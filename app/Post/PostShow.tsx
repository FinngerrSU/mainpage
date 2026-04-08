'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
// Assuming you have a way to initialize or access these clients in your app context
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { fetchBoardPosts } from './getPostFeed';// Import the function above
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';


const suiClient = new SuiGrpcClient({
    network: 'mainnet', // or 'testnet' / 'devnet' depending on your deployment
    baseUrl: 'https://fullnode.mainnet.sui.io:443',
});

const gqlClient = new SuiGraphQLClient({
    url: 'https://graphql.mainnet.sui.io/graphql',
    network: "mainnet"
});
const PACKAGE_ID = "0x0ce1729516456933aed62ff002752a32fcd87732e95913e064b6848419031c66";

export default function PostFeed() {

    const dAppKit = useDAppKit();
    const account = useCurrentAccount();
    const { data: posts, isPending, isError } = useQuery({
        queryKey: ['message-board-posts-bcs'],
        queryFn: () => fetchBoardPosts(suiClient, gqlClient),
        refetchInterval: 10000,
    });


    const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>('');

    const { mutateAsync: signAndExecute } = useMutation({
        mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
    });

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const formatTimeAgo = (timestamp: number) => {
        // Catch invalid timestamps safely
        if (!timestamp || isNaN(timestamp)) return '';

        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        if (seconds < 60) return 'Just now';

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const parsePostContent = (rawContent: string) => {
        // Check if the string starts with our specific reply tag
        if (rawContent.startsWith('[REPLY:0x')) {
            const closingBracketIndex = rawContent.indexOf(']');
            if (closingBracketIndex > 8) {
                return {
                    isReply: true,
                    parentId: rawContent.substring(7, closingBracketIndex), // Extract the ID
                    cleanContent: rawContent.substring(closingBracketIndex + 1).trim() // Extract the message
                };
            }
        }
        // If no tag, it's a normal post
        return { isReply: false, parentId: null, cleanContent: rawContent };
    };

    // 2. Group the posts
    const mainPosts: any[] = [];
    const repliesByParent: Record<string, any[]> = {};

    // Sort the flat array into our groups
    posts?.forEach((post) => {
        const { isReply, parentId, cleanContent } = parsePostContent(post!.content);

        // Attach our parsed data to the post object for rendering
        const processedPost = { ...post, cleanContent };

        if (isReply && parentId) {
            // Put it in the replies bucket for that specific parent
            if (!repliesByParent[parentId]) {
                repliesByParent[parentId] = [];
            }
            repliesByParent[parentId].push(processedPost);
        } else {
            // It's a main timeline post
            mainPosts.push(processedPost);
        }
    });
    const handleDeletePost = async (postId: string) => {
        if (!account) return;

        // Optional: Add a quick confirmation so users don't accidentally click it
        if (!window.confirm("Are you sure you want to delete this post?")) return;

        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::pui_post::delete_post`,
            arguments: [
                tx.object(postId) // Pass the Post object ID to be consumed and destroyed
            ],
        });

        try {
            await signAndExecute(tx, {
                onSuccess: (result) => {
                    console.log("Post deleted:", result);
                    alert("Post successfully deleted!");
                    setReplyText('');
                    setActiveReplyId(null);
                },
                onError: (error) => {
                    console.error("Delete failed:", error);
                    alert("Failed to delete. Are you sure you are the author?");
                },
            });
        } catch (error) {
            console.error("Mutation error:", error);
        }
    };

    const handleSubmitReply = async (parentId: string) => {
        if (!account || !replyText.trim()) return;

        const taggedContent = `[REPLY:${parentId}] ${replyText}`;
        const tx = new Transaction();

        tx.moveCall({
            target: `${PACKAGE_ID}::pui_post::create_post`,
            arguments: [
                tx.pure.string(taggedContent),
                tx.pure.option('string', null),
                tx.object('0x6')
            ],
        });

        try {
            await signAndExecute(tx, {
                onSuccess: (result) => {
                    alert("Reply posted successfully!");
                    // Reset the UI after success
                    setReplyText('');
                    setActiveReplyId(null);
                },
                onError: (error) => {
                    alert("Failed to publish reply.");
                    console.error("Reply failed:", error);
                },
            });
        } catch (error) {
            console.error("Mutation error:", error);
        }
    };
    if (isPending) {
        return (
            <div className="flex justify-center p-8 text-gray-500 font-medium animate-pulse">
                Syncing with network via gRPC...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-xl border border-red-100 max-w-2xl mx-auto mt-4">
                Failed to load the feed. Check your gRPC connection.
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 mt-8 pb-12">
            <div className="flex items-center gap-2 mb-2 px-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    Live Feed
                </span>
                <span className="text-gray-500 text-sm font-medium">
                    {posts?.length || 0} Posts Found
                </span>
            </div>

            {mainPosts.length === 0 ? (
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 text-center text-gray-500">
                    No posts yet. Be the first to publish!
                </div>
            ) : (
                // 1. MAP OVER MAIN POSTS INSTEAD OF ALL POSTS
                mainPosts.map((post) => (
                    <div key={post.id} className="mb-8"> {/* Wrapper for Post + Replies */}

                        {/* --- THE MAIN POST CARD (Your exact UI) --- */}
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 hover:shadow-md transition-shadow relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-indigo-200 border border-gray-200 flex items-center justify-center">
                                    <span className="text-blue-700 font-bold text-sm">
                                        {post.author.slice(2, 6).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">
                                        {formatAddress(post.author)}
                                    </div>
                                    <span className="text-gray-500 font-medium text-xs">
                                        {formatTimeAgo(post.timestamp)}
                                    </span>
                                    <div className="text-xs text-gray-500 font-mono">
                                        object ID: {formatAddress(post.id)}
                                    </div>
                                    {account?.address === post.author && (
                                        <button
                                            onClick={() => handleDeletePost(post.id)}
                                            disabled={isPending}
                                            className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors mt-1"
                                        >
                                            {isPending ? 'Deleting...' : 'Delete'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* CRITICAL: Use cleanContent so the tag is hidden! */}
                            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed mb-3">
                                {post.cleanContent}
                            </div>

                            {post.imageUrl && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                                    <img
                                        src={post.imageUrl}
                                        alt="Post attachment"
                                        className="w-full max-h-96 object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                                className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                {activeReplyId === post.id ? 'Cancel Reply' : 'Reply 💬'}
                            </button>
                        </div>
                        {activeReplyId === post.id && (
                            <div className="mt-4 bg-[#F8F9FA] border border-gray-200 rounded-xl p-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write your reply..."
                                    className="w-full p-3 rounded-xl bg-white border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors mb-3"
                                    rows={2}
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSubmitReply(post.id)}
                                        disabled={isPending || !replyText.trim()}
                                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl disabled:opacity-50 transition-colors shadow-sm"
                                    >
                                        {isPending ? 'Posting...' : 'Post Reply'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- THE REPLIES SECTION --- */}
                        {repliesByParent[post.id] && repliesByParent[post.id].length > 0 && (
                            <div className="ml-4 sm:ml-8 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                                {repliesByParent[post.id].map((reply) => (
                                    <div key={reply.id} className="bg-[#F8F9FA] border border-gray-100 rounded-xl p-4 shadow-sm">

                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-900">
                                                    {formatAddress(reply.author)}
                                                </span>
                                                <span className="text-gray-400 text-xs font-medium">
                                                    {formatTimeAgo(reply.timestamp)}
                                                </span>
                                            </div>

                                            {/* Allow users to delete their own replies too! */}
                                            {account?.address === reply.author && (
                                                <button
                                                    onClick={() => handleDeletePost(reply.id)}
                                                    disabled={isPending}
                                                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {reply.cleanContent}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* --------------------------- */}

                    </div>
                ))
            )}
        </div>
    );
}
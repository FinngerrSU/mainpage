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
        <div className="max-w-3xl mx-auto mt-8 pb-12 px-4">
            {/* --- BRIEFING HEADER --- */}
            <div className="flex items-end justify-between border-b border-neutral-800 pb-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold tracking-tighter text-neutral-100 uppercase italic">
                        Daily Briefing <span className="text-emerald-500">.01 room</span>
                    </h1>
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                        System Status: Synced 
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-mono block leading-none">
                        LATENCY: 24MS
                    </span>
                    <span className="text-[10px] font-mono block">
                        {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {mainPosts.length === 0 ? (
                <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-12 text-center text-neutral-600 font-mono text-sm">
                    NO ACTIVE INTELLIGENCE FOUND_
                </div>
            ) : (
                <div className="space-y-0 border-l border-neutral-800 ml-3">
                    {mainPosts.map((post) => (
                        <div key={post.id} className="relative pl-8 pb-10 group/post">
                            {/* Timeline Node Icon */}
                            <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-neutral-800 border border-neutral-700 group-hover/post:bg-emerald-500 transition-colors" />

                            {/* --- ENTRY HEADER --- */}
                            <div className="flex items-center gap-3 mb-2">
                                {/* Removed the .slice(-4) so the full formatted ID remains intact */}
                                <span className="text-xs font-mono font-bold text-emerald-500/80 bg-emerald-500/5 px-1.5 py-0.5 rounded">
                                    ENTRY_{formatAddress(post.id)}
                                </span>
                                <span className="text-[11px] font-mono text-neutral-300 italic">
                                    [{formatTimeAgo(post.timestamp)}]
                                </span>
                                <span className="text-[11px] font-mono text-neutral-700">
                                    BY: {formatAddress(post.author)}
                                </span>

                                {account?.address === post.author && (
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="ml-auto opacity-0 group-hover/post:opacity-100 text-[10px] font-bold text-red-500/60 hover:text-red-400 transition-all uppercase tracking-tighter"
                                    >
                                        [ Purge ]
                                    </button>
                                )}
                            </div>

                            {/* --- CONTENT AREA --- */}
                            <div className="text-neutral-100 text-lg leading-relaxed max-w-xl">
                                {post.cleanContent}
                            </div>

                            {post.imageUrl && (
                                <div className="mt-4 max-w-md rounded-sm overflow-hidden border border-neutral-800 transition-all duration-500">
                                    <img
                                        src={post.imageUrl}
                                        alt="Briefing attachment"
                                        className="w-full h-auto"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {/* --- ACTION BAR (Minimalist) --- */}
                            <div className="mt-3 flex items-center gap-4">
                                <button
                                    onClick={() => setActiveReplyId(activeReplyId === post.id ? null : post.id)}
                                    className="text-[10px] font-mono font-bold text-neutral-500 hover:text-emerald-400 uppercase tracking-widest transition-colors"
                                >
                                    {activeReplyId === post.id ? '> CANCEL_INTEL' : '> ADD_INTEL'}
                                </button>
                            </div>

                            {/* Reply Input Box */}
                            {activeReplyId === post.id && (
                                <div className="mt-4 bg-neutral-950 border-l-2 border-emerald-500/30 p-4 max-w-lg">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Input additional data..."
                                        className="w-full bg-transparent text-neutral-200 text-sm focus:outline-none placeholder-neutral-700 resize-none font-mono"
                                        rows={3}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={() => handleSubmitReply(post.id)}
                                            className="text-[10px] font-bold bg-neutral-200 text-neutral-900 px-3 py-1 hover:bg-emerald-400 transition-colors uppercase"
                                        >
                                            Transmit
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- REPLIES (Sub-logs) --- */}
                            {repliesByParent[post.id] && repliesByParent[post.id].length > 0 && (
                                <div className="mt-4 space-y-4 border-l border-neutral-800/50 ml-2">
                                    {repliesByParent[post.id].map((reply) => (
                                        <div key={reply.id} className="pl-6 relative">
                                            {/* Small sub-node connector */}
                                            <div className="absolute left-0 top-2 w-3 h-[1px] bg-neutral-800" />

                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-mono text-neutral-600">
                                                    SUPP_{formatAddress(reply.author).slice(-4)}
                                                </span>
                                                <span className="text-[10px] font-mono text-neutral-700 italic">
                                                    {formatTimeAgo(reply.timestamp)}
                                                </span>
                                            </div>
                                            <div className="text-neutral-500 text-xs border-l border-neutral-800 pl-3">
                                                {reply.cleanContent}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
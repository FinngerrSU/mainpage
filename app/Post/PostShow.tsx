'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { fetchBoardPosts } from './getPostFeed';
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';

const suiClient = new SuiGrpcClient({
    network: 'mainnet',
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

    // UI State for navigating between Blog Feed and Single Article
    const [viewingPostId, setViewingPostId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>('');

    const { data: posts, isPending, isError } = useQuery({
        queryKey: ['message-board-posts-bcs'],
        queryFn: () => fetchBoardPosts(suiClient, gqlClient),
        refetchInterval: 10000,
    });

    const { mutateAsync: signAndExecute } = useMutation({
        mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
    });

    // --- Helpers ---
    const formatAddress = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

    const formatDate = (timestamp: number) => {
        if (!timestamp || isNaN(timestamp)) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(timestamp));
    };

    const getReadTime = (text: string) => {
        const words = text.trim().split(/\s+/).length;
        const time = Math.ceil(words / 200); // Assume 200 words per minute
        return `${time} min read`;
    };

    const generateAvatar = (address: string) => {
        // Generates a consistent colorful gradient based on the author's wallet address
        return `linear-gradient(135deg, #${address.slice(2, 8)}, #${address.slice(-6)})`;
    };

    // --- Content Parsing ---
    const parsePostContent = (rawContent: string) => {
        if (rawContent.startsWith('[REPLY:0x')) {
            const closingBracketIndex = rawContent.indexOf(']');
            if (closingBracketIndex > 8) {
                return {
                    isReply: true,
                    parentId: rawContent.substring(7, closingBracketIndex),
                    cleanContent: rawContent.substring(closingBracketIndex + 1).trim()
                };
            }
        }
        return { isReply: false, parentId: null, cleanContent: rawContent };
    };

    const extractBlogContent = (text: string) => {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length > 1 && lines[0].length < 100) {
            return { title: lines[0], body: lines.slice(1).join('\n\n') };
        }
        return { title: 'Thoughts & Musings', body: text };
    };

    // --- Organize Data ---
    const mainPosts: any[] = [];
    const repliesByParent: Record<string, any[]> = {};

    posts?.forEach((post) => {
        const { isReply, parentId, cleanContent } = parsePostContent(post!.content);
        const { title, body } = extractBlogContent(cleanContent);

        const processedPost = { ...post, title, body };

        if (isReply && parentId) {
            if (!repliesByParent[parentId]) repliesByParent[parentId] = [];
            repliesByParent[parentId].push(processedPost);
        } else {
            mainPosts.push(processedPost);
        }
    });

    // Sort newest main posts first
    mainPosts.sort((a, b) => b.timestamp - a.timestamp);

    // --- Interactions ---
    const handleDeletePost = async (postId: string) => {
        if (!account) return;
        if (!window.confirm("Are you sure you want to delete this article?")) return;

        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::pui_post::delete_post`,
            arguments: [tx.object(postId)],
        });

        try {
            await signAndExecute(tx, {
                onSuccess: () => {
                    alert("Article deleted.");
                    if (viewingPostId === postId) setViewingPostId(null);
                },
                onError: (error) => {
                    console.error("Delete failed:", error);
                    alert("Failed to delete. You might not be the author.");
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
                onSuccess: () => setReplyText(''),
                onError: () => alert("Failed to publish comment."),
            });
        } catch (error) {
            console.error("Mutation error:", error);
        }
    };

    // --- Loading & Error States ---
    if (isPending) return <div className="flex justify-center py-20 text-gray-400">Loading publication...</div>;
    if (isError) return <div className="text-center py-20 text-red-500">Failed to load publication.</div>;

    // ==========================================
    // VIEW 1: SINGLE ARTICLE READING EXPERIENCE
    // ==========================================
    if (viewingPostId) {
        const activePost = mainPosts.find(p => p.id === viewingPostId);
        if (!activePost) return <div className="text-center py-20">Article not found.</div>;

        return (
            <div className="max-w-3xl mx-auto px-6 py-12 bg-white dark:bg-[#0a0a0a] min-h-screen">
                {/* Close Article Navigation */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={() => setViewingPostId(null)}
                        className="group flex items-center justify-center p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
                        title="Close article"
                        aria-label="Close article"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Article Header */}
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 leading-tight mb-8">
                        {activePost.title}
                    </h1>

                    <div className="flex items-center justify-between border-b border-t border-gray-100 dark:border-gray-800 py-4">
                        <div className="flex items-center gap-4">
                            <div
                                className="w-10 h-10 rounded-full"
                                style={{ background: generateAvatar(activePost.author) }}
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    {formatAddress(activePost.author)}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <time>{formatDate(activePost.timestamp)}</time>
                                   
                                    
                                </div>
                            </div>
                        </div>

                        {account?.address === activePost.author && (
                            <button
                                onClick={() => handleDeletePost(activePost.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/10 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </header>

                {/* Featured Image */}
                {activePost.imageUrl && (
                    <figure className="mb-12">
                        <img
                            src={activePost.imageUrl}
                            alt={activePost.title}
                            className="w-full rounded-2xl object-cover shadow-sm"
                        />
                    </figure>
                )}

                {/* Article Content */}
                <article className="text-lg dark:prose-invert max-w-none font-serif text-black dark:text-gray-300 leading-loose whitespace-pre-wrap pb-16 border-b border-gray-100 dark:border-gray-800">
                    {activePost.body}
                </article>

                {/* Comments Section */}
                <section className="mt-12">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-8">
                        Responses ({repliesByParent[activePost.id]?.length || 0})
                    </h3>

                    {/* Write Comment Box */}
                    <div className="mb-10 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-800">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={account ? "What are your thoughts?" : "Connect your wallet to leave a comment..."}
                            disabled={!account} // Optional: locks the textarea if not connected
                            className="w-full bg-transparent border-none focus:ring-0 text-gray-800 dark:text-gray-200 resize-none outline-none min-h-[100px] disabled:opacity-50"
                        />
                        <div className="flex justify-end mt-4">
                            {account ? (
                                <button
                                    onClick={() => handleSubmitReply(activePost.id)}
                                    disabled={!replyText.trim()}
                                    className="bg-black dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition-colors"
                                >
                                    Respond
                                </button>
                            ) : (
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-white font-mono tracking-wide bg-blue-950 border px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.1)]">

                                    Connect Wallet to Respond
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Render Comments */}
                    <div className="space-y-8">
                        {repliesByParent[activePost.id]?.map((reply) => (
                            <div key={reply.id} className="flex gap-4">
                                <div
                                    className="w-8 h-8 rounded-full flex-shrink-0"
                                    style={{ background: generateAvatar(reply.author) }}
                                />
                                <div>
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl rounded-tl-none p-4 px-5 border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                                {formatAddress(reply.author)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(reply.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                            {reply.cleanContent}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    // ==========================================
    // VIEW 2: BLOG HOME / INDEX (THE FEED)
    // ==========================================
    return (
        <div className="max-w-5xl mx-auto px-6 py-16">


            {mainPosts.length === 0 ? (
                <div className="text-center text-gray-500 py-12 font-serif text-xl italic">
                    The journal is currently empty.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {mainPosts.map((post) => (
                        <article
                            key={post.id}
                            onClick={() => setViewingPostId(post.id)}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            {/* Card Image */}
                            <div className="w-full aspect-video  rounded-2xl overflow-hidden mb-5 relative">
                                {post.imageUrl ? (
                                    <img
                                        src={post.imageUrl}
                                        alt=""
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-serif italic">
                                        No image provided
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="flex flex-col grow">
                                <h2 className="text-2xl font-serif font-bold text-gray-100 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                                    {post.title}
                                </h2>

                                <p className="text-gray-100 dark:text-gray-100 text-base font-serif line-clamp-3 mb-5 grow leading-relaxed">
                                    {post.body}
                                </p>

                                {/* Card Meta */}
                                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800/60">
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ background: generateAvatar(post.author) }}
                                    />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {formatAddress(post.author)}
                                    </span>
                                    <span className="text-gray-300 dark:text-gray-700">•</span>
                                    <span className="text-xs text-gray-100 uppercase tracking-wider">
                                        {formatDate(post.timestamp)}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
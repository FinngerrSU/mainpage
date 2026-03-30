'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UiWalletAccount, useWalletConnection } from '@mysten/dapp-kit-react';
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';

export default function CreatePost() {
    // Hooks to get the connected wallet and the execution function
    const dAppKit = useDAppKit();
    const { mutateAsync: signAndExecute, isPending } = useMutation({
        mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
    });

    const account = useCurrentAccount();
    const connection = useWalletConnection();
    // Local component state for our form
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Replace this with the Package ID you got when publishing your contract
    const PACKAGE_ID = '0x0ce1729516456933aed62ff002752a32fcd87732e95913e064b6848419031c66';

    const handlePostSubmit = async () => {


        // 2. Your connection and account validation
        if (connection.status !== "connected" || !account) {
            alert("Cannot post - wallet not connected or no account");
            return;
        }

        const tx = new Transaction();

        // 3. Add the moveCall for the post
        tx.moveCall({
            target: `${PACKAGE_ID}::pui_post::create_post`,
            arguments: [
                tx.pure.string(content),
                tx.pure.option('string', imageUrl ? imageUrl : null),
                tx.object('0x6')
            ],
        });

        // 4. Execute using your mutateAsync setup
        try {
            await signAndExecute(tx, {
                onSuccess: (result) => {
                    alert("Success! Post created on-chain.");
                    console.log("Post result:", result);
                    setContent('');
                    setImageUrl('');
                },
                onError: (error) => {
                    alert("Failed to publish post.");
                    console.error("Post failed:", error);
                },
            });
        } catch (error) {
            console.error("Mutation error:", error);
        }
    };

    

    return (
        <div className="max-w-md mx-auto bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    Publish
                </span>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    Create a New Post
                </h2>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
                <div>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                        rows={4}
                    />
                </div>

                <div>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Optional Image URL (e.g., https://...)"
                        className="w-full p-3 rounded-xl bg-[#F8F9FA] border border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !account}
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isSubmitting ? 'Posting to Network...' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
}
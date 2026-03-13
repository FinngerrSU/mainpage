'use client';
import { useState } from 'react';
import { useWalletConnection } from '@mysten/dapp-kit-react';
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';// Assuming dapp-kit, adjust if using other hooks
import { Transaction } from '@mysten/sui/transactions';
import { useMutation } from '@tanstack/react-query';

// Mock Constants (Replace with your actual imports)
const CONSTANTS = {
  PACKAGE_ID: "0x1583a89ecfcec4d98ba6361a819c566c5c6cdeb12f5a11e424104c45b3f61aa6",
  SPECIAL_ID: "0x24acfa541a458bfae79d4cab7f008ef9f4f69f41c435a49eef88d867da10e75e",
  MODULE_NAME: "dailySupply",
  // REPLACE THIS WITH YOUR ACTUAL COIN TYPE

};
interface image_url {
  image_url: string;
}
export default function Mint({ image_url }: image_url) {
  const dAppKit = useDAppKit();
  const { mutateAsync: signAndExecute, isPending } = useMutation({
    mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
  });
  const account = useCurrentAccount();
  const connection = useWalletConnection();

  const [status, setStatus] = useState('');

  const [isMinting, setIsMinting] = useState(false);

  // 1. GENERATE RANDOM IMAGE URL
  // You can replace this logic with an API call or a specific logic


  const handleMint = async () => {
    if (connection.status !== "connected" || !account) {
      alert("wallet not connected or no account");
      return;
    }
    setIsMinting(true);
    setStatus("Preparing transaction...");

    try {
      // 1. Get Coins

      const tx = new Transaction();



      // 3. Move Call
      // Arguments: Registry, Payment, Random, image_url (String)
      tx.moveCall({
        target: `${CONSTANTS.PACKAGE_ID}::${CONSTANTS.MODULE_NAME}::mint_special`,
        arguments: [
          tx.object(CONSTANTS.SPECIAL_ID),
        ],
      });

      // 4. Execute
      await signAndExecute(tx, {
        onSuccess: (result) => {
          alert("Success! Check your wallet for $PUIMON 💎");
          console.log("Check-in result:", result);
        },
        onError: (error) => {
          // If the move contract's 'assert' fails, it hits here
          alert("Patience! You've already checked in today.");
          console.error("Check-in failed:", error);
        },
      });

    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
      setIsMinting(false);
      alert(status);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto font-serif">

      {/* THE MINTING ARTIFACT - Deep stone texture with a subtle metallic ring */}
      <div className="bg-stone-900 border border-stone-950 ring-1 ring-amber-900/40 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* LEFT SIDE: Controls */}
          <div className="p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-stone-950 shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-10">
            <h2 className="text-3xl mb-2 text-amber-500 uppercase tracking-widest drop-shadow-md font-semibold">
              Daily Card
            </h2>
            

            {/* Info Box - Recessed parchment/stone look */}
            <div className="bg-stone-950 p-4 rounded-sm mb-6 border-t border-l border-stone-700 border-b border-r  shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-center text-sm text-stone-300 tracking-wider mb-2">
                <span>Price</span>
                <span className="text-amber-500 font-semibold tracking-widest drop-shadow-[0_0_8px_rgba(180,83,9,0.8)]">FREE</span>
              </div>
              <div className="flex justify-between items-center text-sm text-stone-300 tracking-wider">
                <span>Status</span>
                <span className={connection.status === 'connected' ? "text-emerald-700 font-semibold" : "text-red-900 font-semibold"}>
                  {connection.status === 'connected' ? 'Connected' : 'Wallet Locked'}
                </span>
              </div>
            </div>

            <button
              onClick={handleMint}
              disabled={!account || isMinting}
              className={`
              w-full py-4 rounded-sm font-serif text-lg uppercase tracking-[0.2em] transition-all duration-300
              ${!account || isMinting
                  ? 'bg-stone-950 border border-stone-800 text-stone-600 cursor-not-allowed'
                  : 'bg-stone-950 border border-amber-700/50 text-amber-500 hover:border-amber-400 hover:text-amber-400 hover:shadow-[0_0_20px_rgba(180,83,9,0.3)] hover:-translate-y-px active:translate-y-px'
                }
            `}
            >
              {isMinting ? 'Channeling...' : 'Mint Now'}
            </button>

            {status && (
              <div className="mt-4 p-3 bg-stone-950/80 border border-stone-800 rounded-sm text-xs text-center text-amber-700/80 break-all font-mono">
                {status}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Image Display */}
          {/* Added an inset shadow to make this side look like a deeper recess in the artifact */}
          <div className="p-8 bg-stone-950/50 flex flex-col items-center justify-center relative">


            <div className="relative group w-full aspect-square max-w-sm bg-stone-950 rounded-xl shadow-xl transform rotate-1 hover:rotate-0 transition-all duration-300">
              <div className="w-full h-full overflow-hidden rounded-lg border-2 border-amber-700">
                <a
                  href={image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] flex justify-center relative cursor-pointer"
                  title="Click to view high-resolution artwork"
                >
                  <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>
                  {image_url ? (
                    <img
                      src={image_url}
                      alt="NFT Preview"
                      className="w-full h-full object-cover saturate-[0.85] group-hover:saturate-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-800 font-bold text-2xl">
                      ?
                    </div>
                  )}
                </a>
              </div>

              {/* Sticker/Label */}
              <div className="absolute -bottom-3 -left-3 bg-stone-900 border border-amber-800/60 text-amber-600 px-4 py-1.5 rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.9)] text-xs font-semibold tracking-[0.2em] uppercase">
                Preview
              </div>
            </div>


          </div>
          /
        </div>
      </div>
    </div>
  );

}



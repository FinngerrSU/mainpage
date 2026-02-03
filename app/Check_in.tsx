"use client"
import { useWalletConnection, ConnectButton } from '@mysten/dapp-kit-react';
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { useMutation } from '@tanstack/react-query';

export default function CheckIn() {
  const dAppKit = useDAppKit();

  const { mutateAsync: signAndExecute, isPending } = useMutation({
    mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
  });
  const account = useCurrentAccount();
  const connection = useWalletConnection();

  
  

  const PACKAGE_ID = "0x0fa47f4c79360984701ff9b989944d7dbb568b550e97ad52377b7e7ebbdd9d3f";
  const STATE_OBJECT_ID = "0xd79933edaeea13ef3a7c3a570b07f5fe1bc0235d4fcba3e76195fba41285f0e9";
  const CLOCK_ID = "0x6"; // System clock is always 0x6
  const handleCheckIn = async () => {
  

    console.log("Buy clicked! Status:", connection.status, "Account:", account?.address);
    if (connection.status !== "connected" || !account) {
      console.log("Cannot mint - wallet not connected or no account");
      return;
    }


    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::dailycheck::check_in`,
      arguments: [
        tx.object(STATE_OBJECT_ID),
        tx.object(CLOCK_ID),
      ],
    });

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
  };
  return (

    <main className="max-w-6xl mx-auto px-4 mb-16">
      <div className="bg-[#FFE600] border-4 border-black rounded-2xl p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Side: Stats/Info */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex w-20 h-20 bg-white border-4 border-black rounded-full items-center justify-center text-4xl shadow-[4px_4px_0px_0px_#000]">
            💎
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase italic leading-none mb-2">
              Daily Loot Drop
            </h3>
            <p className="font-bold text-black/70">
              Status: <span className="text-green-600">READY TO CLAIM</span> • Reward: <span className="underline">10000 $PUIMON</span>
            </p>
          </div>
        </div>

        {/* Right Side: The Interactive Button */}
        <div className="w-full md:w-auto flex flex-col items-center gap-4">
          {!account ? (
            /* 1. DISCONNECTED: The Big Login Button */
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <ConnectButton
                
                className="bg-[#4F78EB]! text-white! font-black! uppercase! rounded-none! border-none! px-10! py-4! text-xl! hover:bg-white! transition-colors!"
              >Login To Claim</ConnectButton>
            </div>
          ) : (
            /* 2. CONNECTED: Built-in Wallet Menu + Punch In Button */
            <div className="flex flex-col items-center gap-4 w-full">

              {/* This ConnectButton will now show the address & handle the Switch/Disconnect menu */}
              <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <ConnectButton
                  className="bg-white! text-black! font-black! text-xs! uppercase! rounded-none! border-none! px-4! py-2! hover:bg-gray-100! transition-all!"
                />
              </div>

              {/* THE ACTUAL CLAIM BUTTON */}
              <button
                onClick={handleCheckIn}
                disabled={isPending}
                className={`
          w-full md:w-64 py-4 px-8 text-2xl font-black uppercase tracking-tighter
          border-4 border-black rounded-xl transition-all
          ${isPending
                    ? 'bg-gray-400 translate-y-1 shadow-none cursor-not-allowed'
                    : 'bg-black text-white hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#4F78EB] active:translate-y-1 active:shadow-none'
                  }
        `}
              >
                {isPending ? "Claiming..." : "Punch In ➜"}
              </button>

              <p className="text-[10px] font-black opacity-40 uppercase tracking-tighter">
                Click address to switch or logout
              </p>
            </div>
          )}
        </div>

      </div>
    </main>

  );
}
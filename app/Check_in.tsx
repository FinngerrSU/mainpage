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
    <div className="flex gap-2 sm:gap-4 mb-4 group w-full">
      
      {/* System Node Line (Matches the Ecosystem Cards) */}
      

      {/* Main Module Card */}
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 w-full max-w-200transition-all duration-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

        {/* Left Side: System Stats/Info */}
        <div className="flex-1">
          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider">
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
              Reward Module
            </span>
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              READY TO CLAIM
            </span>
            <span className="text-gray-400 font-mono lowercase tracking-normal hidden sm:inline ml-auto">
              // sys::daily_loot
            </span>
          </div>

          <h3 className="font-bold text-xl mb-1 text-gray-900 tracking-tight">
            Daily Drop Protocol
          </h3>
          <p className="text-gray-500 font-mono text-sm">
            Allocation: <span className="font-bold text-blue-600">10,000 $PUIMON</span>
          </p>
        </div>

        {/* Right Side: The Interactive Panel */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3">
          {!account ? (
            /* 1. DISCONNECTED */
            <div className="w-full">
              <ConnectButton
                className="w-full sm:w-auto bg-blue-600! text-white! font-bold! text-sm! rounded-xl! border-none! px-8! py-3! hover:bg-blue-700! hover:-translate-y-0.5! transition-all! shadow-sm!"
              >
                Login-in wallet
              </ConnectButton>
            </div>
          ) : (
            /* 2. CONNECTED */
            <div className="flex flex-col items-end gap-3 w-full">
              
              {/* THE ACTUAL CLAIM BUTTON */}
              <button
                onClick={handleCheckIn}
                disabled={isPending}
                className={`
                  w-full sm:w-auto px-8 py-3 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2
                  ${isPending
                    ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md'
                  }
                `}
              >
                {isPending ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-500 rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Claim Allocation ➜"
                )}
              </button>

              {/* Minimal ConnectButton for Wallet/Address Menu */}
              <div className="w-full sm:w-auto flex flex-col items-end gap-1 text-right">
                <ConnectButton
                  className="bg-gray-50! text-gray-600! font-mono! text-xs! font-medium! rounded-lg! border! border-gray-200! px-3! py-1.5! hover:bg-gray-100! transition-all! shadow-none!"
                />
                <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                  Click address to manage session
                </p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
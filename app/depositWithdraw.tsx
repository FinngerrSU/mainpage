"use client"
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UiWalletAccount, useWalletConnection } from '@mysten/dapp-kit-react';
import { useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { bcs } from '@mysten/sui/bcs';
import { GetPool } from './getPool';

const suiClient = new SuiGrpcClient({
    network: 'mainnet',
    baseUrl: 'https://fullnode.mainnet.sui.io:443',
});



const PACKAGE_ID = "0xfa49a4b8989bb452ea747cf521dabed63e9b12f1edf8d78ecf5ab4f67490cfb4";
const BANK_OBJECT_ID = "0xf0d3051112eca05ad1521cb439d57d5fdc50eaf35f896bd9c50179cb8dd84332";
const COIN_ID = "0x2::coin::Coin<0xb696b148be1f7d358a2540081ce7052c13c68b7b917895282de4b987e6467e17::puimon::PUIMON>";

const LOGO_URL = "https://arweave.net/g2Fgf9YlkDv6B4YD0AZPZjcelUCmntk-jVEt28VzJVU";

export default function DepositWithdraw() {
    const dAppKit = useDAppKit();
    const { mutateAsync: signAndExecute, isPending } = useMutation({
        mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
    });
    const account = useCurrentAccount();
    const connection = useWalletConnection();
    const [poolBalance, setPoolBalance] = useState<string>("0");
    const [amount, setAmount] = useState<string>("");

    useEffect(() => {
        // 2. Define an async wrapper function inside the effect
        const fetchData = async () => {
            try {
                const result = await GetPool();
                setPoolBalance(result); // Save to state
                console.log("Pool loaded:", result);
            } catch (error) {
                console.error("Failed to fetch pool:", error);
            }
        };

        // 3. Call the wrapper function
        fetchData();
    }, []);

    const user_balance = useBankBalance(account, suiClient);

    const deposit = async () => {

        console.log("clicked! Status:", connection.status, "Account:", account?.address);
        if (connection.status !== "connected" || !account) {
            alert("Cannot deposit - wallet not connected or no account");
            return;
        }
        const tx = new Transaction();
        // 1. Split the specific amount from the user's PUIMON gas/coins
        // Note: You'll need to fetch the user's coin IDs first, 
        // or use tx.gas if PUIMON was the gas token (unlikely here).
        // Assuming you've fetched a coin object ID 'coinInput':
        const coins = await getCoin(suiClient, account.address, COIN_ID);
        // 1. Check if the array exists and has items FIRST
        if (!coins || coins.length === 0) {
            alert("No coins found.");
            return;
        }
        const primaryCoin = coins[0];
        const coinsToMerge = coins.slice(1);

        // Create a list of coin object inputs, max 500ish per transaction
        // (If you have >500 coins, you need to batch this logic)
        const mergeIds = coinsToMerge
            .map(c => c.objectId)
            .filter((id): id is string => !!id);
        if (primaryCoin.objectId && mergeIds.length > 0) {

            tx.mergeCoins(primaryCoin.objectId, mergeIds);
        }
        const coinID = primaryCoin.objectId;
        if (coinID) {

            const [memecoin] = tx.splitCoins(coinID, [amount]);
            console.log(memecoin);

            tx.moveCall({
                target: `${PACKAGE_ID}::deposit::deposit`,
                arguments: [
                    tx.object(BANK_OBJECT_ID),
                    memecoin,
                    tx.object("0x6")
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


        }
        else {
            alert("No PUIMON coin")
        }




    };

    const withdraw = async () => {
        console.log("clicked! Status:", connection.status, "Account:", account?.address);
        if (connection.status !== "connected" || !account) {
            alert("Cannot withdraw - wallet not connected or no account");
            return;
        }
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::deposit::withdraw`,
            arguments: [
                tx.object(BANK_OBJECT_ID),
                tx.pure.u64(amount),
                tx.object("0x6")

            ],
        });

        await signAndExecute(tx, {
            onSuccess: (result) => {
                alert("Success! Check your wallet!");
                console.log("Check-in result:", result);
            },
            onError: (error) => {
                // If the move contract's 'assert' fails, it hits here
                alert("Withdraw failed");
                console.error("Check-in failed:", error);
            },
        });
    };

    return (
    <div className="flex gap-2 sm:gap-4 mb-4 group w-full">
      
      

      {/* Main Vault Card */}
      <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 sm:p-6 w-full max-w-200 transition-all duration-200">
        
        {/* Module Metadata Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider">
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
            DeFi Protocol
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            VAULT ACTIVE
          </span>
          <span className="text-gray-400 font-mono lowercase tracking-normal hidden sm:inline ml-auto">
            // sys::central_vault
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Central Vault Protocol</h2>
          <p className="text-sm text-gray-500 font-medium">Manage your $PUIMON liquidity and earn ecosystem yields.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          
          {/* Total Vault Value */}
          <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl flex flex-col justify-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Vault Liquidity</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-mono font-bold text-gray-900">{poolBalance || "0"}</p>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shrink-0 opacity-80">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* User Deposit */}
          <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl flex flex-col justify-center">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">My Active Deposit</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-mono font-bold text-blue-600">
                {user_balance === "0" && !account?.address ? "—" : user_balance}
              </p>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-blue-200 shrink-0">
                <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>

        {/* Interaction Area */}
        <div className="space-y-4">
          
          {/* Input Field */}
          <div className="relative">
            <input
              type="number"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 pl-4 pr-16 bg-white border border-gray-200 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
              $PUIMON
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={deposit}
              className="py-3.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md transition-all flex justify-center items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              DEPOSIT
            </button>
            <button
              onClick={withdraw}
              className="py-3.5 bg-white text-gray-700 border border-gray-200 text-sm font-bold rounded-xl shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              WITHDRAW
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
async function getCoin(suiClient: SuiGrpcClient, owner: string, objectType: string) {
    const response = suiClient.stateService.listOwnedObjects({
        objectType: objectType,
        owner: owner,
    })
    const balance = await response.response;

    const coins = balance?.objects;
    return coins;
}

function useBankBalance(account: UiWalletAccount | null, suiClient: SuiGrpcClient) {

    const [balance, setBalance] = useState<string>("0");


    useEffect(() => {
        if (!account) return;

        const fetchBalance = async () => {

            try {
                // 1. Build the Transaction
                const tx = new Transaction();
                tx.moveCall({
                    target: `${PACKAGE_ID}::deposit::get_balance`,
                    arguments: [
                        tx.object(BANK_OBJECT_ID),
                        tx.pure.address(account.address),
                        // Note: '0x6' (Clock) is usually a shared object, 
                        // verify if your move function actually needs it or just the context.
                        tx.object('0x6')
                    ],
                });

                // Set sender so simulation knows who is calling
                tx.setSender(account.address);

                // 2. Build Bytes
                const bytes = await tx.build({ client: suiClient });

                const response = await suiClient.transactionExecutionService.simulateTransaction({
                    transaction: { bcs: { value: bytes } },
                });
                const data = response.response.commandOutputs[0].returnValues[0].value?.value;
                if (data) {
                    const balance = bcs.u64().parse(data);
                    console.log("this is response of simulation", balance);
                    setBalance(balance);
                }


            } catch (e) {
                console.error("Failed to fetch balance:", e);
                setBalance("0");
            }
        };

        fetchBalance();

    }, [account, suiClient]); // Re-run when account or client changes

    return balance;
}



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

        <section className="max-w-xl mx-auto px-4 mb-12">
            <div className="bg-[#F0F6FF] border-4 border-[#1a1a1a] p-8 rounded-3xl shadow-[8px_8px_0px_0px_#1a1a1a]">
                <h2 className="text-4xl font-black italic tracking-tighter mb-2">PUIMON BANK</h2>

                <div className="grid grid-cols-2 gap-4 mb-6">

                    <div className="bg-white p-4 border-2 border-[#1a1a1a] rounded-xl">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total Vault Value</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-[#4F78EB]">{poolBalance}</p>

                            {/* Logo Unit */}
                            <div className="w-8 h-8 bg-[#B92B27] border-2 border-[#1a1a1a] rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                <img
                                    src={LOGO_URL}
                                    alt="Logo"
                                    className="w-full h-full object-cover scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: MY DEPOSIT */}
                    <div className="bg-white p-4 border-2 border-[#1a1a1a] rounded-xl">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">My Deposit</p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-[#10D8A6]">
                                {user_balance === "0" && !account?.address ? "..." : user_balance}
                            </p>

                            {/* Logo Unit */}
                            <div className="w-8 h-8 bg-[#B92B27] border-2 border-[#1a1a1a] rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                <img
                                    src={LOGO_URL}
                                    alt="Logo"
                                    className="w-full h-full object-cover scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <input
                        type="number"
                        placeholder="Amount..."
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-4 bg-white border-4 border-[#1a1a1a] rounded-xl text-xl font-bold focus:outline-none focus:ring-4 ring-[#654FF0]/20"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={deposit}
                            className="py-4 bg-[#10D8A6] border-4 border-[#1a1a1a] text-xl font-black rounded-xl shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            DEPOSIT
                        </button>
                        <button
                            onClick={withdraw}
                            className="py-4 bg-[#B92B27] text-white border-4 border-[#1a1a1a] text-xl font-black rounded-xl shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            WITHDRAW
                        </button>
                    </div>
                </div>
            </div>
        </section>
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



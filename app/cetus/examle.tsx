'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useWalletConnection, useCurrentAccount, useDAppKit } from '@mysten/dapp-kit-react';
import { Transaction } from '@mysten/sui/transactions';
import { CetusClmmSDK, FullRangeParams } from '@cetusprotocol/sui-clmm-sdk';

export default function CreateCetusPool() {
    const dAppKit = useDAppKit();
    const account = useCurrentAccount();
    const connection = useWalletConnection();

    // 1. Setup the execution mutation
    const { mutateAsync: signAndExecute } = useMutation({
        mutationFn: (tx: Transaction) => dAppKit.signAndExecuteTransaction({ transaction: tx }),
    });

    // 2. Initialize the Cetus SDK once per component mount
    const sdk = useMemo(() => {
        return CetusClmmSDK.createSDK({ env: 'mainnet' });
    }, []);

    // 3. Local state for pool parameters (using your defaults)
    const [coinA, setCoinA] = useState('0xb696b148be1f7d358a2540081ce7052c13c68b7b917895282de4b987e6467e17::puimon::PUIMON');
    const [coinB, setCoinB] = useState('0x2::sui::SUI');
    const [price, setPrice] = useState('0');
    const [amount, setAmount] = useState('0');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [decimalA, setDecimalA] = useState('0');
    const [decimalB, setDecimalB] = useState('9');

    const [tickSpacing, setTickSpacing] = useState('60');

    
    const handlePoolSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (connection.status !== "connected" || !account) {
            alert("Cannot create pool - wallet not connected.");
            return;
        }

        setIsSubmitting(true);

        try {
            // CRITICAL: Tell the SDK whose wallet is interacting so it can find the right coins to spend
            sdk.setSenderAddress(account.address);


            const tick_spacing = 2;
            const full_range_params: FullRangeParams = { is_full_range: true };

            const parsedTickSpacing = Number(tickSpacing);
            const poolParams = {
                tick_spacing,
                current_price: price,
                coin_amount: amount,
                fix_amount_a: true,
                add_mode_params: full_range_params,
                coin_decimals_a: decimalA,
                coin_decimals_b: decimalB,
                price_base_coin: 'coin_a',
                slippage: 0.05,
            };

            // 4. Calculate the required amounts and ticks
            const full_range_result = await sdk.Pool.calculateCreatePoolWithPrice({
                tick_spacing: parsedTickSpacing,
                current_price: price,
                coin_amount: amount,
                fix_amount_a: true,
                add_mode_params: full_range_params,
                coin_decimals_a: Number(decimalA),
                coin_decimals_b: Number(decimalB),
                price_base_coin: 'coin_a',
                slippage: 0.05,
            });

            console.log("Raw Units to Spend:", {
                full_range_result,
                poolParams
            });
            // 5. Generate the Transaction payload
            const txPayload = await sdk.Pool.createPoolWithPricePayload({
                tick_spacing:parsedTickSpacing,
                calculate_result: full_range_result,
                add_mode_params: full_range_params,
                coin_type_a: coinA,
                coin_type_b: coinB,
            });

            // 6. Execute via dAppKit (txPayload is passed directly!)
            await signAndExecute(txPayload, {
                onSuccess: (result) => {
                    alert("Success! Pool created on-chain." + result);

                },
                onError: (error) => {
                    alert("Failed to create pool. See console.");
                    console.error("Execution failed:", error);
                },
            });

        } catch (error) {
            console.error("SDK Calculation Error:", error);
            alert("Failed to build transaction. Do you have the tokens in your wallet?");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwapCoins = () => {
        // Swap token addresses
        const tempCoinA = coinA;
        setCoinA(coinB);
        setCoinB(tempCoinA);

        // Swap decimals
        const tempDecimalA = decimalA;
        setDecimalA(decimalB);
        setDecimalB(tempDecimalA);


    };

    return (
        <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-800 shadow-xl shadow-black/40 rounded-2xl p-6 mb-8 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-cyan-500 opacity-50"></div>

            <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    Liquidity
                </span>
                <h2 className="text-lg font-bold text-neutral-100 tracking-tight">
                    Create Cetus Pool
                </h2>
            </div>

            <form onSubmit={handlePoolSubmit} className="space-y-4 relative z-10">
                {/* COIN A BLOCK */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Coin A (Base)</label>
                        <input
                            required
                            value={coinA}
                            onChange={(e) => setCoinA(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors text-sm"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Decimals A</label>
                        <input
                            type="number"
                            required
                            min="0"
                            max="18"
                            value={decimalA}
                            onChange={(e) => setDecimalA(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors text-sm text-center"
                        />
                    </div>
                </div>

                {/* SWAP BUTTON */}
                <div className="flex justify-center -my-2 relative z-20">
                    <button
                        type="button"
                        onClick={handleSwapCoins}
                        className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 hover:text-neutral-200 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-md"
                        title="Swap Base and Quote"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                    </button>
                </div>

                {/* COIN B BLOCK */}
                <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Coin B (Quote)</label>
                        <input
                            required
                            value={coinB}
                            onChange={(e) => setCoinB(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors text-sm"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Decimals B</label>
                        <input
                            type="number"
                            required
                            min="0"
                            max="18"
                            value={decimalB}
                            onChange={(e) => setDecimalB(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors text-sm text-center"
                        />
                    </div>
                </div>

                {/* PRICE & AMOUNT BLOCK */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Initial Price</label>
                        <input
                            type="number"
                            step="any"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Amount A</label>
                        <input
                            type="number"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">Tick Spacing</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={tickSpacing}
                            onChange={(e) => setTickSpacing(e.target.value)}
                            className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors text-sm text-center"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !account}
                    className="w-full py-3 px-4 mt-2 bg-neutral-100 hover:bg-neutral-300 text-neutral-900 font-bold rounded-xl disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isSubmitting ? 'Building & Signing...' : 'Deploy Pool & Add Liquidity'}
                </button>
            </form>
        </div>
    );
}
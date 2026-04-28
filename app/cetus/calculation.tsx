'use client'
import { useState, useMemo } from 'react';

export default function CryptoConverter() {
    const [ethPrice, setEthPrice] = useState('2303');
    const [coinPrice, setCoinPrice] = useState('0.0000003747');

    const results = useMemo(() => {
        const eth = parseFloat(ethPrice);
        const coin = parseFloat(coinPrice);

        if (isNaN(eth) || isNaN(coin) || coin === 0 || eth === 0) {
            return { ethToCoin: 0, coinToEth: 0 };
        }

        return {
            ethToCoin: eth / coin,
            coinToEth: coin / eth,
        };
    }, [ethPrice, coinPrice]);

    return (
        <div className="p-6 max-w-md mx-auto bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700 font-mono">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">Rate Calculator</h2>

            <div className="space-y-4">
                {/* Input ETH */}
                <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">A Price (USD)</label>
                    <input
                        type="number"
                        value={ethPrice}
                        onChange={(e) => setEthPrice(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                </div>

                {/* Input My Coin */}
                <div>
                    <label className="block text-xs uppercase text-slate-400 mb-1">B Price (USD)</label>
                    <input
                        type="number"
                        value={coinPrice}
                        onChange={(e) => setCoinPrice(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 focus:ring-1 focus:ring-cyan-500 outline-none"
                        step="0.0000000001"
                    />
                </div>

                <hr className="border-slate-700" />

                {/* Output Results */}
                <div className="space-y-3 pt-2">
                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase">1 A Equals</p>
                        <p className="text-lg font-semibold text-emerald-400">
                            {results.ethToCoin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            <span className="text-xs ml-1 text-slate-400 text-sm">B</span>
                        </p>
                    </div>

                    <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
                        <p className="text-xs text-slate-500 uppercase">1 B Equals</p>
                        <p className="text-lg font-semibold text-amber-400">
                            {results.coinToEth.toFixed(15).replace(/\.?0+$/, "") === ""
                                ? "0"
                                : results.coinToEth.toFixed(13)}
                            <span className="text-xs ml-1 text-slate-400 text-sm">A</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


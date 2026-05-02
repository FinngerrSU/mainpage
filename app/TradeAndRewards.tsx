

export function TradeAndRewards() {
  const suiVisionUrl = `https://suivision.xyz/coin/0xb696b148be1f7d358a2540081ce7052c13c68b7b917895282de4b987e6467e17::puimon::PUIMON?tab=Holders`;

  return (
    <div className="w-full max-w-2xl mx-auto mb-12 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border-t-cyan-500/10">
      
      {/* Dividend Reward Hint */}
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-base font-bold text-neutral-100 tracking-wide">
            DIVIDEND REWARD INCENTIVE
          </h3>
        </div>
        <p className="text-sm text-neutral-100 max-w-sm">
          Get in early and climb the leaderboard! The <strong className="text-cyan-300 font-bold">top 40 traders</strong> by volume are eligible to receive exclusive dividends.
        </p>
      </div>

      {/* SuiVision Trade CTA Button */}
      <a
        href={suiVisionUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full md:w-auto px-6 py-3.5 bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 text-neutral-950 font-black text-center text-sm rounded-xl transition duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] whitespace-nowrap cursor-pointer"
      >
        Trade on SuiVision
      </a>
    </div>
  );
}
export function BulletinBoard() {
  return (
    <div className="w-full max-w-5xl mt-8 px-4">
      <div className="relative overflow-hidden rounded-xl border border-blue-500/40 bg-blue-950/20 backdrop-blur-xl p-6 md:p-8 shadow-[0_0_30px_rgba(30,58,138,0.3)]">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Large "NOTICE" Label */}
          <div className="flex-shrink-0 bg-blue-600 px-4 py-1 rounded text-xs font-black tracking-[0.2em] text-white uppercase shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            Broadcast
          </div>

          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-cyan-300 mb-2 tracking-tight">
              Game function is online
            </h3>
            <p className="text-neutral-300 leading-relaxed text-lg">
              YOu can download game in game center right now
            </p>
          </div>
         
        </div>
      </div>
    </div>
  );
}
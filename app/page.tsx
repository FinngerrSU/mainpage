
import Link from 'next/link';
import { Metadata } from 'next';
import CheckIn from './Check_in';
import DepositWithdraw from './depositWithdraw';

const LOGO_URL = "https://arweave.net/g2Fgf9YlkDv6B4YD0AZPZjcelUCmntk-jVEt28VzJVU";
// Helper component for the "Neo-Brutalist" Cards
const MemeCard = ({ title, emoji, desc, link, colorClass }: { title: string, emoji: string, desc: string, link: string, colorClass: string }) => (
  <Link href={link} className="block group">
    <div className={`
      relative h-full p-6 border-4 border-black rounded-xl 
      transition-all duration-150 ease-in-out
      hover:-translate-y-2 hover:translate-x-1
      shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]
      ${colorClass}
    `}>
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {emoji}
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-2">
        {title}
      </h2>
      <p className="font-bold text-black/80 leading-tight">
        {desc}
      </p>

      {/* Decorative "Go" Button inside card */}
      <div className="mt-6 inline-block bg-black text-white px-4 py-2 font-bold rounded-lg transform group-hover:rotate-2 transition-transform">
        LETS GO ➜
      </div>
    </div>
  </Link>
);

export const metadata: Metadata = {
  title: 'PUIMON Coin- Official HomePage',
  description: 'All PUIMON Ecosystem here! ',
}
export default function Home() {
  
  return (
    
    // MEME VIBE: Bright background (Pepe Green-ish)
    <main className="min-h-screen bg-[#10D8A6] text-black font-sans selection:text-white pb-20 overflow-x-hidden">

      {/* --- Marquee / Navbar --- */}
      <nav className="border-b-4 border-[#1a1a1a] bg-[#F0F6FF] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo in Navbar */}
            <div className="w-12 h-12 bg-[#B92B27] border-2 border-[#1a1a1a] rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="text-3xl font-black italic tracking-tighter">
              $PUIMON
            </span>
          </div>

        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="pt-16 pb-20 text-center px-4">
        <div className="max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-block bg-[#F0F6FF] border-2 border-[#1a1a1a] px-4 py-1 rounded-full font-bold mb-8 -rotate-2 shadow-[4px_4px_0px_0px_#000]">
            💧 Entertaining MEME COIN
          </div>

          {/* BIG TEXT */}
          <h1 className="text-7xl md:text-9xl font-black mb-6 leading-[0.9] tracking-tighter text-[#4F78EB] drop-shadow-sm">
            PUIMON<br />
            <span className="text-white">The Future</span>
          </h1>

          {/* Center Logo Display */}
          <div className="relative w-56 h-56 mx-auto mb-10 group">
            {/* Decorative Background Circle */}
            <div className="absolute inset-0 bg-[#4FB0E5] rounded-full border-4 border-[#1a1a1a] translate-x-3 translate-y-3" />
            <div className="relative w-full h-full bg-[#B92B27] rounded-full border-4 border-[#1a1a1a] overflow-hidden group-hover:-translate-y-1 transition-transform">
              <img
                src={LOGO_URL}
                alt="Main Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-10 text-white drop-shadow-md">
            Join the lottery, mint the drip, and play to win.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="https://app.cetus.zone/swap/0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC/0xb696b148be1f7d358a2540081ce7052c13c68b7b917895282de4b987e6467e17::puimon::PUIMON"  // 1. Put your URL here
              target="_blank"                     // 2. Opens in new tab
              rel="noopener noreferrer"           // 3. Security best practice
              className="w-full sm:w-auto px-10 py-4 bg-[#654FF0] text-white border-4 border-[#1a1a1a] text-2xl font-black rounded-xl shadow-[6px_6px_0px_0px_#1a1a1a] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#1a1a1a] transition-all inline-block text-center cursor-pointer decoration-0"
            >
              BUY $PUIMON
            </a>

          </div>
        </div>
      </section>

      <CheckIn/>
      <DepositWithdraw/>
      {/* --- The "Utility" (Fun) Section --- */}
      <section className="max-w-6xl mx-auto px-4">

        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white border-4 border-[#1a1a1a] px-10 py-4 transform -rotate-1 shadow-[8px_8px_0px_0px_#000]">
            <h2 className="text-4xl font-black uppercase">The Ecosystem</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* 1. Lottery Link */}
          <MemeCard
            title="Lottery"
            emoji="🎰"
            desc="Join the lottery. Earn real money"
            link="https://lottery.pui.monster"
            colorClass='bg-pink-300'
          />

          {/* 2. NFT Link */}
          <MemeCard
            title="Hentai NFT"
            emoji="🖼️"
            desc="Totally Free Minting on SUI Chain"
            link="https://hentai.pui.monster"
            colorClass='bg-cyan-300'
          />

          {/* 3. Game Link */}
          <MemeCard
            title="Game"
            emoji="🕹️"
            desc="PVP Battles. MMO Web Game (Coming Soon...)"
            link="/game"
            colorClass='bg-orange-300'
          />

        </div>
      </section>

      {/* --- Footer (Simple & Messy) --- */}
      <footer className="mt-24 pt-12 pb-12 border-t-4 border-[#1a1a1a] bg-[#1a1a1a] text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <img src={LOGO_URL} className="w-16 h-16 mx-auto mb-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
          <p className="font-bold text-lg mb-2">BUILT ON SUI</p>
          <p className="opacity-50 text-sm">
            $PUIMON is for entertainment only.
          </p>
        </div>
      </footer>

    </main>
    
  );
}
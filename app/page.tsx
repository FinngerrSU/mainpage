import Link from 'next/link';
import { Metadata } from 'next';

import Mint from './Mint';
import { GetSpecial } from './getSpecial';
import CreatePost from './Post/postFunction';
import PostFeed from './Post/PostShow';
import ConnectWalletBtn from './Wallet';

const LOGO_URL = "https://arweave.net/g2Fgf9YlkDv6B4YD0AZPZjcelUCmntk-jVEt28VzJVU";
export const revalidate = 120;
// Adapted from the "Reply" style into an "Ecosystem Node"
const EcosystemCard = ({ title, desc, link, status, category }: { title: string, desc: string, link: string, status: string, category: string }) => {
  const isLive = status.toLowerCase() !== 'coming soon';

  return (
    <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col h-full transition-all duration-200 group">

      {/* Module Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md border border-gray-200 text-[10px] font-bold uppercase tracking-wider">
          {category}
        </span>
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2 text-gray-900 tracking-tight">{title}</h3>
        <p className="mb-6 text-gray-500 font-mono text-xs leading-relaxed">{desc}</p>
      </div>

      {/* Modern Action Button (Pushed to bottom) */}
      <div className="mt-auto">
        {link.startsWith('http') ? (
          <a href={isLive ? link : '#'} target={isLive ? "_blank" : "_self"} rel="noopener noreferrer" className={`flex justify-center items-center w-full text-sm font-bold px-4 py-2.5 rounded-lg transition-all ${isLive ? 'text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600' : 'text-gray-400 bg-gray-50 cursor-not-allowed'}`}>
            {isLive ? 'Launch App ↗' : 'In Development ⏳'}
          </a>
        ) : (
          <Link href={isLive ? link : '#'} className={`flex justify-center items-center w-full text-sm font-bold px-4 py-2.5 rounded-lg transition-all ${isLive ? 'text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600' : 'text-gray-400 bg-gray-50 cursor-not-allowed'}`}>
            {isLive ? 'Enter Portal ➜' : 'In Development ⏳'}
          </Link>
        )}
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: 'PUIMON - Core Ecosystem',
  description: 'Access all PUIMON ecosystem modules here.',
}

export default async function Home() {
  const special = await GetSpecial();
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans pb-20 selection:bg-blue-200">

      {/* --- System Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Left Side: Brand & Engine Badge */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Logo */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
              <img src={LOGO_URL} alt="PUIMON" className="w-full h-full object-cover" />
            </div>

            {/* Typography Grouping */}
            <div className="flex items-baseline gap-2 sm:gap-3">
              <span className="font-black text-xl tracking-tight text-gray-900">
                PUI BBS
              </span>

              {/* SuiBoard Technical Tag */}
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                SuiBoard Engine
              </span>
            </div>

          </div>

          {/* Right Side: Links & Wallet */}
          <div className="flex items-center gap-4 sm:gap-6">

            <a
              href="https://docs.pui.monster"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Documentation
            </a>

            {/* Clean vertical divider between links and the interactive wallet button */}
            <div className="hidden sm:block w-px h-5 bg-gray-200"></div>

            <ConnectWalletBtn />

          </div>

        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 pt-8">


        {/* --- Core Overview (Hero Section) --- */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          {/* Left: System Status & Title */}
          <div className="flex flex-col gap-2 w-full sm:w-auto">

            {/* Status Indicators */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                Core Protocol
              </span>
              <span className="text-gray-500 border-l border-gray-300 pl-2 hidden sm:block">
                SUI Mainnet
              </span>
              <span className="flex items-center gap-1 text-emerald-600 border-l border-gray-300 pl-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Online
              </span>
            </div>

            <div className="text-gray-900 font-bold text-lg tracking-tight">
              PUIMON Native Asset
            </div>
          </div>

          {/* Right: The Swap Button */}
          <a
            href="https://app.cetus.zone/swap/0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC/0xb696b148be1f7d358a2540081ce7052c13c68b7b917895282de4b987e6467e17::puimon::PUIMON"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-sm hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto gap-2 whitespace-nowrap"
          >
            Buy on Cetus DEX
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>

        </div>

        {/* --- Active Modules (Side-by-Side Grid) --- */}
        <div className="mb-8">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Active Modules</div>

          <div className="flex flex-col gap-6 w-full max-w-xl justify-center mx-auto">
            {/* LEFT COLUMN: CheckIn and Mint stacked vertically */}
           

              <div className="relative w-full justify-center">
                <Mint image_url={special.image_url} />
              </div>
           



          </div>
        </div>
        <PostFeed />
        <CreatePost />
        {/* --- Ecosystem Nodes (3-Column Grid) --- */}
        <div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Ecosystem Directory</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <EcosystemCard
              category="DeFi / GameFi"
              status="LIVE"
              title="Lottery"
              desc="Test your luck on the blockchain. Enter the decentralized lottery pools and earn real yield."
              link="https://lottery.pui.monster"
            />

            <EcosystemCard
              category="Collectibles"
              status="MINTING NOW"
              title="Card NFT Drop"
              desc="Check daily card history"
              link="https://hentai.pui.monster"
            />

            <EcosystemCard
              category="Gaming Protocol"
              status="PlAYING NOW"
              title="MMO Web Game"
              desc="PVP Battles and tokenized interactions. The ultimate on-chain gaming experience is currently compiling."
              link="https://game.pui.monster"
            />

          </div>
        </div>

        {/* Embedded DApp Modules */}


        {/* --- Footer --- */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col items-center justify-center text-center text-sm text-gray-500 font-medium">
          <img src={LOGO_URL} className="w-8 h-8 mb-3 grayscale opacity-40" />
          <p className="mb-1 text-gray-800 font-bold">BUILT ON SUI</p>
          <p className="text-gray-400 text-xs">$PUIMON is a decentralized experiment for entertainment purposes.</p>
        </div>

      </div>
    </main>
  );
}

import ConnectWalletBtn from './Wallet';

import PostFeed from './Post/PostShow';
// Array-based structure makes it trivial to add "more things later"
import WrappedData from './data/wrapped';
import WrappedCetus from './cetus/wrapped';
import WrappedGame from './Game/wrapped';
import { BulletinBoard } from './board';

const PACKAGE_ID_1 = "0x0ce1729516456933aed62ff002752a32fcd87732e95913e064b6848419031c66";
const PACKAGE_ID_2="0xa9dc35c26990e4f4dd777f1d02d592f773bb8623bb1ac85239e4b5af3ec759f9";
const PACKAGE_ID_3='0xa2f7263981c8e9f60580b7304dc0fc471f31eecbf88d044d1cfac46f8add1f29';
export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8 md:p-16 flex flex-col items-center justify-center font-sans">


      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-4 sm:gap-6">
        {/* Replace the button below with your actual <ConnectWalletBtn /> */}
        <ConnectWalletBtn />
      </div>


      {/* Hero Section */}
      <div className="relative inline-block group">
        {/* The Vibrant Backlight */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-400 blur-2xl opacity-60 group-hover:opacity-100 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all duration-300 -z-10"></div>

        {/* The Text */}
        <h1 className="relative text-6xl md:text-7xl font-black tracking-widest text-white uppercase drop-shadow-md">
          PUIMON
        </h1>
      </div>
      <BulletinBoard />
      <PostFeed packageId={PACKAGE_ID_1} title='Global News'/>
       <PostFeed packageId={PACKAGE_ID_2} title='Game News'/>
      <PostFeed packageId={PACKAGE_ID_3} title='Opinions'/>
     
      <WrappedGame />
      {/* Global Disclaimer Footer */}
      <footer className="w-full max-w-3xl mx-auto mt-20 pt-8 border-t border-neutral-800/60 text-center">
        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-center gap-2 mb-3">
            
            <span className="text-lg font-mono font-bold tracking-widest text-white uppercase">
               Legal & Compliance
            </span>
          </div>
          <p className="text-lg text-white font-sans leading-relaxed max-w-2xl mx-auto">
            All materials shared on this platform—including open-source software, games, academic research papers, and curated news data—are provided strictly for <strong className="text-[#FF3D2F] font-semibold">educational, academic, and non-commercial research purposes</strong>.
          </p>
          <p className="text-base font-mono text-[#FFF871] mt-3">
            No financial advice. Intellectual property belongs to their respective owners unless stated otherwise.
          </p>
        </div>
      </footer>
    </main>
  );
}
import Link from 'next/link';
import ConnectWalletBtn from './Wallet';
import CreatePost from './Post/postFunction';
import PostFeed from './Post/PostShow';
// Array-based structure makes it trivial to add "more things later"
import DataCenterCards from './data/page';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8 md:p-16 flex flex-col items-center justify-center font-sans">


      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-4 sm:gap-6">
        {/* Replace the button below with your actual <ConnectWalletBtn /> */}
        <ConnectWalletBtn />
      </div>


      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
          PUIMON
        </h1>
      </div>
      <DataCenterCards />

      <CreatePost />
      <PostFeed />
    </main>
  );
}
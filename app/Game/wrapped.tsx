'use client';
import GetGameList from './GetGameList';
import { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { GameGrid,GameItem } from './GameList';
export default function WrappedGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [games, setGames] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define the async function inside the effect
    const fetchGames = async () => {
      try {
        const list = await GetGameList();
        setGames(list);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false); // Stop loading skeleton once done
      }
    };

    // Call it immediately
    fetchGames();
  }, []); // Empty dependency array means this runs once on mount

  // Replace your 'mounted' check with this loading state
  if (loading) return <div className="loading-skeleton h-screen w-full bg-stone-950" />;
  return (
  <section className="w-full max-w-7xl mx-auto my-12 relative">
    {/* Background Glow Effect to make the component pop from the page */}
    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

    {/* The Main Component Container */}
    <div className="relative bg-neutral-950 border border-neutral-800/80 rounded-3xl shadow-2xl ring-1 ring-white/5 overflow-hidden">
      
      {/* Component Header / Control Bar */}
      <header className="px-2 py-3 bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Visual Anchor (Blue Accent Line) */}
          <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          
          <h2 className="text-2xl font-black tracking-tight text-white">
            Hentai CENTER
          </h2>
        </div>
        
        {/* Optional Status/Label for the component */}
        <div className="px-3 py-1 rounded-full bg-neutral-800/50 border border-neutral-700/50">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Library
          </span>
        </div>
      </header>

      {/* Component Body */}
      <div className="p-3 md:p-5">
        <GameGrid games={games} />
      </div>
      
    </div>
  </section>
);
}
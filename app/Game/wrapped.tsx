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
    <div className="w-full max-w-7xl mb-8">
      {/* 1. The Trigger Button (This is what the user clicks) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-blue-500/50 transition-all"
      >
        <div className="flex flex-col items-start">
          
          <span className="text-xl font-bold bg-linear-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            GAME CENTER
          </span>
        </div>

        {/* Animated Arrow Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="p-2 bg-neutral-800 rounded-full text-blue-400"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* 2. The Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            {/* 3. Your Existing Card Content goes inside here */}
            <div className="pt-6">
             <GameGrid games={games} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
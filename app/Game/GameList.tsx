import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

export interface GameItem {
    id: string;
    creator: string;
    name: string;
    description: string;
    downloadUrl: string;
    imageUrls: string[];
    unzipPassword?: string;
}

interface GameGridProps {
    games: GameItem[];
}

export function GameGrid({ games }: GameGridProps) {
    const [mounted, setMounted] = useState(false);
    const [selectedGame, setSelectedGame] = useState<GameItem | null>(null);
    // 1. Wait for the component to land on the user's device
    useEffect(() => {
        setMounted(true);
    }, []);

    // 2. Shuffle logic runs only once per page load or when games array changes
    const cleanData = useMemo(() => {
        if (!games || games.length === 0) return [];

        const shuffled = [...games];
        const total = shuffled.length;
        // PC gets 40, Mobile gets 15
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
        const targetSize = Math.min(isMobile ? 15 : 40, total);

        // Partial Fisher-Yates shuffle
        for (let i = 0; i < targetSize; i++) {
            const j = Math.floor(Math.random() * (total - i)) + i;
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled
            .slice(0, targetSize)
            .map((obj) => ({ ...obj }))
            .filter((item): item is GameItem => item !== null);
    }, [games]);

    // 3. While the server is "thinking" or hydrating, show a skeleton matching the dark theme
    if (!mounted) return <div className="loading-skeleton h-screen w-full bg-stone-950" />;

    return (
        <div className="relative w-full p-8 bg-stone-950 min-h-screen">
            {/* --- The Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-16">
                {cleanData.map((item) => (
                    <div key={item.id} className="flex justify-center">
                        <div className="w-fit h-fit transition-transform duration-500 hover:-translate-y-3">
                            <Card item={item} onOpen={() => setSelectedGame(item)} />
                        </div>
                    </div>
                ))}
            </div>
            {/* --- The Pop-Up Panel (Modal) --- */}
            {selectedGame && (
                <GamePanel
                    game={selectedGame}
                    onClose={() => setSelectedGame(null)}
                />
            )}
        </div>
    );
}

type CardProps = {
    item: GameItem;
    onOpen: () => void;
};

function Card({ item, onOpen }: CardProps) {
    return (
        <div className="bg-stone-900 border border-stone-950 ring-1 ring-amber-900/40 w-72 rounded-md hover:z-10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(180,83,9,0.3)] transition-all duration-500 flex flex-col relative group overflow-hidden">

            {/* Changed from <a> to a <button> or <div> that triggers onOpen */}
            <div
                onClick={onOpen}
                className="shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] flex justify-center relative cursor-pointer h-64 overflow-hidden bg-stone-950"
                title={`View details for ${item.name}`}
            >
                <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>

                <Image
                    src={item.imageUrls[0]}
                    alt={item.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full rounded-t-sm filter contrast-110 saturate-[0.85] transition-all duration-500 group-hover:saturate-100"
                    unoptimized
                    priority
                />
            </div>

            <div className="bg-[#e8dcc7] flex flex-col p-4 border-t-2 border-stone-950 flex-grow">
                <div className="flex-grow">
                    <button onClick={onOpen} className="text-left w-full focus:outline-none">
                        <h3 className="font-serif font-bold text-xl text-stone-900 leading-tight mb-1 hover:text-amber-700 transition-colors">
                            {item.name}
                        </h3>
                    </button>
                    <p className="font-serif text-sm text-stone-700 line-clamp-3 mb-2">
                        {item.description}
                    </p>
                </div>

                <div className="mt-4 flex justify-between items-end border-t border-stone-400/30 pt-3">
                    <button
                        onClick={onOpen}
                        className="font-serif text-sm font-bold text-amber-800 hover:text-amber-600 transition-colors w-full text-center"
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}
type GamePanelProps = {
    game: GameItem;
    onClose: () => void;
};

function GamePanel({ game, onClose }: GamePanelProps) {
    // 1. Add state to track which image is currently being viewed
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    // 2. Handlers to go to the previous/next image
    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) =>
            prevIndex === game.imageUrls.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? game.imageUrls.length - 1 : prevIndex - 1
        );
    };

    const lines = game.description.split('\n');

    // 2. Identify the last two lines and the rest of the body
    const mainBody = lines.slice(0, -2).join('\n');
    const importantLines = lines.slice(-2);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8"
            onClick={onClose}
        >
            <div
                className="bg-stone-900 border-2 border-stone-800 ring-1 ring-amber-900/50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col md:flex-row relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-stone-800 text-stone-300 hover:text-amber-500 rounded-full hover:bg-stone-700 transition-colors"
                    aria-label="Close panel"
                >
                    ✕
                </button>

                {/* Left side: Main Image with Carousel Controls */}
                <div className="md:w-1/2 min-h-75 md:min-h-125 relative bg-stone-950 group">
                    <Image
                        src={game.imageUrls[currentImageIndex]}
                        alt={`${game.name} screenshot ${currentImageIndex + 1}`}
                        fill
                        className="object-contain opacity-90 transition-opacity duration-300"
                        unoptimized
                    />

                    {/* Only show arrows if there is more than 1 image */}
                    {game.imageUrls.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 text-white hover:bg-amber-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                aria-label="Previous image"
                            >
                                ←
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={handleNextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/60 text-white hover:bg-amber-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                aria-label="Next image"
                            >
                                →
                            </button>

                            {/* Image Counter at the bottom */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-stone-300 text-xs px-3 py-1 rounded-full font-mono">
                                {currentImageIndex + 1} / {game.imageUrls.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Right side: Details & Download (Remains Unchanged) */}
                <div className="md:w-1/2 p-8 flex flex-col bg-[#e8dcc7]">
                    <h2 className="font-serif font-bold text-3xl text-stone-900 mb-2">
                        {game.name}
                    </h2>

                    <div className="flex-grow">
                        <h4 className="font-serif font-bold text-lg text-stone-800 mb-2">About this game</h4>
                        <p className="font-serif text-stone-700 whitespace-pre-wrap leading-relaxed">
                            {mainBody}
                        </p>

                        {/* Emphasized Last Two Lines */}
                        <div className="mt-4 flex flex-col gap-1">
                            {importantLines.map((line, index) => (
                                <p key={index} className="font-serif text-red-700 font-bold whitespace-pre-wrap">
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-stone-300 flex flex-col gap-4">
                        {game.unzipPassword && (
                            <div className="bg-amber-900/10 border border-amber-900/20 p-3 rounded text-center">
                                <span className="font-serif text-sm text-stone-600 block mb-1">Extraction Password:</span>
                                <code className="font-mono font-bold text-amber-900">{game.unzipPassword}</code>
                            </div>
                        )}

                        <a
                            href={game.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-amber-500 font-serif font-bold text-center rounded transition-colors shadow-lg hover:shadow-xl border border-stone-950 hover:border-amber-900/50"
                        >
                            Download Link
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
import Link from 'next/link';
import ConnectWalletBtn from './Wallet';
import CreatePost from './Post/postFunction';
import PostFeed from './Post/PostShow';
// Array-based structure makes it trivial to add "more things later"
const directoryRoutes = [
  {
    title: 'Global Data Center',
    description: 'Real-time metrics, node statuses, and global telemetry.',
    href: 'https://global.pui.monster',
    icon: '🌐',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    title: 'Animation Vault',
    description: 'Exclusive animation galleries, episodic content, and archives.',
    href: 'https://sol.pui.monster',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Articles & Essays',
    description: 'Long-form writing, technical deep-dives, and world-building.',
    href: '/articles',
    icon: '📝',
    color: 'from-emerald-500 to-teal-400',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-8 md:p-16 flex flex-col items-center justify-center font-sans">


      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-4 sm:gap-6">
        {/* Replace the button below with your actual <ConnectWalletBtn /> */}
        <ConnectWalletBtn/>
      </div>


      {/* Hero Section */}
      <div className="max-w-3xl text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-500">
          PUIMON
        </h1>
        
      </div>

      {/* Grid Layout for Subsites */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {directoryRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="group relative flex flex-col p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden"
          >
            {/* Background Gradient Hover Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${route.color} transition-opacity duration-500`} />

            <div className="text-4xl mb-4">{route.icon}</div>
            <h2 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
              {route.title} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              {route.description}
            </p>
          </Link>
        ))}

        {/* Future Expansion Placeholder */}
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-neutral-800 text-neutral-600 opacity-50 cursor-not-allowed">
          <span className="text-2xl mb-2">➕</span>
          <h2 className="text-lg font-medium">New modules pending...</h2>
        </div>
      </div>
      <CreatePost/>
      <PostFeed/>
    </main>
  );
}
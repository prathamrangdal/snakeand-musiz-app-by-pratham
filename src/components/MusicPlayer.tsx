import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Synthwave Drift",
    artist: "AI Neon Pulse",
    cover: "https://picsum.photos/seed/synthwave/300/300",
    color: "#ff00ff"
  },
  {
    id: 2,
    title: "Midnight Pulse",
    artist: "Cyber Echo",
    cover: "https://picsum.photos/seed/pulse/300/300",
    color: "#00ffff"
  },
  {
    id: 3,
    title: "Neon Horizon",
    artist: "Vapor Geist",
    cover: "https://picsum.photos/seed/horizon/300/300",
    color: "#9d00ff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setProgress(p => (p + 0.2) % 100);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <div className="p-6 bg-gray-900/40 rounded-3xl border border-white/10 backdrop-blur-xl shadow-neon-blue w-full max-w-sm flex flex-col gap-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40 font-display">Audio Station</span>
        <div className="flex gap-1">
          <div className={`w-1 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.3s] ${!isPlaying && 'animate-none opacity-20'}`} />
          <div className={`w-1 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.1s] ${!isPlaying && 'animate-none opacity-20'}`} />
          <div className={`w-1 h-3 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.2s] ${!isPlaying && 'animate-none opacity-20'}`} />
        </div>
      </div>

      <div className="relative group">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </motion.div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-display font-bold text-white leading-tight">{currentTrack.title}</h3>
          <p className="text-sm text-white/60 font-mono uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-blue shadow-neon-blue"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button onClick={prevTrack} className="p-2 text-white/60 hover:text-white transition-colors active:scale-90">
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <button onClick={nextTrack} className="p-2 text-white/60 hover:text-white transition-colors active:scale-90">
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          <Volume2 size={16} className="text-white/40" />
          <div className="w-24 h-1 bg-white/10 rounded-full">
            <div className="w-3/4 h-full bg-white/40 rounded-full" />
          </div>
          <Music2 size={16} className="text-white/40" />
        </div>
      </div>

      <div className="mt-2 p-3 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-2">
        <span className="text-[10px] uppercase text-white/20 font-mono">Next System Track</span>
        <div className="flex items-center gap-3">
          <img 
            src={TRACKS[(currentTrackIndex + 1) % TRACKS.length].cover} 
            className="w-8 h-8 rounded-md opacity-50"
            referrerPolicy="no-referrer"
            alt="Next track"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white/40">{TRACKS[(currentTrackIndex + 1) % TRACKS.length].title}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

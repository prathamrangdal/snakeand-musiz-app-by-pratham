/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Github, Music, Gamepad2, Settings } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden selection:bg-neon-pink pb-20">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
             backgroundSize: '40px 40px' 
           }} 
      />

      {/* Header Navigation */}
      <header className="w-full max-w-7xl px-8 py-10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-blue rounded-lg flex items-center justify-center shadow-neon-blue">
            <Gamepad2 className="text-black" size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tighter text-white">NEON <span className="text-neon-pink">RHYTHM</span></h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono -mt-1">Synchronized Arcade</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-mono uppercase tracking-widest text-neon-blue hover:text-white transition-colors">Arcade</a>
          <a href="#" className="text-sm font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors">Library</a>
          <a href="#" className="text-sm font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors">Profile</a>
          <div className="w-px h-4 bg-white/10 mx-2" />
          <Settings size={20} className="text-white/40 cursor-pointer hover:text-white transition-colors" />
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl px-4 md:px-8 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 flex-1 z-10">
        
        {/* Left Side: Info & Stats (Desktop) */}
        <section className="hidden xl:flex flex-col gap-8 w-64 order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md"
          >
            <h2 className="text-xs uppercase font-bold tracking-widest text-white/30 mb-4 flex items-center gap-2">
              <Music size={12} className="text-neon-pink" /> 
              Now Playing Tech
            </h2>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-[10px] text-white/40 uppercase font-mono">BPM Range</span>
                <span className="text-sm font-bold text-neon-pink">128 - 144</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-[10px] text-white/40 uppercase font-mono">Dynamic Difficulty</span>
                <span className="text-sm font-bold text-neon-blue">Enabled</span>
              </div>
              <div className="h-px bg-white/10" />
              <p className="text-[10px] text-white/40 font-mono leading-relaxed italic">
                Connect your rhythm. The higher your score, the more intense the visual pulse becomes.
              </p>
            </div>
          </motion.div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/20 pl-2">System Resources</span>
            <div className="flex gap-2">
              <div className="h-1 bg-neon-blue flex-1 rounded-full opacity-50" />
              <div className="h-1 bg-neon-pink flex-1 rounded-full opacity-50" />
              <div className="h-1 bg-neon-purple flex-1 rounded-full" />
            </div>
          </div>
        </section>

        {/* Center: The Game */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="order-3 lg:order-2 flex justify-center"
        >
          <SnakeGame />
        </motion.section>

        {/* Right Side: Music Player */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="order-2 lg:order-3 w-full max-w-sm"
        >
          <MusicPlayer />
        </motion.section>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 w-full max-w-7xl px-8 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-mono text-white/20 z-10">
        <span>© 2026 DIGITAL ARCADE SYSTEM</span>
        <div className="flex gap-6">
          <span className="text-neon-blue">Network Stable</span>
          <span className="text-neon-pink">Latency 14ms</span>
        </div>
      </footer>
    </div>
  );
}

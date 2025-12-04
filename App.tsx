import React from 'react';
import { Player } from './components/Player';

function App() {
  return (
    <div className="min-h-screen bg-[#3e342b] flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white overflow-hidden relative">
      
      {/* Wooden Table Texture Background */}
      <div className="absolute inset-0 pointer-events-none opacity-80" 
           style={{ 
               backgroundImage: `
                   linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)),
                   url('https://www.transparenttextures.com/patterns/wood-pattern.png')
               `,
               backgroundSize: 'cover, 400px 400px'
           }}>
      </div>
      
      {/* Light Overlay (Vignette) */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none"></div>

      <header className="mb-12 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white/90 mb-2 tracking-tighter uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ textShadow: '2px 2px 0px #000' }}>
          Retro<span className="text-blue-400">Deck</span> <span className="text-neutral-400">90</span>
        </h1>
        <div className="inline-block bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10">
            <p className="text-stone-300 font-mono text-xs md:text-sm tracking-widest uppercase">
            Interactive Cassette Simulator
            </p>
        </div>
      </header>

      <main className="w-full max-w-4xl flex justify-center perspective-1000 relative z-20">
        <Player />
      </main>

      <footer className="mt-16 text-stone-400/50 text-xs text-center font-mono relative z-10">
        <p>Est. 1990 • High Fidelity Audio System</p>
      </footer>
    </div>
  );
}

export default App;
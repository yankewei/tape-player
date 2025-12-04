import React, { useState, useRef, useEffect } from 'react';
import { TapeData } from '../types';
import { Cassette } from './Cassette';
import { Controls } from './Controls';
import { TapeEditor } from './TapeEditor';
import { SpeakerGrille, ScrewHead, TextureNoise } from './Icons';

export const Player: React.FC = () => {
  const [tape, setTape] = useState<TapeData | null>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onended = () => setPlaying(false);
    audioRef.current.onerror = () => {
        setPlaying(false);
        setErrorMsg("ERR: BAD TAPE");
        setTimeout(() => setErrorMsg(null), 3000);
    };
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEject = () => {
    if (playing) {
        setPlaying(false);
        audioRef.current?.pause();
    }
    setDoorOpen(!doorOpen);
  };

  const handlePlay = () => {
    if (tape && audioRef.current && !doorOpen) {
      if (audioRef.current.src !== tape.url) {
          audioRef.current.src = tape.url;
      }
      
      // Reset error state
      setErrorMsg(null);

      audioRef.current.play()
        .then(() => setPlaying(true))
        .catch(e => {
            console.error("Playback failed", e);
            // If it's a Spotify link, it won't play natively in Audio element
            if (tape.url.includes('spotify.com')) {
                setErrorMsg("ERR: DRM LOCKED");
            } else {
                setErrorMsg("ERR: SNARLED");
            }
            setPlaying(false);
        });
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleInsertTape = (newTape: TapeData) => {
    setTape(newTape);
    setShowEditor(false);
    setErrorMsg(null);
    
    // Auto-close door after insertion to simulate mechanical loading
    // This will also trigger the Eject button to "pop up" via the isDoorOpen prop
    setTimeout(() => {
        setDoorOpen(false);
    }, 500);
  };

  const handleSlotClick = () => {
      if (doorOpen) {
          if (tape) {
              setTape(null); // Remove tape
              setPlaying(false);
          } else {
              setShowEditor(true); // Open editor
          }
      }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      
      {/* --- Main Device Body --- */}
      {/* Realistic Casing: Brushed Silver/Grey Plastic */}
      <div className="relative w-[640px] h-[340px] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.6),0_15px_25px_rgba(0,0,0,0.4)] z-10">
        
        {/* Chassis Material */}
        <div className="absolute inset-0 bg-neutral-300 rounded-xl overflow-hidden border-t border-white/50 border-b-4 border-b-neutral-900 border-x border-neutral-400">
            {/* Brushed Metal Texture Gradient */}
            <div className="absolute inset-0 opacity-100" 
                 style={{ backgroundImage: 'linear-gradient(180deg, #e5e5e5 0%, #d4d4d4 10%, #a3a3a3 100%)' }}></div>
            <TextureNoise opacity={0.3} />
        </div>

        {/* Top Trim (Dark Plastic Strip) */}
        <div className="absolute top-0 left-4 right-4 h-12 bg-[#222] rounded-b-lg shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] border-b border-white/10 z-0">
             {/* Decor lines */}
             <div className="w-full h-full opacity-20 flex flex-col justify-center gap-1">
                <div className="w-full h-[1px] bg-white"></div>
                <div className="w-full h-[1px] bg-white"></div>
             </div>
        </div>

        {/* --- Content Area --- */}
        <div className="absolute inset-4 top-14 flex rounded-lg overflow-hidden bg-[#1a1a1a] shadow-[inset_0_0_20px_black] ring-1 ring-white/20">
            
            {/* Left Side: Speaker Section */}
            <div className="w-[200px] relative bg-[#2a2a2a] border-r-2 border-[#111] flex flex-col items-center p-4">
                <TextureNoise opacity={0.05} />
                
                {/* Branding Plate */}
                <div className="w-full mb-4 px-2 py-1 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded border border-white/10 shadow-sm flex items-center justify-between">
                     <span className="text-xs font-bold text-neutral-400 font-mono tracking-widest">
                        {errorMsg ? <span className="text-red-500 animate-pulse">{errorMsg}</span> : "AUTO REVERSE"}
                     </span>
                     <div className="w-2 h-2 rounded-full bg-red-900 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] overflow-hidden">
                        {/* Power LED */}
                        <div className={`w-full h-full bg-red-500 rounded-full blur-[1px] transition-opacity ${playing ? 'opacity-100' : 'opacity-20'}`}></div>
                     </div>
                </div>

                {/* Speaker Unit */}
                <div className="relative w-36 h-36 mt-2">
                    {/* Chrome Ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-600 shadow-[0_5px_10px_black]"></div>
                    {/* Mesh */}
                    <div className="absolute inset-2 rounded-full bg-black overflow-hidden shadow-[inset_0_5px_10px_black] flex items-center justify-center">
                        <SpeakerGrille className="opacity-80" />
                        {/* Shine on mesh */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="absolute inset-[40%] rounded-full bg-neutral-800 shadow-[0_2px_5px_black] flex items-center justify-center border border-neutral-700">
                        <div className="text-[8px] font-black text-neutral-500">HI-FI</div>
                    </div>
                </div>

                {/* Bottom Model Text */}
                <div className="mt-auto text-center">
                    <h2 className="text-white/80 font-black italic text-lg tracking-tighter drop-shadow-md">STEREO<span className="text-blue-500">DECK</span></h2>
                </div>
            </div>

            {/* Right Side: Cassette Deck */}
            <div className="flex-1 relative flex items-center justify-center bg-[#111]">
                 {/* Deck Cavity (Behind door) */}
                 <div className="absolute w-[340px] h-[200px] bg-[#0a0a0a] rounded-md shadow-[inset_0_0_30px_black] border border-white/5 flex items-center justify-center overflow-hidden">
                     {/* Mechanical details in background */}
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                     <div className="flex gap-20 opacity-30">
                        <div className="w-12 h-12 rounded-full border-4 border-neutral-600 bg-neutral-800 shadow-lg"></div>
                        <div className="w-12 h-12 rounded-full border-4 border-neutral-600 bg-neutral-800 shadow-lg"></div>
                     </div>
                     {!tape && <div className="absolute text-neutral-700 font-mono text-xs tracking-[0.3em]">NO TAPE INSERTED</div>}
                 </div>

                 {/* --- The Door --- */}
                 <div 
                    className="relative w-[340px] h-[200px] z-20"
                    style={{ perspective: '1200px' }}
                >
                    <div 
                        onClick={() => doorOpen && setDoorOpen(false)}
                        className={`w-full h-full relative transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) transform-gpu cursor-pointer group/door`}
                        style={{ 
                            transformOrigin: 'bottom', 
                            // Rotate NEGATIVE to tip the top TOWARDS the viewer (Pop Out)
                            transform: doorOpen ? 'rotateX(-35deg) translateZ(5px)' : 'rotateX(0deg)',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                         {/* Door Thickness - Top Face (Visible when tilted out) */}
                         <div className="absolute -top-[16px] left-0 w-full h-[16px] bg-gradient-to-b from-neutral-600 to-neutral-700 origin-bottom transform -rotate-x-90 border-x border-t border-white/20"></div>
                         
                         {/* Door Thickness - Right Side */}
                         <div className="absolute top-0 -right-[10px] w-[10px] h-full bg-neutral-700 origin-left transform rotate-y-90"></div>
                         
                         {/* Door Thickness - Left Side */}
                         <div className="absolute top-0 -left-[10px] w-[10px] h-full bg-neutral-700 origin-right transform -rotate-y-90"></div>

                         {/* Door Front Face */}
                         <div className="absolute inset-0 bg-neutral-800/30 rounded-md border-[6px] border-neutral-400/80 shadow-[0_10px_20px_rgba(0,0,0,0.5)] backdrop-blur-[2px] overflow-hidden flex items-center justify-center backface-hidden">
                             
                             {/* Glass Reflection */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-30"></div>
                             <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/5 to-transparent rotate-45 pointer-events-none z-30"></div>

                             {/* The Tape (Inside Door) */}
                             <div className="w-[90%] relative z-10 transition-transform duration-500 transform translate-z-[2px]">
                                {tape && (
                                    <Cassette 
                                        data={tape} 
                                        isSpinning={playing} 
                                        showLabels={true} 
                                        className="shadow-2xl"
                                    />
                                )}
                             </div>

                             {/* Door Handle/Lip */}
                             <div className="absolute top-2 w-16 h-1 bg-white/20 rounded-full shadow-sm"></div>
                         </div>
                         
                         {/* Insert Area Overlay (Only clickable when open) */}
                         {doorOpen && (
                             <div 
                                onClick={(e) => { e.stopPropagation(); handleSlotClick(); }}
                                className="absolute inset-0 z-50 flex items-center justify-center hover:bg-white/5 border-2 border-dashed border-white/20 rounded-md transition-all group"
                                style={{ transform: 'translateZ(20px)' }}
                             >
                                 <span className="px-4 py-2 bg-black/80 text-white font-mono text-xs rounded shadow-lg backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform">
                                    {tape ? 'REMOVE TAPE' : 'INSERT CASSETTE'}
                                 </span>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
        
        {/* Controls (Mounted Top Right) */}
        <Controls 
            onPlay={handlePlay} 
            onStop={handleStop} 
            onEject={handleEject}
            isPlaying={playing}
            isDoorOpen={doorOpen}
            hasTape={!!tape}
            isTapeLoaded={!!tape}
        />

        {/* Screws on Chassis */}
        <ScrewHead className="absolute top-2 left-2 w-3 h-3 text-neutral-600" />
        <ScrewHead className="absolute top-2 right-2 w-3 h-3 text-neutral-600" />
        <ScrewHead className="absolute bottom-2 left-2 w-3 h-3 text-neutral-400" />
        <ScrewHead className="absolute bottom-2 right-2 w-3 h-3 text-neutral-400" />

      </div>

      {/* Realistic Table Shadow */}
      <div className="absolute bottom-[-20px] w-[90%] h-12 bg-black/60 blur-2xl rounded-[100%] z-0"></div>

      {/* Editor Modal */}
      {showEditor && (
        <TapeEditor 
            onInsert={handleInsertTape} 
            onCancel={() => setShowEditor(false)} 
        />
      )}
    </div>
  );
};
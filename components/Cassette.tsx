import React from 'react';
import { TapeData } from '../types';
import { SpindleGear, ScrewHead } from './Icons';

interface CassetteProps {
  data: TapeData;
  isSpinning: boolean;
  className?: string;
  onClick?: () => void;
  showLabels?: boolean;
}

export const Cassette: React.FC<CassetteProps> = ({ 
  data, 
  isSpinning, 
  className = '', 
  onClick,
  showLabels = true
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-[1.6/1] bg-neutral-800 rounded-lg shadow-xl select-none overflow-hidden ${className}`}
      style={{
          boxShadow: 'inset 0 0 0 2px #333, inset 0 0 10px rgba(0,0,0,0.8), 0 5px 15px rgba(0,0,0,0.5)'
      }}
    >
      {/* Plastic Texture */}
      <div className="absolute inset-0 bg-neutral-800 opacity-90" 
           style={{ backgroundImage: 'linear-gradient(45deg, #262626 25%, transparent 25%, transparent 75%, #262626 75%, #262626), linear-gradient(45deg, #262626 25%, transparent 25%, transparent 75%, #262626 75%, #262626)', backgroundSize: '4px 4px', backgroundPosition: '0 0, 2px 2px' }}></div>
      
      {/* The Sticker Label */}
      <div className="absolute top-[8%] left-[5%] right-[5%] bottom-[20%] bg-[#f0f0f0] rounded-sm overflow-hidden flex flex-col items-center shadow-[0_1px_3px_rgba(0,0,0,0.5)] z-10">
        
        {/* Label Background / Cover */}
        <div className="absolute inset-0 z-0">
            {data.cover ? (
                <div className="w-full h-full relative">
                    <img src={data.cover} alt="cover" className="w-full h-full object-cover opacity-100" />
                    {/* Paper texture overlay */}
                    <div className="absolute inset-0 bg-yellow-50/10 mix-blend-multiply"></div>
                </div>
            ) : (
                <div className="w-full h-full relative overflow-hidden" style={{ backgroundColor: data.color }}>
                     <div className="absolute top-0 w-full h-8 bg-black/10 border-b border-black/20"></div>
                     <div className="absolute bottom-0 w-full h-16 bg-white/20"></div>
                     {/* Lines */}
                     <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 20px)' }}></div>
                </div>
            )}
        </div>

        {/* Text Layer */}
        {showLabels && (
            <div className="relative z-10 w-full flex-1 flex flex-col items-center pt-2 px-4 text-center">
                 <div className={`px-3 py-1 rounded-sm rotate-[-1deg] shadow-sm border border-black/10 ${data.cover ? 'bg-white/95 backdrop-blur-md' : 'bg-white/90'}`}>
                    <h3 className="font-handwriting text-xl sm:text-2xl text-blue-900 leading-[0.9] tracking-tight">{data.title}</h3>
                </div>
                {data.artist && (
                    <div className="mt-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-sm rotate-[0.5deg] border border-black/5 shadow-sm">
                        <p className="font-handwriting text-xs text-neutral-800">{data.artist}</p>
                    </div>
                )}
            </div>
        )}

        {/* Central Window Cutout */}
        <div className="relative z-20 w-[70%] h-12 mt-auto mb-2 bg-neutral-800/90 rounded-full border-2 border-neutral-600/80 flex justify-between items-center px-2 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] backdrop-blur-sm">
             {/* Spindles */}
             <div className="relative w-8 h-8 flex items-center justify-center">
                 <SpindleGear className={`w-7 h-7 text-white/90 drop-shadow-md ${isSpinning ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
             </div>
             
             {/* Transparent Tape View */}
             <div className="flex-1 h-8 mx-1 relative overflow-hidden flex items-center justify-center">
                 {/* Tape ribbon guide */}
                 <div className="w-full h-[20px] bg-neutral-900/50 absolute top-1/2 -translate-y-1/2"></div>
                 
                 {/* Left Reel Mass */}
                 <div className="absolute left-0 top-1 bottom-1 bg-[#4a3b32] rounded-r-full shadow-[inset_-2px_0_3px_rgba(0,0,0,0.5)] border-r border-[#6d5a4d] transition-all duration-[10000ms] ease-linear" 
                      style={{ width: isSpinning ? '20%' : '45%' }}></div>
                 {/* Right Reel Mass */}
                 <div className="absolute right-0 top-1 bottom-1 bg-[#4a3b32] rounded-l-full shadow-[inset_2px_0_3px_rgba(0,0,0,0.5)] border-l border-[#6d5a4d] transition-all duration-[10000ms] ease-linear"
                      style={{ width: isSpinning ? '45%' : '20%' }}></div>
             </div>

             <div className="relative w-8 h-8 flex items-center justify-center">
                <SpindleGear className={`w-7 h-7 text-white/90 drop-shadow-md ${isSpinning ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
             </div>
        </div>
      </div>

      {/* Bottom Area (Magnetic Strip Access) */}
      <div className="absolute bottom-0 left-[15%] right-[15%] h-[18%] bg-[#1a1a1a] border-t border-neutral-700 rounded-t-sm z-0 flex justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
          {/* Felt Pad */}
         <div className="absolute top-0 w-10 h-2 bg-[#8b4513] rounded-b border border-[#5c2e0d] shadow-sm"></div>
         {/* Tape Exposure */}
         <div className="w-full h-full flex items-center justify-center opacity-30">
            <div className="w-full h-2 bg-black"></div>
         </div>
      </div>

      {/* Screws */}
      <ScrewHead className="absolute top-2 left-2 w-3 h-3 opacity-90" />
      <ScrewHead className="absolute top-2 right-2 w-3 h-3 opacity-90" />
      <ScrewHead className="absolute bottom-2 left-2 w-3 h-3 opacity-90" />
      <ScrewHead className="absolute bottom-2 right-2 w-3 h-3 opacity-90" />
      <ScrewHead className="absolute top-[85%] left-[50%] -translate-x-1/2 w-3 h-3 opacity-90" />

      {/* Glossy Overlay (Plastic Shell Reflection) */}
      <div className="absolute inset-0 rounded-lg pointer-events-none z-30 opacity-40 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
      <div className="absolute inset-0 rounded-lg pointer-events-none z-30 ring-1 ring-inset ring-white/10"></div>
    </div>
  );
};
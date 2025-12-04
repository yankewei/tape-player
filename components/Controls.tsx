
import React from 'react';
import { Play, Square, Upload } from 'lucide-react';

interface ControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onEject: () => void;
  isPlaying: boolean;
  isDoorOpen: boolean;
  hasTape: boolean;
  isTapeLoaded: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ 
    onPlay, 
    onStop, 
    onEject, 
    isPlaying, 
    isDoorOpen, 
    hasTape,
    isTapeLoaded 
}) => {
  
  // The Button Component
  const ButtonContent = ({ 
      icon: Icon, 
      label, 
      colorClass = "bg-neutral-200", 
      iconColor = "text-neutral-700",
      isLatched = false,
      onClick,
      disabled = false
  }: any) => {
      
      return (
        <div className="relative group w-16 h-20 perspective-100">
            {/* The Socket/Well (Hole in the chassis) */}
            <div className="absolute bottom-0 inset-x-0 h-4 bg-black/40 rounded-sm blur-[1px]"></div>

            {/* The Physical Button Key */}
            <button 
                onClick={onClick}
                disabled={disabled}
                className={`
                    relative w-full h-full flex flex-col items-center justify-start z-10
                    transition-all duration-200 cubic-bezier(0.4, 0, 0.2, 1)
                    focus:outline-none
                    ${isLatched ? 'translate-y-[18px]' : 'translate-y-0 active:translate-y-[18px]'}
                    ${disabled ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer'}
                `}
            >
                {/* Button Top Face */}
                <div className={`
                    relative w-full h-12 z-20
                    rounded-t-[3px] rounded-b-[2px]
                    ${colorClass}
                    border-t border-white/40 border-x border-white/20
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_-1px_1px_rgba(0,0,0,0.1),0_5px_10px_rgba(0,0,0,0.3)]
                    flex flex-col items-center justify-center gap-1
                `}>
                    {/* Grip Texture */}
                    <div className="w-10 h-1 bg-black/10 rounded-full mb-0.5"></div>
                    
                    <Icon className={`w-5 h-5 ${iconColor} ${isLatched ? 'drop-shadow-none scale-95' : 'drop-shadow-sm'}`} />
                    
                    <span className="text-[9px] font-black text-neutral-500/80 font-mono uppercase tracking-tighter select-none">
                        {label}
                    </span>

                    {/* Pressed Shadow Overlay */}
                    {isLatched && <div className="absolute inset-0 bg-black/10 rounded-t-[3px]"></div>}
                </div>

                {/* Button Side (Extrusion) */}
                <div className={`
                    absolute top-11 inset-x-1 h-[22px] -z-10
                    bg-gradient-to-b from-neutral-400 to-neutral-600
                    border-x border-neutral-700
                    shadow-[inset_0_5px_10px_rgba(0,0,0,0.5)]
                    transition-all duration-200
                    ${isLatched ? 'h-[4px] opacity-0' : 'opacity-100'}
                `}></div>
                
            </button>
        </div>
      );
  };
  
  return (
    <div className="absolute -top-[52px] right-8 flex gap-4 z-20 px-4 py-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-lg shadow-2xl border-t border-white/10">
        
        {/* STOP Button (Momentary) */}
        <ButtonContent 
            icon={Square} 
            label="Stop" 
            onClick={onStop}
            disabled={isDoorOpen && !isPlaying} // Can press stop if playing or if door closed
            colorClass="bg-gradient-to-b from-[#d6d3d1] to-[#a8a29e]"
            iconColor="text-neutral-800"
        />

        {/* PLAY Button (Latches) */}
        <ButtonContent 
            icon={Play} 
            label="Play" 
            onClick={onPlay}
            isLatched={isPlaying}
            disabled={isDoorOpen || !hasTape}
            colorClass="bg-gradient-to-b from-[#d6d3d1] to-[#a8a29e]"
            iconColor={isPlaying ? "text-green-600 fill-green-600" : "text-neutral-800"}
        />

        <div className="w-2"></div>
         
        {/* EJECT Button (Latches with Door) */}
        <ButtonContent 
            icon={Upload} 
            label="Eject" 
            onClick={onEject}
            isLatched={isDoorOpen}
            colorClass="bg-gradient-to-b from-blue-100 to-blue-300" 
            iconColor="text-blue-900" 
        />

    </div>
  );
};

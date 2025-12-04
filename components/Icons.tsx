import React from 'react';

export const SpindleGear: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Inner Hub */}
    <circle cx="50" cy="50" r="48" fill="#e5e5e5" stroke="#999" strokeWidth="1" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="4 2" />
    
    {/* Gear Teeth */}
    <path
      d="M50 15 L55 25 L45 25 Z M50 85 L55 75 L45 75 Z M15 50 L25 55 L25 45 Z M85 50 L75 55 L75 45 Z M25 25 L35 30 L30 35 Z M75 75 L65 70 L70 65 Z M25 75 L35 70 L30 65 Z M75 25 L65 30 L70 35 Z"
      fill="#d4d4d4"
    />
    
    {/* Center Hole */}
    <circle cx="50" cy="50" r="12" fill="#333" stroke="#222" strokeWidth="2" />
    <path d="M50 38 L50 62 M38 50 L62 50" stroke="#333" strokeWidth="4" />
  </svg>
);

export const ScrewHead: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`rounded-full bg-gradient-to-br from-zinc-300 to-zinc-500 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center ${className}`}>
    <div className="w-[70%] h-[15%] bg-zinc-600/80 rotate-45 rounded-[1px] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]"></div>
    <div className="w-[70%] h-[15%] bg-zinc-600/80 -rotate-45 absolute rounded-[1px] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.8)]"></div>
  </div>
);

export const SpeakerGrille: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="100%" height="100%" className={className}>
    <defs>
      <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="#111" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

export const TextureNoise: React.FC<{ className?: string; opacity?: number }> = ({ className, opacity = 0.1 }) => (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} 
         style={{ 
             opacity, 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
         }}>
    </div>
);
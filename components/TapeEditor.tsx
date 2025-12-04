
import React, { useState, useEffect, useRef } from 'react';
import { TapeData } from '../types';
import { ScrewHead, SpindleGear } from './Icons';
import { Music, Link as LinkIcon, Image as ImageIcon, Loader2, Search, Disc } from 'lucide-react';

interface TapeEditorProps {
  onInsert: (tape: TapeData) => void;
  onCancel: () => void;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

export const TapeEditor: React.FC<TapeEditorProps> = ({ onInsert, onCancel }) => {
  // Input value (what the user sees/types)
  const [inputValue, setInputValue] = useState('');
  
  // Resolved Data (what goes onto the tape)
  const [mediaUrl, setMediaUrl] = useState('');
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  
  const [selectedColor, setSelectedColor] = useState(COLORS[4]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        if (inputValue && inputValue.length > 2) {
            handleSmartSearch(inputValue);
        }
    }, 600);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSmartSearch = async (query: string) => {
      // If it looks like a URL, treat as direct link
      if (query.match(/^(http|https):\/\//)) {
          setMediaUrl(query);
          // Try to guess title from filename if empty
          if (!title) {
             try {
                const parts = query.split('/');
                const filename = parts[parts.length - 1].split('?')[0];
                const name = decodeURIComponent(filename).replace(/\.(mp3|wav|ogg|m4a)$/i, '').replace(/[_-]/g, ' ');
                if (name) setTitle(name);
             } catch (e) {}
          }
          return;
      }

      // Otherwise, SEARCH ITUNES
      setIsSearching(true);
      try {
          const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
          // Note: iTunes API supports CORS usually, but if it fails in some envs, we might need a proxy.
          // In standard browsers, it often works directly for GET requests.
          
          const res = await fetch(searchUrl);
          const data = await res.json();
          
          if (data.results && data.results.length > 0) {
              const track = data.results[0];
              
              // Set Metadata
              setTitle(`${track.trackName} - ${track.artistName}`);
              
              // Set Cover (Get high res)
              const highResArt = track.artworkUrl100.replace('100x100bb', '600x600bb');
              setCoverUrl(highResArt);
              
              // Set Audio Preview
              setMediaUrl(track.previewUrl);
          }
      } catch (err) {
          console.error("iTunes search failed", err);
      } finally {
          setIsSearching(false);
      }
  };

  const handleDemo = async () => {
      setInputValue("放漾 - A公館");
      setTitle("放漾 - A公館");
      setCoverUrl("https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/24/4f/d5/244fd5f5-9cfa-30ba-5451-bf62c648ed3c/wgg.jpg/600x600bb.jpg");
      
      setIsSearching(true);
      try {
          // Fetch audio for A Gong Guan - Fang Yang
          const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent("放漾 A公館")}&media=music&entity=song&limit=1`);
          const data = await res.json();
          if (data.results && data.results.length > 0) {
               setMediaUrl(data.results[0].previewUrl);
          } else {
               // Fallback audio if search fails
               setMediaUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
          }
      } catch (e) {
           setMediaUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      } finally {
          setIsSearching(false);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaUrl && title) {
      onInsert({ url: mediaUrl, title, color: selectedColor, cover: coverUrl });
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      
      <div className="relative flex flex-col items-center perspective-1000">
        <div className="bg-white/10 px-6 py-2 rounded-full backdrop-blur-md mb-6 border border-white/20 shadow-lg">
             <h2 className="text-white font-mono text-lg tracking-widest uppercase drop-shadow-md flex items-center gap-2">
                 <Disc className="w-5 h-5 animate-spin-slow" /> New Mixtape
             </h2>
        </div>

        {/* The Cassette Form */}
        <div className="relative w-[340px] sm:w-[500px] aspect-[1.6/1] bg-[#222] rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-neutral-600 flex flex-col p-1 overflow-hidden group transform transition-transform hover:scale-[1.02] duration-500">
            
            {/* Texture */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            
            <form onSubmit={handleSubmit} className="relative w-full h-full bg-[#1a1a1a] rounded-lg overflow-hidden flex flex-col border border-neutral-700">
                
                {/* The Label Area */}
                <div className="absolute inset-x-4 top-3 bottom-12 bg-neutral-100 rounded-sm flex flex-col shadow-inner transition-colors duration-500 overflow-hidden"
                    style={{ backgroundColor: coverUrl ? '#fff' : selectedColor }}>
                    
                    {/* Cover Art Background */}
                    {coverUrl && (
                        <div className="absolute inset-0 z-0 animate-in fade-in duration-700">
                            <img src={coverUrl} className="w-full h-full object-cover opacity-60" alt="cover preview" onError={() => setCoverUrl('')} />
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full p-4 gap-4 items-center justify-center">
                        
                        {/* Title Display / Input */}
                        <div className="relative w-full max-w-[85%] group/input z-20">
                            <input
                                type="text"
                                required
                                maxLength={40}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={isSearching ? "SEARCHING..." : "TAPE TITLE"}
                                className="w-full bg-white/50 border-b-2 border-black/20 px-2 py-2 font-handwriting text-2xl sm:text-3xl text-blue-900 placeholder-neutral-500/40 focus:outline-none focus:border-blue-600 text-center uppercase transition-all focus:bg-white/80"
                            />
                            {isSearching ? (
                                <Loader2 className="absolute right-2 top-3 w-5 h-5 text-blue-600 animate-spin" />
                            ) : (
                                <Music className="absolute right-2 top-3 w-5 h-5 text-neutral-400 pointer-events-none opacity-50" />
                            )}
                        </div>

                        {/* Search / URL Input */}
                        <div className="w-full max-w-[95%] flex flex-col gap-3 mt-1 z-20">
                            <div className="relative group/field shadow-sm">
                                <div className="absolute left-3 top-2 pointer-events-none">
                                    {inputValue.match(/^(http|https):\/\//) ? (
                                        <LinkIcon className="w-4 h-4 text-neutral-600" />
                                    ) : (
                                        <Search className="w-4 h-4 text-blue-600" />
                                    )}
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Search song or paste URL..."
                                    className="w-full bg-white/90 backdrop-blur-md border border-neutral-400/50 rounded-full pl-9 pr-3 py-1.5 font-mono text-xs text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                                {mediaUrl && !isSearching && (
                                    <div className="absolute right-3 top-1.5 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e] animate-pulse"></div>
                                )}
                            </div>
                            
                            {/* Cover URL Input (Optional override) */}
                            <div className="relative flex gap-2">
                                <div className="relative flex-1 shadow-sm">
                                    <ImageIcon className="absolute left-3 top-2 w-4 h-4 text-neutral-600" />
                                    <input
                                        type="url"
                                        value={coverUrl}
                                        onChange={(e) => setCoverUrl(e.target.value)}
                                        placeholder="Cover Image URL (Optional)"
                                        className="w-full bg-white/80 backdrop-blur-sm border border-neutral-400/50 rounded-full pl-9 pr-3 py-1.5 font-mono text-xs text-black placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <button type="button" onClick={handleDemo} className="px-3 py-1 bg-black/80 text-white text-[10px] font-bold uppercase rounded-full hover:bg-black whitespace-nowrap shadow-md border border-white/20 transition-transform hover:scale-105 active:scale-95">
                                    Demo
                                </button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="flex justify-center gap-2 mt-2 bg-white/40 p-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/20">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => { setSelectedColor(c); setCoverUrl(''); }}
                                    className={`w-4 h-4 rounded-full border border-black/10 shadow-sm transition-all hover:scale-125 hover:shadow-md ${selectedColor === c && !coverUrl ? 'ring-2 ring-offset-1 ring-black scale-110' : ''}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Spindles Visuals */}
                <div className="absolute bottom-2 left-0 right-0 h-10 bg-transparent pointer-events-none flex justify-between px-[18%] items-center z-10">
                    <div className="w-10 h-10 bg-white/90 rounded-full border-2 border-neutral-500 flex items-center justify-center shadow-lg">
                        <SpindleGear className="w-8 h-8 text-neutral-700" />
                    </div>
                    <div className="w-10 h-10 bg-white/90 rounded-full border-2 border-neutral-500 flex items-center justify-center shadow-lg">
                        <SpindleGear className="w-8 h-8 text-neutral-700" />
                    </div>
                </div>

                {/* Screws */}
                <ScrewHead className="absolute top-2 left-2 w-3 h-3 text-neutral-400 opacity-80" />
                <ScrewHead className="absolute top-2 right-2 w-3 h-3 text-neutral-400 opacity-80" />
                <ScrewHead className="absolute bottom-2 left-2 w-3 h-3 text-neutral-400 opacity-80" />
                <ScrewHead className="absolute bottom-2 right-2 w-3 h-3 text-neutral-400 opacity-80" />
            </form>
            
            {/* Gloss Overlay */}
            <div className="absolute inset-0 rounded-xl pointer-events-none z-30 bg-gradient-to-tr from-white/10 to-transparent"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
             <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-neutral-800 text-white font-mono text-sm rounded shadow-lg hover:bg-neutral-700 transition-all border border-neutral-600 hover:border-neutral-400"
            >
                CANCEL
            </button>
            <button
                onClick={handleSubmit}
                disabled={!mediaUrl}
                className={`px-8 py-2 font-mono text-sm font-bold rounded shadow-[0_4px_15px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-0.5 border border-blue-400/30 flex items-center gap-2
                    ${mediaUrl ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:brightness-110' : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'}
                `}
            >
                {mediaUrl ? 'INSERT TAPE' : 'ENTER SONG...'}
            </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export function BackgroundMusicPlayer({ musicUrl, isMuted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt auto play on user first click anywhere on document
    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying && !isMuted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio autoplay prevented by browser policy:', err);
        });
      }
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);
    return () => document.removeEventListener('click', handleFirstClick);
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    soundEngine.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        // If no custom mp3 provided yet, play synth background music fallback
        soundEngine.toggleBgMusic();
        setIsPlaying(true);
      });
    }
  };

  return (
    <div className="flex items-center gap-2 bg-pink-50/90 px-3 py-1.5 rounded-full border border-pink-300 shadow-sm">
      
      {/* Animated Equalizer Wave / Icon */}
      <div className="flex items-center gap-0.5">
        <Music className={`w-4 h-4 text-pink-600 ${isPlaying ? 'animate-bounce' : ''}`} />
      </div>

      {/* Song Title Info */}
      <div className="flex flex-col">
        <span className="text-xs font-extrabold text-pink-950 leading-none">
          Upohar
        </span>
        <span className="text-[9px] text-pink-800/80 font-bold leading-none mt-0.5">
          Bishrut Saikia 🎵
        </span>
      </div>

      {/* Play / Pause Toggle Button */}
      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all ml-1"
        title={isPlaying ? 'Pause Background Music' : 'Play Upohar by Bishrut Saikia'}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5 fill-white" />
        ) : (
          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
        )}
      </button>

      {/* Audio Tag configured for Infinite Loop */}
      {musicUrl && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          preload="auto"
          onError={(e) => {
            console.warn('Audio URL load error, falling back to /upohar.mp3', e);
            if (audioRef.current && musicUrl !== '/upohar.mp3') {
              audioRef.current.src = '/upohar.mp3';
              audioRef.current.play().catch(() => {});
            }
          }}
        />
      )}
    </div>
  );
}

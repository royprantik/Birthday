import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause } from 'lucide-react';

export function BackgroundMusicPlayer({ musicUrl, isMuted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const effectiveSrc = musicUrl || '/upohar.mp3';

  // Ensure audio plays when user interacts or toggles
  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Playback error:', err);
    });
  };

  const pauseAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioRef.current && !isPlaying && !isMuted) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isPlaying, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

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
      <audio
        ref={audioRef}
        src={effectiveSrc}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Image, Settings } from 'lucide-react';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';
import { soundEngine } from '../utils/audio';

// Anniversary start date: March 8th, 2024 00:00:00
const START_DATE = new Date('2024-03-08T00:00:00');

export function HeaderCounter({ onOpenVault, onOpenCustomizer, isMuted, setIsMuted, bgMusicUrl }) {
  const [elapsed, setElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      let diffMs = now - START_DATE;
      if (diffMs < 0) diffMs = 0;

      const secondsTotal = Math.floor(diffMs / 1000);
      const minutesTotal = Math.floor(secondsTotal / 60);
      const hoursTotal = Math.floor(minutesTotal / 60);
      const daysTotal = Math.floor(hoursTotal / 24);

      let start = new Date(START_DATE);
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += lastMonthDate;
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      setElapsed({
        years,
        months,
        days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        totalDays: daysTotal
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextMuteState = !isMuted;
    setIsMuted(nextMuteState);
    soundEngine.setMuted(nextMuteState);
    if (!nextMuteState && !isPlayingMusic) {
      const playing = soundEngine.toggleBgMusic();
      setIsPlayingMusic(playing);
    }
  };

  return (
    <header className="w-full sticky top-0 z-40 px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-pink-500/15 shadow-sm rounded-none mb-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Heartbeat Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 p-0.5 shadow-md shadow-pink-500/20">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600 fill-pink-500 animate-heartbeat" />
            </div>
          </div>
          <div>
            <h1 className="font-playfair text-xl md:text-2xl font-bold gradient-text leading-tight">
              Our Journey of Love
            </h1>
            <p className="text-xs text-rose-800/70 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" /> Together Since March 08, 2024
            </p>
          </div>
        </div>

        {/* Live Counter Cards (Bright Luxury Theme) */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-rose-50/80 p-2 rounded-2xl border border-pink-200/80 shadow-inner">
          <div className="flex flex-col items-center px-2 py-1 bg-white rounded-xl min-w-[44px] shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-pink-700 font-mono">
              {elapsed.years}
            </span>
            <span className="text-[9px] text-pink-900/60 uppercase font-semibold">Yrs</span>
          </div>

          <span className="text-pink-400 font-bold text-base">:</span>

          <div className="flex flex-col items-center px-2 py-1 bg-white rounded-xl min-w-[44px] shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-pink-600 font-mono">
              {elapsed.months}
            </span>
            <span className="text-[9px] text-pink-900/60 uppercase font-semibold">Mos</span>
          </div>

          <span className="text-pink-400 font-bold text-base">:</span>

          <div className="flex flex-col items-center px-2 py-1 bg-white rounded-xl min-w-[44px] shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-amber-600 font-mono">
              {elapsed.days}
            </span>
            <span className="text-[9px] text-pink-900/60 uppercase font-semibold">Days</span>
          </div>

          <span className="text-pink-400 font-bold text-base">:</span>

          <div className="flex flex-col items-center px-2 py-1 bg-white rounded-xl min-w-[44px] shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-purple-700 font-mono">
              {String(elapsed.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-pink-900/60 uppercase font-semibold">Hrs</span>
          </div>

          <span className="text-pink-400 font-bold text-base">:</span>

          <div className="flex flex-col items-center px-2 py-1 bg-white rounded-xl min-w-[44px] shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-rose-700 font-mono">
              {String(elapsed.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-pink-900/60 uppercase font-semibold">Min</span>
          </div>

          <span className="text-pink-400 font-bold text-base">:</span>

          <div className="flex flex-col items-center px-2 py-1 bg-pink-100/80 rounded-xl min-w-[44px] border border-pink-400/40 shadow-sm">
            <span className="text-base md:text-lg font-extrabold text-pink-700 font-mono animate-pulse">
              {String(elapsed.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-pink-900 uppercase font-bold">Sec</span>
          </div>
        </div>

        {/* Action Control Buttons & Music Player */}
        <div className="flex items-center gap-2">
          
          {/* Upohar by Bishrut Saikia Continuous Background Music Player */}
          <BackgroundMusicPlayer musicUrl={bgMusicUrl} isMuted={isMuted} />

          <button
            onClick={onOpenVault}
            className="btn-secondary text-xs sm:text-sm !py-2 !px-3 flex items-center gap-1.5"
            title="Memory Vault"
          >
            <Image className="w-4 h-4 text-pink-600" />
            <span className="hidden sm:inline">Memories</span>
          </button>

          <button
            onClick={onOpenCustomizer}
            className="btn-secondary text-xs sm:text-sm !py-2 !px-3 flex items-center gap-1.5"
            title="Customize Photos, Audio & Letter"
          >
            <Settings className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Customize</span>
          </button>

          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-all ${
              isMuted
                ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}

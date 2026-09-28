import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, Gift, Volume2, VolumeX, Play, Pause, Flame, RotateCcw, Image as ImageIcon, Music, Radio, Crown, Compass, Wind, FastForward } from 'lucide-react';
import { triggerFireworks, triggerHeartBlast } from '../utils/fireworks';
import { soundEngine } from '../utils/audio';

// 20 Candles forming the shape of "20"
const CANDLE_POSITIONS = [
  // Digit "2" (10 candles)
  { x: 32, y: 32 },
  { x: 48, y: 22 },
  { x: 65, y: 28 },
  { x: 70, y: 44 },
  { x: 60, y: 60 },
  { x: 48, y: 76 },
  { x: 38, y: 92 },
  { x: 32, y: 105 },
  { x: 50, y: 105 },
  { x: 68, y: 105 },

  // Digit "0" (10 candles)
  { x: 105, y: 35 },
  { x: 125, y: 24 },
  { x: 145, y: 35 },
  { x: 152, y: 54 },
  { x: 152, y: 76 },
  { x: 145, y: 95 },
  { x: 125, y: 105 },
  { x: 105, y: 95 },
  { x: 98, y: 76 },
  { x: 98, y: 54 }
];

const TOTAL_CANDLES = CANDLE_POSITIONS.length; // 20

export function BirthdayFinale({ letterText, memories, voiceNoteUrl, herPhotoUrl, onReplayMap, onOpenCustomizer, onCeremonyStateChange }) {
  // Ceremony phases: 'lighting' -> 'blowing' -> 'revealed'
  const [ceremonyPhase, setCeremonyPhase] = useState('lighting');
  const [litCandlesCount, setLitCandlesCount] = useState(0);
  const [blownCandlesCount, setBlownCandlesCount] = useState(0);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  const audioRef = useRef(null);
  const swipeTouchStartX = useRef(null);

  // Notify parent App whether ceremony is active (so top header is hidden completely)
  useEffect(() => {
    if (onCeremonyStateChange) {
      onCeremonyStateChange(ceremonyPhase !== 'revealed');
    }
  }, [ceremonyPhase, onCeremonyStateChange]);

  // Phase 1 & 2: 100% Pitch-Black screen with 20 candles lighting up slowly
  // Each candle ignites every ~2.8 seconds slowly
  useEffect(() => {
    if (ceremonyPhase === 'lighting') {
      setLitCandlesCount(0);
      setBlownCandlesCount(0);

      const interval = setInterval(() => {
        setLitCandlesCount((prev) => {
          if (prev < TOTAL_CANDLES) {
            soundEngine.playSwap(); // Soft chime on each ignition
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => setCeremonyPhase('blowing'), 800);
            return TOTAL_CANDLES;
          }
        });
      }, 2800); // 2.8 seconds per candle

      return () => clearInterval(interval);
    }
  }, [ceremonyPhase]);

  // Handle blowing out action
  const handleBlowCandlesAction = () => {
    if (ceremonyPhase !== 'blowing') return;

    soundEngine.playMatch();
    const blowInterval = setInterval(() => {
      setBlownCandlesCount((prev) => {
        if (prev < TOTAL_CANDLES) {
          return prev + 1;
        } else {
          clearInterval(blowInterval);
          setTimeout(() => {
            setCeremonyPhase('revealed');
            triggerFireworks();
            triggerHeartBlast();
            soundEngine.playVictory();
          }, 900);
          return TOTAL_CANDLES;
        }
      });
    }, 100);
  };

  const handleFastForwardLighting = () => {
    setLitCandlesCount(TOTAL_CANDLES);
    setCeremonyPhase('blowing');
  };

  const handleTouchStart = (e) => {
    swipeTouchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!swipeTouchStartX.current) return;
    const diffX = e.changedTouches[0].clientX - swipeTouchStartX.current;
    if (Math.abs(diffX) > 30) {
      handleBlowCandlesAction();
    }
    swipeTouchStartX.current = null;
  };

  const handleReplayCeremony = () => {
    soundEngine.playClick();
    setCeremonyPhase('lighting');
  };

  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    soundEngine.playClick();

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(() => {
        soundEngine.playVictory();
        setIsPlayingAudio(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime);
      setAudioDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const profilePhotoSrc = herPhotoUrl || '/memories/birthday_cake.png';

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start relative">
      
      {/* 100% ABSOLUTE PITCH BLACK CEREMONY OVERLAY (Phases 1, 2 & 3: NOTHING else visible) */}
      {ceremonyPhase !== 'revealed' && (
        <div
          className="fixed inset-0 z-[999999] bg-black w-screen h-screen flex flex-col items-center justify-center p-4 select-none touch-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Status Prompt */}
          <div className="text-center mb-4 sm:mb-8 z-10 px-4">
            <h2 className="font-playfair text-2xl sm:text-4xl font-extrabold text-white mb-1">
              Miss Violina Das 👑
            </h2>
            <p className="text-amber-300 text-xs sm:text-sm font-semibold">
              {ceremonyPhase === 'lighting'
                ? `Lighting Candle ${litCandlesCount} of 20...`
                : 'Swipe across the screen or tap below to Blow Out the 20 Candles! 💨'}
            </p>
          </div>

          {/* TOP-DOWN VIEW OF CAKE WITH 20 CANDLES SHAPED AS "20" */}
          <div className="relative w-72 h-72 sm:w-[420px] sm:h-[420px] my-2 sm:my-6 z-10 flex items-center justify-center bg-black">
            
            {/* Pure Pitch Black Container */}
            <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden">
              
              {/* 20 Candles in the Shape of "20" */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 190 130"
                  className="w-full h-full p-6 sm:p-10 overflow-visible"
                >
                  {CANDLE_POSITIONS.map((pos, i) => {
                    const isLit = i < litCandlesCount;
                    const isBlown = i < blownCandlesCount;

                    // UNLIT CANDLES ARE PURE PITCH BLACK (COMPLETELY INVISIBLE)
                    if (!isLit) return null;

                    return (
                      <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                        {/* Candle Body - ONLY VISIBLE WHEN LIT */}
                        {!isBlown && (
                          <rect
                            x="-3"
                            y="2"
                            width="6"
                            height="14"
                            rx="3"
                            fill="url(#candleGradient)"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="0.5"
                          />
                        )}

                        {/* Flame Light & Aura */}
                        {isLit && !isBlown && (
                          <g className="animate-pulse">
                            {/* Outer Glow Halo */}
                            <circle cx="0" cy="-6" r="16" fill="rgba(245,158,11,0.35)" />
                            {/* Inner Flame SVG */}
                            <path
                              d="M 0,-12 C 4,-6 4,-2 0,2 C -4,-2 -4,-6 0,-12 Z"
                              fill="#f59e0b"
                            />
                            <path
                              d="M 0,-9 C 2.5,-5 2.5,-2 0,1 C -2.5,-2 -2.5,-5 0,-9 Z"
                              fill="#fef08a"
                            />
                          </g>
                        )}

                        {/* Blown Smoke Effect */}
                        {isBlown && (
                          <text
                            x="-5"
                            y="-6"
                            fontSize="10"
                            className="animate-ping opacity-60"
                            fill="#ffffff"
                          >
                            💨
                          </text>
                        )}
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="candleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#be185d" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

            </div>
          </div>

          {/* Controls & Prompts */}
          <div className="z-10 mt-4 flex flex-col items-center gap-3">
            {ceremonyPhase === 'lighting' && (
              <button
                onClick={handleFastForwardLighting}
                className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                <span>Fast Forward Lighting ⚡</span>
              </button>
            )}

            {ceremonyPhase === 'blowing' && (
              <button
                onClick={handleBlowCandlesAction}
                className="btn-primary text-base sm:text-lg !py-3.5 !px-8 shadow-2xl shadow-amber-500/50 flex items-center gap-2 animate-bounce"
              >
                <Wind className="w-6 h-6 text-amber-200" />
                <span>💨 Swipe or Tap to Blow Candles Out!</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: THE REVEALED GRAND BIRTHDAY CELEBRATION PAGE */}
      {ceremonyPhase === 'revealed' && (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center animate-[fadeIn_0.8s_ease-out_forwards]">
          
          {/* Hero Grand Birthday Header Card */}
          <div className="w-full glass-panel-glow p-6 sm:p-10 text-center relative overflow-hidden mb-10 border-2 border-pink-400/50 shadow-2xl bg-white/95">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
              
              {/* HER PROFILE PHOTO BADGE CARD FRAME (MISS VIOLINA DAS) */}
              <div className="relative group shrink-0">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl p-1.5 bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-xl shadow-pink-500/20">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-rose-50 border-2 border-white relative">
                    <img
                      src={profilePhotoSrc}
                      alt="Miss Violina Das"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Crown Badge */}
                  <div className="absolute -top-3 -right-2 w-10 h-10 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-md animate-bounce">
                    <Crown className="w-6 h-6 text-slate-900 fill-amber-300" />
                  </div>
                </div>

                {/* Name Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-950 font-extrabold text-sm sm:text-base shadow-sm">
                  <span>Miss Violina Das 👑</span>
                </div>
              </div>

              {/* Ceremony Relight & Cake Info */}
              <div className="relative flex-1 flex flex-col items-center justify-center text-center">
                
                <div className="w-28 h-20 rounded-2xl bg-gradient-to-tr from-pink-400 via-rose-300 to-pink-200 border-2 border-pink-300 shadow-xl flex items-center justify-center text-3xl mb-3">
                  🎂
                </div>

                <button
                  onClick={handleReplayCeremony}
                  className="px-4 py-1.5 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs font-bold hover:bg-pink-200 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>🕯️ Replay 20-Candle Lighting Ceremony</span>
                </button>
              </div>

            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs sm:text-sm font-bold mb-3">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>Grand Birthday Celebration Page</span>
            </div>

            {/* BIGGER PROMINENT NAME HEADER */}
            <h1 className="font-playfair text-4xl sm:text-6xl font-extrabold gradient-text mb-3 leading-tight">
              Happy Birthday Miss Violina Das! 🎂💖
            </h1>

            <p className="text-pink-950/80 max-w-xl mx-auto text-sm sm:text-base mb-6 font-medium leading-relaxed">
              To my highness, Miss Violina Das — the cosmic attractor of my life, dragging me towards you across all time and space!
            </p>

            {/* Celebrate Fireworks Button */}
            <button
              onClick={() => {
                triggerFireworks();
                triggerHeartBlast();
                soundEngine.playVictory();
              }}
              className="btn-primary text-base sm:text-lg !py-3.5 !px-8 shadow-2xl shadow-pink-500/30 animate-pulse-glow"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Celebrate With Fireworks & Confetti! 🎆</span>
            </button>
          </div>

          {/* Cosmic Love Compatibility Card */}
          <div className="w-full glass-panel p-6 mb-10 border-pink-300 bg-white/95 shadow-xl">
            <div className="flex items-center justify-between border-b border-pink-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-pink-600 animate-spin" />
                <h3 className="font-playfair text-xl font-bold text-pink-950">
                  Our Cosmic Love Compatibility 🌌✨
                </h3>
              </div>
              <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-300">
                Verified 100% Cosmic Match
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-rose-50 p-3 rounded-2xl border border-pink-200">
                <span className="text-xs font-semibold text-pink-800">Cosmic Attractor</span>
                <div className="text-xl font-extrabold text-pink-600 mt-1">1000%</div>
                <span className="text-[10px] text-pink-900/60 font-medium">Time & Space Magnet</span>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-pink-200">
                <span className="text-xs font-semibold text-pink-800">Hug Compatibility</span>
                <div className="text-xl font-extrabold text-rose-600 mt-1">Infinite ♾️</div>
                <span className="text-[10px] text-pink-900/60 font-medium">Warm & Cozy</span>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-pink-200">
                <span className="text-xs font-semibold text-pink-800">Angry Bird Mood</span>
                <div className="text-xl font-extrabold text-amber-600 mt-1">Super Cute 🦜</div>
                <span className="text-[10px] text-pink-900/60 font-medium">Nehru Park Favorite</span>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-pink-200">
                <span className="text-xs font-semibold text-pink-800">First Kiss Rating</span>
                <div className="text-xl font-extrabold text-purple-700 mt-1">10/10 ✨</div>
                <span className="text-[10px] text-pink-900/60 font-medium">Digholi Pukhuri</span>
              </div>
            </div>
          </div>

          {/* Voice Note Audio Player Card ("Listen to My Voice 🎙️") */}
          <div className="w-full glass-panel p-6 sm:p-8 mb-10 border-pink-300/60 bg-gradient-to-r from-white via-rose-50/50 to-white shadow-xl relative">
            <div className="flex items-center justify-between border-b border-pink-200/80 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-pink-600">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-pink-950">
                    A Special Voice Message For You 🎙️❤️
                  </h3>
                  <p className="text-xs text-pink-800/70 font-medium">
                    Press play to listen to a voice note recorded with love
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenCustomizer}
                className="btn-secondary !py-1 !px-3 text-xs flex items-center gap-1"
              >
                Upload Audio
              </button>
            </div>

            {/* Audio Player Controls */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-pink-200 shadow-sm">
              <button
                onClick={handleToggleAudio}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                {isPlayingAudio ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs text-pink-900/70 font-mono">
                  <span>{formatTime(audioProgress)}</span>
                  <span>{formatTime(audioDuration || 90)}</span>
                </div>

                <div className="h-2 bg-pink-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-200"
                    style={{
                      width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {voiceNoteUrl && (
              <audio
                ref={audioRef}
                src={voiceNoteUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlayingAudio(false)}
              />
            )}
          </div>

          {/* Romantic Birthday Letter Parchment Card */}
          <div className="w-full glass-panel p-8 sm:p-12 mb-10 border-pink-300/80 bg-white/95 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-pink-200/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-600 fill-pink-500 animate-heartbeat" />
                <h3 className="font-playfair text-2xl font-bold text-pink-950">
                  My Birthday Letter To Miss Violina Das
                </h3>
              </div>
              <span className="text-xs text-pink-700/60 font-semibold uppercase">
                With All My Heart
              </span>
            </div>

            {/* Letter Text Content */}
            <div className="prose prose-rose max-w-none font-playfair text-lg sm:text-xl leading-relaxed text-pink-950 whitespace-pre-line tracking-wide">
              {letterText}
            </div>

            <div className="mt-8 pt-4 border-t border-pink-200/60 flex items-center justify-end">
              <span className="text-xs text-pink-700 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tap 'Customize' anytime to edit this letter
              </span>
            </div>
          </div>

          {/* Unlocked Memory Highlights Polaroid Grid */}
          <div className="w-full mb-10">
            <h3 className="font-playfair text-2xl font-bold text-pink-950 mb-6 text-center flex items-center justify-center gap-2">
              <ImageIcon className="w-6 h-6 text-pink-600" />
              <span>Our Memory Book Highlights</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {memories.map((mem) => {
                const firstSlide = mem.slides[0];
                return (
                  <div
                    key={mem.id}
                    className="bg-white p-4 rounded-2xl border border-pink-200 shadow-md hover:shadow-xl hover:border-pink-400 transition-all group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-rose-50">
                      {firstSlide?.url && (
                        <img
                          src={firstSlide.url}
                          alt={mem.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] text-pink-700 font-bold border border-pink-300">
                        Level {mem.id}
                      </div>
                    </div>

                    <h4 className="font-playfair font-bold text-pink-950 text-sm group-hover:text-pink-600 transition-colors">
                      {mem.title}
                    </h4>
                    <p className="text-xs text-pink-800/60 mt-1 line-clamp-1">
                      {mem.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onReplayMap}
              className="btn-secondary !py-3 !px-6 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5 text-pink-600" />
              <span>Back to Saga Map</span>
            </button>

            <button
              onClick={onOpenCustomizer}
              className="btn-primary !py-3 !px-6 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Customize Photos & Letter</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

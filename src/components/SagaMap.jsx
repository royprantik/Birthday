import React, { useState } from 'react';
import { Lock, Play, Star, Sparkles, Trophy, Heart, Gift, Eye } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export function SagaMap({ memories, onPlayLevel, onGoToFinale, onSelectStory, currentLevelId }) {
  const [unlockAllMode, setUnlockAllMode] = useState(false);

  const handlePlayClick = (e, memory) => {
    e.stopPropagation();
    soundEngine.playClick();
    onPlayLevel(memory.id);
  };

  const handleStoryClick = (e, memory) => {
    e.stopPropagation();
    soundEngine.playClick();
    if (onSelectStory) {
      onSelectStory(memory);
    }
  };

  const handleFinaleClick = (e) => {
    e.stopPropagation();
    soundEngine.playClick();
    onGoToFinale();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      
      {/* Hero Banner Header */}
      <div className="text-center mb-8 glass-panel-glow p-6 md:p-8 relative overflow-hidden bg-white/90">
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-100 border border-pink-300 text-pink-700 text-xs md:text-sm font-bold mb-3">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>Interactive Memory Crush Saga</span>
        </div>

        <h2 className="font-playfair text-3xl md:text-5xl font-extrabold gradient-text mb-3">
          Clear Levels to Unlock Our Memories 💖
        </h2>

        <p className="text-pink-950/80 max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-4 font-medium">
          Match sweet candies to clear each level goal. Completing a level unlocks our photo story memory and unlocks the next level! 🎂✨
        </p>

        {/* Quick Unlock / Preview Toggle */}
        <div className="inline-flex items-center gap-2 bg-rose-50/80 px-3.5 py-1.5 rounded-full border border-pink-200 text-xs text-pink-900 font-semibold shadow-sm">
          <Eye className="w-3.5 h-3.5 text-amber-600" />
          <span>Unlock All Levels (Preview Mode):</span>
          <button
            onClick={() => setUnlockAllMode(!unlockAllMode)}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-all ${
              unlockAllMode
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white text-pink-900 border border-pink-300 hover:bg-pink-100'
            }`}
          >
            {unlockAllMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Level Saga Path Map */}
      <div className="relative py-8 px-4 flex flex-col items-center gap-12 sm:gap-16">
        
        {/* Curved starry path background line */}
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-pink-400/40 via-rose-300/40 to-pink-500/40 rounded-full z-0 hidden sm:block border border-dashed border-pink-300/40" />

        {memories.map((memory, index) => {
          const isUnlocked = unlockAllMode || memory.unlocked || memory.id === 1;
          const isLastLevel = index === memories.length - 1;

          // Alternate left / right offset layout for saga map feel
          const offsetClass = index % 2 === 0 ? 'sm:translate-x-[-120px]' : 'sm:translate-x-[120px]';

          return (
            <div
              key={memory.id}
              className={`relative z-10 transition-all duration-300 transform ${offsetClass}`}
            >
              <div
                className={`group relative w-72 sm:w-80 glass-panel p-5 flex flex-col items-center text-center border transition-all duration-300 ${
                  isUnlocked
                    ? 'border-pink-300 hover:border-pink-500 hover:shadow-2xl hover:shadow-pink-500/20 bg-white/95'
                    : 'opacity-70 border-rose-200 grayscale-[40%] bg-rose-50/50'
                }`}
              >
                {/* Level Badge Number / Icon */}
                <div className="relative mb-3">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg transition-transform group-hover:scale-110 ${
                      isLastLevel
                        ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-pink-600 text-white shadow-amber-500/40'
                        : isUnlocked
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-pink-500/30'
                        : 'bg-rose-100 text-rose-400 border border-pink-200'
                    }`}
                  >
                    {isLastLevel ? (
                      <Gift className="w-8 h-8 text-white animate-bounce" />
                    ) : isUnlocked ? (
                      <span>{memory.id}</span>
                    ) : (
                      <Lock className="w-6 h-6 text-rose-400" />
                    )}
                  </div>

                  {/* Level Star Rating */}
                  {isUnlocked && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    </div>
                  )}
                </div>

                {/* Level Title & Subtitle */}
                <h3 className="font-playfair text-xl font-bold text-pink-950 group-hover:text-pink-600 transition-colors">
                  {memory.title}
                </h3>
                <p className="text-xs text-pink-800/70 mt-1 mb-4 font-medium">
                  {memory.subtitle}
                </p>

                {/* Level Goal Pill */}
                <div className="w-full bg-rose-50/80 rounded-xl p-2 mb-4 border border-pink-200 flex items-center justify-around text-xs">
                  <div className="flex items-center gap-1 text-pink-700 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>Goal: {memory.requiredCount} {memory.requiredType}s</span>
                  </div>
                  <span className="text-pink-300">|</span>
                  <div className="text-amber-700 font-bold">
                    Moves: {memory.maxMoves}
                  </div>
                </div>

                {/* Play & View Story Buttons Action Row */}
                <div className="w-full flex flex-col gap-2">
                  {isUnlocked && !isLastLevel && (
                    <button
                      onClick={(e) => handleStoryClick(e, memory)}
                      className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-amber-300" />
                      <span>View Story Memory ({memory.slides.length} Photos) 📸</span>
                    </button>
                  )}

                  <button
                    disabled={!isUnlocked}
                    onClick={(e) => handlePlayClick(e, memory)}
                    className={`w-full py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isUnlocked
                        ? 'bg-rose-50 text-pink-900 border border-pink-300 hover:bg-pink-100 shadow-sm'
                        : 'bg-rose-100 text-rose-400 cursor-not-allowed border border-rose-200'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Play className="w-3.5 h-3.5 text-pink-600 fill-pink-500" />
                        <span>Play Level {memory.id} Game 🎮</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked (Complete Level {memory.id - 1})</span>
                      </>
                    )}
                  </button>

                  {/* If final level & unlocked, show direct Birthday Finale shortcut button */}
                  {isLastLevel && (memory.unlocked || unlockAllMode) && (
                    <button
                      onClick={handleFinaleClick}
                      className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600 text-white hover:scale-[1.02] flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <Gift className="w-4 h-4 text-white" />
                      <span>View Birthday Finale Page 🎂</span>
                    </button>
                  )}
                </div>

                {/* Memory Unlocked Ribbon Badge */}
                {memory.unlocked && (
                  <div className="mt-3 text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Memory Unlocked!</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

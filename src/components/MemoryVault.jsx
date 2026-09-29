import React from 'react';
import { X, Play, Image as ImageIcon, Calendar, Sparkles, Heart } from 'lucide-react';

export function MemoryVault({ memories, onClose, onSelectStory }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 max-w-3xl w-full border-pink-300 relative my-8 bg-white/95 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600">
              <ImageIcon className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="font-playfair text-2xl font-bold text-pink-950">
                Our Memory Vault 💖
              </h3>
              <p className="text-xs text-pink-800/70 font-medium">
                All memory stories collected from your journey
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Story Memory Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memories.map((mem) => {
            const isUnlocked = true;
            const firstSlide = mem.slides[0];

            return (
              <div
                key={mem.id}
                onClick={() => isUnlocked && onSelectStory(mem)}
                className={`bg-white p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'border-pink-200 hover:border-pink-500 cursor-pointer hover:shadow-lg hover:scale-[1.02]'
                    : 'opacity-50 grayscale cursor-not-allowed border-rose-100 bg-rose-50/50'
                }`}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-rose-50 border border-pink-200">
                  {firstSlide?.url && (
                    <img
                      src={firstSlide.url}
                      alt={mem.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {isUnlocked && (
                    <div className="absolute inset-0 bg-pink-950/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/90 text-[11px] text-pink-700 font-bold border border-pink-300">
                    Level {mem.id}
                  </div>
                </div>

                <h4 className="font-playfair font-bold text-pink-950 text-base mb-1">
                  {mem.title}
                </h4>
                <p className="text-xs text-pink-800/70 mb-2 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-pink-600" /> {mem.subtitle}
                </p>

                <div className="text-xs font-bold text-pink-600 flex items-center gap-1">
                  {isUnlocked ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tap to view story slides ({mem.slides.length})
                    </>
                  ) : (
                    <span className="text-pink-900/40">Clear level to unlock</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

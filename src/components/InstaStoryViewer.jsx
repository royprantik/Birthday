import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export function InstaStoryViewer({ memory, onClose, onNextLevel }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [isMutedVideo, setIsMutedVideo] = useState(true);

  const slides = memory?.slides || [];
  const currentSlide = slides[currentSlideIndex];
  const timerRef = useRef(null);

  // Auto-advance progress bar timer
  useEffect(() => {
    if (isPaused || !slides.length) return;

    timerRef.current = setTimeout(() => {
      handleNextSlide();
    }, 5000); // 5 seconds per slide

    return () => clearTimeout(timerRef.current);
  }, [currentSlideIndex, isPaused, slides.length]);

  const handleNextSlide = () => {
    soundEngine.playClick();
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Completed all slides in this story
      onClose();
    }
  };

  const handlePrevSlide = () => {
    soundEngine.playClick();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Heart Reaction Button
  const handleHeartReaction = (e) => {
    soundEngine.playMatch();
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2 - 12,
      y: rect.top - 20
    };
    setFloatingHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1200);
  };

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-0 md:p-4">
      
      {/* Container simulating Instagram Story Mobile Screen */}
      <div
        className="relative w-full max-w-md h-full md:h-[840px] md:rounded-3xl overflow-hidden bg-slate-950 flex flex-col justify-between shadow-2xl border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top Segmented Progress Bars */}
        <div className="absolute top-0 inset-x-0 z-30 p-3 pt-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-1.5 mb-3">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all duration-100 ${
                    idx < currentSlideIndex
                      ? 'w-full'
                      : idx === currentSlideIndex && !isPaused
                      ? 'w-full animate-[progressBar_5s_linear_forwards]'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Header Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs">
                  💖
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {memory.title}
                </h4>
                <p className="text-[11px] text-rose-200/80 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-pink-400" /> {currentSlide.date}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 text-white/80 hover:text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Story Media Viewer (Image or Video) */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {currentSlide.type === 'video' ? (
            <video
              src={currentSlide.url}
              autoPlay
              loop
              muted={isMutedVideo}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentSlide.url}
              alt={currentSlide.caption}
              className="w-full h-full object-contain max-h-[82vh] mx-auto"
            />
          )}

          {/* Tap Navigation Overlays (Left 30% = prev, Right 70% = next) */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-0 inset-y-0 w-1/3 z-20 focus:outline-none"
            title="Previous slide"
          />
          <button
            onClick={handleNextSlide}
            className="absolute right-0 inset-y-0 w-2/3 z-20 focus:outline-none"
            title="Next slide"
          />
        </div>

        {/* Bottom Story Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-6 pt-12 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col gap-3">
          
          {/* Mood Badge */}
          {currentSlide.mood && (
            <span className="self-start px-3 py-1 rounded-full bg-pink-500/30 border border-pink-500/40 text-pink-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> {currentSlide.mood}
            </span>
          )}

          {/* Caption Text */}
          <p className="font-playfair text-lg md:text-xl text-white font-medium leading-snug drop-shadow-md">
            "{currentSlide.caption}"
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-white/50">
              Slide {currentSlideIndex + 1} of {slides.length}
            </span>

            {/* Heart Burst Reaction Button */}
            <button
              onClick={handleHeartReaction}
              className="p-3 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 hover:scale-110 active:scale-95 transition-all shadow-lg shadow-pink-500/30"
              title="Send Love Reaction"
            >
              <Heart className="w-6 h-6 fill-pink-500 text-pink-500 animate-heartbeat" />
            </button>
          </div>
        </div>

        {/* Floating Heart Animations */}
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart text-2xl"
            style={{ left: `${heart.x}px`, top: `${heart.y}px` }}
          >
            💖
          </div>
        ))}

      </div>
    </div>
  );
}

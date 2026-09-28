import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Trophy, Sparkles, Eye, CheckCircle2, HelpCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const GRID_SIZE = 3; // 3x3 sliding puzzle (9 pieces, 1 empty)

export function JigsawPuzzleGame({ imageUrl, onBackToMap, onLevelComplete, levelData }) {
  // Solved state: array [0, 1, 2, 3, 4, 5, 6, 7, 8] where 8 is empty space
  const [tiles, setTiles] = useState([]);
  const [emptyIndex, setEmptyIndex] = useState(8);
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Initialize and shuffle puzzle
  useEffect(() => {
    initPuzzle();
  }, [imageUrl]);

  const initPuzzle = () => {
    // 0..8
    let initialTiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
    let currentEmpty = GRID_SIZE * GRID_SIZE - 1;

    // Perform valid random moves to ensure solvable puzzle
    let moves = 0;
    while (moves < 30) {
      const validNeighbors = getNeighbors(currentEmpty);
      const randomNeighbor = validNeighbors[Math.floor(Math.random() * validNeighbors.length)];
      
      // Swap empty with random neighbor
      initialTiles[currentEmpty] = initialTiles[randomNeighbor];
      initialTiles[randomNeighbor] = GRID_SIZE * GRID_SIZE - 1;
      currentEmpty = randomNeighbor;
      moves++;
    }

    setTiles(initialTiles);
    setEmptyIndex(currentEmpty);
    setMoveCount(0);
    setIsSolved(false);
  };

  // Get valid adjacent tile indices (up, down, left, right)
  const getNeighbors = (index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const neighbors = [];

    if (row > 0) neighbors.push(index - GRID_SIZE); // Up
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < GRID_SIZE - 1) neighbors.push(index + 1); // Right

    return neighbors;
  };

  // Check if puzzle tiles are in ordered state [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const checkWin = (currentTiles) => {
    for (let i = 0; i < currentTiles.length; i++) {
      if (currentTiles[i] !== i) return false;
    }
    return true;
  };

  const handleTileClick = (index) => {
    if (isSolved) return;

    const neighbors = getNeighbors(emptyIndex);
    if (!neighbors.includes(index)) return;

    soundEngine.playSwap();

    const newTiles = [...tiles];
    newTiles[emptyIndex] = newTiles[index];
    newTiles[index] = GRID_SIZE * GRID_SIZE - 1;

    setTiles(newTiles);
    setEmptyIndex(index);
    setMoveCount((prev) => prev + 1);

    if (checkWin(newTiles)) {
      soundEngine.playVictory();
      setIsSolved(true);
    }
  };

  // Auto solve helper for instant completion if requested
  const handleAutoSolve = () => {
    soundEngine.playVictory();
    setTiles(Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i));
    setEmptyIndex(8);
    setIsSolved(true);
  };

  const imageSrc = imageUrl || '/memories/birthday_cake.png';

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToMap}
          className="btn-secondary text-xs sm:text-sm !py-2 !px-3"
        >
          <ArrowLeft className="w-4 h-4" /> Map
        </button>

        <div className="text-center">
          <span className="px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold border border-pink-300">
            Level 9 Special Puzzle Game 🧩
          </span>
          <h2 className="font-playfair text-xl md:text-2xl font-bold gradient-text">
            {levelData?.title || 'Grand Birthday Celebration'}
          </h2>
        </div>

        <button
          onClick={initPuzzle}
          className="btn-secondary text-xs sm:text-sm !py-2 !px-3"
          title="Shuffle Puzzle"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Helper Bar */}
      <div className="w-full glass-panel p-3 mb-6 flex items-center justify-between bg-white/90 border-pink-200 shadow-sm text-xs font-semibold text-pink-950">
        <div className="flex items-center gap-1">
          <span>Moves:</span>
          <span className="text-pink-600 font-mono text-base font-bold">{moveCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 flex items-center gap-1 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPreview ? 'Hide Photo' : 'Peek Photo'}</span>
          </button>

          <button
            onClick={handleAutoSolve}
            className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 flex items-center gap-1 transition-all"
            title="Auto complete puzzle"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Auto Solve</span>
          </button>
        </div>
      </div>

      {/* Peek Original Image Modal */}
      {showPreview && (
        <div className="mb-4 relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-pink-400 shadow-xl bg-black">
          <img src={imageSrc} alt="Complete Puzzle Target" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold">
            Target Image
          </div>
        </div>
      )}

      {/* Jigsaw Sliding Tile Grid */}
      <div className="relative p-3 rounded-3xl border-2 border-pink-300 shadow-2xl bg-white">
        <div
          className="grid gap-1.5 w-72 h-72 sm:w-80 sm:h-80"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {tiles.map((tileVal, currentIdx) => {
            const isEmpty = tileVal === GRID_SIZE * GRID_SIZE - 1 && !isSolved;

            if (isEmpty) {
              return (
                <div
                  key={currentIdx}
                  className="w-full h-full rounded-xl bg-pink-100/40 border border-dashed border-pink-300 flex items-center justify-center text-pink-400 text-xs font-bold"
                >
                  Empty
                </div>
              );
            }

            // Calculate background position offset for sliced tile image piece
            const originalRow = Math.floor(tileVal / GRID_SIZE);
            const originalCol = tileVal % GRID_SIZE;
            const bgX = (originalCol / (GRID_SIZE - 1)) * 100;
            const bgY = (originalRow / (GRID_SIZE - 1)) * 100;

            return (
              <button
                key={currentIdx}
                onClick={() => handleTileClick(currentIdx)}
                className={`relative w-full h-full rounded-xl overflow-hidden transition-transform duration-200 border border-white shadow-md group ${
                  isSolved ? 'border-2 border-emerald-400' : 'hover:scale-105 active:scale-95'
                }`}
                style={{
                  backgroundImage: `url(${imageSrc})`,
                  backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                  backgroundPosition: `${bgX}% ${bgY}%`
                }}
              >
                {/* Tile Number Overlay */}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/50 text-white text-[9px] font-mono font-bold opacity-70 group-hover:opacity-100">
                  {tileVal + 1}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Modal */}
      {isSolved && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow p-8 max-w-md w-full text-center border-2 border-pink-400 animate-float bg-white shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-1 flex items-center justify-center shadow-xl shadow-pink-500/30">
              <Trophy className="w-10 h-10 text-white animate-bounce" />
            </div>

            <h3 className="font-playfair text-3xl font-extrabold gradient-text mb-2">
              Photo Puzzle Solved! 🎉
            </h3>
            <p className="text-pink-950/80 text-sm mb-6 font-medium">
              You completed the grand photo puzzle! Get ready for your Birthday celebration surprise... 🎂💖
            </p>

            <button
              onClick={() => onLevelComplete(levelData?.id || 9)}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-500/40"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Enter Grand Birthday Celebration Page 🎂✨</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

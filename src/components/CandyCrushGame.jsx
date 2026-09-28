import React, { useState, useEffect } from 'react';
import { Heart, Star, Sparkles, ArrowLeft, RotateCcw, Trophy, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const BOARD_SIZE = 6;

// 6 Romantic Candy Tile Definitions
const CANDY_TYPES = [
  { id: 'heart', name: 'Heart', icon: '💖', color: 'from-pink-500 to-rose-600', glow: 'rgba(233, 30, 99, 0.4)' },
  { id: 'star', name: 'Star', icon: '⭐', color: 'from-amber-400 to-yellow-500', glow: 'rgba(212, 175, 55, 0.4)' },
  { id: 'cupcake', name: 'Cupcake', icon: '🧁', color: 'from-purple-400 to-pink-500', glow: 'rgba(142, 36, 170, 0.4)' },
  { id: 'rose', name: 'Rose', icon: '🌹', color: 'from-red-500 to-rose-700', glow: 'rgba(229, 57, 53, 0.4)' },
  { id: 'diamond', name: 'Diamond', icon: '💎', color: 'from-cyan-400 to-blue-500', glow: 'rgba(0, 188, 212, 0.4)' },
  { id: 'chocolate', name: 'Chocolate', icon: '🍫', color: 'from-amber-700 to-amber-900', glow: 'rgba(121, 85, 72, 0.4)' }
];

const getRandomCandy = () => {
  return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
};

export function CandyCrushGame({ levelData, onBackToMap, onLevelComplete }) {
  const [board, setBoard] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(levelData.maxMoves);
  const [collectedCount, setCollectedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [explodingTiles, setExplodingTiles] = useState([]);

  useEffect(() => {
    initBoard();
  }, [levelData]);

  const initBoard = () => {
    let newBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        let candy;
        do {
          candy = getRandomCandy();
        } while (
          (r >= 2 && newBoard[(r - 1) * BOARD_SIZE + c]?.id === candy.id && newBoard[(r - 2) * BOARD_SIZE + c]?.id === candy.id) ||
          (c >= 2 && newBoard[r * BOARD_SIZE + c - 1]?.id === candy.id && newBoard[r * BOARD_SIZE + c - 2]?.id === candy.id)
        );
        newBoard[r * BOARD_SIZE + c] = { ...candy, uid: Math.random().toString() };
      }
    }
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(levelData.maxMoves);
    setCollectedCount(0);
    setGameStatus('playing');
    setSelectedTile(null);
  };

  const checkMatches = (currentBoard) => {
    let matchedIndices = new Set();

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE - 2; c++) {
        const idx1 = r * BOARD_SIZE + c;
        const idx2 = r * BOARD_SIZE + c + 1;
        const idx3 = r * BOARD_SIZE + c + 2;
        const id1 = currentBoard[idx1]?.id;

        if (id1 && currentBoard[idx2]?.id === id1 && currentBoard[idx3]?.id === id1) {
          matchedIndices.add(idx1);
          matchedIndices.add(idx2);
          matchedIndices.add(idx3);
        }
      }
    }

    for (let c = 0; c < BOARD_SIZE; c++) {
      for (let r = 0; r < BOARD_SIZE - 2; r++) {
        const idx1 = r * BOARD_SIZE + c;
        const idx2 = (r + 1) * BOARD_SIZE + c;
        const idx3 = (r + 2) * BOARD_SIZE + c;
        const id1 = currentBoard[idx1]?.id;

        if (id1 && currentBoard[idx2]?.id === id1 && currentBoard[idx3]?.id === id1) {
          matchedIndices.add(idx1);
          matchedIndices.add(idx2);
          matchedIndices.add(idx3);
        }
      }
    }

    return Array.from(matchedIndices);
  };

  const processMatches = async (boardState, movesCount, currentScore, currentCollected) => {
    setIsProcessing(true);
    let matched = checkMatches(boardState);

    if (matched.length === 0) {
      setIsProcessing(false);

      if (currentCollected >= levelData.requiredCount) {
        soundEngine.playVictory();
        setGameStatus('won');
        onLevelComplete(levelData.id);
      } else if (movesCount <= 0) {
        setGameStatus('lost');
      }
      return;
    }

    soundEngine.playMatch();
    setExplodingTiles(matched);

    let newlyCollected = 0;
    matched.forEach((idx) => {
      if (boardState[idx]?.id === levelData.requiredType) {
        newlyCollected += 1;
      }
    });

    const updatedCollected = currentCollected + newlyCollected;
    const updatedScore = currentScore + matched.length * 50;

    setCollectedCount(updatedCollected);
    setScore(updatedScore);

    await new Promise((res) => setTimeout(res, 300));
    setExplodingTiles([]);

    let newBoard = [...boardState];
    matched.forEach((idx) => {
      newBoard[idx] = null;
    });

    for (let c = 0; c < BOARD_SIZE; c++) {
      let emptyRow = BOARD_SIZE - 1;
      for (let r = BOARD_SIZE - 1; r >= 0; r--) {
        const idx = r * BOARD_SIZE + c;
        if (newBoard[idx] !== null) {
          const targetIdx = emptyRow * BOARD_SIZE + c;
          newBoard[targetIdx] = newBoard[idx];
          if (targetIdx !== idx) {
            newBoard[idx] = null;
          }
          emptyRow--;
        }
      }

      for (let r = emptyRow; r >= 0; r--) {
        const idx = r * BOARD_SIZE + c;
        newBoard[idx] = { ...getRandomCandy(), uid: Math.random().toString() };
      }
    }

    setBoard(newBoard);

    setTimeout(() => {
      processMatches(newBoard, movesCount, updatedScore, updatedCollected);
    }, 250);
  };

  const handleTileClick = (index) => {
    if (isProcessing || gameStatus !== 'playing') return;

    soundEngine.playClick();

    if (selectedTile === null) {
      setSelectedTile(index);
      return;
    }

    if (selectedTile === index) {
      setSelectedTile(null);
      return;
    }

    const row1 = Math.floor(selectedTile / BOARD_SIZE);
    const col1 = selectedTile % BOARD_SIZE;
    const row2 = Math.floor(index / BOARD_SIZE);
    const col2 = index % BOARD_SIZE;

    const isAdjacent = (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);

    if (!isAdjacent) {
      setSelectedTile(index);
      return;
    }

    soundEngine.playSwap();
    let tempBoard = [...board];
    const temp = tempBoard[selectedTile];
    tempBoard[selectedTile] = tempBoard[index];
    tempBoard[index] = temp;

    const matches = checkMatches(tempBoard);

    if (matches.length > 0) {
      setBoard(tempBoard);
      setSelectedTile(null);
      const newMoves = movesLeft - 1;
      setMovesLeft(newMoves);
      processMatches(tempBoard, newMoves, score, collectedCount);
    } else {
      setSelectedTile(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col items-center">
      
      {/* Top Level Nav Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBackToMap}
          className="btn-secondary text-xs sm:text-sm !py-2 !px-3"
        >
          <ArrowLeft className="w-4 h-4" /> Map
        </button>

        <h2 className="font-playfair text-xl md:text-2xl font-bold gradient-text text-center">
          {levelData.title}
        </h2>

        <button
          onClick={initBoard}
          className="btn-secondary text-xs sm:text-sm !py-2 !px-3"
          title="Restart Level"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Level Status & Goals Header Card (White Theme) */}
      <div className="w-full glass-panel p-4 mb-6 grid grid-cols-3 gap-2 text-center border-pink-300 bg-white/90 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-xs text-pink-900/60 font-bold uppercase">Score</span>
          <span className="text-xl md:text-2xl font-extrabold text-amber-600 font-mono">
            {score}
          </span>
        </div>

        <div className="flex flex-col items-center border-x border-pink-200 px-2">
          <span className="text-xs text-pink-700 font-bold uppercase flex items-center gap-1">
            <Heart className="w-3 h-3 fill-pink-500 text-pink-500" /> Goal ({levelData.requiredType})
          </span>
          <span className="text-xl md:text-2xl font-extrabold text-pink-600 font-mono">
            {collectedCount} / {levelData.requiredCount}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs text-pink-900/60 font-bold uppercase">Moves Left</span>
          <span className={`text-xl md:text-2xl font-extrabold font-mono ${movesLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-purple-700'}`}>
            {movesLeft}
          </span>
        </div>
      </div>

      {/* Match-3 Puzzle Game Board Grid */}
      <div className="relative p-4 rounded-3xl border-2 border-pink-300 shadow-2xl bg-white/95">
        <div
          className="grid gap-2.5"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`
          }}
        >
          {board.map((tile, idx) => {
            if (!tile) return <div key={idx} className="w-11 h-11 sm:w-14 sm:h-14" />;

            const isSelected = selectedTile === idx;
            const isExploding = explodingTiles.includes(idx);

            return (
              <button
                key={tile.uid || idx}
                onClick={() => handleTileClick(idx)}
                className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-200 shadow-sm ${
                  isExploding ? 'tile-explode' : 'tile-enter'
                } ${
                  isSelected
                    ? 'scale-110 border-2 border-amber-500 ring-4 ring-pink-400/50 z-20 shadow-amber-400/50 bg-pink-50'
                    : 'bg-rose-50/80 hover:bg-pink-100 hover:scale-105 border border-pink-200'
                }`}
                style={{
                  boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.8)' : `0 4px 12px ${tile.glow}`
                }}
              >
                <span>{tile.icon}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Victory Modal Popup */}
      {gameStatus === 'won' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-glow p-8 max-w-md w-full text-center border-2 border-pink-400 animate-float bg-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-500 to-amber-400 p-1 flex items-center justify-center shadow-xl shadow-pink-500/30">
              <Trophy className="w-10 h-10 text-white animate-bounce" />
            </div>

            <h3 className="font-playfair text-3xl font-extrabold gradient-text mb-2">
              Level Complete! 🎉
            </h3>
            <p className="text-pink-950/80 text-sm mb-6 font-medium">
              You cleared the level and unlocked a brand new story memory of us! 💖
            </p>

            <button
              onClick={() => onLevelComplete(levelData.id)}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2 shadow-xl shadow-pink-500/40"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Unlock & View Memory ✨</span>
            </button>
          </div>
        </div>
      )}

      {/* Game Over / Try Again Modal */}
      {gameStatus === 'lost' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-8 max-w-md w-full text-center border-red-300 bg-white">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 border border-red-300 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="font-playfair text-2xl font-bold text-pink-950 mb-2">
              Out of Moves! 💔
            </h3>
            <p className="text-pink-900/70 text-sm mb-6">
              Almost there! Give it another try to unlock this special memory.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onBackToMap}
                className="btn-secondary flex-1 py-2.5"
              >
                Back to Map
              </button>
              <button
                onClick={initBoard}
                className="btn-primary flex-1 py-2.5"
              >
                Try Again 🔄
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

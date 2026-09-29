import React, { useState, useEffect } from 'react';
import { HeaderCounter } from './components/HeaderCounter';
import { SagaMap } from './components/SagaMap';
import { CandyCrushGame } from './components/CandyCrushGame';
import { JigsawPuzzleGame } from './components/JigsawPuzzleGame';
import { InstaStoryViewer } from './components/InstaStoryViewer';
import { BirthdayFinale } from './components/BirthdayFinale';
import { MemoryVault } from './components/MemoryVault';
import { MemoryCustomizerModal } from './components/MemoryCustomizerModal';
import { DEFAULT_MEMORIES, INITIAL_LETTER } from './utils/defaultMemories';
import './styles/glassmorphism.css';

import { setLargeItem, getLargeItem, removeLargeItem } from './utils/indexedDBStorage';
import { fetchCloudState, saveCloudState } from './utils/cloudSync';

export function App() {
  const [view, setView] = useState('map'); // 'map', 'game', 'finale'
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [activeStoryMemory, setActiveStoryMemory] = useState(null);
  
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [isCeremonyActive, setIsCeremonyActive] = useState(false);

  // Load memories state - DEFAULT_MEMORIES in code is 100% absolute source of truth for photo slides & unlocked state!
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);

  // Sync state on mount if DEFAULT_MEMORIES changes
  useEffect(() => {
    setMemories(DEFAULT_MEMORIES);
  }, []);

  const [letterText, setLetterText] = useState(INITIAL_LETTER);
  const [voiceNoteUrl, setVoiceNoteUrl] = useState('');
  const [bgMusicUrl, setBgMusicUrl] = useState('/upohar.mp3');
  const [herPhotoUrl, setHerPhotoUrl] = useState('/memories/level1_slide1.jpg?v=3');

  // Save unlocked level IDs to storage
  useEffect(() => {
    try {
      const unlockedIds = memories.filter((m) => m.unlocked).map((m) => m.id);
      localStorage.setItem('birthday_unlocked_levels_v1', JSON.stringify(unlockedIds));
    } catch (e) {}
  }, [memories]);

  // Load large media items from IndexedDB asynchronously on mount fallback
  useEffect(() => {
    getLargeItem('birthday_bgmusic').then((val) => {
      if (val && !val.startsWith('blob:')) {
        setBgMusicUrl(val);
      } else {
        try {
          const ls = localStorage.getItem('birthday_bgmusic');
          if (ls && !ls.startsWith('blob:')) {
            setBgMusicUrl(ls);
          } else {
            setBgMusicUrl('/upohar.mp3');
          }
        } catch (e) {
          setBgMusicUrl('/upohar.mp3');
        }
      }
    });

    getLargeItem('birthday_voicenote').then((val) => {
      if (val && !val.startsWith('blob:')) {
        setVoiceNoteUrl(val);
      } else {
        try {
          const ls = localStorage.getItem('birthday_voicenote');
          if (ls && !ls.startsWith('blob:')) setVoiceNoteUrl(ls);
        } catch (e) {}
      }
    });

    getLargeItem('birthday_herphoto').then((val) => {
      if (val && !val.startsWith('blob:')) {
        setHerPhotoUrl(val);
      } else {
        try {
          const ls = localStorage.getItem('birthday_herphoto');
          if (ls && !ls.startsWith('blob:')) setHerPhotoUrl(ls);
          else setHerPhotoUrl('/memories/level1_slide1.jpg?v=3');
        } catch (e) {
          setHerPhotoUrl('/memories/level1_slide1.jpg?v=3');
        }
      }
    });
  }, []);

  // Save to IndexedDB and fallback to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('birthday_memories_v3', JSON.stringify(memories));
    } catch (e) {
      setLargeItem('birthday_memories_v3', memories);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem('birthday_letter_v3', letterText);
    } catch (e) {}
  }, [letterText]);

  useEffect(() => {
    if (voiceNoteUrl) {
      setLargeItem('birthday_voicenote', voiceNoteUrl);
      try {
        localStorage.setItem('birthday_voicenote', voiceNoteUrl);
      } catch (e) {}
    }
  }, [voiceNoteUrl]);

  useEffect(() => {
    if (bgMusicUrl) {
      setLargeItem('birthday_bgmusic', bgMusicUrl);
      try {
        localStorage.setItem('birthday_bgmusic', bgMusicUrl);
      } catch (e) {}
    }
  }, [bgMusicUrl]);

  useEffect(() => {
    if (herPhotoUrl) {
      setLargeItem('birthday_herphoto', herPhotoUrl);
      try {
        localStorage.setItem('birthday_herphoto', herPhotoUrl);
      } catch (e) {}
    }
  }, [herPhotoUrl]);

  // Last level ID is dynamic (e.g. level 9)
  const lastLevelId = memories[memories.length - 1]?.id || 9;

  // Handle playing a specific level
  const handlePlayLevel = (levelId) => {
    setIsCeremonyActive(false);
    setCurrentLevelId(levelId);
    setView('game');
  };

  // Handle jumping directly to finale
  const handleGoToFinale = () => {
    setView('finale');
  };

  // Handle completing a level in match-3 or jigsaw puzzle
  const handleLevelComplete = (levelId) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === levelId) return { ...m, unlocked: true };
        if (m.id === levelId + 1) return { ...m, unlocked: true };
        return m;
      })
    );

    const unlockedMem = memories.find((m) => m.id === levelId);
    setActiveStoryMemory(unlockedMem);
  };

  // Save changes from Memory Customizer Modal & Push to Cloud Database for multi-device sync
  const handleSaveCustomizer = ({ letterText: newLetter, memories: newMemories, voiceNoteUrl: newVoice, bgMusicUrl: newBgMusic, herPhotoUrl: newHerPhoto }) => {
    setLetterText(newLetter);
    setMemories(newMemories);
    if (newVoice !== undefined) setVoiceNoteUrl(newVoice);
    if (newBgMusic !== undefined) setBgMusicUrl(newBgMusic);
    if (newHerPhoto !== undefined) setHerPhotoUrl(newHerPhoto);

    // Sync state to Cloud Database so all devices update in real-time!
    saveCloudState({
      letterText: newLetter,
      memories: newMemories,
      voiceNoteUrl: newVoice !== undefined ? newVoice : voiceNoteUrl,
      bgMusicUrl: newBgMusic !== undefined ? newBgMusic : bgMusicUrl,
      herPhotoUrl: newHerPhoto !== undefined ? newHerPhoto : herPhotoUrl
    });
  };

  // Reset to default initial memories and letter
  const handleResetDefaults = () => {
    if (window.confirm('Reset all photos, music, voice note, captions, and letter back to default settings?')) {
      localStorage.removeItem('birthday_memories');
      localStorage.removeItem('birthday_letter');
      localStorage.removeItem('birthday_voicenote');
      localStorage.removeItem('birthday_bgmusic');
      localStorage.removeItem('birthday_herphoto');
      removeLargeItem('birthday_memories');
      removeLargeItem('birthday_letter');
      removeLargeItem('birthday_voicenote');
      removeLargeItem('birthday_bgmusic');
      removeLargeItem('birthday_herphoto');
      setMemories(DEFAULT_MEMORIES);
      setLetterText(INITIAL_LETTER);
      setVoiceNoteUrl('');
      setBgMusicUrl('/upohar.mp3');
      setHerPhotoUrl('/memories/level1_slide1.jpg?v=3');
    }
  };

  const currentLevelData = memories.find((m) => m.id === currentLevelId) || memories[0];

  return (
    <div className={`min-h-screen text-pink-950 relative selection:bg-pink-500 selection:text-white pb-12 ${isCeremonyActive ? 'bg-black' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-rose-50 to-pink-100'}`}>
      
      {/* Background Subtle Floating Petals & Glow Orbs */}
      {!isCeremonyActive && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-200/20 rounded-full blur-3xl" />
        </div>
      )}

      {/* Real-time Relationship Counter Header with Upohar Music Player (Hidden during candle ceremony) */}
      {!isCeremonyActive && (
        <HeaderCounter
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          bgMusicUrl={bgMusicUrl}
        />
      )}

      {/* Main View Router */}
      <main className="relative z-10">
        {view === 'map' && (
          <SagaMap
            memories={memories}
            onPlayLevel={handlePlayLevel}
            onGoToFinale={handleGoToFinale}
            onSelectStory={(mem) => setActiveStoryMemory(mem)}
            currentLevelId={currentLevelId}
          />
        )}

        {view === 'game' && (
          currentLevelId === lastLevelId ? (
            <JigsawPuzzleGame
              levelData={currentLevelData}
              imageUrl={currentLevelData.puzzleImage || currentLevelData.slides[0]?.url || '/memories/level1_slide1.jpg?v=3'}
              onBackToMap={() => setView('map')}
              onLevelComplete={handleLevelComplete}
            />
          ) : (
            <CandyCrushGame
              levelData={currentLevelData}
              onBackToMap={() => setView('map')}
              onLevelComplete={handleLevelComplete}
            />
          )
        )}

        {view === 'finale' && (
          <BirthdayFinale
            letterText={letterText}
            memories={memories}
            voiceNoteUrl={voiceNoteUrl}
            herPhotoUrl={herPhotoUrl}
            onReplayMap={() => {
              setIsCeremonyActive(false);
              setView('map');
            }}
            onOpenCustomizer={() => setIsCustomizerOpen(true)}
            onCeremonyStateChange={setIsCeremonyActive}
          />
        )}
      </main>

      {/* Instagram Story Memory Viewer Modal */}
      {activeStoryMemory && (
        <InstaStoryViewer
          memory={activeStoryMemory}
          onClose={() => {
            const isLast = activeStoryMemory.id === lastLevelId;
            setActiveStoryMemory(null);
            if (isLast) {
              setView('finale');
            } else {
              setView('map');
            }
          }}
        />
      )}

      {/* Memory Vault Modal */}
      {isVaultOpen && (
        <MemoryVault
          memories={memories}
          onClose={() => setIsVaultOpen(false)}
          onSelectStory={(mem) => {
            setIsVaultOpen(false);
            setActiveStoryMemory(mem);
          }}
        />
      )}

      {/* Memory Customizer & Photo/Letter Manager Modal */}
      {isCustomizerOpen && (
        <MemoryCustomizerModal
          letterText={letterText}
          memories={memories}
          voiceNoteUrl={voiceNoteUrl}
          bgMusicUrl={bgMusicUrl}
          herPhotoUrl={herPhotoUrl}
          onSave={handleSaveCustomizer}
          onClose={() => setIsCustomizerOpen(false)}
          onReset={handleResetDefaults}
        />
      )}

    </div>
  );
}

export default App;

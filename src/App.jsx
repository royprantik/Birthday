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

export function App() {
  const [view, setView] = useState('map'); // 'map', 'game', 'finale'
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [activeStoryMemory, setActiveStoryMemory] = useState(null);
  
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [isCeremonyActive, setIsCeremonyActive] = useState(false);

  // Load state from localStorage or initialize with default 9 memories
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('birthday_memories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= 9) return parsed;
      } catch (e) {}
    }
    return DEFAULT_MEMORIES;
  });

  const [letterText, setLetterText] = useState(() => {
    const saved = localStorage.getItem('birthday_letter');
    if (saved && saved.includes('Violina')) {
      return saved;
    }
    return INITIAL_LETTER;
  });

  const [voiceNoteUrl, setVoiceNoteUrl] = useState(() => {
    const saved = localStorage.getItem('birthday_voicenote');
    return saved || '';
  });

  const [bgMusicUrl, setBgMusicUrl] = useState(() => {
    const saved = localStorage.getItem('birthday_bgmusic');
    return saved || '';
  });

  const [herPhotoUrl, setHerPhotoUrl] = useState(() => {
    const saved = localStorage.getItem('birthday_herphoto');
    return saved || '';
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('birthday_memories', JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem('birthday_letter', letterText);
  }, [letterText]);

  useEffect(() => {
    if (voiceNoteUrl) {
      localStorage.setItem('birthday_voicenote', voiceNoteUrl);
    }
  }, [voiceNoteUrl]);

  useEffect(() => {
    if (bgMusicUrl) {
      localStorage.setItem('birthday_bgmusic', bgMusicUrl);
    }
  }, [bgMusicUrl]);

  useEffect(() => {
    if (herPhotoUrl) {
      localStorage.setItem('birthday_herphoto', herPhotoUrl);
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

  // Save changes from Memory Customizer Modal
  const handleSaveCustomizer = ({ letterText: newLetter, memories: newMemories, voiceNoteUrl: newVoice, bgMusicUrl: newBgMusic, herPhotoUrl: newHerPhoto }) => {
    setLetterText(newLetter);
    setMemories(newMemories);
    if (newVoice !== undefined) setVoiceNoteUrl(newVoice);
    if (newBgMusic !== undefined) setBgMusicUrl(newBgMusic);
    if (newHerPhoto !== undefined) setHerPhotoUrl(newHerPhoto);
  };

  // Reset to default initial memories and letter
  const handleResetDefaults = () => {
    if (window.confirm('Reset all photos, music, voice note, captions, and letter back to default settings?')) {
      localStorage.removeItem('birthday_memories');
      localStorage.removeItem('birthday_letter');
      localStorage.removeItem('birthday_voicenote');
      localStorage.removeItem('birthday_bgmusic');
      localStorage.removeItem('birthday_herphoto');
      setMemories(DEFAULT_MEMORIES);
      setLetterText(INITIAL_LETTER);
      setVoiceNoteUrl('');
      setBgMusicUrl('');
      setHerPhotoUrl('');
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
            currentLevelId={currentLevelId}
          />
        )}

        {view === 'game' && (
          currentLevelId === lastLevelId ? (
            <JigsawPuzzleGame
              levelData={currentLevelData}
              imageUrl={currentLevelData.puzzleImage || currentLevelData.slides[0]?.url || '/memories/birthday_cake.png'}
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

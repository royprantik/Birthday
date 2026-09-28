import React, { useState } from 'react';
import { X, Save, Upload, RotateCcw, Sparkles, FileText, Image as ImageIcon, Plus, Trash2, Mic, Radio, Music, Crown } from 'lucide-react';

export function MemoryCustomizerModal({ letterText, memories, voiceNoteUrl, bgMusicUrl, herPhotoUrl, onSave, onClose, onReset }) {
  const [currentLetter, setCurrentLetter] = useState(letterText);
  const [customMemories, setCustomMemories] = useState(memories);
  const [currentVoiceUrl, setCurrentVoiceUrl] = useState(voiceNoteUrl || '');
  const [currentBgMusicUrl, setCurrentBgMusicUrl] = useState(bgMusicUrl || '');
  const [currentHerPhotoUrl, setCurrentHerPhotoUrl] = useState(herPhotoUrl || '');
  const [activeTab, setActiveTab] = useState('photos'); // 'photos', 'letter', or 'audio'
  const [selectedLevelId, setSelectedLevelId] = useState(1);

  const handleLetterChange = (e) => {
    setCurrentLetter(e.target.value);
  };

  const handleHerPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentHerPhotoUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentVoiceUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBgMusicUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentBgMusicUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePuzzleImageUpload = (levelId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setCustomMemories((prev) =>
        prev.map((mem) => {
          if (mem.id === levelId) {
            return { ...mem, puzzleImage: dataUrl };
          }
          return mem;
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const reindexMemories = (mems) => {
    const count = mems.length;
    return mems.map((mem, idx) => {
      const id = idx + 1;
      const isLast = idx === count - 1;
      return {
        ...mem,
        id,
        title: isLast ? `Level ${id}: Grand Birthday Celebration` : mem.title,
        subtitle: isLast ? 'Happy Birthday My Everything! 🎂🎉💖' : mem.subtitle,
        requiredCount: isLast ? 20 : 10 + (id * 2),
        maxMoves: 18 + (id * 2)
      };
    });
  };

  const handleAddLevel = () => {
    const newLevelId = customMemories.length + 1;
    const newStoryLevel = {
      id: newLevelId,
      title: `Level ${newLevelId - 1}: Special Memory`,
      subtitle: `Unforgettable Moments ✨`,
      targetScore: 1500,
      maxMoves: 20,
      requiredType: 'heart',
      requiredCount: 15,
      unlocked: false,
      slides: [
        {
          id: `${newLevelId}-1`,
          type: 'image',
          url: '/memories/first_date.png',
          caption: 'Add your memory story caption here! 💖',
          date: 'Special Memory Date',
          mood: 'Heartwarming'
        }
      ]
    };

    const updated = [...customMemories];
    const finalLevel = updated.pop();
    updated.push(newStoryLevel);
    updated.push(finalLevel);

    const reindexed = reindexMemories(updated);
    setCustomMemories(reindexed);
    setSelectedLevelId(reindexed.length - 1);
  };

  const handleDeleteLevel = (levelId) => {
    if (customMemories.length <= 2) {
      alert('You must have at least 2 levels in your memory saga!');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete Level ${levelId}?`)) return;

    const filtered = customMemories.filter((m) => m.id !== levelId);
    const reindexed = reindexMemories(filtered);
    setCustomMemories(reindexed);

    if (selectedLevelId >= reindexed.length) {
      setSelectedLevelId(reindexed.length - 1);
    }
  };

  const handleAddSlide = (levelId) => {
    setCustomMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === levelId) {
          const newSlide = {
            id: `${levelId}-${mem.slides.length + 1}`,
            type: 'image',
            url: '/memories/first_date.png',
            caption: 'New slide memory caption! ✨',
            date: 'Memory Date',
            mood: 'Magical'
          };
          return { ...mem, slides: [...mem.slides, newSlide] };
        }
        return mem;
      })
    );
  };

  const handleDeleteSlide = (levelId, slideIdx) => {
    setCustomMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === levelId) {
          if (mem.slides.length <= 1) {
            alert('A level must have at least 1 photo/video slide!');
            return mem;
          }
          const updatedSlides = mem.slides.filter((_, idx) => idx !== slideIdx);
          return { ...mem, slides: updatedSlides };
        }
        return mem;
      })
    );
  };

  const handleSlideCaptionChange = (levelId, slideIdx, caption) => {
    setCustomMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === levelId) {
          const updatedSlides = [...mem.slides];
          updatedSlides[slideIdx] = { ...updatedSlides[slideIdx], caption };
          return { ...mem, slides: updatedSlides };
        }
        return mem;
      })
    );
  };

  const handleSlideDateChange = (levelId, slideIdx, date) => {
    setCustomMemories((prev) =>
      prev.map((mem) => {
        if (mem.id === levelId) {
          const updatedSlides = [...mem.slides];
          updatedSlides[slideIdx] = { ...updatedSlides[slideIdx], date };
          return { ...mem, slides: updatedSlides };
        }
        return mem;
      })
    );
  };

  const handleFileUpload = (levelId, slideIdx, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const isVideo = file.type.startsWith('video');

      setCustomMemories((prev) =>
        prev.map((mem) => {
          if (mem.id === levelId) {
            const updatedSlides = [...mem.slides];
            updatedSlides[slideIdx] = {
              ...updatedSlides[slideIdx],
              url: dataUrl,
              type: isVideo ? 'video' : 'image'
            };
            return { ...mem, slides: updatedSlides };
          }
          return mem;
        })
      );
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    onSave({
      letterText: currentLetter,
      memories: customMemories,
      voiceNoteUrl: currentVoiceUrl,
      bgMusicUrl: currentBgMusicUrl,
      herPhotoUrl: currentHerPhotoUrl
    });
    onClose();
  };

  const currentLevelMemory = customMemories.find((m) => m.id === selectedLevelId);
  const isFinalLevelSelected = selectedLevelId === customMemories.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 sm:p-8 max-w-3xl w-full border-pink-300 relative my-8 bg-white/95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-pink-200 pb-4 mb-6">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-pink-950 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-pink-600" />
              <span>Customize Levels, Photos & Letter</span>
            </h3>
            <p className="text-xs text-pink-800/70 font-medium">
              Upload her photo, voice notes, background song, memory photos, and edit your letter
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'photos'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-rose-50 text-pink-900 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Levels & Photos</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'audio'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-rose-50 text-pink-900 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Upohar & Voice Audio 🎵</span>
          </button>

          <button
            onClick={() => setActiveTab('letter')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'letter'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                : 'bg-rose-50 text-pink-900 hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Birthday Letter</span>
          </button>
        </div>

        {/* Tab 1: Photos & Level Management */}
        {activeTab === 'photos' && (
          <div className="space-y-6">
            
            {/* Her Profile Photo Upload Banner */}
            <div className="bg-rose-50 p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white border border-pink-300 shrink-0">
                  {currentHerPhotoUrl ? (
                    <img src={currentHerPhotoUrl} alt="Miss Violina Ray" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-400">
                      <Crown className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-pink-950 flex items-center gap-1">
                    <span>Miss Violina Ray Profile Photo 👑</span>
                  </h5>
                  <p className="text-[11px] text-pink-800/80 mt-0.5">
                    Upload a gorgeous photo of her! It will be featured on the Birthday Celebration page frame!
                  </p>
                </div>
              </div>

              <label className="btn-primary !py-1.5 !px-3 text-xs cursor-pointer shrink-0 flex items-center gap-1 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Her Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHerPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Level Selector Bar & Add Level Action */}
            <div className="flex items-center justify-between gap-2 border-b border-pink-200 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                {customMemories.map((mem, idx) => {
                  const isLast = idx === customMemories.length - 1;
                  return (
                    <button
                      key={mem.id}
                      onClick={() => setSelectedLevelId(mem.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        selectedLevelId === mem.id
                          ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                          : 'bg-rose-50 text-pink-900 border border-pink-200 hover:bg-pink-100'
                      }`}
                    >
                      <span>{isLast ? `Level ${mem.id} (Finale Puzzle 🧩)` : `Level ${mem.id}`}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleAddLevel}
                className="btn-primary text-xs !py-1.5 !px-3 shrink-0 flex items-center gap-1 shadow-md shadow-pink-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Level</span>
              </button>
            </div>

            {/* Level 9 Puzzle Image Upload Banner */}
            {isFinalLevelSelected && currentLevelMemory && (
              <div className="bg-pink-100/80 p-4 rounded-2xl border border-pink-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <h5 className="text-xs font-bold text-pink-950 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Level {currentLevelMemory.id} Interactive Jigsaw Puzzle Photo 🧩</span>
                  </h5>
                  <p className="text-[11px] text-pink-800/80 mt-0.5">
                    Upload any photo of you two! The site will automatically slice it into a 3x3 sliding jigsaw puzzle for her to solve!
                  </p>
                </div>

                <label className="btn-primary !py-1.5 !px-3 text-xs cursor-pointer shrink-0 flex items-center gap-1 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Puzzle Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePuzzleImageUpload(currentLevelMemory.id, e)}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {currentLevelMemory && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-rose-50 p-3 rounded-2xl border border-pink-200">
                  <div>
                    <h4 className="text-sm font-bold text-pink-950">
                      {currentLevelMemory.title}
                    </h4>
                    <p className="text-xs text-pink-800/70">
                      {currentLevelMemory.slides.length} Photo/Video Slide(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddSlide(currentLevelMemory.id)}
                      className="btn-secondary text-xs !py-1.5 !px-3 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5 text-pink-600" />
                      <span>Add Slide</span>
                    </button>

                    {customMemories.length > 2 && (
                      <button
                        onClick={() => handleDeleteLevel(currentLevelMemory.id)}
                        className="p-2 rounded-xl bg-red-100 text-red-600 border border-red-200 hover:bg-red-200"
                        title="Delete Level"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {currentLevelMemory.slides.map((slide, sIdx) => (
                  <div
                    key={slide.id || sIdx}
                    className="bg-white p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center gap-4 relative shadow-sm"
                  >
                    <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-rose-50 shrink-0 border border-pink-200">
                      {slide.url ? (
                        slide.type === 'video' ? (
                          <video src={slide.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={slide.url} alt="Slide Preview" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-pink-800/40">
                          No Media
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-pink-700">
                          Slide #{sIdx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <label className="btn-secondary !py-1 !px-3 text-xs cursor-pointer flex items-center gap-1">
                            <Upload className="w-3.5 h-3.5 text-pink-600" />
                            <span>Upload Media</span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={(e) => handleFileUpload(currentLevelMemory.id, sIdx, e)}
                              className="hidden"
                            />
                          </label>

                          {currentLevelMemory.slides.length > 1 && (
                            <button
                              onClick={() => handleDeleteSlide(currentLevelMemory.id, sIdx)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={slide.caption}
                        onChange={(e) => handleSlideCaptionChange(currentLevelMemory.id, sIdx, e.target.value)}
                        placeholder="Memory story caption..."
                        className="w-full bg-rose-50/50 border border-pink-200 rounded-xl px-3 py-1.5 text-xs text-pink-950 focus:outline-none focus:border-pink-500 font-medium"
                      />

                      <input
                        type="text"
                        value={slide.date || ''}
                        onChange={(e) => handleSlideDateChange(currentLevelMemory.id, sIdx, e.target.value)}
                        placeholder="Date (e.g. July 24, 2024)"
                        className="w-full bg-rose-50/50 border border-pink-200 rounded-xl px-3 py-1 text-[11px] text-pink-800 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Audio Upload Tab (Background Music & Voice Note) */}
        {activeTab === 'audio' && (
          <div className="space-y-6">
            
            {/* Background Song Upload (Upohar by Bishrut Saikia) */}
            <div className="bg-rose-50 p-4 rounded-2xl border border-pink-200">
              <h4 className="text-sm font-bold text-pink-950 flex items-center gap-2 mb-1">
                <Music className="w-4 h-4 text-pink-600" />
                <span>Background Song (Upohar by Bishrut Saikia) 🎵</span>
              </h4>
              <p className="text-xs text-pink-800/70 leading-relaxed mb-4">
                Upload your audio file (.mp3, .m4a) of <b>Upohar by Bishrut Saikia</b>. It will play continuously on repeat across the entire website while she plays games and explores memories!
              </p>

              <label className="btn-primary text-xs cursor-pointer inline-flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4" />
                <span>Upload "Upohar" Song File (.mp3, .m4a)</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleBgMusicUpload}
                  className="hidden"
                />
              </label>

              {currentBgMusicUrl && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-pink-300 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    ✓ Upohar Song File Loaded!
                  </span>
                  <audio controls src={currentBgMusicUrl} className="h-8" />
                </div>
              )}
            </div>

            {/* Voice Message Upload */}
            <div className="bg-rose-50 p-4 rounded-2xl border border-pink-200">
              <h4 className="text-sm font-bold text-pink-950 flex items-center gap-2 mb-1">
                <Radio className="w-4 h-4 text-pink-600" />
                <span>Upload Voice Message Recording 🎙️</span>
              </h4>
              <p className="text-xs text-pink-800/70 leading-relaxed mb-4">
                Upload your personal voice note recording for the final Birthday Celebration page!
              </p>

              <label className="btn-primary text-xs cursor-pointer inline-flex items-center gap-2 mb-3">
                <Upload className="w-4 h-4" />
                <span>Upload Voice Note File (.mp3, .m4a)</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleVoiceUpload}
                  className="hidden"
                />
              </label>

              {currentVoiceUrl && (
                <div className="mt-3 p-3 bg-white rounded-xl border border-pink-300 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    ✓ Voice Recording Loaded!
                  </span>
                  <audio controls src={currentVoiceUrl} className="h-8" />
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Birthday Letter Editor */}
        {activeTab === 'letter' && (
          <div className="space-y-4">
            <label className="block text-xs font-bold text-pink-900 uppercase">
              Your Long Birthday Paragraph / Letter
            </label>
            <textarea
              rows={12}
              value={currentLetter}
              onChange={handleLetterChange}
              placeholder="Paste your heartfelt long birthday paragraph for her here..."
              className="w-full bg-rose-50/40 border border-pink-300 rounded-2xl p-4 text-pink-950 placeholder-pink-900/40 focus:outline-none focus:border-pink-500 font-playfair text-base leading-relaxed"
            />
          </div>
        )}

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-pink-200 pt-4 mt-6">
          <button
            onClick={onReset}
            className="btn-secondary text-xs !py-2 !px-3 text-red-600 hover:text-red-700"
            title="Reset to initial default letter & photos"
          >
            <RotateCcw className="w-4 h-4" /> Reset Defaults
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn-secondary text-xs !py-2 !px-4">
              Cancel
            </button>
            <button onClick={handleSaveAll} className="btn-primary text-xs !py-2 !px-5">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Web Audio API Synthesizer for Game Sound Effects & Romantic Ambient Music

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgOscillators = [];
    this.bgGain = null;
    this.isPlayingBg = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.isMuted && this.bgGain) {
      this.bgGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else if (!this.isMuted && this.bgGain && this.isPlayingBg) {
      this.bgGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.1);
    }
  }

  // Play a soft tap sound
  playClick() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play tile swap sound
  playSwap() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Play tile match pop sound
  playMatch() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    // Play a dual pop chord (C5 - E5)
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.25, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.04 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.15);
    });
  }

  // Play combo bonus sound
  playCombo() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C (arpeggio)
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.25, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.2);
    });
  }

  // Play level victory fanfare
  playVictory() {
    if (this.isMuted) return;
    this.init();
    const fanfareNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    const now = this.ctx.currentTime;

    fanfareNotes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.3, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.4);
    });
  }

  // Toggle warm romantic ambient background synth chord pads
  toggleBgMusic() {
    this.init();
    if (this.isPlayingBg) {
      this.stopBgMusic();
      return false;
    }

    this.isPlayingBg = true;
    this.bgGain = this.ctx.createGain();
    this.bgGain.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    this.bgGain.connect(this.ctx.destination);

    // Warm romantic pad frequencies (Cmaj7 / Am9)
    const freqs = [130.81, 164.81, 196.00, 246.94, 329.63]; 

    this.bgOscillators = freqs.map((f, index) => {
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      // Subtle LFO vibrato
      lfo.frequency.setValueAtTime(0.2 + index * 0.05, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(this.bgGain);
      lfo.start();
      osc.start();
      return { osc, lfo };
    });

    return true;
  }

  stopBgMusic() {
    if (this.bgOscillators.length) {
      this.bgOscillators.forEach(({ osc, lfo }) => {
        try {
          osc.stop();
          lfo.stop();
        } catch (_) {}
      });
      this.bgOscillators = [];
    }
    this.isPlayingBg = false;
  }
}

export const soundEngine = new SoundEngine();

/**
 * AUDIO SYNTHESIZER ENGINE (Web Audio API)
 * Pure procedural synthesis without external audio files.
 * Provides subtle sci-fi clicks, boot sweeps, terminal beeps, and warp sounds.
 * OFF by default, respects user preferences, stores state in localStorage.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = true;
    this.volume = 0.3;
    this.initialized = false;
    this.loadSettings();
  }

  loadSettings() {
    try {
      const savedMute = localStorage.getItem("atul_os_muted");
      if (savedMute !== null) {
        this.muted = savedMute === "true";
      }
      const savedVol = localStorage.getItem("atul_os_volume");
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.3;
      }
    } catch (e) {
      console.warn("Storage unavailable for audio settings", e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem("atul_os_muted", this.muted.toString());
      localStorage.setItem("atul_os_volume", this.volume.toString());
    } catch (e) {
      // ignore
    }
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        this.initialized = true;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    this.saveSettings();
    if (!this.muted) {
      this.playChime();
    }
    return this.muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.saveSettings();
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playHover() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, this.ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(this.volume * 0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {}
  }

  playTerminalKey() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freqs = [750, 850, 920, 1050];
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(this.volume * 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.025);
    } catch (e) {}
  }

  playBootSweep() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(160, now);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);
    } catch (e) {}
  }

  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + idx * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(this.volume * 0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch (e) {}
  }

  playWarp() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.6);

      gain.gain.setValueAtTime(this.volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }
}

export const sound = new AudioEngine();

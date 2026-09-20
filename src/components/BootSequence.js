/**
 * ATUL OS BOOT SEQUENCE & CINEMATIC INTRO
 * Terminal bootloader sequence with hardware checks, diagnostic stream,
 * audio chime triggers, and rocket launch transition.
 */

import { sound } from "./AudioEngine.js";

export class BootSequence {
  constructor(onComplete) {
    this.overlay = document.getElementById("boot-sequence-overlay");
    this.textContainer = document.getElementById("boot-terminal-text");
    this.progressBar = document.getElementById("boot-progress-bar");
    this.progressPercent = document.getElementById("boot-progress-percent");
    this.skipBtn = document.getElementById("boot-skip-btn");
    this.audioPrompt = document.getElementById("boot-audio-enable-btn");
    this.onComplete = onComplete;
    this.isSkipped = false;
    this.init();
  }

  init() {
    if (!this.overlay) {
      if (this.onComplete) this.onComplete();
      return;
    }

    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.skip());
    }

    if (this.audioPrompt) {
      this.audioPrompt.addEventListener("click", () => {
        sound.toggleMute();
        this.audioPrompt.innerText = sound.muted ? "🔇 AUDIO OFF" : "🔊 AUDIO ACTIVE";
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.isSkipped) {
        this.skip();
      }
    });

    this.runSequence();
  }

  async runSequence() {
    const logs = [
      "ATUL OS v2.0.4 — [INITIALIZING AI SYSTEM ARCHITECTURE]",
      "Allocating VRAM & Neural Memory Buffers... [OK]",
      "Initializing CUDA Hardware Accelerators (NVIDIA)... [OK]",
      "Establishing GitHub Sync Protocol (atleekumaar)... [OK]",
      "Loading NETRA Autonomous Perception Pipeline (v0.1)... [OK]",
      "Binding Pydantic Schema Contracts & HUD Engine... [OK]",
      "Loading 3D LiDAR Foveated Voxel Grid (Pandar40)... [OK]",
      "Initializing Kimi K3 Transformer & LatentMoE Blocks... [OK]",
      "Loading Interactive AI Knowledge Graph... [OK]",
      "Running Deep Diagnostics & Interface Telemetry...",
      "",
      ">> SYSTEM CORE 100% OPERATIONAL.",
      ">> WELCOME, VISITOR."
    ];

    let progress = 0;
    const total = logs.length;

    for (let i = 0; i < total; i++) {
      if (this.isSkipped) break;

      const log = logs[i];
      await this.typeLine(log);

      progress = Math.min(100, Math.round(((i + 1) / total) * 100));
      if (this.progressBar) this.progressBar.style.width = `${progress}%`;
      if (this.progressPercent) this.progressPercent.innerText = `${progress}%`;

      if (i === 1) sound.playBootSweep();
      if (i === total - 1) sound.playChime();

      await new Promise(r => setTimeout(r, 90));
    }

    if (!this.isSkipped) {
      await new Promise(r => setTimeout(r, 600));
      this.finish();
    }
  }

  async typeLine(text) {
    if (!this.textContainer) return;
    const line = document.createElement("div");
    line.className = "text-xs font-mono text-cyan-300 py-0.5";
    this.textContainer.appendChild(line);

    for (let j = 0; j < text.length; j++) {
      if (this.isSkipped) {
        line.innerText = text;
        return;
      }
      line.innerText += text[j];
      if (j % 5 === 0) sound.playTerminalKey();
      await new Promise(r => setTimeout(r, 8));
    }
  }

  skip() {
    this.isSkipped = true;
    this.finish();
  }

  finish() {
    if (!this.overlay) return;
    this.overlay.classList.add("animate-fade-out");
    setTimeout(() => {
      this.overlay.style.display = "none";
      if (this.onComplete) this.onComplete();
    }, 450);
  }
}

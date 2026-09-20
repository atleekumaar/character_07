/**
 * NETRA AI — FLAGSHIP COMMAND CENTER
 * Cinematic interactive perception simulator, real-time bounding box HUD,
 * latency telemetry, and decoupled Pydantic schema inspector.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class NetraCommandCenter {
  constructor() {
    this.container = document.getElementById("netra-command-center");
    this.canvas = document.getElementById("netra-hud-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.schemaOutput = document.getElementById("netra-schema-output");
    this.fpsElement = document.getElementById("netra-fps-counter");
    this.latencyElement = document.getElementById("netra-latency-counter");
    this.frameId = 1042;
    this.activeStep = 0;
    this.simulatedDetections = [
      { id: 0, label: "person", confidence: 0.94, x: 120, y: 80, w: 90, h: 180, dx: 0.4, dy: 0.2 },
      { id: 1, label: "vehicle", confidence: 0.91, x: 320, y: 140, w: 160, h: 110, dx: -0.6, dy: 0.1 },
      { id: 2, label: "obstacle (static)", confidence: 0.88, x: 230, y: 220, w: 60, h: 70, dx: 0, dy: 0 }
    ];
    this.pipelineSteps = [
      { name: "Camera Ingestion", tech: "Thread-Safe OpenCV / RTSP", desc: "Captures 1080p frames into a lock-free ring buffer with timestamp synchronization." },
      { name: "Tensor Normalization", tech: "CUDA Tensor Resizer", desc: "Batch normalization, letterbox padding, and FP16 tensor conversion on GPU." },
      { name: "YOLOv8 Inference", tech: "PyTorch CUDA Core", desc: "Hardware-accelerated neural forward pass executing in ~22.4ms with dynamic warmup." },
      { name: "Pydantic Contracts", tech: "Schema Interfaces", desc: "Enforces strict type contracts (BoundingBox, DetectedObject, PerceptionResult)." },
      { name: "HUD & Decision", tech: "Downstream Bridge", desc: "Streams structured JSON telemetry to path planner and displays annotated HUD overlay." }
    ];
    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
    this.setupPipelineControls();
    this.animateHUD();
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = Math.max(rect.height, 320);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  setupPipelineControls() {
    const stepsContainer = document.getElementById("netra-pipeline-steps");
    if (!stepsContainer) return;

    stepsContainer.innerHTML = this.pipelineSteps.map((step, idx) => `
      <button class="netra-step-btn text-left p-3 rounded-lg border transition-all ${idx === 0 ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300' : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'}" data-step="${idx}">
        <div class="flex items-center justify-between text-xs font-mono mb-1">
          <span class="text-cyan-400 font-bold">0${idx + 1}</span>
          <span class="text-[10px] text-slate-500">${step.tech}</span>
        </div>
        <div class="text-sm font-semibold text-slate-200">${step.name}</div>
      </button>
    `).join("");

    stepsContainer.querySelectorAll(".netra-step-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const step = parseInt(btn.getAttribute("data-step"));
        this.setActiveStep(step);
        sound.playClick();
      });
    });
  }

  setActiveStep(stepIndex) {
    this.activeStep = stepIndex;
    const step = this.pipelineSteps[stepIndex];
    const descEl = document.getElementById("netra-step-desc");
    if (descEl) {
      descEl.innerHTML = `
        <div class="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
          <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">Active Pipeline Stage:</span>
          <p class="text-xs text-slate-300">${step.desc}</p>
        </div>
      `;
    }

    document.querySelectorAll(".netra-step-btn").forEach((btn, idx) => {
      if (idx === stepIndex) {
        btn.className = "netra-step-btn text-left p-3 rounded-lg border transition-all bg-cyan-950/50 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]";
      } else {
        btn.className = "netra-step-btn text-left p-3 rounded-lg border transition-all bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700";
      }
    });
  }

  animateHUD() {
    if (!this.ctx || !this.canvas) return;

    this.frameId++;
    const latency = (21.8 + Math.sin(this.frameId * 0.05) * 1.4).toFixed(1);
    const fps = (45.2 + Math.cos(this.frameId * 0.08) * 1.2).toFixed(1);

    if (this.fpsElement) this.fpsElement.innerText = `${fps} FPS`;
    if (this.latencyElement) this.latencyElement.innerText = `${latency} ms`;

    // Clear canvas
    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle grid
    this.ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Reticle center
    const cx = this.width / 2;
    const cy = this.height / 2;
    this.ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    this.ctx.moveTo(cx - 36, cy);
    this.ctx.lineTo(cx + 36, cy);
    this.ctx.moveTo(cx, cy - 36);
    this.ctx.lineTo(cx, cy + 36);
    this.ctx.stroke();

    // Corner HUD target brackets
    const bracketSize = 16;
    this.ctx.strokeStyle = "#06b6d4";
    this.ctx.lineWidth = 2;
    
    // Top Left
    this.ctx.beginPath();
    this.ctx.moveTo(16, 16 + bracketSize);
    this.ctx.lineTo(16, 16);
    this.ctx.lineTo(16 + bracketSize, 16);
    this.ctx.stroke();

    // Top Right
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - 16 - bracketSize, 16);
    this.ctx.lineTo(this.width - 16, 16);
    this.ctx.lineTo(this.width - 16, 16 + bracketSize);
    this.ctx.stroke();

    // Bottom Left
    this.ctx.beginPath();
    this.ctx.moveTo(16, this.height - 16 - bracketSize);
    this.ctx.lineTo(16, this.height - 16);
    this.ctx.lineTo(16 + bracketSize, this.height - 16);
    this.ctx.stroke();

    // Bottom Right
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - 16 - bracketSize, this.height - 16);
    this.ctx.lineTo(this.width - 16, this.height - 16);
    this.ctx.lineTo(this.width - 16, this.height - 16 - bracketSize);
    this.ctx.stroke();

    // Render Bounding Boxes
    this.simulatedDetections.forEach((obj, idx) => {
      obj.x += obj.dx;
      obj.y += obj.dy;
      if (obj.x < 30 || obj.x + obj.w > this.width - 30) obj.dx *= -1;
      if (obj.y < 30 || obj.y + obj.h > this.height - 30) obj.dy *= -1;

      const color = obj.label.includes("person") ? "#00f0ff" : (obj.label.includes("vehicle") ? "#38bdf8" : "#f59e0b");

      // Box
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 1.6;
      this.ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Corner Accents
      const cs = 8;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(obj.x, obj.y + cs);
      this.ctx.lineTo(obj.x, obj.y);
      this.ctx.lineTo(obj.x + cs, obj.y);

      this.ctx.moveTo(obj.x + obj.w - cs, obj.y);
      this.ctx.lineTo(obj.x + obj.w, obj.y);
      this.ctx.lineTo(obj.x + obj.w, obj.y + cs);

      this.ctx.moveTo(obj.x, obj.y + obj.h - cs);
      this.ctx.lineTo(obj.x, obj.y + obj.h);
      this.ctx.lineTo(obj.x + cs, obj.y + obj.h);

      this.ctx.moveTo(obj.x + obj.w - cs, obj.y + obj.h);
      this.ctx.lineTo(obj.x + obj.w, obj.y + obj.h);
      this.ctx.lineTo(obj.x + obj.w, obj.y + obj.h - cs);
      this.ctx.stroke();

      // Label Banner
      this.ctx.fillStyle = "rgba(3, 7, 18, 0.85)";
      this.ctx.fillRect(obj.x, obj.y - 18, 110, 18);
      this.ctx.fillStyle = color;
      this.ctx.font = "bold 10px 'JetBrains Mono', monospace";
      this.ctx.fillText(`${obj.label.toUpperCase()} [${(obj.confidence * 100).toFixed(0)}%]`, obj.x + 4, obj.y - 5);
    });

    // Update Live Pydantic JSON stream sample every 30 frames
    if (this.frameId % 30 === 0 && this.schemaOutput) {
      const payload = {
        frame_id: this.frameId,
        timestamp: Date.now() / 1000,
        latency_ms: parseFloat(latency),
        fps: parseFloat(fps),
        cuda_accelerated: true,
        detected_objects: this.simulatedDetections.map(d => ({
          class_id: d.id,
          label: d.label,
          confidence: parseFloat(d.confidence.toFixed(2)),
          bbox: {
            xmin: Math.round(d.x),
            ymin: Math.round(d.y),
            xmax: Math.round(d.x + d.w),
            ymax: Math.round(d.y + d.h)
          }
        }))
      };
      this.schemaOutput.innerText = JSON.stringify(payload, null, 2);
    }

    requestAnimationFrame(() => this.animateHUD());
  }
}

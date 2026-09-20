/**
 * HERO COMPONENT & HOLOGRAPHIC AI CORE
 * Multi-ring 3D holographic neural canvas reacting to cursor coordinates,
 * dynamic animated role ticker, and primary command CTAs.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class Hero {
  constructor() {
    this.canvas = document.getElementById("ai-core-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.tickerEl = document.getElementById("hero-role-ticker");
    this.currentRoleIndex = 0;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.angle = 0;
    this.init();
  }

  init() {
    this.initTicker();
    if (this.canvas) {
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
      window.addEventListener("mousemove", (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        this.mouse.targetX = (e.clientX - cx) / cx;
        this.mouse.targetY = (e.clientY - cy) / cy;
      });
      this.animateCore();
    }
  }

  initTicker() {
    if (!this.tickerEl) return;
    const roles = PORTFOLIO_DATA.rolesTicker;

    setInterval(() => {
      this.tickerEl.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => {
        this.currentRoleIndex = (this.currentRoleIndex + 1) % roles.length;
        this.tickerEl.innerText = roles[this.currentRoleIndex];
        this.tickerEl.classList.remove("opacity-0", "translate-y-2");
      }, 350);
    }, 2800);
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width || 380;
    this.height = Math.max(rect.height || 380, 360);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  animateCore() {
    if (!this.ctx || !this.canvas) return;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.angle += 0.015;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const cx = this.width / 2;
    const cy = this.height / 2;

    // Outer glow
    const grad = this.ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
    grad.addColorStop(0, "rgba(6, 182, 212, 0.25)");
    grad.addColorStop(0.5, "rgba(139, 92, 246, 0.1)");
    grad.addColorStop(1, "rgba(3, 7, 18, 0)");
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 140, 0, Math.PI * 2);
    this.ctx.fill();

    // 3 Concentric Elliptical Holographic Rings
    const rings = [
      { radiusX: 110, radiusY: 35, rot: this.angle, color: "#00f0ff", width: 1.8 },
      { radiusX: 90, radiusY: 45, rot: -this.angle * 1.3 + Math.PI / 3, color: "#8b5cf6", width: 1.5 },
      { radiusX: 75, radiusY: 55, rot: this.angle * 0.9 + Math.PI / 1.5, color: "#38bdf8", width: 1.4 }
    ];

    rings.forEach(ring => {
      this.ctx.save();
      this.ctx.translate(cx + this.mouse.x * 20, cy + this.mouse.y * 20);
      this.ctx.rotate(ring.rot);

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, ring.radiusX, ring.radiusY, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = ring.color;
      this.ctx.lineWidth = ring.width;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = ring.color;
      this.ctx.stroke();

      // Satellite particle orbiting on ring
      const pAngle = this.angle * 2.5;
      const px = Math.cos(pAngle) * ring.radiusX;
      const py = Math.sin(pAngle) * ring.radiusY;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fill();

      this.ctx.restore();
    });

    // Pulsing Neural Nucleus Core
    const pulse = 18 + Math.sin(this.angle * 3) * 3;
    this.ctx.save();
    this.ctx.translate(cx + this.mouse.x * 12, cy + this.mouse.y * 12);
    
    this.ctx.beginPath();
    this.ctx.arc(0, 0, pulse, 0, Math.PI * 2);
    this.ctx.fillStyle = "#00f0ff";
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = "#00f0ff";
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(0, 0, pulse * 0.5, 0, Math.PI * 2);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fill();

    this.ctx.restore();

    requestAnimationFrame(() => this.animateCore());
  }
}

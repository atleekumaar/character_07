/**
 * NEURAL NETWORK CANVAS BACKGROUND
 * High-performance 2D canvas with synaptic nodes, pulsing signals, and mouse physics.
 * Optimized with requestAnimationFrame and visibility detection.
 */

export class NeuralBackground {
  constructor(canvasId = "neural-bg-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.nodes = [];
    this.pulses = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.width = 0;
    this.height = 0;
    this.animationFrame = null;
    this.nodeCount = 55;
    this.maxDistance = 140;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createNodes();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    
    // Adjust density based on screen size
    this.nodeCount = this.width < 768 ? 28 : 55;
    this.maxDistance = this.width < 768 ? 100 : 140;
    if (this.nodes.length !== this.nodeCount) {
      this.createNodes();
    }
  }

  createNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        color: Math.random() > 0.3 ? "0, 240, 255" : "139, 92, 246"
      });
    }
  }

  spawnPulse(n1, n2) {
    if (Math.random() < 0.015 && this.pulses.length < 12) {
      this.pulses.push({
        x1: n1.x, y1: n1.y,
        x2: n2.x, y2: n2.y,
        progress: 0,
        speed: 0.02 + Math.random() * 0.02
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > this.width) n.vx *= -1;
      if (n.y < 0 || n.y > this.height) n.vy *= -1;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - n.x;
        const dy = this.mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          n.x -= (dx / dist) * force * 1.5;
          n.y -= (dy / dist) * force * 1.5;
        }
      }

      // Draw node
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${n.color}, ${n.baseAlpha})`;
      this.ctx.fill();

      // Connect with neighbors
      for (let j = i + 1; j < this.nodes.length; j++) {
        const n2 = this.nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.18;
          this.ctx.beginPath();
          this.ctx.moveTo(n.x, n.y);
          this.ctx.lineTo(n2.x, n2.y);
          this.ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();

          this.spawnPulse(n, n2);
        }
      }
    }

    // Draw active synaptic pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed;
      if (p.progress >= 1) {
        this.pulses.splice(i, 1);
        continue;
      }
      const px = p.x1 + (p.x2 - p.x1) * p.progress;
      const py = p.y1 + (p.y2 - p.y1) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      this.ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = "#38bdf8";
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

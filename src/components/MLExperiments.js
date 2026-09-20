/**
 * ML EXPERIMENT METRICS DASHBOARD
 * Visualizes loss convergence curves, confusion matrices, and model performance metrics.
 */

export class MLExperiments {
  constructor() {
    this.canvas = document.getElementById("ml-loss-curve-canvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.init();
  }

  init() {
    if (!this.canvas) return;
    this.drawLossCurve();
    window.addEventListener("resize", () => this.drawLossCurve());
  }

  drawLossCurve() {
    if (!this.ctx || !this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 200;

    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.fillStyle = "#030712";
    this.ctx.fillRect(0, 0, w, h);

    // Grid lines
    this.ctx.strokeStyle = "rgba(30, 41, 59, 0.6)";
    this.ctx.lineWidth = 1;
    for (let y = 20; y < h; y += 35) {
      this.ctx.beginPath();
      this.ctx.moveTo(35, y);
      this.ctx.lineTo(w - 15, y);
      this.ctx.stroke();
    }

    // Epoch steps (1 to 50)
    const points = 50;
    const trainLoss = [];
    const valLoss = [];

    for (let i = 0; i < points; i++) {
      const t = i / points;
      trainLoss.push(0.85 * Math.exp(-t * 4.2) + 0.08 + Math.sin(i) * 0.015);
      valLoss.push(0.92 * Math.exp(-t * 3.8) + 0.12 + Math.cos(i) * 0.02);
    }

    // Helper draw line
    const drawLine = (data, color, label) => {
      this.ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = 40 + (i / (points - 1)) * (w - 60);
        const y = h - 25 - (data[i] / 1.0) * (h - 50);
        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.strokeStyle = color;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    };

    drawLine(trainLoss, "#06b6d4", "Training Loss");
    drawLine(valLoss, "#a855f7", "Validation Loss");

    // Legend
    this.ctx.font = "10px 'JetBrains Mono', monospace";
    this.ctx.fillStyle = "#06b6d4";
    this.ctx.fillText("■ Training Loss", w - 180, 18);
    this.ctx.fillStyle = "#a855f7";
    this.ctx.fillText("■ Validation Loss", w - 90, 18);
  }
}

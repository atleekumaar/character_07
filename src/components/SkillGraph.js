/**
 * INTERACTIVE AI SKILL GRAPH
 * 2D Canvas force-directed graph centered around AI Engineering with draggable nodes,
 * animated edge pulses, category filtering, and deep-inspect panel.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class SkillGraph {
  constructor(canvasId = "skill-graph-canvas", detailsPanelId = "skill-node-details") {
    this.canvas = document.getElementById(canvasId);
    this.detailsPanel = document.getElementById(detailsPanelId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.nodes = [];
    this.edges = [];
    this.selectedNode = null;
    this.hoveredNode = null;
    this.draggedNode = null;
    this.width = 0;
    this.height = 0;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.setupData();
    this.setupEvents();
    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = Math.max(rect.height, 460);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Reposition central node
    const core = this.nodes.find(n => n.id === "ai_core");
    if (core) {
      core.x = this.width / 2;
      core.y = this.height / 2;
      core.targetX = this.width / 2;
      core.targetY = this.height / 2;
    }
  }

  setupData() {
    const rawNodes = PORTFOLIO_DATA.knowledgeGraph.nodes;
    const centerX = this.width / 2 || 400;
    const centerY = this.height / 2 || 250;

    this.nodes = rawNodes.map((n, idx) => {
      let angle = (idx / (rawNodes.length - 1)) * Math.PI * 2;
      let radius = n.type === "core" ? 0 : (n.type === "primary" ? 140 : 210);
      return {
        ...n,
        x: n.type === "core" ? centerX : centerX + Math.cos(angle) * radius,
        y: n.type === "core" ? centerY : centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        targetX: n.type === "core" ? centerX : centerX + Math.cos(angle) * radius,
        targetY: n.type === "core" ? centerY : centerY + Math.sin(angle) * radius,
        radius: n.radius || 24
      };
    });

    this.edges = PORTFOLIO_DATA.knowledgeGraph.edges.map(e => ({
      source: this.nodes.find(n => n.id === e.source),
      target: this.nodes.find(n => n.id === e.target),
      pulse: Math.random()
    })).filter(e => e.source && e.target);

    // Select core by default
    this.selectNode(this.nodes[0]);
  }

  setupEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (this.draggedNode) {
        this.draggedNode.x = mx;
        this.draggedNode.y = my;
        this.draggedNode.targetX = mx;
        this.draggedNode.targetY = my;
        return;
      }

      let found = null;
      for (const n of this.nodes) {
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist < n.radius) {
          found = n;
          break;
        }
      }

      if (found !== this.hoveredNode) {
        this.hoveredNode = found;
        if (found) sound.playHover();
        this.canvas.style.cursor = found ? "pointer" : "default";
      }
    });

    this.canvas.addEventListener("mousedown", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      for (const n of this.nodes) {
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist < n.radius) {
          this.draggedNode = n;
          this.selectNode(n);
          sound.playClick();
          break;
        }
      }
    });

    window.addEventListener("mouseup", () => {
      this.draggedNode = null;
    });
  }

  selectNode(node) {
    this.selectedNode = node;
    this.renderDetails(node);
  }

  renderDetails(node) {
    if (!this.detailsPanel) return;

    // Find related projects
    const related = PORTFOLIO_DATA.projects.filter(p => 
      p.tags.some(t => t.toLowerCase().includes(node.label.toLowerCase()) || node.label.toLowerCase().includes(t.toLowerCase())) ||
      (node.id === "netra" && p.id === "netra") ||
      (node.id === "lidar" && p.id === "foveated_lidar") ||
      (node.id === "moe" && p.id === "kimi_k3_toy")
    );

    this.detailsPanel.innerHTML = `
      <div class="space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div class="flex items-center gap-3">
            <span class="w-4 h-4 rounded-full shadow-lg" style="background: ${node.color}; box-shadow: 0 0 12px ${node.color};"></span>
            <div>
              <h4 class="text-lg font-bold text-slate-100 tracking-wide">${node.label}</h4>
              <span class="text-xs font-mono text-cyan-400 uppercase tracking-widest">${node.category || "Core Competency"}</span>
            </div>
          </div>
          <span class="px-2.5 py-1 text-xs font-mono rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
            ${node.type.toUpperCase()}
          </span>
        </div>

        <div class="text-xs text-slate-300 leading-relaxed">
          Integrated directly across system pipelines, architectural designs, and active research models.
        </div>

        <div class="pt-2">
          <span class="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Connected Projects:</span>
          ${related.length > 0 ? `
            <div class="space-y-2">
              ${related.map(p => `
                <a href="#projects" class="block p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors group">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-200 group-hover:text-cyan-300">${p.title}</span>
                    <span class="text-[10px] font-mono text-cyan-400">${p.badge.split("•")[0]}</span>
                  </div>
                </a>
              `).join("")}
            </div>
          ` : `
            <p class="text-xs font-mono text-slate-500 italic">Foundation technology underpinning full stack.</p>
          `}
        </div>
      </div>
    `;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Physics spring simulation towards targets
    for (const n of this.nodes) {
      if (n !== this.draggedNode) {
        const dx = n.targetX - n.x;
        const dy = n.targetY - n.y;
        n.vx = (n.vx + dx * 0.04) * 0.78;
        n.vy = (n.vy + dy * 0.04) * 0.78;
        n.x += n.vx;
        n.y += n.vy;
      }
    }

    // Draw edges
    for (const e of this.edges) {
      e.pulse = (e.pulse + 0.012) % 1;
      const isHighlighted = this.selectedNode && (this.selectedNode.id === e.source.id || this.selectedNode.id === e.target.id);

      this.ctx.beginPath();
      this.ctx.moveTo(e.source.x, e.source.y);
      this.ctx.lineTo(e.target.x, e.target.y);
      this.ctx.strokeStyle = isHighlighted ? "rgba(6, 182, 212, 0.7)" : "rgba(30, 41, 59, 0.6)";
      this.ctx.lineWidth = isHighlighted ? 2.2 : 1;
      this.ctx.stroke();

      // Pulse particle
      const px = e.source.x + (e.target.x - e.source.x) * e.pulse;
      const py = e.source.y + (e.target.y - e.source.y) * e.pulse;
      this.ctx.beginPath();
      this.ctx.arc(px, py, isHighlighted ? 2.5 : 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = isHighlighted ? "#22d3ee" : "rgba(148, 163, 184, 0.4)";
      this.ctx.fill();
    }

    // Draw nodes
    for (const n of this.nodes) {
      const isSelected = this.selectedNode && this.selectedNode.id === n.id;
      const isHovered = this.hoveredNode && this.hoveredNode.id === n.id;

      // Glow halo
      if (isSelected || isHovered) {
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, n.radius + 7, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${n.color === "#06b6d4" ? "6, 182, 212" : "139, 92, 246"}, 0.25)`;
        this.ctx.fill();
      }

      // Outer circle
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "#030712";
      this.ctx.fill();
      this.ctx.strokeStyle = isSelected ? "#00f0ff" : n.color;
      this.ctx.lineWidth = isSelected ? 3 : 1.8;
      this.ctx.stroke();

      // Inner dot
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius * 0.45, 0, Math.PI * 2);
      this.ctx.fillStyle = n.color;
      this.ctx.fill();

      // Text label
      this.ctx.font = `${n.type === "core" ? "bold 13px" : "500 11px"} 'Space Grotesk', sans-serif`;
      this.ctx.fillStyle = isSelected ? "#38bdf8" : "#f1f5f9";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(n.label, n.x, n.y + n.radius + 14);
    }

    requestAnimationFrame(() => this.animate());
  }
}

/**
 * MISSIONS UNIVERSE & CASE STUDY MODAL CONTROLLER
 * Renders cinematic glass mission cards for verified engineering projects
 * and manages interactive full-screen case study modal walkthroughs.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class MissionsUniverse {
  constructor() {
    this.container = document.getElementById("missions-grid-container");
    this.modal = document.getElementById("mission-case-study-modal");
    this.modalContent = document.getElementById("mission-case-study-content");
    this.closeBtn = document.getElementById("mission-case-study-close");
    this.init();
  }

  init() {
    this.renderMissions();

    if (this.closeBtn && this.modal) {
      this.closeBtn.addEventListener("click", () => this.closeCaseStudy());
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) this.closeCaseStudy();
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal && !this.modal.classList.contains("hidden")) {
        this.closeCaseStudy();
      }
    });
  }

  renderMissions() {
    if (!this.container) return;

    const missions = PORTFOLIO_DATA.missions;
    this.container.innerHTML = missions.map((m, idx) => `
      <div class="p-6 sm:p-8 rounded-2xl glass-panel holo-card flex flex-col justify-between space-y-6 group cursor-pointer transition-all border border-cyan-500/15 hover:border-cyan-400/40" data-mission-idx="${idx}">
        <div class="space-y-4">
          <div class="flex items-center justify-between font-mono text-xs">
            <span class="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-bold tracking-wider">${m.id}</span>
            <span class="text-slate-500 uppercase text-[10px] tracking-widest">${m.category.split("&")[0]}</span>
          </div>

          <div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-100 font-display group-hover:text-cyan-300 transition-colors">${m.title}</h3>
            <p class="text-xs font-mono text-cyan-400/80 mt-1">${m.tagline}</p>
          </div>

          <p class="text-xs text-slate-300 leading-relaxed line-clamp-3">
            ${m.approach}
          </p>
        </div>

        <div class="space-y-4 pt-4 border-t border-slate-800/80">
          <div class="flex flex-wrap gap-1.5 font-mono text-[10px]">
            ${m.tags.slice(0, 4).map(tag => `
              <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">${tag}</span>
            `).join("")}
          </div>

          <div class="flex items-center justify-between font-mono text-xs pt-1">
            <span class="text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-bold">
              OPEN CASE STUDY →
            </span>
            <span class="text-slate-500 text-[10px]">VERIFIED SOURCE</span>
          </div>
        </div>
      </div>
    `).join("");

    this.container.querySelectorAll("[data-mission-idx]").forEach(card => {
      card.addEventListener("click", () => {
        const idx = parseInt(card.getAttribute("data-mission-idx"));
        this.openCaseStudy(missions[idx]);
      });
    });
  }

  openCaseStudy(m) {
    sound.playClick();
    if (!this.modal || !this.modalContent) return;

    this.modalContent.innerHTML = `
      <!-- Case Study Header -->
      <div class="border-b border-slate-800 pb-6 mb-6">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-2">
          <span class="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
            ${m.id} // ${m.badge}
          </span>
          <span class="text-xs font-mono text-slate-400 uppercase tracking-widest">${m.category}</span>
        </div>
        <h2 class="text-2xl sm:text-4xl font-bold text-white font-display">${m.title}</h2>
        <p class="text-sm font-mono text-cyan-400 mt-1">${m.tagline}</p>
      </div>

      <!-- Problem & Approach -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs leading-relaxed">
        <div class="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h4 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold">01. THE PROBLEM</h4>
          <p class="text-slate-300">${m.problem}</p>
        </div>
        <div class="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h4 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold">02. THE APPROACH</h4>
          <p class="text-slate-300">${m.approach}</p>
        </div>
      </div>

      <!-- Architecture Pipeline -->
      <div class="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 mb-8 font-mono text-xs">
        <h4 class="text-cyan-400 uppercase tracking-widest text-[11px] font-bold">03. ARCHITECTURAL PIPELINE</h4>
        <p class="text-slate-200 leading-relaxed">${m.architecture}</p>
      </div>

      <!-- Verified Metrics & Tech Stack -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h4 class="font-mono text-slate-400 uppercase tracking-widest text-[11px] font-bold mb-3">VERIFIED SYSTEM METRICS</h4>
          <div class="space-y-2 font-mono text-xs">
            ${Object.entries(m.metrics || {}).map(([key, val]) => `
              <div class="flex justify-between p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span class="text-slate-400 capitalize">${key}:</span>
                <span class="text-cyan-300 font-bold">${val}</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div>
          <h4 class="font-mono text-slate-400 uppercase tracking-widest text-[11px] font-bold mb-3">TECHNOLOGY STACK</h4>
          <div class="flex flex-wrap gap-2">
            ${m.tags.map(t => `
              <span class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs">${t}</span>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Action Links -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-800 font-mono text-xs">
        <div class="flex items-center gap-3">
          ${m.githubUrl ? `
            <a href="${m.githubUrl}" target="_blank" class="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span>View Source Code on GitHub</span>
              <span>↗</span>
            </a>
          ` : ''}
          ${m.liveUrl ? `
            <a href="${m.liveUrl}" target="_blank" class="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold flex items-center gap-2 transition-colors">
              <span>Open Live Demo</span>
              <span>↗</span>
            </a>
          ` : ''}
        </div>
        <span class="text-slate-500">AUTHENTIC REPRODUCIBLE PIPELINE</span>
      </div>
    `;

    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
  }

  closeCaseStudy() {
    if (!this.modal) return;
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
  }
}

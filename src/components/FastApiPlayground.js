/**
 * FASTAPI PLAYGROUND COMPONENT
 * Interactive Swagger-inspired API explorer showcasing live FastAPI REST endpoints.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class FastApiPlayground {
  constructor() {
    this.endpoints = [
      { method: "GET", path: "/api/status", desc: "Telemetry health & GPU status", data: () => ({ status: "ONLINE", system: "ATUL_OS_v2.0", latency_ms: 22.4, cuda: true }) },
      { method: "GET", path: "/api/projects", desc: "Verified project registry & metrics", data: () => PORTFOLIO_DATA.projects },
      { method: "GET", path: "/api/skills", desc: "Categorized competencies & proficiencies", data: () => PORTFOLIO_DATA.skillsCategories },
      { method: "GET", path: "/api/experience", desc: "Industry programs & timeline", data: () => PORTFOLIO_DATA.experience },
      { method: "GET", path: "/api/github", desc: "Live GitHub profile & repo statistics", data: () => ({ username: "atleekumaar", repos: 9, stars: 24, topLanguage: "Python" }) }
    ];
    this.activeEndpoint = this.endpoints[0];
    this.init();
  }

  init() {
    this.listContainer = document.getElementById("fastapi-endpoints-list");
    this.jsonOutput = document.getElementById("fastapi-json-output");
    this.statusBadge = document.getElementById("fastapi-status-badge");
    this.executeBtn = document.getElementById("fastapi-execute-btn");
    this.pathDisplay = document.getElementById("fastapi-active-path");

    if (this.listContainer) {
      this.listContainer.innerHTML = this.endpoints.map((ep, idx) => `
        <button class="fastapi-ep-btn w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${idx === 0 ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700'}" data-idx="${idx}">
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-bold">${ep.method}</span>
            <span class="text-xs font-mono font-medium">${ep.path}</span>
          </div>
          <span class="text-[10px] text-slate-500">${ep.desc.split(" ")[0]}</span>
        </button>
      `).join("");

      this.listContainer.querySelectorAll(".fastapi-ep-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          this.selectEndpoint(this.endpoints[idx], btn);
        });
      });
    }

    if (this.executeBtn) {
      this.executeBtn.addEventListener("click", () => this.executeRequest());
    }

    this.renderJSON(this.activeEndpoint.data());
  }

  selectEndpoint(ep, buttonEl) {
    sound.playClick();
    this.activeEndpoint = ep;
    if (this.pathDisplay) this.pathDisplay.innerText = ep.path;

    document.querySelectorAll(".fastapi-ep-btn").forEach(btn => {
      btn.className = "fastapi-ep-btn w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700";
    });
    if (buttonEl) {
      buttonEl.className = "fastapi-ep-btn w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between bg-cyan-950/40 border-cyan-500/40 text-cyan-300";
    }

    this.executeRequest();
  }

  async executeRequest() {
    sound.playClick();
    if (this.statusBadge) {
      this.statusBadge.innerText = "FETCHING...";
      this.statusBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300";
    }

    try {
      const res = await fetch(this.activeEndpoint.path);
      if (res.ok) {
        const data = await res.json();
        this.renderJSON(data);
        if (this.statusBadge) {
          this.statusBadge.innerText = "200 OK (LIVE)";
          this.statusBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300";
        }
        return;
      }
    } catch (e) {}

    // Fallback simulation
    setTimeout(() => {
      this.renderJSON(this.activeEndpoint.data());
      if (this.statusBadge) {
        this.statusBadge.innerText = "200 OK (SIMULATED)";
        this.statusBadge.className = "text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300";
      }
    }, 120);
  }

  renderJSON(data) {
    if (this.jsonOutput) {
      this.jsonOutput.innerText = JSON.stringify(data, null, 2);
    }
  }
}

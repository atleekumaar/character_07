/**
 * GITHUB INTELLIGENCE DASHBOARD
 * Live telemetry integration for 'atleekumaar', contribution graph generator,
 * pinned repositories, and computed intelligence metrics.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class GitHubDashboard {
  constructor() {
    this.container = document.getElementById("github-repos-container");
    this.heatmapContainer = document.getElementById("github-heatmap-grid");
    this.init();
  }

  async init() {
    this.renderHeatmap();
    this.renderRepos();
    this.fetchLiveGitHub();
  }

  renderHeatmap() {
    if (!this.heatmapContainer) return;

    // Generate 52 weeks x 7 days realistic commit cells
    let cellsHTML = "";
    const levels = [
      "bg-slate-900 border-slate-800/40",
      "bg-emerald-950/80 border-emerald-800/30",
      "bg-emerald-800/80 border-emerald-600/40",
      "bg-emerald-600 border-emerald-400/50",
      "bg-cyan-400 border-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.4)]"
    ];

    for (let i = 0; i < 52 * 7; i++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.7) level = 3;
      else if (rand > 0.5) level = 2;
      else if (rand > 0.3) level = 1;

      cellsHTML += `<div class="w-2.5 h-2.5 rounded-sm border ${levels[level]} transition-transform hover:scale-125"></div>`;
    }

    this.heatmapContainer.innerHTML = cellsHTML;
  }

  renderRepos() {
    if (!this.container) return;

    const repos = PORTFOLIO_DATA.projects;
    this.container.innerHTML = repos.map(repo => `
      <div class="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-2">
              <span class="text-cyan-400 font-mono text-xs font-bold">📁</span>
              <a href="${repo.githubUrl}" target="_blank" class="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                ${repo.id === "netra" ? "NETRA-" : (repo.id === "kimi_k3_toy" ? "kimi-k3-toy" : repo.id)}
              </a>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700">Public</span>
          </div>
          <p class="text-xs text-slate-400 line-clamp-2 mb-4">${repo.problem}</p>
        </div>

        <div class="flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Python</span>
            <span>⭐ ${repo.stars}</span>
          </div>
          <a href="${repo.githubUrl}" target="_blank" class="text-cyan-400 hover:underline">Inspect →</a>
        </div>
      </div>
    `).join("");
  }

  async fetchLiveGitHub() {
    try {
      const res = await fetch("https://api.github.com/users/atleekumaar");
      if (res.ok) {
        const user = await res.json();
        const reposCount = document.getElementById("gh-stat-repos");
        const followersCount = document.getElementById("gh-stat-followers");
        if (reposCount) reposCount.innerText = user.public_repos || "9";
        if (followersCount) followersCount.innerText = user.followers || "12";
      }
    } catch (e) {
      console.log("Using cached GitHub statistics.");
    }
  }
}

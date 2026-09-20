/**
 * RECRUITER MODE CONTROLLER
 * Instantly transforms the entire portfolio into a streamlined, high-contrast, ATS-friendly
 * executive dashboard designed for recruiters to evaluate candidate qualifications in under 30 seconds.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class RecruiterMode {
  constructor() {
    this.isActive = false;
    this.toggleBtn = document.getElementById("recruiter-mode-toggle");
    this.recruiterOverlay = document.getElementById("recruiter-mode-overlay");
    this.exitBtn = document.getElementById("recruiter-mode-exit");
    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }

    if (this.exitBtn) {
      this.exitBtn.addEventListener("click", () => this.toggle());
    }

    window.addEventListener("toggle-recruiter-mode", () => this.toggle());

    this.renderContent();
  }

  toggle() {
    sound.playClick();
    this.isActive = !this.isActive;

    if (this.isActive) {
      if (this.recruiterOverlay) {
        this.recruiterOverlay.classList.remove("hidden");
        this.recruiterOverlay.classList.add("block");
      }
      document.body.classList.add("recruiter-mode-active");
    } else {
      if (this.recruiterOverlay) {
        this.recruiterOverlay.classList.add("hidden");
        this.recruiterOverlay.classList.remove("block");
      }
      document.body.classList.remove("recruiter-mode-active");
    }
  }

  renderContent() {
    const container = document.getElementById("recruiter-content-body");
    if (!container) return;

    const { identity, recruiterHighlights, projects, experience, certifications } = PORTFOLIO_DATA;

    container.innerHTML = `
      <!-- Header / Candidate Summary -->
      <div class="border-b border-slate-700/60 pb-8 mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-slate-100 tracking-tight">${identity.name}</h1>
              <span class="px-3 py-0.5 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold">● AVAILABLE FOR HIRE</span>
            </div>
            <p class="text-lg font-medium text-cyan-400 mb-2">${identity.tagline}</p>
            <p class="text-sm text-slate-400 max-w-2xl leading-relaxed">${identity.education.degree} — ${identity.education.institution} (${identity.education.graduationYear})</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a href="mailto:${identity.email}" class="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              ✉ Email Candidate
            </a>
            <button onclick="window.print()" class="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all">
              📄 Print / Save PDF
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60 text-xs font-mono text-slate-300">
          <div><span class="text-slate-500 block">Email:</span> ${identity.email}</div>
          <div><span class="text-slate-500 block">Location:</span> ${identity.location}</div>
          <div><span class="text-slate-500 block">GitHub:</span> <a href="${identity.githubUrl}" target="_blank" class="text-cyan-400 underline">${identity.handle}</a></div>
          <div><span class="text-slate-500 block">LinkedIn:</span> <a href="${identity.linkedinUrl}" target="_blank" class="text-cyan-400 underline">atul-shukla-ai</a></div>
        </div>
      </div>

      <!-- Executive Overview -->
      <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-6 mb-8">
        <h3 class="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Executive Summary</h3>
        <p class="text-sm text-slate-200 leading-relaxed mb-4">${recruiterHighlights.oneLiner}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          ${recruiterHighlights.coreStrengths.map(s => `
            <div class="flex items-start gap-2"><span class="text-emerald-400 font-bold">✓</span> <span>${s}</span></div>
          `).join("")}
        </div>
      </div>

      <!-- Verified Flagship & Core Projects -->
      <div class="mb-8">
        <h3 class="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Key Engineering Projects</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${projects.slice(0, 4).map(p => `
            <div class="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-base font-bold text-slate-100">${p.title}</h4>
                  <span class="text-[11px] font-mono text-cyan-400">${p.badge.split("•")[0]}</span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed mb-3">${p.solution}</p>
              </div>
              <div class="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span class="text-slate-400 font-mono">${p.tags.slice(0, 3).join(", ")}</span>
                <a href="${p.githubUrl}" target="_blank" class="text-cyan-400 hover:underline font-mono">View Source →</a>
              </div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Industry Experience Programs -->
      <div class="mb-8">
        <h3 class="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Industry Simulation Programs</h3>
        <div class="space-y-3">
          ${experience.map(exp => `
            <div class="p-4 rounded-lg bg-slate-900/30 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div class="text-sm font-bold text-slate-200">${exp.organization} — <span class="text-cyan-400 font-normal">${exp.role}</span></div>
                <div class="text-xs text-slate-400 mt-1">${exp.skills.join(" • ")}</div>
              </div>
              <span class="text-xs font-mono text-slate-500">${exp.period}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Certifications -->
      <div>
        <h3 class="text-sm font-mono text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Accreditations & Certifications</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${certifications.map(c => `
            <div class="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800">
              <div class="text-xs font-bold text-slate-200 mb-1">${c.title}</div>
              <div class="text-[11px] text-slate-400">${c.issuer}</div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }
}

/**
 * SMART RESUME SYSTEM
 * Role-targeted resume selector with real-time profile highlights,
 * skills prioritization, and print/PDF export capabilities.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class SmartResume {
  constructor() {
    this.container = document.getElementById("smart-resume-preview");
    this.activeRoleKey = "ai_ml";
    this.init();
  }

  init() {
    this.setupRoleButtons();
    this.renderPreview();
  }

  setupRoleButtons() {
    const buttons = document.querySelectorAll(".resume-role-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        sound.playClick();
        const role = btn.getAttribute("data-role");
        this.activeRoleKey = role;

        buttons.forEach(b => {
          if (b.getAttribute("data-role") === role) {
            b.className = "resume-role-btn px-4 py-2 rounded-lg text-xs font-mono border bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]";
          } else {
            b.className = "resume-role-btn px-4 py-2 rounded-lg text-xs font-mono border bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700";
          }
        });

        this.renderPreview();
      });
    });
  }

  renderPreview() {
    if (!this.container) return;

    const resumeData = PORTFOLIO_DATA.smartResumes[this.activeRoleKey];
    const { identity, projects, experience, certifications } = PORTFOLIO_DATA;

    const filteredProjects = projects.filter(p => resumeData.topProjects.includes(p.id));
    const filteredCerts = certifications.filter(c => resumeData.relevantCertifications.includes(c.id));

    this.container.innerHTML = `
      <div class="p-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl animate-fade-in text-slate-300 font-sans text-xs">
        <!-- Resume Header -->
        <div class="border-b border-slate-800 pb-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white tracking-wide">${identity.name}</h2>
            <div class="text-sm font-semibold text-cyan-400 mt-0.5">${resumeData.roleTitle}</div>
            <div class="text-slate-400 mt-1 text-[11px]">${identity.education.degree} • ${identity.education.institution}</div>
          </div>
          <div class="text-right text-[11px] text-slate-400 font-mono space-y-1">
            <div>${identity.email}</div>
            <div>${identity.githubUrl}</div>
            <div>${identity.location}</div>
          </div>
        </div>

        <!-- Targeted Summary -->
        <div class="mb-5">
          <h3 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold mb-2">Professional Profile</h3>
          <p class="text-slate-300 leading-relaxed text-xs">${resumeData.summary}</p>
        </div>

        <!-- Prioritized Skills -->
        <div class="mb-5">
          <h3 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold mb-2">Core Competencies</h3>
          <div class="flex flex-wrap gap-1.5">
            ${resumeData.keySkills.map(sk => `
              <span class="px-2.5 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-200 font-mono text-[11px]">${sk}</span>
            `).join("")}
          </div>
        </div>

        <!-- Key Featured Projects -->
        <div class="mb-5">
          <h3 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold mb-3">Targeted Engineering Projects</h3>
          <div class="space-y-3">
            ${filteredProjects.map(p => `
              <div class="border-l-2 border-cyan-500 pl-3">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-100">${p.title}</span>
                  <span class="font-mono text-[10px] text-cyan-400">${p.tags.slice(0, 3).join(", ")}</span>
                </div>
                <p class="text-slate-400 mt-1">${p.solution}</p>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Experience & Certs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
          <div>
            <h3 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold mb-2">Virtual Industry Programs</h3>
            <div class="space-y-1.5 text-[11px]">
              ${experience.slice(0, 3).map(exp => `
                <div><strong class="text-slate-200">${exp.organization}</strong>: ${exp.role}</div>
              `).join("")}
            </div>
          </div>
          <div>
            <h3 class="font-mono text-cyan-400 uppercase tracking-widest text-[11px] font-bold mb-2">Key Accreditations</h3>
            <div class="space-y-1.5 text-[11px]">
              ${filteredCerts.map(c => `
                <div><strong class="text-emerald-400">✓</strong> ${c.title} (${c.issuer})</div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * INTERACTIVE DEVELOPER TERMINAL
 * Full-featured developer shell with history, tab autocomplete, rich output formatters,
 * Easter eggs (matrix, sudo hire-atul), and sound fx.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class Terminal {
  constructor() {
    this.container = document.getElementById("terminal-output");
    this.input = document.getElementById("terminal-input");
    this.history = [];
    this.historyIndex = -1;
    this.commands = [
      "help", "about", "skills", "projects", "netra", "lidar", "kimi",
      "experience", "certifications", "resume", "github", "linkedin",
      "recruiter", "ai-lab", "sudo hire-atul", "matrix", "clear"
    ];
    this.init();
  }

  init() {
    if (!this.input || !this.container) return;

    this.printWelcome();

    this.input.addEventListener("keydown", (e) => {
      sound.playTerminalKey();

      if (e.key === "Enter") {
        const cmd = this.input.value.trim();
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
          this.input.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.history[this.historyIndex];
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.input.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.input.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const current = this.input.value.toLowerCase();
        const match = this.commands.find(c => c.startsWith(current));
        if (match) this.input.value = match;
      }
    });

    // Terminal quick buttons
    document.querySelectorAll(".terminal-quick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cmd = btn.getAttribute("data-cmd");
        if (cmd) {
          this.execute(cmd);
          sound.playClick();
        }
      });
    });
  }

  printWelcome() {
    this.container.innerHTML = `
      <div class="text-cyan-400 font-bold mb-2">ATUL OS v2.0.4 [Neural Kernel Ready]</div>
      <div class="text-slate-400 text-xs mb-3">Type <span class="text-cyan-300 font-semibold">'help'</span> for command inventory, or try <span class="text-emerald-400 font-semibold">'sudo hire-atul'</span>.</div>
    `;
  }

  execute(cmdRaw) {
    const cmd = cmdRaw.toLowerCase().trim();
    this.appendLine(`<span class="text-cyan-400 font-bold">visitor@atul-os:~$</span> <span class="text-slate-200">${cmdRaw}</span>`);

    switch (cmd) {
      case "help":
        this.appendLine(`
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 my-2 text-xs">
            ${PORTFOLIO_DATA.terminalHelp.map(h => `
              <div><span class="text-cyan-300 font-bold font-mono">${h.cmd}</span> <span class="text-slate-400">— ${h.desc}</span></div>
            `).join("")}
          </div>
        `);
        break;

      case "about":
        this.appendLine(`
          <div class="my-2 text-xs space-y-1 text-slate-300">
            <div class="text-cyan-300 font-bold">${PORTFOLIO_DATA.identity.name}</div>
            <div>${PORTFOLIO_DATA.identity.education.degree}</div>
            <div>${PORTFOLIO_DATA.identity.education.institution} (${PORTFOLIO_DATA.identity.education.graduationYear})</div>
            <p class="text-slate-400 mt-2">${PORTFOLIO_DATA.identity.bio}</p>
          </div>
        `);
        break;

      case "skills":
        this.appendLine(`
          <div class="my-2 text-xs space-y-2">
            ${PORTFOLIO_DATA.skillsCategories.map(cat => `
              <div>
                <span class="text-cyan-400 font-bold font-mono">${cat.name}:</span>
                <span class="text-slate-300">${cat.skills.map(s => s.name).join(", ")}</span>
              </div>
            `).join("")}
          </div>
        `);
        break;

      case "projects":
        this.appendLine(`
          <div class="my-2 text-xs space-y-2">
            ${PORTFOLIO_DATA.projects.map(p => `
              <div class="border-l-2 border-cyan-500 pl-2">
                <div class="text-cyan-300 font-bold">${p.title} <span class="text-[10px] text-slate-500 font-mono">[${p.tags.slice(0, 3).join(", ")}]</span></div>
                <div class="text-slate-400">${p.problem}</div>
              </div>
            `).join("")}
          </div>
        `);
        break;

      case "netra":
        this.appendLine(`
          <div class="p-3 my-2 bg-cyan-950/30 border border-cyan-500/40 rounded-lg text-xs space-y-1.5">
            <div class="text-cyan-300 font-bold text-sm">👁️ NETRA AI — Autonomous Perception Engine</div>
            <div class="text-slate-300">Inference Latency: <span class="text-emerald-400 font-mono">~22.4 ms (CUDA GPU)</span></div>
            <div class="text-slate-300">Architecture: Camera Ingestion → YOLOv8 → Pydantic Schema → HUD</div>
            <div class="text-slate-300">Repository: <a href="https://github.com/atleekumaar/NETRA-" target="_blank" class="text-cyan-400 underline">github.com/atleekumaar/NETRA-</a></div>
          </div>
        `);
        break;

      case "lidar":
        this.appendLine(`
          <div class="p-3 my-2 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-1.5">
            <div class="text-cyan-300 font-bold">Foveated 2.5D LiDAR Mapping & Semantic Segmentation</div>
            <div class="text-slate-300">Voxel Zones: Near 0.05m | Mid 0.15m | Far 0.50m</div>
            <div class="text-slate-300">Network: PointNet++ with Distance Conditioning</div>
            <div class="text-slate-300">Sensor: Hesai Pandar40 (40-beam LiDAR, 10 Hz)</div>
          </div>
        `);
        break;

      case "kimi":
        this.appendLine(`
          <div class="p-3 my-2 bg-slate-900/60 border border-slate-700 rounded-lg text-xs space-y-1.5">
            <div class="text-purple-300 font-bold">Kimi K3 Toy Architecture (PyTorch)</div>
            <div class="text-slate-300">Features: Kimi Delta Attention (KDA) + Gated MLA + AttnRes + LatentMoE</div>
            <div class="text-slate-300">Experts: Shared SwiGLU + Routed SiTU-GLU Experts</div>
          </div>
        `);
        break;

      case "experience":
        this.appendLine(`
          <div class="my-2 text-xs space-y-1.5">
            ${PORTFOLIO_DATA.experience.map(exp => `
              <div><span class="text-cyan-300 font-bold">${exp.organization}</span> — <span class="text-slate-300">${exp.role}</span> <span class="text-slate-500">(${exp.period})</span></div>
            `).join("")}
          </div>
        `);
        break;

      case "certifications":
        this.appendLine(`
          <div class="my-2 text-xs space-y-1.5">
            ${PORTFOLIO_DATA.certifications.map(c => `
              <div><span class="text-emerald-400 font-bold">✓</span> <span class="text-slate-200 font-medium">${c.title}</span> <span class="text-slate-500">— ${c.issuer}</span></div>
            `).join("")}
          </div>
        `);
        break;

      case "sudo hire-atul":
        sound.playBootSweep();
        this.appendLine(`
          <div class="p-3 my-2 bg-emerald-950/30 border border-emerald-500/50 rounded-lg text-xs space-y-1.5 text-emerald-300 font-mono animate-fade-in">
            <div class="font-bold text-sm">INITIATING CANDIDATE DIAGNOSTIC MATRIX...</div>
            <div>[✓] Autonomous Perception (NETRA Sub-25ms CUDA) — VERIFIED</div>
            <div>[✓] Deep Learning & PyTorch (Kimi K3, AttnRes, LatentMoE) — VERIFIED</div>
            <div>[✓] High-Performance Backend (FastAPI, Pydantic, PostgreSQL) — VERIFIED</div>
            <div>[✓] Cloud & Systems Architecture (AWS Solutions Arch) — VERIFIED</div>
            <div>[✓] Industry Simulation Programs (Walmart, AWS, BA, Deloitte, Tata) — VERIFIED</div>
            <div class="pt-2 text-white font-bold text-sm tracking-widest">>> RECOMMENDATION: HIRE ATUL SHUKLA 🚀</div>
            <div class="text-cyan-300 text-[11px] pt-1">Contact direct: <a href="mailto:${PORTFOLIO_DATA.identity.email}" class="underline">${PORTFOLIO_DATA.identity.email}</a></div>
          </div>
        `);
        break;

      case "matrix":
        this.appendLine(`<div class="text-emerald-400 font-mono text-xs my-2">Wake up, Neo... The Matrix has you. Follow the white rabbit. 🐇</div>`);
        sound.playWarp();
        break;

      case "clear":
        this.container.innerHTML = "";
        this.printWelcome();
        break;

      case "resume":
        this.appendLine(`<div class="my-2 text-xs text-cyan-300 font-mono">Opening Smart Resume generator... (Scroll down to Resume section or click Download)</div>`);
        const resumeSection = document.getElementById("resume");
        if (resumeSection) resumeSection.scrollIntoView({ behavior: "smooth" });
        break;

      case "github":
        window.open(PORTFOLIO_DATA.identity.githubUrl, "_blank");
        this.appendLine(`<div class="my-1 text-xs text-slate-400">Opening ${PORTFOLIO_DATA.identity.githubUrl}...</div>`);
        break;

      case "linkedin":
        window.open(PORTFOLIO_DATA.identity.linkedinUrl, "_blank");
        this.appendLine(`<div class="my-1 text-xs text-slate-400">Opening ${PORTFOLIO_DATA.identity.linkedinUrl}...</div>`);
        break;

      case "recruiter":
        window.dispatchEvent(new CustomEvent("toggle-recruiter-mode"));
        this.appendLine(`<div class="my-1 text-xs text-emerald-400 font-mono">Toggling Recruiter Executive Mode...</div>`);
        break;

      case "ai-lab":
        const lab = document.getElementById("ai-lab");
        if (lab) lab.scrollIntoView({ behavior: "smooth" });
        this.appendLine(`<div class="my-1 text-xs text-cyan-300 font-mono">Navigating to AI Lab...</div>`);
        break;

      default:
        this.appendLine(`<div class="text-rose-400 text-xs my-1">Command not recognized: '${cmdRaw}'. Type <span class="text-cyan-300 font-bold">'help'</span> for inventory.</div>`);
        break;
    }

    this.container.scrollTop = this.container.scrollHeight;
  }

  appendLine(html) {
    const div = document.createElement("div");
    div.innerHTML = html;
    this.container.appendChild(div);
  }
}

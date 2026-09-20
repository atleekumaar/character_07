/**
 * COMMAND PALETTE COMPONENT (Ctrl+K / Cmd+K)
 * Spotlight-style fuzzy search modal for instant navigation and action triggering.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class CommandPalette {
  constructor() {
    this.modal = document.getElementById("command-palette-modal");
    this.input = document.getElementById("command-palette-input");
    this.resultsList = document.getElementById("command-palette-results");
    this.isOpen = false;
    this.selectedIndex = 0;
    this.items = [
      { id: "hero", title: "Home / Overview", category: "Navigation", action: () => this.scrollTo("hero") },
      { id: "about", title: "About Atul Shukla (Education & Bio)", category: "Navigation", action: () => this.scrollTo("about") },
      { id: "skills", title: "Skill Matrix & Knowledge Graph", category: "Navigation", action: () => this.scrollTo("skills") },
      { id: "projects", title: "Project Universe", category: "Navigation", action: () => this.scrollTo("projects") },
      { id: "netra", title: "NETRA AI Flagship Command Center", category: "Flagship", action: () => this.scrollTo("netra-command-center") },
      { id: "ai-lab", title: "Interactive AI Lab (5 Demos)", category: "AI Lab", action: () => this.scrollTo("ai-lab") },
      { id: "playgrounds", title: "Code & FastAPI Playgrounds", category: "Tools", action: () => this.scrollTo("playgrounds") },
      { id: "terminal-sec", title: "Developer Terminal CLI", category: "Tools", action: () => this.scrollTo("terminal-section") },
      { id: "experience", title: "Industry Simulation Timeline", category: "Career", action: () => this.scrollTo("experience") },
      { id: "certifications", title: "Verified Certifications & CIQ L7", category: "Career", action: () => this.scrollTo("certifications") },
      { id: "github-dash", title: "GitHub Intelligence Dashboard", category: "Telemetry", action: () => this.scrollTo("github-dashboard") },
      { id: "resume", title: "Smart Resume Builder & Download", category: "Action", action: () => this.scrollTo("resume") },
      { id: "contact", title: "Contact & Transmission Console", category: "Action", action: () => this.scrollTo("contact") },
      { id: "recruiter", title: "Toggle Recruiter Mode (ATS High-Contrast)", category: "System", action: () => window.dispatchEvent(new CustomEvent("toggle-recruiter-mode")) },
      { id: "hire", title: "Run 'sudo hire-atul' Qualification Check", category: "Easter Egg", action: () => { this.scrollTo("terminal-section"); const term = document.getElementById("terminal-input"); if(term) { term.value = "sudo hire-atul"; const e = new KeyboardEvent("keydown", { key: "Enter" }); term.dispatchEvent(e); } } }
    ];
    this.filteredItems = [...this.items];
    this.init();
  }

  init() {
    if (!this.modal || !this.input) return;

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.toggle();
      } else if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });

    const triggerBtn = document.getElementById("cmd-k-nav-btn");
    if (triggerBtn) {
      triggerBtn.addEventListener("click", () => this.open());
    }

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });

    this.input.addEventListener("input", () => {
      this.filter(this.input.value);
    });

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredItems.length - 1);
        this.renderResults();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.renderResults();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (this.filteredItems[this.selectedIndex]) {
          this.executeItem(this.filteredItems[this.selectedIndex]);
        }
      }
    });
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    sound.playClick();
    this.isOpen = true;
    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
    this.input.value = "";
    this.filter("");
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.isOpen = false;
    this.modal.classList.add("hidden");
    this.modal.classList.remove("flex");
  }

  filter(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      this.filteredItems = [...this.items];
    } else {
      this.filteredItems = this.items.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    this.selectedIndex = 0;
    this.renderResults();
  }

  renderResults() {
    if (!this.resultsList) return;

    if (this.filteredItems.length === 0) {
      this.resultsList.innerHTML = `<div class="p-4 text-center text-xs font-mono text-slate-500">No command matching criteria.</div>`;
      return;
    }

    this.resultsList.innerHTML = this.filteredItems.map((item, idx) => `
      <button class="cmd-result-item w-full text-left p-3 rounded-lg flex items-center justify-between transition-all ${idx === this.selectedIndex ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300' : 'text-slate-300 hover:bg-slate-900/60 border border-transparent'}" data-idx="${idx}">
        <div class="flex items-center gap-3">
          <span class="text-xs font-mono text-cyan-400 font-bold">›</span>
          <span class="text-xs font-medium">${item.title}</span>
        </div>
        <span class="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800">${item.category}</span>
      </button>
    `).join("");

    this.resultsList.querySelectorAll(".cmd-result-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"));
        this.executeItem(this.filteredItems[idx]);
      });
    });
  }

  executeItem(item) {
    sound.playClick();
    this.close();
    if (item && item.action) {
      item.action();
    }
  }

  scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}

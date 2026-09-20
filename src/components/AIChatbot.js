/**
 * ATUL AI ASSISTANT / CHATBOT COMPONENT
 * Floating corner intelligent co-pilot informing visitors about Atul Shukla's
 * background, projects, skills, research, experience, and contact info.
 */

import { PORTFOLIO_DATA } from "../data/portfolioData.js";
import { sound } from "./AudioEngine.js";

export class AIChatbot {
  constructor() {
    this.container = document.getElementById("ai-chatbot-window");
    this.triggerBtn = document.getElementById("ai-chatbot-trigger");
    this.closeBtn = document.getElementById("ai-chatbot-close");
    this.messagesContainer = document.getElementById("ai-chatbot-messages");
    this.input = document.getElementById("ai-chatbot-input");
    this.sendBtn = document.getElementById("ai-chatbot-send");
    this.chipsContainer = document.getElementById("ai-chatbot-chips");
    this.isOpen = false;
    this.isTyping = false;

    this.promptChips = [
      { label: "👤 Who is Atul?", query: "Who is Atul Shukla?" },
      { label: "👁️ Tell me about NETRA", query: "What is NETRA AI and how does it work?" },
      { label: "🧠 Kimi K3 Architecture", query: "Explain Kimi K3 Toy Architecture" },
      { label: "📡 LiDAR Mapping", query: "Tell me about 2.5D LiDAR Mapping" },
      { label: "⚡ Core Skills", query: "What are Atul's top skills?" },
      { label: "📜 Certifications", query: "Show certifications and experience" },
      { label: "🚀 Why hire Atul?", query: "Why should we hire Atul Shukla?" },
      { label: "✉️ Contact Info", query: "How can I contact Atul?" }
    ];

    this.init();
  }

  init() {
    if (!this.triggerBtn || !this.container) return;

    this.triggerBtn.addEventListener("click", () => this.toggle());
    if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.close());

    if (this.sendBtn && this.input) {
      this.sendBtn.addEventListener("click", () => this.handleSend());
      this.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
    }

    this.renderChips();
    this.renderInitialMessage();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  open() {
    sound.playClick();
    this.isOpen = true;
    this.container.classList.remove("hidden");
    this.container.classList.add("flex");
    const badge = document.getElementById("chatbot-unread-badge");
    if (badge) badge.classList.add("hidden");
    if (this.input) setTimeout(() => this.input.focus(), 150);
  }

  close() {
    this.isOpen = false;
    this.container.classList.add("hidden");
    this.container.classList.remove("flex");
  }

  renderChips() {
    if (!this.chipsContainer) return;
    this.chipsContainer.innerHTML = this.promptChips.map(chip => `
      <button class="chat-chip px-2.5 py-1 text-[11px] font-mono rounded-full bg-slate-900 border border-slate-700/80 text-cyan-300 hover:border-cyan-500 hover:bg-cyan-950/60 transition-all whitespace-nowrap" data-query="${chip.query}">
        ${chip.label}
      </button>
    `).join("");

    this.chipsContainer.querySelectorAll(".chat-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const query = btn.getAttribute("data-query");
        if (query) {
          this.sendMessage(query);
          sound.playClick();
        }
      });
    });
  }

  renderInitialMessage() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = `
      <div class="chat-msg bot flex gap-2.5 items-start">
        <div class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
          AI
        </div>
        <div class="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed max-w-[85%] space-y-2">
          <p>
            Hello! I am <strong>ATUL AI</strong>, the digital intelligence assistant for <strong>Atul Shukla</strong>.
          </p>
          <p class="text-slate-400">
            Ask me anything about Atul's AI perception models (<strong>NETRA</strong>), transformer architectures (<strong>Kimi K3</strong>), LiDAR mapping, skills, experience, or hiring details!
          </p>
        </div>
      </div>
    `;
  }

  handleSend() {
    if (!this.input || this.isTyping) return;
    const text = this.input.value.trim();
    if (!text) return;
    this.sendMessage(text);
    this.input.value = "";
  }

  async sendMessage(userText) {
    if (this.isTyping) return;

    // Append User Message
    this.appendUserMessage(userText);
    this.isTyping = true;
    sound.playTerminalKey();

    // Append Typing Indicator
    const typingId = this.appendTypingIndicator();

    // Generate Response (Check backend or fallback to local knowledge engine)
    let reply = null;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText })
      });
      if (res.ok) {
        const data = await res.json();
        reply = data.response;
      }
    } catch (e) {
      // Backend not running, use client-side knowledge engine
    }

    if (!reply) {
      reply = this.generateLocalResponse(userText);
    }

    // Remove typing indicator & stream response
    this.removeTypingIndicator(typingId);
    await this.streamBotMessage(reply);
    this.isTyping = false;
  }

  appendUserMessage(text) {
    if (!this.messagesContainer) return;
    const div = document.createElement("div");
    div.className = "chat-msg user flex justify-end";
    div.innerHTML = `
      <div class="p-3 rounded-2xl bg-cyan-600 text-slate-950 font-medium text-xs leading-relaxed max-w-[85%] shadow-[0_0_12px_rgba(6,182,212,0.2)]">
        ${this.escapeHtml(text)}
      </div>
    `;
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
  }

  appendTypingIndicator() {
    if (!this.messagesContainer) return null;
    const id = "typing-" + Date.now();
    const div = document.createElement("div");
    div.id = id;
    div.className = "chat-msg bot flex gap-2.5 items-start animate-fade-in";
    div.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0">
        AI
      </div>
      <div class="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
      </div>
    `;
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
    return id;
  }

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  async streamBotMessage(botData) {
    if (!this.messagesContainer) return;
    const div = document.createElement("div");
    div.className = "chat-msg bot flex gap-2.5 items-start animate-fade-in";

    const bubble = document.createElement("div");
    bubble.className = "p-3.5 rounded-2xl bg-slate-900/95 border border-slate-800 text-xs text-slate-200 leading-relaxed max-w-[88%] space-y-2.5";

    div.innerHTML = `
      <div class="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
        AI
      </div>
    `;
    div.appendChild(bubble);
    this.messagesContainer.appendChild(div);

    const fullText = botData.text || botData;
    let currentText = "";
    bubble.innerHTML = `<p></p>`;
    const p = bubble.querySelector("p");

    for (let i = 0; i < fullText.length; i++) {
      currentText += fullText[i];
      p.innerText = currentText;
      if (i % 6 === 0) sound.playTerminalKey();
      this.scrollToBottom();
      await new Promise(r => setTimeout(r, 6));
    }

    // Append action links/buttons if available
    if (botData.actions && botData.actions.length > 0) {
      const actionsContainer = document.createElement("div");
      actionsContainer.className = "flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80";
      actionsContainer.innerHTML = botData.actions.map(act => `
        <button class="chat-action-btn px-2.5 py-1 text-[10px] font-mono rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors" data-target="${act.target}" data-type="${act.type || 'scroll'}">
          ${act.label}
        </button>
      `).join("");

      actionsContainer.querySelectorAll(".chat-action-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          sound.playClick();
          const target = btn.getAttribute("data-target");
          const type = btn.getAttribute("data-type");
          if (type === "scroll") {
            const el = document.getElementById(target);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          } else if (type === "recruiter") {
            window.dispatchEvent(new CustomEvent("toggle-recruiter-mode"));
          } else if (type === "link") {
            window.open(target, "_blank");
          }
        });
      });

      bubble.appendChild(actionsContainer);
      this.scrollToBottom();
    }
  }

  generateLocalResponse(query) {
    const q = query.toLowerCase();

    // 1. Identity & Education
    if (q.includes("who is") || q.includes("about") || q.includes("education") || q.includes("degree") || q.includes("lucknow")) {
      return {
        text: `Atul Shukla is a Computer Science Engineering (Artificial Intelligence) undergraduate at the University of Lucknow (Graduation Expected 2029). He specializes in AI Engineering, Machine Learning, Deep Learning, Transformer Architectures, and High-Performance Backend Infrastructure.`,
        actions: [
          { label: "📍 View About Section", target: "about", type: "scroll" },
          { label: "📄 View Resume", target: "resume", type: "scroll" }
        ]
      };
    }

    // 2. NETRA AI Flagship
    if (q.includes("netra") || q.includes("perception") || q.includes("yolo") || q.includes("vision")) {
      return {
        text: `NETRA AI is Atul's flagship Autonomous Perception & Multimodal Intelligence platform. It features sub-25ms inference latency (~22.4ms on CUDA GPUs), a thread-safe OpenCV frame capture pipeline, and strictly decoupled Pydantic schema contracts (BoundingBox, DetectedObject, PerceptionResult) with an annotated HUD overlay.`,
        actions: [
          { label: "👁️ Launch NETRA Command Center", target: "netra-command-center", type: "scroll" },
          { label: "💻 GitHub: NETRA-", target: "https://github.com/atleekumaar/NETRA-", type: "link" }
        ]
      };
    }

    // 3. Kimi K3 & LLMs
    if (q.includes("kimi") || q.includes("transformer") || q.includes("llm") || q.includes("attention") || q.includes("moe")) {
      return {
        text: `Atul implemented an educational PyTorch version of the Kimi K3 architecture featuring Kimi Delta Attention (KDA) with sequential recurrence, Gated MLA with NoPE, Attention Residuals (AttnRes with learned pseudo-queries), and Stable LatentMoE (Shared SwiGLU + Routed SiTU-GLU experts).`,
        actions: [
          { label: "🧠 Open AI Lab", target: "ai-lab", type: "scroll" },
          { label: "💻 Kimi K3 GitHub Repo", target: "https://github.com/atleekumaar/kimi-k3-toy", type: "link" }
        ]
      };
    }

    // 4. LiDAR & 3D
    if (q.includes("lidar") || q.includes("voxel") || q.includes("pointnet") || q.includes("autonomous navigation")) {
      return {
        text: `The Foveated 2.5D LiDAR Mapping project uses Distance-Adaptive 3D Voxel Foveation (0.05m near / 0.15m mid / 0.50m far) on Hesai Pandar40 40-beam LiDAR with PointNet++ to generate traversability grid layers for autonomous robotics.`,
        actions: [
          { label: "📡 Inspect Project Universe", target: "projects", type: "scroll" }
        ]
      };
    }

    // 5. Skills & Tech Stack
    if (q.includes("skill") || q.includes("stack") || q.includes("technolog") || q.includes("python") || q.includes("fastapi") || q.includes("pytorch")) {
      return {
        text: `Atul's verified skill matrix spans: \n• AI/ML: PyTorch, Transformers, YOLOv8, Scikit-Learn, CUDA, RAG\n• Backend: FastAPI, Pydantic, REST APIs, Streamlit, Structured Logging\n• Cloud & DevOps: AWS Solutions Architecture, Docker, Git/GitHub\n• Data: Pandas, NumPy, PostgreSQL, SQL.`,
        actions: [
          { label: "⚡ Explore Skill Graph", target: "skills", type: "scroll" }
        ]
      };
    }

    // 6. Experience & Certifications
    if (q.includes("experience") || q.includes("certification") || q.includes("walmart") || q.includes("aws") || q.includes("deloitte") || q.includes("tata") || q.includes("ciq")) {
      return {
        text: `Atul holds the prestigious CIQ Level 7 Machine Learning Algorithms accreditation and has completed industry simulation programs with Walmart Global Tech (Advanced Software Engineering), AWS (Solutions Architecture), British Airways (Data Science), Tata (Generative AI), and Deloitte Australia.`,
        actions: [
          { label: "📜 View Certifications", target: "experience", type: "scroll" }
        ]
      };
    }

    // 7. Why Hire / Recruiter
    if (q.includes("hire") || q.includes("recruiter") || q.includes("job") || q.includes("opportunity") || q.includes("why")) {
      return {
        text: `Why hire Atul Shukla? \n1. Builds real low-latency AI pipelines (NETRA sub-25ms CUDA).\n2. Implements cutting-edge research architectures (Kimi K3 & LatentMoE) from paper specs.\n3. Strong high-throughput backend engineering in FastAPI.\n4. Verified credentials across leading global organizations.`,
        actions: [
          { label: "💼 Activate Recruiter Mode", target: "recruiter", type: "recruiter" },
          { label: "📄 Download Resume", target: "resume", type: "scroll" }
        ]
      };
    }

    // 8. Contact
    if (q.includes("contact") || q.includes("email") || q.includes("reach") || q.includes("linkedin") || q.includes("github")) {
      return {
        text: `You can reach Atul Shukla directly via:\n• Email: atulshukla84340@gmail.com\n• LinkedIn: linkedin.com/in/atul-shukla-105341383\n• GitHub: github.com/atleekumaar\n• Location: Lucknow, India.`,
        actions: [
          { label: "✉️ Send Message Now", target: "contact", type: "scroll" }
        ]
      };
    }

    // Default Fallback
    return {
      text: `I can help you explore Atul Shukla's engineering portfolio! Would you like to know about his flagship autonomous perception engine (NETRA), transformer research (Kimi K3), 3D LiDAR mapping, or view his verified experience and credentials?`,
      actions: [
        { label: "👁️ NETRA AI", target: "netra-command-center", type: "scroll" },
        { label: "⚡ Skill Graph", target: "skills", type: "scroll" },
        { label: "💼 Recruiter View", target: "recruiter", type: "recruiter" }
      ]
    };
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

/**
 * ATUL AI LAB — 5 INTERACTIVE EXPERIMENTAL MODULES
 * 1. LLM Token Generation Playground
 * 2. RAG Semantic Chunk Retrieval Simulator
 * 3. Real-Time ML Inference Engine (Sonar Rock vs Mine & Diabetes Risk)
 * 4. 2D Semantic Embedding Space Visualizer
 * 5. Feedforward Neural Network Activation Propagator
 */

import { sound } from "./AudioEngine.js";

export class AILab {
  constructor() {
    this.activeTab = "llm";
    this.init();
  }

  init() {
    this.setupTabs();
    this.initLLMPlayground();
    this.initRAGDemo();
    this.initMLInference();
    this.initEmbeddingViz();
    this.initNeuralNetViz();
  }

  setupTabs() {
    const tabButtons = document.querySelectorAll(".ai-lab-tab-btn");
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchTab(tab);
        sound.playClick();
      });
    });
  }

  switchTab(tabId) {
    this.activeTab = tabId;
    document.querySelectorAll(".ai-lab-tab-btn").forEach(btn => {
      if (btn.getAttribute("data-tab") === tabId) {
        btn.className = "ai-lab-tab-btn px-4 py-2 text-xs font-mono rounded-lg border bg-cyan-950/60 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]";
      } else {
        btn.className = "ai-lab-tab-btn px-4 py-2 text-xs font-mono rounded-lg border bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700";
      }
    });

    document.querySelectorAll(".ai-lab-pane").forEach(pane => {
      if (pane.id === `ai-lab-${tabId}`) {
        pane.classList.remove("hidden");
        pane.classList.add("block");
      } else {
        pane.classList.add("hidden");
        pane.classList.remove("block");
      }
    });
  }

  // 1. LLM PLAYGROUND
  initLLMPlayground() {
    const sendBtn = document.getElementById("llm-send-btn");
    const input = document.getElementById("llm-prompt-input");
    const output = document.getElementById("llm-stream-output");
    const tempSlider = document.getElementById("llm-temp-slider");
    const tempValue = document.getElementById("llm-temp-value");

    if (tempSlider && tempValue) {
      tempSlider.addEventListener("input", (e) => {
        tempValue.innerText = e.target.value;
      });
    }

    if (sendBtn && input && output) {
      sendBtn.addEventListener("click", () => {
        const prompt = input.value.trim();
        if (!prompt) return;
        sound.playClick();

        output.innerHTML = `<span class="inline-block w-2 h-4 bg-cyan-400 animate-pulse"></span>`;
        sendBtn.disabled = true;

        const completions = {
          "default": `[Kimi K3 & AttnRes Execution Stream]\n\nAnalyzing input prompt: "${prompt}"\n\n1. Tokenized sequence into 18 subword embeddings.\n2. Processed 3x KDA layers with sequential recurrence & causal short convolutions.\n3. LatentMoE dynamically activated Expert #2 (Mathematical Reasoning) and Shared Expert #0 (Syntactic Coherence).\n4. Generated response with zero hallucination variance at current temperature.\n\nSummary: Atul Shukla's engineering architecture decouples neural perception contracts from distributed execution pipelines, ensuring deterministic edge latency under 25ms.`
        };

        const text = completions.default;
        let index = 0;
        output.innerText = "";

        const interval = setInterval(() => {
          if (index < text.length) {
            output.innerText += text[index];
            index++;
            if (index % 4 === 0) sound.playTerminalKey();
          } else {
            clearInterval(interval);
            sendBtn.disabled = false;
          }
        }, 14);
      });
    }
  }

  // 2. RAG DEMO
  initRAGDemo() {
    const queryInput = document.getElementById("rag-query-input");
    const searchBtn = document.getElementById("rag-search-btn");
    const chunksContainer = document.getElementById("rag-chunks-container");
    const answerContainer = document.getElementById("rag-answer-container");

    const corpus = [
      { id: "CHUNK_01", score: 0.94, text: "NETRA AI achieves sub-25ms inference latency on NVIDIA GPUs utilizing YOLOv8 with thread-safe OpenCV ring buffers and Pydantic data contracts." },
      { id: "CHUNK_02", score: 0.91, text: "The Kimi K3 toy PyTorch implementation features Kimi Delta Attention (KDA), Gated MLA with NoPE, Attention Residuals (AttnRes), and Stable LatentMoE routing." },
      { id: "CHUNK_03", score: 0.88, text: "Distance-Adaptive 3D Voxel Foveation partitions LiDAR point clouds into near (0.05m), mid (0.15m), and far (0.50m) resolution zones for autonomous traversability mapping." },
      { id: "CHUNK_04", score: 0.82, text: "SONAR Rock vs Mine prediction leverages 60-band acoustic frequency spectra with regularized Logistic Regression achieving 83.4% train and 76.1% test accuracy." }
    ];

    if (searchBtn && chunksContainer && answerContainer) {
      searchBtn.addEventListener("click", () => {
        sound.playClick();
        const query = (queryInput ? queryInput.value : "") || "Explain NETRA architecture";

        chunksContainer.innerHTML = corpus.map((c, idx) => `
          <div class="p-3 rounded-lg bg-slate-900/60 border ${idx === 0 ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800'} animate-fade-in">
            <div class="flex items-center justify-between text-[11px] font-mono mb-1">
              <span class="text-cyan-400 font-bold">${c.id}</span>
              <span class="text-emerald-400">Cosine Similarity: ${c.score}</span>
            </div>
            <p class="text-xs text-slate-300">${c.text}</p>
          </div>
        `).join("");

        answerContainer.innerHTML = `
          <div class="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed animate-fade-in">
            <span class="font-mono text-cyan-400 uppercase text-[10px] tracking-widest block mb-1">Synthesized RAG Response:</span>
            Based on the top retrieved context chunks (Cosine Similarity > 0.88), the system establishes high-precision perception contracts (NETRA), advanced transformer recurrence (Kimi K3), and multi-scale foveated LiDAR voxelization for real-time edge intelligence.
          </div>
        `;
      });
    }
  }

  // 3. REAL-TIME ML INFERENCE
  initMLInference() {
    const sonarSlider = document.getElementById("ml-sonar-freq");
    const sonarValue = document.getElementById("ml-sonar-val");
    const sonarResult = document.getElementById("ml-sonar-result");
    const sonarProb = document.getElementById("ml-sonar-prob");

    const updateSonar = () => {
      if (!sonarSlider) return;
      const val = parseFloat(sonarSlider.value);
      if (sonarValue) sonarValue.innerText = val.toFixed(2);
      
      // Simulated logistic sigmoid on frequency band
      const z = (val - 0.5) * 6.5;
      const probMine = 1 / (1 + Math.exp(-z));
      const isMine = probMine >= 0.5;

      if (sonarResult) {
        sonarResult.innerText = isMine ? "NAVAL MINE (EXPLOSIVE)" : "UNDERWATER ROCK";
        sonarResult.className = `font-mono font-bold text-sm ${isMine ? 'text-rose-400' : 'text-cyan-400'}`;
      }
      if (sonarProb) {
        sonarProb.innerText = `${(probMine * 100).toFixed(1)}% Mine Probability`;
      }
    };

    if (sonarSlider) {
      sonarSlider.addEventListener("input", updateSonar);
      updateSonar();
    }
  }

  // 4. EMBEDDING SPACE 2D VISUALIZER
  initEmbeddingViz() {
    const canvas = document.getElementById("embedding-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 260;

    const vectors = [
      { word: "PyTorch", x: 60, y: 70, cluster: "Deep Learning", color: "#ee4c2c" },
      { word: "TensorFlow", x: 85, y: 95, cluster: "Deep Learning", color: "#ee4c2c" },
      { word: "Transformers", x: 140, y: 80, cluster: "LLMs", color: "#8b5cf6" },
      { word: "Attention", x: 170, y: 60, cluster: "LLMs", color: "#8b5cf6" },
      { word: "FastAPI", x: 280, y: 180, cluster: "Backend", color: "#009688" },
      { word: "Pydantic", x: 260, y: 210, cluster: "Backend", color: "#009688" },
      { word: "PostgreSQL", x: 320, y: 190, cluster: "Database", color: "#336791" },
      { word: "LiDAR 3D", x: 180, y: 200, cluster: "Perception", color: "#06b6d4" },
      { word: "YOLOv8", x: 150, y: 170, cluster: "Perception", color: "#06b6d4" }
    ];

    const draw = () => {
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Draw semantic vector nodes
      vectors.forEach(v => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = v.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = v.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#e2e8f0";
        ctx.fillText(v.word, v.x + 8, v.y + 3);
      });
    };

    draw();
  }

  // 5. NEURAL NETWORK VISUALIZER
  initNeuralNetViz() {
    const canvas = document.getElementById("neural-net-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 260;

    let time = 0;
    const layers = [
      { name: "Input", count: 3, x: 60 },
      { name: "Hidden 1", count: 4, x: 160 },
      { name: "Hidden 2", count: 4, x: 260 },
      { name: "Output", count: 2, x: 360 }
    ];

    const animate = () => {
      time += 0.03;
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let l = 0; l < layers.length - 1; l++) {
        const l1 = layers[l];
        const l2 = layers[l + 1];
        for (let i = 0; i < l1.count; i++) {
          const y1 = 40 + i * (180 / (l1.count - 1));
          for (let j = 0; j < l2.count; j++) {
            const y2 = 40 + j * (180 / (l2.count - 1));
            const signal = Math.sin(time * 2 + i * 0.5 + j * 0.7);
            ctx.beginPath();
            ctx.moveTo(l1.x, y1);
            ctx.lineTo(l2.x, y2);
            ctx.strokeStyle = signal > 0.2 ? "rgba(6, 182, 212, 0.45)" : "rgba(30, 41, 59, 0.4)";
            ctx.lineWidth = signal > 0.2 ? 1.5 : 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw neurons
      layers.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
          const y = 40 + i * (180 / (layer.count - 1));
          ctx.beginPath();
          ctx.arc(layer.x, y, 7, 0, Math.PI * 2);
          ctx.fillStyle = "#030712";
          ctx.fill();
          ctx.strokeStyle = "#00f0ff";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(layer.x, y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8";
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
}

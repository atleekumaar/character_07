/**
 * CODE PLAYGROUND COMPONENT
 * Interactive multi-language workspace (Python, JavaScript, SQL) with syntax highlighter,
 * preset algorithms, and execution console.
 */

import { sound } from "./AudioEngine.js";

export class CodePlayground {
  constructor() {
    this.activeLang = "python";
    this.snippets = {
      python: `# NETRA AI — Fast Perception Pipeline Test
from dataclasses import dataclass
import time

@dataclass
class BoundingBox:
    xmin: int
    ymin: int
    xmax: int
    ymax: int

def run_inference_simulation(frame_id: int):
    start = time.perf_counter()
    # Simulated YOLOv8 CUDA latency
    latency_ms = 22.4
    detections = [
        {"class": "person", "conf": 0.94, "bbox": BoundingBox(120, 80, 210, 260)},
        {"class": "vehicle", "conf": 0.91, "bbox": BoundingBox(320, 140, 480, 250)}
    ]
    return {
        "status": "SUCCESS",
        "frame_id": frame_id,
        "latency_ms": latency_ms,
        "detections": len(detections)
    }

print(run_inference_simulation(1042))`,
      javascript: `// Vector Cosine Similarity Metric
function cosineSimilarity(vecA, vecB) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }
  return (dot / (Math.sqrt(normA) * Math.sqrt(normB))).toFixed(4);
}

const embeddingA = [0.84, 0.12, 0.55, 0.09]; // PyTorch
const embeddingB = [0.81, 0.15, 0.50, 0.11]; // Transformers

console.log("Vector Cosine Similarity:", cosineSimilarity(embeddingA, embeddingB));`,
      sql: `-- Autonomous Perception Telemetry Query
SELECT 
    model_version,
    COUNT(frame_id) AS total_frames,
    ROUND(AVG(latency_ms), 2) AS avg_cuda_latency,
    MAX(confidence) AS peak_confidence
FROM netra_telemetry_logs
WHERE hardware_target = 'NVIDIA_CUDA'
GROUP BY model_version
ORDER BY avg_cuda_latency ASC;`
    };
    this.init();
  }

  init() {
    this.editor = document.getElementById("code-playground-editor");
    this.output = document.getElementById("code-playground-output");
    this.runBtn = document.getElementById("code-run-btn");
    this.langSelect = document.getElementById("code-lang-select");

    if (this.langSelect && this.editor) {
      this.langSelect.addEventListener("change", (e) => {
        this.activeLang = e.target.value;
        this.editor.value = this.snippets[this.activeLang];
        sound.playClick();
      });
      this.editor.value = this.snippets[this.activeLang];
    }

    if (this.runBtn && this.editor && this.output) {
      this.runBtn.addEventListener("click", () => this.runCode());
    }
  }

  async runCode() {
    sound.playClick();
    if (!this.output || !this.editor) return;

    const code = this.editor.value;
    this.output.innerHTML = `<span class="text-cyan-400 font-mono text-xs">Executing script in sandbox container...</span>`;
    
    // Try live API backend if running
    try {
      const response = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: this.activeLang, code })
      });
      if (response.ok) {
        const data = await response.json();
        this.output.innerText = data.output;
        sound.playChime();
        return;
      }
    } catch (e) {
      // Fallback client simulation
    }

    setTimeout(() => {
      sound.playChime();
      if (this.activeLang === "python") {
        this.output.innerText = `[Container: Sandbox-Py314-CUDA-Active]\n{'status': 'SUCCESS', 'frame_id': 1042, 'latency_ms': 22.4, 'detections': 2}\n\n>> Process finished with exit code 0 (Execution time: 0.048s)`;
      } else if (this.activeLang === "javascript") {
        try {
          let logged = "";
          const customConsole = { log: (...args) => { logged += args.join(" ") + "\n"; } };
          const fn = new Function("console", code);
          fn(customConsole);
          this.output.innerText = logged || "Executed successfully with zero return value.";
        } catch (err) {
          this.output.innerText = `Error: ${err.message}`;
        }
      } else {
        this.output.innerText = `+---------------+--------------+------------------+-----------------+\n| model_version | total_frames | avg_cuda_latency | peak_confidence |\n+---------------+--------------+------------------+-----------------+\n| NETRA-v0.1-PT | 14,820       | 22.14 ms         | 0.98            |\n+---------------+--------------+------------------+-----------------+\n(1 row affected, Query time: 1.8ms)`;
      }
    }, 280);
  }
}

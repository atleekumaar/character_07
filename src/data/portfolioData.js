/**
 * ATLEE // CHARACTER-07 — PORTFOLIO OS DATA CONFIGURATION LAYER
 * Central single source of truth for all verified content, missions, capabilities,
 * evolution logs, reasoning philosophy, certifications, and telemetry.
 */

export const PORTFOLIO_DATA = {
  character: {
    id: "CHARACTER-07",
    codeName: "ATLEE // 07",
    name: "ATLEE KUMAAR",
    realName: "Atul Shukla",
    title: "AI Engineer • Builder • Researcher",
    tagline: "A human engineer building intelligent systems in a world increasingly shaped by machines.",
    status: "ACTIVE // DEPLOYED",
    corePhilosophy: "BUILD. TEST. UNDERSTAND. ITERATE. SHIP. REPEAT.",
    location: "Lucknow, Uttar Pradesh, India",
    email: "atulshukla84340@gmail.com",
    githubUrl: "https://github.com/atleekumaar",
    githubHandle: "atleekumaar",
    linkedinUrl: "https://www.linkedin.com/in/atul-shukla-105341383",
    education: {
      degree: "B.Tech in Computer Science Engineering (Artificial Intelligence)",
      institution: "University of Lucknow",
      graduationYear: "Expected 2029",
      specialization: "Artificial Intelligence, Deep Learning & Autonomous Perception"
    },
    narrative: `Undergraduate engineer at the University of Lucknow dedicated to the mathematical and physical reality of artificial intelligence. Rather than relying on superficial abstractions, my work focuses on building deterministic, low-latency perception frameworks (NETRA), researching transformer attention dynamics and Mixture-of-Experts routing (Kimi K3), distance-adaptive 3D voxel foveation for autonomous LiDAR navigation, and high-throughput asynchronous backend systems.`,
    objectives: [
      "Architect sub-25ms autonomous edge perception systems bridging hardware sensors with downstream planners.",
      "Explore non-standard transformer architectures, sequential recurrence (KDA), and sparse LatentMoE routing.",
      "Design zero-leakage, reproducible machine learning and signal processing pipelines with verifiable metrics.",
      "Bridge cutting-edge deep learning research with production-grade backend infrastructure."
    ]
  },

  rolesTicker: [
    "AI Systems Engineer",
    "Autonomous Perception Developer",
    "Deep Learning Researcher",
    "Transformer & LLM Architect",
    "Backend Microservices Engineer",
    "3D Spatial Intelligence Developer"
  ],

  capabilityMatrix: [
    {
      category: "INTELLIGENCE",
      subtitle: "Neural Modeling & Deep Learning",
      description: "Custom tensor operations, transformer attention layers, loss formulations, and statistical inference.",
      state: "PRIMARY SPECIALIZATION",
      levelBar: 92,
      skills: [
        { name: "PyTorch", context: "Custom layers, backward passes, loss convergence" },
        { name: "Transformers & LLMs", context: "KDA recurrence, Gated MLA, AttnRes, LatentMoE" },
        { name: "RAG Architectures", context: "Vector DBs, embedding similarity & context retrieval" },
        { name: "Scikit-Learn", context: "Statistical classifiers, SVM, regularized regression" },
        { name: "TensorFlow & Keras", context: "Deep convolutional & sequential models" }
      ]
    },
    {
      category: "PERCEPTION & VISION",
      subtitle: "Spatial Intelligence & Edge AI",
      description: "Real-time video ingestion pipelines, CUDA acceleration, and 3D point cloud segmentation.",
      state: "PRIMARY SPECIALIZATION",
      levelBar: 94,
      skills: [
        { name: "YOLOv8 & CUDA", context: "Sub-25ms hardware-accelerated edge inference (~22.4ms)" },
        { name: "3D LiDAR Segmentation", context: "PointNet++ & Distance-Adaptive Voxel Foveation" },
        { name: "OpenCV & RTSP", context: "Thread-safe camera ring buffers & frame ingestion" },
        { name: "Pydantic Contracts", context: "Decoupled perception payloads & downstream contracts" }
      ]
    },
    {
      category: "SYSTEMS & BACKEND",
      subtitle: "High-Throughput Services",
      description: "Asynchronous APIs, relational schemas, type-safe serialization, and structured observability.",
      state: "OPERATIONAL CORE",
      levelBar: 90,
      skills: [
        { name: "FastAPI", context: "High-throughput asynchronous REST APIs & WebSockets" },
        { name: "Python 3.10+", context: "Core language mastery, dataclasses, async concurrency" },
        { name: "PostgreSQL & SQL", context: "Normalized relational schemas & query optimization" },
        { name: "Streamlit", context: "Interactive ML diagnostic applications & deployment" },
        { name: "Production Logging", context: "Structured rotating JSON telemetry with zero bloat" }
      ]
    },
    {
      category: "INFRASTRUCTURE & CLOUD",
      subtitle: "Cloud & Distributed Environments",
      description: "Cloud architecture, containerization, GPU compute environments, and CI/CD.",
      state: "VERIFIED CAPABILITY",
      levelBar: 86,
      skills: [
        { name: "AWS Solutions Architecture", context: "EC2, S3, VPC networking, serverless Lambda" },
        { name: "Docker", context: "Containerization, multi-stage builds & environment isolation" },
        { name: "Git & GitHub", context: "Version control, automated pipelines & collaboration" },
        { name: "Vector Databases", context: "FAISS, Chroma, high-dimensional cosine search" }
      ]
    }
  ],

  missions: [
    {
      id: "MISSION-01",
      slug: "netra",
      title: "NETRA AI",
      tagline: "Autonomous Perception & Multimodal Spatial Intelligence Platform",
      category: "Robotics & Computer Vision",
      badge: "FLAGSHIP MISSION • v0.1 PERCEPTION ENGINE",
      tags: ["Python", "YOLOv8", "CUDA", "FastAPI", "Pydantic", "OpenCV", "Edge AI"],
      githubUrl: "https://github.com/atleekumaar/NETRA-",
      liveUrl: null,
      stars: 2,
      problem: "Autonomous edge systems require deterministic sub-25ms object perception without coupling low-level camera drivers directly to high-level path planners.",
      approach: "Engineered a modular, thread-safe perception platform with automatic hardware acceleration detection (CUDA with CPU fallback), sub-25ms YOLOv8 inference, strictly enforced Pydantic schema contracts (BoundingBox, DetectedObject, PerceptionResult), and a real-time HUD telemetry overlay.",
      architecture: "Camera Ingestion (Thread-Safe Ring Buffer) → Tensor Normalization (GPU Preprocessing) → CUDA YOLOv8 Inference → Pydantic Schema Contracts → Live HUD & Downstream JSON Stream.",
      metrics: {
        latency: "~22.4 ms/frame (CUDA GPU)",
        framerate: "45+ FPS real-time",
        contracts: "100% Type-Safe Pydantic v2",
        detection: "80+ COCO / Custom Objects"
      },
      sourceSnippet: `class PerceptionResult(BaseModel):
    frame_id: int
    timestamp: float
    latency_ms: float
    objects: list[DetectedObject] = []
    metadata: dict[str, Any] = Field(default_factory=dict)`
    },
    {
      id: "MISSION-02",
      slug: "foveated_lidar",
      title: "Foveated 2.5D LiDAR Mapping",
      tagline: "Distance-Adaptive 3D Voxel Foveation & Semantic Segmentation",
      category: "Autonomous Navigation & 3D Deep Learning",
      badge: "SPATIAL INTELLIGENCE RESEARCH",
      tags: ["Python", "PyTorch", "PointNet++", "Hesai Pandar40", "3D Voxelization", "GridMap25D"],
      githubUrl: "https://github.com/atleekumaar",
      liveUrl: null,
      stars: 5,
      problem: "Processing full-resolution 3D point clouds at 100m range in real-time creates severe compute bottlenecks on autonomous edge compute units.",
      approach: "Designed a Distance-Adaptive Voxel Foveation pipeline (0.05m near-field, 0.15m mid-field, 0.50m far-field) with a 4-Super-Class semantic segmentation model (Drivable, Non-Drivable, Static Obstacle, Dynamic Object) feeding directly into GridMap25D traversability layers.",
      architecture: "Pandar40 40-Beam Ingestion (10Hz) → Distance-Adaptive Voxel Downsampling → PointNet++ Segmentation → Super-Class Aggregation → GridMap25D Traversability Layers.",
      metrics: {
        range: "100m Range Filtering",
        foveation: "3 Distance Resolution Zones",
        rate: "10 Hz Real-Time Rate",
        classes: "4 Super-Classes + Ignore"
      }
    },
    {
      id: "MISSION-03",
      slug: "kimi_k3_toy",
      title: "Kimi K3 Toy Architecture",
      tagline: "PyTorch Implementation of KDA, Gated MLA, AttnRes & Stable LatentMoE",
      category: "LLMs & Transformers",
      badge: "TRANSFORMER RECURRENCE RESEARCH",
      tags: ["PyTorch", "Transformers", "KDA", "Gated MLA", "AttnRes", "LatentMoE", "Deep Learning"],
      githubUrl: "https://github.com/atleekumaar/kimi-k3-toy",
      liveUrl: "https://drive.google.com/file/d/10SHEqhzBe_iG3NYlifsqvlF-8wjuUG51/view?usp=sharing",
      stars: 3,
      problem: "Studying next-generation transformer architectures featuring sequential recurrence and latent Mixture-of-Experts (MoE) is hindered by massive codebase bloat.",
      approach: "Built a minimal, educational PyTorch implementation of the cutting-edge Kimi K3 architecture featuring Kimi Delta Attention (KDA) with causal convolutions, Gated Multi-Head Latent Attention with NoPE, Attention Residuals (AttnRes with learned pseudo-queries), and Stable LatentMoE with shared and routed experts.",
      architecture: "Input Tokens → AttnRes Residual Stack → 3:1 Sub-Block Layout (3x KDA + 1x Gated MLA) → Stable LatentMoE (Shared SwiGLU + Routed SiTU-GLU) → RMSNorm & LM Head.",
      metrics: {
        architecture: "KDA + Gated MLA + LatentMoE",
        convergence: "300 Steps Periodic Loss Convergence",
        experts: "Shared + Routed Expert Routing",
        execution: "Lightweight CPU & Colab Verified"
      }
    },
    {
      id: "MISSION-04",
      slug: "sonar_rock_vs_mine",
      title: "SONAR Signal Acoustic Classifier",
      tagline: "60-Band Frequency Classification Pipeline with Streamlit Deployment",
      category: "Machine Learning & Signal Processing",
      badge: "PRODUCTION ML DEPLOYMENT",
      tags: ["Python", "Scikit-Learn", "Logistic Regression", "Pandas", "Streamlit", "NumPy"],
      githubUrl: "https://github.com/atleekumaar/rock-vs-mine-prediction",
      liveUrl: "https://blank-app-faabjyd1lpg.streamlit.app/",
      stars: 8,
      problem: "Distinguishing underwater seabed rocks from explosive naval mines using 60 continuous frequency return bands under noisy acoustic conditions.",
      approach: "Engineered an end-to-end binary classification pipeline using regularized Logistic Regression with frequency spectrum standardization, deployed to an interactive dark-themed Streamlit application.",
      architecture: "60-Band Acoustic Spectral Array → StandardScaler Normalization → Logistic Regression Boundary → Calibrated Decision Estimator → Streamlit UI.",
      metrics: {
        trainAccuracy: "83.4% Training Accuracy",
        testAccuracy: "76.1% Test Accuracy",
        features: "60 Continuous Frequency Bands",
        deployment: "Live on Streamlit Cloud"
      }
    },
    {
      id: "MISSION-05",
      slug: "diabetes_risk_predictor",
      title: "Biomedical Health Risk Predictor",
      tagline: "Support Vector Machine (SVM) Diagnostic Classifier with Dark Theme UI",
      category: "Healthcare AI & Analytics",
      badge: "DIAGNOSTIC ML PIPELINE",
      tags: ["Python", "Scikit-Learn", "SVM", "StandardScaler", "Streamlit", "Joblib"],
      githubUrl: "https://github.com/atleekumaar/diabetes-prediction-app",
      liveUrl: "https://diabetes-prediction-app-1256.streamlit.app/",
      stars: 3,
      problem: "Early detection of metabolic risks through non-linear clinical diagnostic variables without data leakage during preprocessing.",
      approach: "Trained an SVM classifier with strict StandardScaler feature standardization, patient biometric parameter dials, and instant risk diagnostic telemetry.",
      architecture: "8 Diagnostic Biomedical Parameters → StandardScaler Normalization → Non-linear SVM Kernel → Risk Decision Probability → Interactive Diagnostic App.",
      metrics: {
        accuracy: "~77.3% Test Accuracy",
        scaling: "Zero-Leakage Feature Scaling",
        model: "Support Vector Classifier",
        deployment: "Live Diagnostic Web Application"
      }
    },
    {
      id: "MISSION-06",
      slug: "brain_tumor_classifier",
      title: "Brain Tumor MRI Neuroimaging Classifier",
      tagline: "Convolutional Neural Network for Medical Scan Categorization",
      category: "Computer Vision & Medical Imaging",
      badge: "COMPUTER VISION MODEL",
      tags: ["Python", "PyTorch", "OpenCV", "CNN", "Medical Imaging", "Deep Learning"],
      githubUrl: "https://github.com/atleekumaar/brain-tumor-mri-classifier",
      liveUrl: null,
      stars: 3,
      problem: "Automating the detection of structural anomalies in neuroimaging scans to support early medical triage.",
      approach: "Constructed a deep convolutional neural network pipeline with adaptive histogram equalization, intensity normalization, and multi-class anomaly categorization.",
      architecture: "MRI T1/T2 Scan Ingestion → Histogram Equalization → Deep CNN Feature Extraction → Dense Softmax Classification.",
      metrics: {
        modality: "T1/T2 Weighted MRI",
        preprocessing: "Adaptive Histogram Equalization",
        framework: "PyTorch & OpenCV"
      }
    },
    {
      id: "MISSION-07",
      slug: "house_price_estimator",
      title: "Real Estate Valuation Regression Engine",
      tagline: "Multivariate Regression Pipeline for Real Estate Price Forecasting",
      category: "Data Science & Predictive Modeling",
      badge: "STATISTICAL MODELING",
      tags: ["Python", "Scikit-Learn", "Pandas", "Matplotlib", "Random Forest", "EDA"],
      githubUrl: "https://github.com/atleekumaar/house-price-estimator",
      liveUrl: null,
      stars: 2,
      problem: "Forecasting property valuations across non-linear spatial and structural feature interactions.",
      approach: "Engineered an end-to-end regression pipeline combining exploratory data analysis, collinearity mitigation, and ensemble tree modeling.",
      architecture: "Multivariate Housing Data → Outlier Filtering → Feature Scaling → Random Forest Regressor → Valuation Output.",
      metrics: {
        metric: "Optimized RMSE & R² Score",
        features: "Multivariate Spatial Features"
      }
    },
    {
      id: "MISSION-08",
      slug: "app_logging_framework",
      title: "Production Observability Framework",
      tagline: "Structured Rotating Logger with Contextual Stack Traces & JSON Serialization",
      category: "Backend & Systems",
      badge: "CORE BACKEND UTILITY",
      tags: ["Python", "Logging", "DevOps", "Backend", "Observability", "JSON Logs"],
      githubUrl: "https://github.com/atleekumaar/basic-application-logging-functions",
      liveUrl: null,
      stars: 3,
      problem: "AI microservices require unified structured logging without introducing heavy external runtime overhead.",
      approach: "Authored a zero-dependency, thread-safe Python logging module supporting timed/sized rotation and structured JSON output for AI pipelines.",
      architecture: "Application Events → Handler Filters → TimedRotatingFileHandler → Structured JSON Telemetry.",
      metrics: {
        overhead: "<0.1ms per log event",
        formats: "Console + Rotating JSON Files"
      }
    }
  ],

  reasoningPhilosophy: {
    title: "HOW THE CHARACTER THINKS",
    mantra: ["BUILD.", "TEST.", "UNDERSTAND.", "ITERATE.", "SHIP.", "REPEAT."],
    principles: [
      {
        heading: "Deterministic Latency Over Abstraction Bloat",
        text: "In edge perception and robotics, predictable 22ms latency on CUDA hardware outweighs deep layers of wrapper abstractions. Optimize the critical path first."
      },
      {
        heading: "Decouple Perception From Downstream Decision",
        text: "Sensor ingestion, neural inference, and planning layers must communicate strictly through typed schema contracts (Pydantic). Decoupling enables modular testing and fearless iteration."
      },
      {
        heading: "Implement from Papers to Master the Math",
        text: "Building architectures like Kimi K3, AttnRes, and PointNet++ from research specifications solidifies deep intuition about attention weights, gradients, and loss surfaces."
      },
      {
        heading: "Verifiable Data Over Synthetic Claims",
        text: "Every benchmark, accuracy percentage, and test metric must derive from reproducible code, standardized feature scaling, and genuine model training."
      }
    ]
  },

  evolutionLog: [
    {
      phase: "01",
      title: "Foundations & Mathematical Core",
      period: "2024",
      description: "Commenced B.Tech in CSE (Artificial Intelligence) at the University of Lucknow. Built rigorous foundations in discrete mathematics, algorithmic complexity, linear algebra, and advanced Python."
    },
    {
      phase: "02",
      title: "Machine Learning, Signal Processing & Industry Simulations",
      period: "2025",
      description: "Achieved the CIQ Level 7 Machine Learning Algorithms accreditation. Engineered the SONAR 60-band classifier and Diabetes SVM. Completed industry simulations with Walmart Global Tech, AWS, British Airways, Tata, and Deloitte Australia."
    },
    {
      phase: "03",
      title: "Autonomous Perception & Transformer Research",
      period: "2026",
      description: "Architected the NETRA AI autonomous perception engine with YOLOv8 & CUDA. Built the Kimi K3 PyTorch toy architecture (KDA, Gated MLA, LatentMoE) and Distance-Adaptive 2.5D LiDAR Foveation pipeline."
    },
    {
      phase: "04",
      title: "Research & Systems Internships",
      period: "2027",
      description: "Targeting engineering and research roles in autonomous systems, distributed LLM infrastructure, and robotics labs."
    },
    {
      phase: "05",
      title: "Full-Scale Autonomous AI Deployment",
      period: "2029",
      description: "Leading end-to-end autonomous perception, robotics, and distributed AI engineering initiatives upon graduation."
    }
  ],

  currentState: {
    building: "NETRA v0.2 Multi-Object Tracking & 3D Spatial Fusion",
    exploring: "Flash Attention-3, Triton GPU Kernels & FP8 KV Cache Quantization",
    research: "PointNet++ Distance-Conditioned Voxel Foveation for LiDAR",
    systemsStatus: "ONLINE // AVAILABLE FOR HIRE",
    lastTelemetryCheck: "2026-09-20T15:15:00Z"
  },

  experience: [
    {
      organization: "Walmart Global Tech",
      role: "Advanced Software Engineering Program",
      badge: "Industry Simulation • 2025",
      period: "2025",
      skills: ["Data Structures", "System Design", "Relational Database Design", "Software Architecture"],
      description: "Tackled software engineering challenges designed by Walmart engineering teams. Modeled scalable relational database schemas and optimized core data structures for high-volume inventory systems."
    },
    {
      organization: "Amazon Web Services (AWS)",
      role: "Solutions Architecture Program",
      badge: "Cloud Architecture • 2025",
      period: "2025",
      skills: ["Cloud Architecture", "AWS EC2", "S3 Storage", "VPC Security", "Serverless Lambda"],
      description: "Architected resilient cloud systems using AWS Well-Architected Framework principles. Formulated migration roadmaps, decoupled services with SQS/SNS, and configured secure VPC networking."
    },
    {
      organization: "British Airways",
      role: "Data Science & Predictive Analytics Program",
      badge: "Predictive Analytics • 2025",
      period: "2025",
      skills: ["Predictive Modeling", "NLP Sentiment", "Feature Engineering", "Python/Pandas"],
      description: "Conducted predictive flight booking conversion analysis. Analyzed customer sentiment datasets and trained classification models to forecast booking conversion patterns."
    },
    {
      organization: "Tata",
      role: "Generative AI Powered Data Analytics Program",
      badge: "GenAI & LLM Analytics • 2025",
      period: "2025",
      skills: ["Generative AI", "LLMs", "Prompt Engineering", "Executive Analytics"],
      description: "Applied generative AI workflows and prompt engineering frameworks to accelerate business analytics, automated EDA, and executive intelligence reporting."
    },
    {
      organization: "Deloitte Australia",
      role: "Data Analytics, Technology & Cybersecurity Program",
      badge: "Analytics & Cyber • 2025",
      period: "2025",
      skills: ["Data Analytics", "Forensics", "Cybersecurity Governance", "Risk Assessment"],
      description: "Executed forensic data investigations on corporate telemetry and translated technical risk metrics into actionable decision dashboards."
    }
  ],

  certifications: [
    {
      id: "ciq_l7_ml",
      title: "CIQ Level 7 — Machine Learning Algorithms",
      issuer: "CIQ Qualifications",
      badge: "LEVEL 7 ACCREDITATION",
      description: "Post-graduate level qualification assessing mathematical formulation, loss surfaces, neural dynamics, and optimization theory."
    },
    {
      id: "walmart_se",
      title: "Advanced Software Engineering",
      issuer: "Walmart Global Tech (Forage)",
      badge: "VERIFIED CREDENTIAL",
      description: "Data structures, database normalization, and distributed inventory management system design."
    },
    {
      id: "aws_arch",
      title: "Solutions Architecture",
      issuer: "Amazon Web Services (AWS / Forage)",
      badge: "VERIFIED CREDENTIAL",
      description: "Resilient system design, cloud security, compute auto-scaling, and VPC network isolation."
    },
    {
      id: "ba_ds",
      title: "Data Science & Predictive Modeling",
      issuer: "British Airways (Forage)",
      badge: "VERIFIED CREDENTIAL",
      description: "Applied predictive customer modeling, NLP sentiment analysis, and machine learning booking prediction."
    },
    {
      id: "tata_genai",
      title: "Generative AI Powered Data Analytics",
      issuer: "Tata (Forage)",
      badge: "VERIFIED CREDENTIAL",
      description: "Generative AI and LLM workflows to automate business intelligence and data analytics pipelines."
    },
    {
      id: "deloitte_cyber",
      title: "Data Analytics, Technology & Cybersecurity",
      issuer: "Deloitte Australia (Forage)",
      badge: "VERIFIED CREDENTIAL",
      description: "Data forensic investigations, telemetry pattern recognition, and cybersecurity threat mitigation."
    }
  ]
};

/**
 * CHARACTER WORLD 3D — UNIFIED THREE.JS SPATIAL UNIVERSE
 * Single persistent WebGL environment driving the narrative of ATLEE // CHARACTER-07.
 * Features a morphing crystalline AI core, cinematic "ENTER CHARACTER" camera travel,
 * particle dispersion, and scroll-linked spatial state transitions.
 */

import { sound } from "./AudioEngine.js";

export class CharacterWorld3D {
  constructor(canvasId = "character-webgl-canvas") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    
    // Core 3D objects
    this.coreGroup = null;
    this.outerCrystal = null;
    this.innerLattice = null;
    this.particleSwarm = null;
    this.particlesData = [];
    this.particlesCount = window.innerWidth < 768 ? 240 : 650;

    // Interaction & Animation State
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.isEntered = false;
    this.isTransitioning = false;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not found, skipping 3D initialization");
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene, Camera, Renderer
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.0028);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 140);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    this.buildLighting();
    this.buildCore();
    this.buildParticleSwarm();
    this.setupEvents();
    this.animate();
  }

  buildLighting() {
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    this.scene.add(ambientLight);

    // Primary Icy Cyan Point Light
    this.cyanLight = new THREE.PointLight(0x00f0ff, 3, 200);
    this.cyanLight.position.set(40, 30, 60);
    this.scene.add(this.cyanLight);

    // Subtle Secondary Sky Blue Light
    this.blueLight = new THREE.PointLight(0x38bdf8, 2, 200);
    this.blueLight.position.set(-50, -40, -40);
    this.scene.add(this.blueLight);
  }

  buildCore() {
    this.coreGroup = new THREE.Group();
    this.scene.add(this.coreGroup);

    // 1. Outer Translucent Crystalline Icosahedron
    const outerGeo = new THREE.IcosahedronGeometry(26, 1);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x060f24,
      emissive: 0x020817,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.92,
      ior: 1.5,
      thickness: 12,
      wireframe: false,
      transparent: true,
      opacity: 0.75
    });
    this.outerCrystal = new THREE.Mesh(outerGeo, outerMat);
    this.coreGroup.add(this.outerCrystal);

    // 2. Wireframe Hairline Geometry
    const wireGeo = new THREE.IcosahedronGeometry(26.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.wireframeMesh = new THREE.Mesh(wireGeo, wireMat);
    this.coreGroup.add(this.wireframeMesh);

    // 3. Inner Rotating Neural Nucleus (Octahedron Lattice)
    const innerGeo = new THREE.OctahedronGeometry(12, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.innerLattice = new THREE.Mesh(innerGeo, innerMat);
    this.coreGroup.add(this.innerLattice);

    // 4. Glowing Center Nucleus Point
    const centerGeo = new THREE.SphereGeometry(3.5, 16, 16);
    const centerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    const centerPoint = new THREE.Mesh(centerGeo, centerMat);
    this.coreGroup.add(centerPoint);
  }

  buildParticleSwarm() {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particlesCount * 3);
    const colors = new Float32Array(this.particlesCount * 3);

    for (let i = 0; i < this.particlesCount; i++) {
      const radius = 35 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      this.particlesData.push({
        baseX: x, baseY: y, baseZ: z,
        speed: 0.2 + Math.random() * 0.5,
        orbitRadius: radius,
        angle: theta
      });

      // Electric blue / icy cyan gradient
      const isCyan = Math.random() > 0.35;
      colors[i * 3] = isCyan ? 0.0 : 0.22;
      colors[i * 3 + 1] = isCyan ? 0.94 : 0.74;
      colors[i * 3 + 2] = isCyan ? 1.0 : 0.97;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particleSwarm = new THREE.Points(geo, mat);
    this.scene.add(this.particleSwarm);
  }

  setupEvents() {
    // Mouse parallax
    window.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      this.mouse.targetX = (e.clientX - cx) / cx;
      this.mouse.targetY = (e.clientY - cy) / cy;
    });

    // Window resize
    window.addEventListener("resize", () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });

    // Scroll progress update
    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        this.scrollProgress = window.scrollY / docHeight;
      }
    }, { passive: true });

    // Enter Character Button Trigger
    const enterBtn = document.getElementById("enter-character-btn");
    if (enterBtn) {
      enterBtn.addEventListener("click", () => this.enterCharacter());
    }
  }

  enterCharacter() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    sound.playWarp();

    const startZ = this.camera.position.z;
    const targetZ = 30;
    const startTime = performance.now();
    const duration = 900;

    const animateTransition = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.camera.position.z = startZ + (targetZ - startZ) * ease;
      if (this.coreGroup) {
        this.coreGroup.scale.set(1 + ease * 1.5, 1 + ease * 1.5, 1 + ease * 1.5);
      }

      if (t < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        this.isEntered = true;
        this.isTransitioning = false;
        // Smoothly scroll to dossier section
        const dossier = document.getElementById("dossier");
        if (dossier) dossier.scrollIntoView({ behavior: "smooth" });
      }
    };

    requestAnimationFrame(animateTransition);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Mouse Damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Core Rotation & Reaction
    if (this.coreGroup && !this.isTransitioning) {
      this.coreGroup.rotation.y = time * 0.25 + this.mouse.x * 0.6;
      this.coreGroup.rotation.x = time * 0.15 - this.mouse.y * 0.4;
      
      if (this.innerLattice) {
        this.innerLattice.rotation.y = -time * 0.6;
        this.innerLattice.rotation.z = time * 0.4;
      }

      // Scroll-linked positioning: smoothly offset core position based on scroll progress
      const scrollOffset = this.scrollProgress * 60;
      this.coreGroup.position.y = -scrollOffset * 0.4;
      this.coreGroup.position.x = Math.sin(this.scrollProgress * Math.PI) * 20;
    }

    // Dynamic Particle Swarm Movement
    if (this.particleSwarm) {
      const positions = this.particleSwarm.geometry.attributes.position.array;
      for (let i = 0; i < this.particlesCount; i++) {
        const p = this.particlesData[i];
        p.angle += p.speed * delta * 0.4;
        
        positions[i * 3] = p.baseX * Math.cos(p.angle) - p.baseZ * Math.sin(p.angle);
        positions[i * 3 + 2] = p.baseX * Math.sin(p.angle) + p.baseZ * Math.cos(p.angle);
        positions[i * 3 + 1] = p.baseY + Math.sin(time * 1.5 + i) * 2;
      }
      this.particleSwarm.geometry.attributes.position.needsUpdate = true;
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

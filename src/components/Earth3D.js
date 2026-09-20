/**
 * 3D INTERACTIVE EARTH / GLOBAL AI NETWORK
 * Uses Three.js WebGL rendering with atmospheric shaders, city nodes, and geodesic AI data arcs.
 * Smooth orbit controls, satellite paths, and responsive performance optimization.
 */

export class Earth3D {
  constructor(containerId = "earth-3d-container") {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.globeGroup = null;
    this.arcsGroup = null;
    this.satellites = [];
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotateSpeed = 0.0018;
    this.init();
  }

  init() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded, skipping 3D Earth");
      return;
    }

    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 500;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 240;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.container.appendChild(this.renderer.domElement);

    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.createGlobe();
    this.createAtmosphere();
    this.createCityNodes();
    this.createArcs();
    this.createSatellites();
    this.setupEvents();
    this.animate();
  }

  createGlobe() {
    // Base dark sphere
    const radius = 70;
    const sphereGeo = new THREE.SphereGeometry(radius, 48, 48);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x060d1d,
      emissive: 0x030814,
      specular: 0x06b6d4,
      shininess: 15,
      wireframe: false
    });
    const globe = new THREE.Mesh(sphereGeo, sphereMat);
    this.globeGroup.add(globe);

    // Subtle wireframe grid overlay
    const wireGeo = new THREE.SphereGeometry(radius + 0.3, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wireGlobe = new THREE.Mesh(wireGeo, wireMat);
    this.globeGroup.add(wireGlobe);

    // Lighting
    const ambient = new THREE.AmbientLight(0x38bdf8, 0.4);
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight1.position.set(100, 80, 100);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 0.8);
    dirLight2.position.set(-100, -50, -50);
    this.scene.add(dirLight2);
  }

  createAtmosphere() {
    const radius = 74;
    const atmosGeo = new THREE.SphereGeometry(radius, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    this.globeGroup.add(atmosphere);
  }

  latLongToVector3(lat, lon, radius = 70.5) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  createCityNodes() {
    this.cities = [
      { name: "Lucknow (Home Core)", lat: 26.8467, lon: 80.9462, primary: true },
      { name: "Bengaluru (AI Hub)", lat: 12.9716, lon: 77.5946 },
      { name: "San Francisco (Silicon Valley)", lat: 37.7749, lon: -122.4194 },
      { name: "London (DeepMind)", lat: 51.5074, lon: -0.1278 },
      { name: "Tokyo (Robotics)", lat: 35.6762, lon: 139.6503 },
      { name: "Sydney (Deloitte)", lat: -33.8688, lon: 151.2093 }
    ];

    this.cities.forEach(city => {
      const pos = this.latLongToVector3(city.lat, city.lon, 70.6);
      
      // Marker Pin
      const geo = new THREE.SphereGeometry(city.primary ? 2.2 : 1.4, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: city.primary ? 0x00f0ff : 0xa855f7
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      this.globeGroup.add(mesh);

      // Marker Outer Pulse Ring
      const ringGeo = new THREE.RingGeometry(2.4, 3.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: city.primary ? 0x00f0ff : 0xa855f7,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      this.globeGroup.add(ring);
    });
  }

  createArcs() {
    this.arcsGroup = new THREE.Group();
    this.globeGroup.add(this.arcsGroup);

    const lucknow = this.cities[0];
    const targets = this.cities.slice(1);

    targets.forEach((dest, idx) => {
      const start = this.latLongToVector3(lucknow.lat, lucknow.lon, 70.6);
      const end = this.latLongToVector3(dest.lat, dest.lon, 70.6);

      // Calculate mid point raised above sphere
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const distance = start.distanceTo(end);
      mid.normalize().multiplyScalar(70.6 + distance * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
        transparent: true,
        opacity: 0.65,
        linewidth: 1.5
      });

      const line = new THREE.Line(curveGeo, curveMat);
      this.arcsGroup.add(line);
    });
  }

  createSatellites() {
    for (let i = 0; i < 3; i++) {
      const satGeo = new THREE.BoxGeometry(1.8, 1.8, 2.5);
      const satMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      
      const radius = 86 + i * 8;
      const angle = (i * Math.PI * 2) / 3;
      const inclination = 0.4 + i * 0.3;

      this.satellites.push({
        mesh: satMesh,
        radius,
        angle,
        speed: 0.008 + i * 0.003,
        inclination
      });

      this.scene.add(satMesh);
    }
  }

  setupEvents() {
    const dom = this.renderer.domElement;

    dom.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.globeGroup.rotation.y += deltaX * 0.005;
      this.globeGroup.rotation.x += deltaY * 0.005;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    // Touch events
    dom.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener("touchmove", (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.globeGroup.rotation.y += deltaX * 0.006;
      this.globeGroup.rotation.x += deltaY * 0.006;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    // Resize
    window.addEventListener("resize", () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isDragging && this.globeGroup) {
      this.globeGroup.rotation.y += this.autoRotateSpeed;
    }

    // Update satellites
    this.satellites.forEach(sat => {
      sat.angle += sat.speed;
      sat.mesh.position.x = Math.cos(sat.angle) * sat.radius;
      sat.mesh.position.z = Math.sin(sat.angle) * sat.radius * Math.cos(sat.inclination);
      sat.mesh.position.y = Math.sin(sat.angle) * sat.radius * Math.sin(sat.inclination);
      sat.mesh.rotation.y += 0.02;
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

/**
 * MINIMAL CUSTOM CURSOR
 * Lightweight, non-distracting futuristic cursor dot with smooth trailing ring.
 * Automatically disables on touch devices.
 */

export class CustomCursor {
  constructor() {
    this.dot = document.getElementById("cursor-dot");
    this.ring = document.getElementById("cursor-ring");
    this.pos = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.isHovered = false;

    if (window.matchMedia("(pointer: fine)").matches && this.dot && this.ring) {
      this.init();
    }
  }

  init() {
    window.addEventListener("mousemove", (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
      if (this.dot) {
        this.dot.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
      }
    });

    const updateHoverState = () => {
      document.querySelectorAll("a, button, input, textarea, select, .cursor-pointer").forEach(el => {
        el.addEventListener("mouseenter", () => {
          this.isHovered = true;
          if (this.ring) this.ring.classList.add("cursor-hover");
        });
        el.addEventListener("mouseleave", () => {
          this.isHovered = false;
          if (this.ring) this.ring.classList.remove("cursor-hover");
        });
      });
    };

    updateHoverState();
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });

    this.animate();
  }

  animate() {
    this.ringPos.x += (this.pos.x - this.ringPos.x) * 0.18;
    this.ringPos.y += (this.pos.y - this.ringPos.y) * 0.18;

    if (this.ring) {
      this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

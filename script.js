/**
 * Apex Motion | Scroll-Driven Hero Section Animation
 * Tech Stack: Vanilla JavaScript (ES6+), GSAP 3, GSAP ScrollTrigger
 * 
 * Features:
 * 1. Initial Page Load Animation (Staggered reveal, count-up numbers, car headlights ignition)
 * 2. Scroll-Driven Pinning & Car Drive (Smooth scrub physics interpolation)
 * 3. Dynamic Letter Illumination (Sub-pixel collision detection as car passes letters)
 * 4. Milestone-based Metric Cards Reveal with Animated Progress Bars
 * 5. Real-Time Telemetry HUD (Speedometer reactive to scroll velocity, tachometer, progress)
 * 6. Procedural Web Audio Engine Sound Synthesizer (Optional sound FX toggle)
 * 7. Zero layout thrashing / GPU accelerated transforms
 */

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // -------------------------------------------------------------------------
  // DOM Elements
  // -------------------------------------------------------------------------
  const heroStage = document.getElementById("heroStage");
  const scrollContainer = document.getElementById("scrollContainer");
  const roadwayWrapper = document.getElementById("roadwayWrapper");
  const roadSurface = document.getElementById("roadSurface");
  const carChassis = document.getElementById("carChassis");
  const carImage = document.getElementById("carImage");
  const kineticTrail = document.getElementById("kineticTrail");
  const valueLetters = gsap.utils.toArray(".value-letter");
  const valueText = document.getElementById("valueText");
  
  // Cards
  const cards = [
    { el: document.getElementById("box1"), numEl: document.getElementById("num1"), target: 58 },
    { el: document.getElementById("box2"), numEl: document.getElementById("num2"), target: 23 },
    { el: document.getElementById("box3"), numEl: document.getElementById("num3"), target: 27 },
    { el: document.getElementById("box4"), numEl: document.getElementById("num4"), target: 40 },
  ];

  // Telemetry HUD Elements
  const speedValueEl = document.getElementById("speedValue");
  const tachoFillEl = document.getElementById("tachoFill");
  const progressValueEl = document.getElementById("progressValue");
  const progressFillEl = document.getElementById("progressFill");

  // Interactive controls
  const soundToggleBtn = document.getElementById("soundToggle");
  const soundIconOff = document.getElementById("soundIconOff");
  const soundIconOn = document.getElementById("soundIconOn");
  const soundBtnText = document.getElementById("soundBtnText");
  const soundEq = document.getElementById("soundEq");
  const scrollToTopBtn = document.getElementById("scrollToTopBtn");

  // -------------------------------------------------------------------------
  // Geometry Cache (Avoid getBoundingClientRect during scroll ticks)
  // -------------------------------------------------------------------------
  let roadWidth = window.innerWidth;
  let carWidth = carImage.offsetWidth || 180;
  let endX = roadWidth - carWidth;
  let letterCoords = [];

  function recalculateCoordinates() {
    roadWidth = roadSurface.offsetWidth || window.innerWidth;
    carWidth = carChassis.offsetWidth || 200;
    // Allow car to exit slightly past the screen right edge for complete runway sweep
    endX = roadWidth - (carWidth * 0.4);

    const roadRect = roadSurface.getBoundingClientRect();
    letterCoords = valueLetters.map((letter) => {
      const rect = letter.getBoundingClientRect();
      // Relative X coordinate inside the road surface
      return rect.left - roadRect.left;
    });
  }

  // Initial calculation
  recalculateCoordinates();
  window.addEventListener("resize", recalculateCoordinates);

  // -------------------------------------------------------------------------
  // Requirement 2: Initial Load Animation
  // -------------------------------------------------------------------------
  function playInitialLoadAnimation() {
    const loadTl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        // Trigger initial numbers count-up preview
        cards.forEach((card, idx) => {
          animateCountUp(card.numEl, card.target, 1.4, idx * 0.15);
        });
      }
    });

    // 1. Fade and slide header & tags
    loadTl.from(".site-header", {
      y: -40,
      opacity: 0,
      duration: 1,
    });

    // 2. Headline eyebrow and subtitle reveal
    loadTl.from(["#eyebrow", "#subtitle"], {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
    }, "-=0.6");

    // 3. Staggered reveal of road letters (ghost letters fade in)
    loadTl.from(valueLetters, {
      opacity: 0,
      scale: 0.85,
      stagger: 0.035,
      duration: 0.7,
      ease: "back.out(1.5)"
    }, "-=0.5");

    // 4. Car ignition & headlights power on
    loadTl.from(carChassis, {
      x: -120,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.7");

    loadTl.from(".headlight-beam", {
      opacity: 0,
      scaleX: 0.2,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.inOut"
    }, "-=0.5");

    loadTl.from(".telemetry-hud", {
      y: 30,
      opacity: 0,
      duration: 0.9,
    }, "-=0.6");
  }

  // Number Counter Animation Helper
  function animateCountUp(element, targetValue, duration = 1.2, delay = 0) {
    const counterObj = { count: 0 };
    gsap.to(counterObj, {
      count: targetValue,
      duration: duration,
      delay: delay,
      ease: "power2.out",
      onUpdate: () => {
        element.textContent = Math.round(counterObj.count);
      }
    });
  }

  // -------------------------------------------------------------------------
  // Requirement 3: Scroll-Driven Animation (Core Feature)
  // -------------------------------------------------------------------------
  
  // Set up the master horizontal driving tween with ScrollTrigger
  const driveTween = gsap.to(carChassis, {
    x: () => endX,
    ease: "none",
    scrollTrigger: {
      trigger: scrollContainer,
      start: "top top",
      end: "bottom bottom",
      pin: heroStage,
      scrub: 1.2, // Smooth interpolation with inertia
      invalidateOnRefresh: true,
      onRefresh: recalculateCoordinates,
      onUpdate: handleScrollUpdate,
    }
  });

  // Dynamic updates on each scrub tick
  function handleScrollUpdate(self) {
    const progress = self.progress;
    
    // 1. Update Progress HUD
    const progressPct = Math.round(progress * 100);
    progressValueEl.textContent = progressPct;
    progressFillEl.style.width = `${progressPct}%`;

    // 2. Calculate dynamic car X position & front headlight beam reach
    const currentCarX = gsap.getProperty(carChassis, "x");
    const carCenterOffset = carWidth * 0.45;
    const trailWidth = Math.max(0, currentCarX + carCenterOffset);
    
    // Trail dynamically expands with exact car position
    kineticTrail.style.width = `${trailWidth}px`;

    // 3. Sub-pixel Letter Collision Detection
    // When car headlights/body cross each letter's X coordinate, illuminate the letter!
    const activationX = currentCarX + carCenterOffset;
    valueLetters.forEach((letter, i) => {
      const letterX = letterCoords[i];
      if (activationX >= letterX) {
        letter.classList.add("revealed");
      } else {
        letter.classList.remove("revealed");
      }
    });

    // 4. Update Engine Velocity & Sound FX
    updateVelocityTelemetry(self.getVelocity());
  }

  // -------------------------------------------------------------------------
  // Metric Cards Staggered Scroll Triggers
  // -------------------------------------------------------------------------
  const cardMilestones = [
    { id: "#box1", startProgress: 0.18, endProgress: 0.38, target: 58, numEl: cards[0].numEl },
    { id: "#box2", startProgress: 0.38, endProgress: 0.58, target: 23, numEl: cards[1].numEl },
    { id: "#box3", startProgress: 0.58, endProgress: 0.78, target: 27, numEl: cards[2].numEl },
    { id: "#box4", startProgress: 0.78, endProgress: 0.98, target: 40, numEl: cards[3].numEl },
  ];

  cardMilestones.forEach((mile) => {
    const cardEl = document.querySelector(mile.id);
    let hasAnimatedCount = false;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: () => `top+=${(mile.startProgress * (scrollContainer.offsetHeight - window.innerHeight))} top`,
      end: () => `top+=${(mile.endProgress * (scrollContainer.offsetHeight - window.innerHeight))} top`,
      onEnter: () => {
        gsap.to(cardEl, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        });
        cardEl.classList.add("active");
        if (!hasAnimatedCount) {
          animateCountUp(mile.numEl, mile.target, 0.9);
          hasAnimatedCount = true;
        }
      },
      onLeaveBack: () => {
        gsap.to(cardEl, {
          opacity: 0,
          y: 30,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.in"
        });
        cardEl.classList.remove("active");
        hasAnimatedCount = false;
      }
    });
  });

  // -------------------------------------------------------------------------
  // Telemetry Velocity & Speedometer Physics
  // -------------------------------------------------------------------------
  let currentSpeed = 0;
  let targetSpeed = 0;

  function updateVelocityTelemetry(velocity) {
    // Velocity from ScrollTrigger is pixels per second
    const normalizedVelocity = Math.abs(velocity) / 18;
    // Map to realistic supercar range: 0 to 260 km/h
    targetSpeed = Math.min(260, Math.round(normalizedVelocity));
  }

  // Smooth decay loop using GSAP ticker (Zero layout reflow)
  gsap.ticker.add(() => {
    // Smooth interpolation towards targetSpeed
    currentSpeed += (targetSpeed - currentSpeed) * 0.14;
    // Friction decay when scrolling stops
    targetSpeed *= 0.93;
    if (targetSpeed < 0.5) targetSpeed = 0;

    const displaySpeed = Math.round(currentSpeed);
    speedValueEl.textContent = displaySpeed;
    
    const tachoPercentage = Math.min(100, (currentSpeed / 260) * 100);
    tachoFillEl.style.width = `${tachoPercentage}%`;

    // Continuously modulate audio pitch and tone with exact real-time speed!
    if (soundSystem) {
      soundSystem.update(currentSpeed);
    }
  });

  // -------------------------------------------------------------------------
  // Bulletproof Supercar Audio System (Embedded Real Engine Audio)
  // -------------------------------------------------------------------------
  const audioToast = document.getElementById("audioToast");
  const toastText = document.getElementById("toastText");
  let toastTimer = null;

  function showToast(msg, duration = 2500) {
    if (!audioToast) return;
    toastText.textContent = msg;
    audioToast.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      audioToast.classList.add("hidden");
    }, duration);
  }

  class SupercarSoundSystem {
    constructor() {
      this.isActive = false;
      this.audioElementsReady = false;
      this.startupAudio = null;
      this.engineAudio = null;
    }

    init() {
      if (this.audioElementsReady) return;
      
      const startupSrc = (typeof STARTUP_AUDIO_B64 !== "undefined") ? STARTUP_AUDIO_B64 : "startup.wav";
      const engineSrc = (typeof ENGINE_AUDIO_B64 !== "undefined") ? ENGINE_AUDIO_B64 : "engine.wav";

      this.startupAudio = new Audio(startupSrc);
      this.engineAudio = new Audio(engineSrc);
      this.engineAudio.loop = true;
      this.engineAudio.volume = 0.7;
      this.startupAudio.volume = 0.9;
      this.audioElementsReady = true;
    }

    async start() {
      this.init();
      this.isActive = true;

      // 1. Play Ignition Rev
      try {
        this.startupAudio.currentTime = 0;
        const p1 = this.startupAudio.play();
        if (p1 !== undefined) {
          p1.catch(err => console.log("Startup play note:", err));
        }
      } catch (e) {
        console.warn("Startup play error:", e);
      }

      // 2. Play Continuous Engine Loop
      try {
        this.engineAudio.currentTime = 0;
        const p2 = this.engineAudio.play();
        if (p2 !== undefined) {
          p2.catch(err => console.log("Engine play note:", err));
        }
      } catch (e) {
        console.warn("Engine play error:", e);
      }
    }

    stop() {
      this.isActive = false;
      if (this.startupAudio) {
        this.startupAudio.pause();
        this.startupAudio.currentTime = 0;
      }
      if (this.engineAudio) {
        this.engineAudio.pause();
        this.engineAudio.currentTime = 0;
      }
    }

    update(speed) {
      if (!this.isActive || !this.engineAudio) return;
      // Map speed (0 to 260 km/h) to playback rate (1.0x to 2.3x)
      const rate = 1.0 + Math.min(1.3, (speed / 260) * 1.3);
      this.engineAudio.playbackRate = rate;

      // Dynamically swell volume slightly under acceleration
      const vol = 0.65 + Math.min(0.35, (speed / 260) * 0.35);
      this.engineAudio.volume = Math.min(1.0, vol);
    }
  }

  const soundSystem = new SupercarSoundSystem();

  soundToggleBtn.addEventListener("click", () => {
    if (!soundSystem.isActive) {
      soundSystem.start();
      soundIconOff.classList.add("hidden");
      soundIconOn.classList.remove("hidden");
      soundBtnText.textContent = "SOUND FX: ON";
      soundEq.classList.remove("hidden");
      soundToggleBtn.classList.add("primary");
      showToast("🔊 McLaren V8 Engine Sound Activated!");
    } else {
      soundSystem.stop();
      soundIconOff.classList.remove("hidden");
      soundIconOn.classList.add("hidden");
      soundBtnText.textContent = "SOUND FX: OFF";
      soundEq.classList.add("hidden");
      soundToggleBtn.classList.remove("primary");
      showToast("🔇 Engine Sound Muted", 1800);
    }
  });

  // -------------------------------------------------------------------------
  // Utility: Smooth Scroll to Top Button
  // -------------------------------------------------------------------------
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // -------------------------------------------------------------------------
  // Execute Page Intro Sequence
  // -------------------------------------------------------------------------
  playInitialLoadAnimation();
});

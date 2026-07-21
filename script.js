document.addEventListener("DOMContentLoaded", () => {
  // ── Detect reduced motion preference ──
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============================================================
  // 1. LENIS SMOOTH SCROLL
  // ============================================================
  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ============================================================
  // 2. CUSTOM CURSOR
  // ============================================================
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");

  if (dot && ring && window.innerWidth > 768) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
    };

    const cursorLoop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      requestAnimationFrame(cursorLoop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    requestAnimationFrame(cursorLoop);

    // Expand cursor on interactive elements
    const interactives = document.querySelectorAll("a, button, .skill-pill, .preview-link");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "48px";
        ring.style.height = "48px";
        ring.style.borderColor = "rgba(30, 58, 95, 0.5)";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderColor = "rgba(30, 58, 95, 0.30)";
      });
    });
  }

  // ============================================================
  // 3. SCROLL PROGRESS BAR + NAV BACKGROUND + SCROLL-TO-TOP
  // ============================================================
  const progressBar = document.getElementById("progress-bar");
  const nav = document.getElementById("main-nav");
  const scrollTopBtn = document.getElementById("scroll-top-btn");

  const updateScrollUI = () => {
    const sy = lenis ? lenis.scroll : window.scrollY;
    const doc = document.documentElement;
    const h = doc.scrollHeight - doc.clientHeight;
    const pct = h > 0 ? sy / h : 0;

    // Nav background
    if (sy > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Progress bar
    if (progressBar) {
      progressBar.style.transform = `scaleX(${pct})`;
    }

    // Scroll-to-top button
    if (scrollTopBtn) {
      if (pct > 0.25) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }
  };

  if (lenis) {
    lenis.on("scroll", updateScrollUI);
  } else {
    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollUI();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  updateScrollUI();

  // Scroll-to-top click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // ============================================================
  // 4. SECTION SCROLL SPY (Active Nav Pill)
  // ============================================================
  const SECTIONS = ["home", "about", "stack", "projects", "contact"];
  const navPills = document.querySelectorAll(".nav-pill");

  const spyOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0,
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navPills.forEach((pill) => {
          if (pill.getAttribute("data-scroll") === id) {
            pill.classList.add("active");
          } else {
            pill.classList.remove("active");
          }
        });
      }
    });
  }, spyOptions);

  SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  // ============================================================
  // 5. SMOOTH SCROLL NAVIGATION (via Lenis or native)
  // ============================================================
  const scrollBtns = document.querySelectorAll("[data-scroll]");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileBtn = document.getElementById("mobile-btn");

  scrollBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll");
      const el = document.getElementById(targetId);
      if (el) {
        if (lenis) {
          lenis.scrollTo(el, { offset: 0, duration: 1.4 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
          mobileBtn.classList.remove("open");
        }
      }
    });
  });

  // ============================================================
  // 6. MOBILE MENU TOGGLE
  // ============================================================
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = mobileBtn.classList.toggle("open");
      mobileMenu.classList.toggle("open");

      // Prevent body scroll when menu is open
      if (isOpen) {
        document.body.style.overflow = "hidden";
        if (lenis) lenis.stop();
      } else {
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      }
    });
  }

  // ============================================================
  // 7. FADE-IN ANIMATIONS (Enhanced with reveal types)
  // ============================================================
  const fadeElements = document.querySelectorAll(".fi");

  if (!prefersReducedMotion) {
    const fadeObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    // If reduced motion, show everything immediately
    fadeElements.forEach((el) => el.classList.add("visible"));
  }

  // ============================================================
  // 8. PARALLAX ENGINE (lightweight, scroll-driven)
  // ============================================================
  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    if (parallaxElements.length > 0) {
      const updateParallax = () => {
        const sy = lenis ? lenis.scroll : window.scrollY;
        const vh = window.innerHeight;

        parallaxElements.forEach((el) => {
          const speed = parseFloat(el.getAttribute("data-parallax")) || 0.05;
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const offset = (center - vh / 2) * speed;

          el.style.transform = `translateY(${offset}px)`;
        });
      };

      if (lenis) {
        lenis.on("scroll", updateParallax);
      } else {
        window.addEventListener("scroll", () => {
          requestAnimationFrame(updateParallax);
        }, { passive: true });
      }
    }
  }
});

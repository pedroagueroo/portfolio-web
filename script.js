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
  let mx = 0, my = 0;

  if (dot && ring && window.innerWidth > 768) {
    let rx = 0, ry = 0;

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

    if (sy > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    if (progressBar) {
      progressBar.style.transform = `scaleX(${pct})`;
    }

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
  }, { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 });

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
        if (mobileMenu && mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
          mobileBtn.classList.remove("open");
          document.body.style.overflow = "";
          if (lenis) lenis.start();
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
    fadeElements.forEach((el) => el.classList.add("visible"));
  }

  // ============================================================
  // 8. PARALLAX ENGINE (lightweight, scroll-driven)
  // ============================================================
  if (!prefersReducedMotion) {
    const parallaxElements = document.querySelectorAll("[data-parallax]");

    if (parallaxElements.length > 0) {
      const updateParallax = () => {
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

  // ============================================================
  // 9. STAGGERED SKILL PILLS
  //    Each pill fades in one by one with cascade timing
  // ============================================================
  if (!prefersReducedMotion) {
    const skillPills = document.querySelectorAll(".skill-pill");
    if (skillPills.length > 0) {
      // Mark pills as hidden initially
      skillPills.forEach((pill) => {
        pill.classList.add("pill-hidden");
      });

      const pillObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Stagger each pill inside the wrapper
              const wrapper = entry.target;
              const pills = wrapper.querySelectorAll(".skill-pill");
              pills.forEach((pill, i) => {
                setTimeout(() => {
                  pill.classList.remove("pill-hidden");
                  pill.classList.add("pill-visible");
                }, i * 60);
              });
              obs.unobserve(wrapper);
            }
          });
        },
        { threshold: 0.15 }
      );

      const skillsWrapper = document.querySelector(".skills-wrapper");
      if (skillsWrapper) pillObserver.observe(skillsWrapper);
    }
  }

  // ============================================================
  // 10. COUNTER ANIMATION
  //     Numbers count up from 0 when they scroll into view
  // ============================================================
  if (!prefersReducedMotion) {
    const counters = document.querySelectorAll("[data-count-to]");
    if (counters.length > 0) {
      const counterObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute("data-count-to"), 10);
              const prefix = el.getAttribute("data-count-prefix") || "";
              const suffix = el.getAttribute("data-count-suffix") || "";
              const duration = 1200;
              const startTime = performance.now();

              const animate = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(target * eased);
                el.textContent = prefix + current + suffix;

                if (progress < 1) {
                  requestAnimationFrame(animate);
                }
              };

              requestAnimationFrame(animate);
              obs.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  // ============================================================
  // 11. SCROLL-DRIVEN ACCENT STRIPE
  //     Project card top stripe animates from 0% to 100% width
  // ============================================================
  if (!prefersReducedMotion) {
    const stripes = document.querySelectorAll(".project-accent-stripe");
    if (stripes.length > 0) {
      const stripeObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("stripe-animate");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      stripes.forEach((s) => stripeObserver.observe(s));
    }
  }

  // ============================================================
  // 12. ANIMATED SECTION DIVIDERS
  //     .divider elements grow from left to right on scroll
  // ============================================================
  if (!prefersReducedMotion) {
    const dividers = document.querySelectorAll(".divider-animate");
    if (dividers.length > 0) {
      const dividerObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("divider-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      dividers.forEach((d) => dividerObserver.observe(d));
    }
  }

  // ============================================================
  // 13. TEXT REVEAL BY WORD
  //     Section titles split into words that fade in one by one
  // ============================================================
  if (!prefersReducedMotion) {
    const revealTitles = document.querySelectorAll("[data-word-reveal]");
    revealTitles.forEach((title) => {
      // Get all child nodes (text + elements like <span>, <em>, <br>)
      const fragment = document.createDocumentFragment();
      const childNodes = Array.from(title.childNodes);

      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // Split text into words
          const words = node.textContent.split(/(\s+)/);
          words.forEach((word) => {
            if (word.trim() === "") {
              fragment.appendChild(document.createTextNode(word));
            } else {
              const span = document.createElement("span");
              span.className = "word-reveal";
              span.textContent = word;
              fragment.appendChild(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === "BR") {
            fragment.appendChild(node.cloneNode());
          } else {
            // Wrap the entire element (like <span class="color-copper">)
            const wrapper = document.createElement("span");
            wrapper.className = "word-reveal";
            wrapper.appendChild(node.cloneNode(true));
            fragment.appendChild(wrapper);
          }
        }
      });

      title.innerHTML = "";
      title.appendChild(fragment);
    });

    // Observe and animate
    const wordElements = document.querySelectorAll("[data-word-reveal]");
    const wordObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll(".word-reveal");
            words.forEach((word, i) => {
              setTimeout(() => {
                word.classList.add("word-visible");
              }, i * 80);
            });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    wordElements.forEach((el) => wordObserver.observe(el));
  }

  // ============================================================
  // 14. MAGNETIC HOVER ON BUTTONS
  //     Buttons subtly attract toward cursor on hover
  // ============================================================
  if (!prefersReducedMotion && window.innerWidth > 768) {
    const magneticBtns = document.querySelectorAll(".btn-primary, .btn-copper, .btn-ghost");

    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.2;
        const dy = (e.clientY - cy) * 0.2;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }
});

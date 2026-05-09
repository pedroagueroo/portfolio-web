document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Custom Smooth Cursor ---
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;
    };
    
    const loop = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0)`;
      requestAnimationFrame(loop);
    };
    
    window.addEventListener("mousemove", onMove, { passive: true });
    requestAnimationFrame(loop);
  }

  // --- 2. Scroll Progress Bar & Nav Background ---
  const progressBar = document.getElementById("progress-bar");
  const nav = document.getElementById("main-nav");
  let ticking = false;
  
  const updateScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const sy = window.scrollY;
        
        // Nav background
        if (sy > 40) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
        
        // Progress bar
        if (progressBar) {
          const doc = document.documentElement;
          const h = doc.scrollHeight - doc.clientHeight;
          const pct = h > 0 ? sy / h : 0;
          progressBar.style.transform = `scaleX(${pct})`;
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  // --- 3. Section Scroll Spy (Active Nav Pill) ---
  const SECTIONS = ["home", "about", "stack", "projects", "contact"];
  const navPills = document.querySelectorAll(".nav-pill");
  
  // Use IntersectionObserver for scroll spy to optimize performance
  const spyOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };
  
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navPills.forEach(pill => {
          if (pill.getAttribute("data-scroll") === id) {
            pill.classList.add("active");
          } else {
            pill.classList.remove("active");
          }
        });
      }
    });
  }, spyOptions);
  
  SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  // --- 4. Smooth Scroll to Sections ---
  const scrollBtns = document.querySelectorAll("[data-scroll]");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileBtn = document.getElementById("mobile-btn");
  
  scrollBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-scroll");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        // Close mobile menu if open
        if (mobileMenu.classList.contains("open")) {
          mobileMenu.classList.remove("open");
          mobileBtn.classList.remove("open");
        }
      }
    });
  });

  // --- 5. Mobile Menu Toggle ---
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileBtn.classList.toggle("open");
      mobileMenu.classList.toggle("open");
    });
  }

  // --- 6. Fade In Animation (Intersection Observer) ---
  const fadeElements = document.querySelectorAll(".fi");
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  fadeElements.forEach(el => fadeObserver.observe(el));
});

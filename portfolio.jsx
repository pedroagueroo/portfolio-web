import { useState, useEffect, useRef } from "react";

const SECTIONS = ["home", "about", "stack", "projects", "value", "contact"];

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

const palette = {
  bg: "#0a0a0b",
  surface: "#131316",
  surfaceHover: "#1a1a1f",
  border: "#23232a",
  text: "#e8e6e3",
  textMuted: "#8a8a8f",
  accent: "#4f8fff",
  accentGlow: "rgba(79,143,255,0.12)",
  accentSoft: "rgba(79,143,255,0.08)",
  green: "#34d399",
  orange: "#f59e42",
  pink: "#f472b6",
};

const fonts = {
  display: "'Syne', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const stackData = [
  {
    category: "Lenguajes",
    icon: "⟨/⟩",
    items: [
      { name: "JavaScript", level: 90 },
      { name: "Python", level: 80 },
      { name: "Java", level: 85 },
      { name: "C", level: 70 },
      { name: "HTML/CSS", level: 95 },
    ],
  },
  {
    category: "Frameworks",
    icon: "⚡",
    items: [
      { name: "React", level: 90 },
      { name: "Angular", level: 75 },
      { name: "Node.js", level: 85 },
    ],
  },
  {
    category: "Bases de datos",
    icon: "◈",
    items: [
      { name: "PostgreSQL", level: 85 },
      { name: "MySQL", level: 80 },
      { name: "Supabase", level: 85 },
    ],
  },
  {
    category: "Herramientas",
    icon: "⊞",
    items: [
      { name: "Git / GitHub", level: 90 },
      { name: "Jira", level: 75 },
      { name: "Vercel", level: 80 },
    ],
  },
];

const projects = [
  {
    name: "HoopStats",
    tagline: "NBA analytics platform — real-time stats, smarter decisions.",
    link: "https://www.hoopstats.com.ar/",
    color: palette.orange,
    problem:
      "Basketball fans and analysts lacked a unified, real-time platform for tracking NBA statistics with meaningful visualizations. Scattered data meant hours of manual research.",
    solution:
      "Built a full-stack analytics platform that aggregates live NBA data, processes it in real time, and delivers interactive visualizations — turning raw numbers into actionable basketball insights.",
    highlights: [
      "Real-time data pipeline processing live NBA feeds",
      "Interactive charts & player comparison dashboards",
      "Responsive design optimized for mobile-first consumption",
      "RESTful API architecture handling concurrent data streams",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "REST APIs", "Chart.js"],
    metric: "Live data",
  },
  {
    name: "Traveris",
    tagline: "SaaS booking engine for travel agencies — built for scale.",
    link: "https://traveris-pro.vercel.app/login",
    color: palette.green,
    problem:
      "Independent travel agents relied on fragmented tools and spreadsheets to manage bookings, losing time and revenue. They needed a centralized, professional-grade system.",
    solution:
      "Designed and developed a complete SaaS platform with multi-user authentication, booking management, client CRM, and business logic — a production-ready tool that travel agencies can rely on daily.",
    highlights: [
      "Multi-role authentication with secure session management",
      "Complex booking workflow with real-time availability",
      "Client management CRM with search & filtering",
      "Business logic engine handling pricing rules & reservations",
    ],
    tech: ["React", "Node.js", "Supabase", "Vercel", "JWT Auth"],
    metric: "Full SaaS",
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const offsets = SECTIONS.map((id) => {
        const el = document.getElementById(id);
        return el ? el.offsetTop - 120 : 0;
      });
      const current = offsets.reduce(
        (acc, offset, i) => (window.scrollY >= offset ? i : acc),
        0
      );
      setActiveSection(SECTIONS[current]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        background: palette.bg,
        color: palette.text,
        fontFamily: fonts.body,
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: "-30%",
          left: "-10%",
          width: "60%",
          height: "60%",
          background: `radial-gradient(ellipse at center, ${palette.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-20%",
          right: "-10%",
          width: "50%",
          height: "50%",
          background: `radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            scrollY > 50
              ? "rgba(10,10,11,0.85)"
              : "transparent",
          backdropFilter: scrollY > 50 ? "blur(16px)" : "none",
          borderBottom:
            scrollY > 50 ? `1px solid ${palette.border}` : "1px solid transparent",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.02em",
            cursor: "pointer",
          }}
          onClick={() => scrollTo("home")}
        >
          <span style={{ color: palette.accent }}>P</span>edro
          <span style={{ color: palette.textMuted, fontWeight: 400, fontSize: 14, marginLeft: 8 }}>
            .dev
          </span>
        </div>

        {/* Desktop nav */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              style={{
                background:
                  activeSection === s ? palette.accentSoft : "transparent",
                color:
                  activeSection === s ? palette.accent : palette.textMuted,
                border: "none",
                padding: "6px 14px",
                borderRadius: 8,
                fontFamily: fonts.body,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
                display: "none",
              }}
              className="nav-link"
            >
              {s === "home" ? "Inicio" : s === "about" ? "Sobre mí" : s === "stack" ? "Stack" : s === "projects" ? "Proyectos" : s === "value" ? "Por qué yo" : "Contacto"}
            </button>
          ))}
          <a
            href="mailto:pedroaguero.dev@gmail.com"
            style={{
              background: palette.accent,
              color: "#fff",
              border: "none",
              padding: "8px 20px",
              borderRadius: 8,
              fontFamily: fonts.body,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            Hablemos →
          </a>
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .nav-link { display: inline-block !important; }
        }
        @media (max-width: 767px) {
          .hero-grid { flex-direction: column !important; text-align: center !important; }
          .hero-title { font-size: 40px !important; }
          .hero-sub { font-size: 16px !important; }
          .section-title { font-size: 32px !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .stack-grid { grid-template-columns: 1fr !important; }
          .value-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .status-bar { flex-direction: column !important; gap: 12px !important; }
        }
      `}</style>

      <main style={{ position: "relative", zIndex: 1 }}>
        {/* ====== HERO ====== */}
        <section
          id="home"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 24px 80px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ width: "100%" }}>
            <FadeIn>
              <div
                className="status-bar"
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 40,
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(52,211,153,0.1)",
                    color: palette.green,
                    padding: "6px 16px",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 500,
                    border: `1px solid rgba(52,211,153,0.2)`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: palette.green,
                      animation: "pulse 2s infinite",
                    }}
                  />
                  Disponible para trabajar
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: palette.textMuted,
                    fontFamily: fonts.mono,
                  }}
                >
                  Mar del Plata, AR 🇦🇷
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1
                className="hero-title"
                style={{
                  fontFamily: fonts.display,
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  marginBottom: 24,
                }}
              >
                Construyo productos digitales{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${palette.accent}, ${palette.green})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  que resuelven problemas reales.
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p
                className="hero-sub"
                style={{
                  fontSize: 19,
                  lineHeight: 1.7,
                  color: palette.textMuted,
                  maxWidth: 620,
                  margin: 0,
                  marginBottom: 40,
                }}
              >
                Soy Pedro Agüero — desarrollador fullstack con foco en crear aplicaciones escalables, 
                desde plataformas SaaS hasta sistemas de datos en tiempo real. 
                Técnico en programación con productos ya en producción.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href="#projects"
                  onClick={(e) => { e.preventDefault(); scrollTo("projects"); }}
                  style={{
                    background: palette.accent,
                    color: "#fff",
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.2s",
                    fontFamily: fonts.body,
                  }}
                >
                  Ver proyectos →
                </a>
                <a
                  href="https://github.com/pedroaguero"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "transparent",
                    color: palette.text,
                    padding: "14px 28px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 500,
                    textDecoration: "none",
                    border: `1px solid ${palette.border}`,
                    transition: "all 0.2s",
                    fontFamily: fonts.body,
                  }}
                >
                  GitHub ↗
                </a>
              </div>
            </FadeIn>

            {/* Quick stats */}
            <FadeIn delay={0.45}>
              <div
                style={{
                  display: "flex",
                  gap: 48,
                  marginTop: 64,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { num: "2", label: "Productos en producción" },
                  { num: "6+", label: "Tecnologías dominadas" },
                  { num: "∞", label: "Ganas de crecer" },
                ].map((s, i) => (
                  <div key={i}>
                    <div
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 36,
                        fontWeight: 800,
                        color: palette.accent,
                        lineHeight: 1,
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: palette.textMuted,
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ====== ABOUT ====== */}
        <section
          id="about"
          style={{
            padding: "100px 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: palette.accent,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              01 — SOBRE MÍ
            </p>
            <h2
              className="section-title"
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 48,
                lineHeight: 1.1,
              }}
            >
              No busco un puesto.{" "}
              <span style={{ color: palette.textMuted }}>
                Busco un equipo donde generar impacto.
              </span>
            </h2>
          </FadeIn>

          <div
            className="about-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 32,
            }}
          >
            <FadeIn delay={0.1}>
              <div
                style={{
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 16,
                  padding: 32,
                }}
              >
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: palette.textMuted,
                    margin: 0,
                  }}
                >
                  Tengo 21 años, soy de Mar del Plata y me recibí como{" "}
                  <strong style={{ color: palette.text }}>Técnico en Programación</strong>. 
                  Pero lo que me define no es un título — es lo que construí con él.
                </p>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: palette.textMuted,
                    margin: 0,
                    marginTop: 16,
                  }}
                >
                  Mientras otros hacían ejercicios de clase, yo diseñé y lancé{" "}
                  <strong style={{ color: palette.text }}>productos reales</strong>: una plataforma de analytics deportivo
                  con datos en tiempo real y un SaaS de gestión de reservas para agencias de viajes. 
                  Ambos en producción, con usuarios reales.
                </p>
                <p
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: palette.textMuted,
                    margin: 0,
                    marginTop: 16,
                  }}
                >
                  Mi enfoque es simple: entender el problema de negocio, diseñar la solución técnica, 
                  y construirla de punta a punta. Fullstack de verdad — no solo la palabra en un CV.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    icon: "🧠",
                    title: "Resolvedor de problemas",
                    desc: "Pienso primero en el problema de negocio, después en la tecnología. Cada línea de código tiene un propósito.",
                  },
                  {
                    icon: "⚡",
                    title: "Aprendizaje acelerado",
                    desc: "Stack completo aprendido de forma autodidacta y aplicado en productos reales. Lo que no sé, lo aprendo rápido.",
                  },
                  {
                    icon: "🚀",
                    title: "Mentalidad de producto",
                    desc: "No entrego código — entrego soluciones. Cada proyecto lo pienso como un producto que alguien va a usar.",
                  },
                  {
                    icon: "🌎",
                    title: "Listo para equipos globales",
                    desc: "Inglés intermedio, experiencia con herramientas de trabajo remoto (GitHub, Jira) y metodologías ágiles.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: palette.surface,
                      border: `1px solid ${palette.border}`,
                      borderRadius: 12,
                      padding: "20px 24px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <span
                        style={{
                          fontFamily: fonts.display,
                          fontWeight: 700,
                          fontSize: 15,
                        }}
                      >
                        {item.title}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: palette.textMuted,
                        margin: 0,
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ====== STACK ====== */}
        <section
          id="stack"
          style={{
            padding: "100px 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: palette.accent,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              02 — STACK TECNOLÓGICO
            </p>
            <h2
              className="section-title"
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 48,
                lineHeight: 1.1,
              }}
            >
              Las herramientas{" "}
              <span style={{ color: palette.textMuted }}>con las que construyo.</span>
            </h2>
          </FadeIn>

          <div
            className="stack-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            {stackData.map((cat, ci) => (
              <FadeIn key={ci} delay={ci * 0.1}>
                <div
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 16,
                    padding: 28,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fonts.mono,
                        fontSize: 18,
                        color: palette.accent,
                      }}
                    >
                      {cat.icon}
                    </span>
                    <span
                      style={{
                        fontFamily: fonts.display,
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {cat.category}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {cat.items.map((item, ii) => (
                      <div key={ii}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              fontFamily: fonts.mono,
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 4,
                            background: palette.border,
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${item.level}%`,
                              background: `linear-gradient(90deg, ${palette.accent}, ${palette.green})`,
                              borderRadius: 4,
                              transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ====== PROJECTS ====== */}
        <section
          id="projects"
          style={{
            padding: "100px 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: palette.accent,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              03 — PROYECTOS
            </p>
            <h2
              className="section-title"
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 16,
                lineHeight: 1.1,
              }}
            >
              Productos en producción.{" "}
              <span style={{ color: palette.textMuted }}>No ejercicios de clase.</span>
            </h2>
            <p
              style={{
                fontSize: 16,
                color: palette.textMuted,
                marginBottom: 48,
                maxWidth: 600,
              }}
            >
              Cada proyecto fue concebido como un producto real: identificando un problema, 
              diseñando la solución y llevándola a producción.
            </p>
          </FadeIn>

          <div
            className="projects-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 32,
            }}
          >
            {projects.map((p, pi) => (
              <FadeIn key={pi} delay={pi * 0.15}>
                <div
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}
                >
                  {/* Project header bar */}
                  <div
                    style={{
                      padding: "28px 32px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: p.color,
                          }}
                        />
                        <h3
                          style={{
                            fontFamily: fonts.display,
                            fontSize: 28,
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {p.name}
                        </h3>
                        <span
                          style={{
                            fontSize: 11,
                            fontFamily: fonts.mono,
                            color: p.color,
                            background: `${p.color}15`,
                            padding: "3px 10px",
                            borderRadius: 6,
                            fontWeight: 500,
                          }}
                        >
                          {p.metric}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          color: palette.textMuted,
                          margin: 0,
                          fontStyle: "italic",
                        }}
                      >
                        {p.tagline}
                      </p>
                    </div>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: `${p.color}15`,
                        color: p.color,
                        padding: "10px 20px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                        border: `1px solid ${p.color}30`,
                        fontFamily: fonts.body,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ver proyecto ↗
                    </a>
                  </div>

                  <div style={{ padding: "24px 32px 32px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                        marginBottom: 24,
                      }}
                      className="about-grid"
                    >
                      <div>
                        <p
                          style={{
                            fontFamily: fonts.mono,
                            fontSize: 11,
                            color: palette.accent,
                            marginBottom: 8,
                            letterSpacing: "0.05em",
                          }}
                        >
                          EL PROBLEMA
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: palette.textMuted,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {p.problem}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily: fonts.mono,
                            fontSize: 11,
                            color: palette.green,
                            marginBottom: 8,
                            letterSpacing: "0.05em",
                          }}
                        >
                          LA SOLUCIÓN
                        </p>
                        <p
                          style={{
                            fontSize: 14,
                            color: palette.textMuted,
                            lineHeight: 1.7,
                            margin: 0,
                          }}
                        >
                          {p.solution}
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div style={{ marginBottom: 20 }}>
                      <p
                        style={{
                          fontFamily: fonts.mono,
                          fontSize: 11,
                          color: palette.textMuted,
                          marginBottom: 10,
                          letterSpacing: "0.05em",
                        }}
                      >
                        HIGHLIGHTS
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 8,
                        }}
                        className="about-grid"
                      >
                        {p.highlights.map((h, hi) => (
                          <div
                            key={hi}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 8,
                              fontSize: 13,
                              color: palette.textMuted,
                              lineHeight: 1.5,
                            }}
                          >
                            <span style={{ color: p.color, flexShrink: 0, marginTop: 2 }}>▸</span>
                            {h}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech tags */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {p.tech.map((t, ti) => (
                        <span
                          key={ti}
                          style={{
                            fontSize: 12,
                            fontFamily: fonts.mono,
                            color: palette.text,
                            background: palette.bg,
                            padding: "5px 12px",
                            borderRadius: 6,
                            border: `1px solid ${palette.border}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ====== VALUE PROPOSITION ====== */}
        <section
          id="value"
          style={{
            padding: "100px 24px",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: palette.accent,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              04 — POR QUÉ YO
            </p>
            <h2
              className="section-title"
              style={{
                fontFamily: fonts.display,
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 48,
                lineHeight: 1.1,
              }}
            >
              Lo que traigo a la mesa{" "}
              <span style={{ color: palette.textMuted }}>que otros juniors no.</span>
            </h2>
          </FadeIn>

          <div
            className="value-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
            }}
          >
            {[
              {
                num: "01",
                title: "Productos, no tareas",
                desc: "No entrego código que funciona — entrego productos que generan valor. Pienso en el usuario final, no solo en el ticket de Jira.",
                color: palette.accent,
              },
              {
                num: "02",
                title: "Ya en producción",
                desc: "Mis proyectos no están en localhost. Están desplegados, funcionando y siendo usados. Eso demuestra ownership y capacidad de delivery.",
                color: palette.green,
              },
              {
                num: "03",
                title: "Fullstack real",
                desc: "Diseño la base de datos, construyo la API, desarrollo el frontend y hago el deploy. No necesito 3 personas para hacer el trabajo de una.",
                color: palette.orange,
              },
              {
                num: "04",
                title: "Curva de aprendizaje agresiva",
                desc: "Aprendí todo mi stack de forma autodidacta y lo apliqué en producción. Dame una tecnología nueva y en semanas estoy siendo productivo.",
                color: palette.pink,
              },
              {
                num: "05",
                title: "Mentalidad de negocio",
                desc: "Entiendo que el código es un medio, no el fin. Mi objetivo es resolver problemas de negocio, no impresionar con abstracciones innecesarias.",
                color: palette.accent,
              },
              {
                num: "06",
                title: "Hambre de crecer",
                desc: "Estoy en el punto donde la energía, la curiosidad y la dedicación están al máximo. Busco un equipo que me desafíe y donde pueda escalar rápido.",
                color: palette.green,
              },
            ].map((v, vi) => (
              <FadeIn key={vi} delay={vi * 0.08}>
                <div
                  style={{
                    background: palette.surface,
                    border: `1px solid ${palette.border}`,
                    borderRadius: 16,
                    padding: 28,
                    height: "100%",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 12,
                      color: v.color,
                      fontWeight: 600,
                    }}
                  >
                    {v.num}
                  </span>
                  <h3
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 18,
                      fontWeight: 700,
                      margin: "12px 0 8px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: palette.textMuted,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {v.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Objective */}
          <FadeIn delay={0.3}>
            <div
              style={{
                marginTop: 48,
                background: `linear-gradient(135deg, ${palette.accentSoft}, rgba(52,211,153,0.06))`,
                border: `1px solid ${palette.border}`,
                borderRadius: 16,
                padding: 36,
              }}
            >
              <h3
                style={{
                  fontFamily: fonts.display,
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                📈 Lo que busco
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: palette.textMuted,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Busco mi primer rol formal como{" "}
                <strong style={{ color: palette.text }}>desarrollador fullstack, frontend o backend</strong>{" "}
                en un equipo donde pueda aportar desde el día uno y seguir creciendo. 
                Me interesa tanto una posición en una empresa tecnológica (startup o corporativo) como 
                trabajar con clientes freelance en proyectos de desarrollo web, plataformas SaaS o 
                aplicaciones a medida. Estoy abierto a trabajo remoto, híbrido o presencial. 
                Lo que importa es el desafío y el equipo.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* ====== CONTACT ====== */}
        <section
          id="contact"
          style={{
            padding: "100px 24px 120px",
            maxWidth: 800,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <FadeIn>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                color: palette.accent,
                marginBottom: 12,
                letterSpacing: "0.05em",
              }}
            >
              05 — CONTACTO
            </p>
            <h2
              className="section-title"
              style={{
                fontFamily: fonts.display,
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                marginBottom: 20,
                lineHeight: 1.1,
              }}
            >
              ¿Tenés un proyecto?{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${palette.accent}, ${palette.green})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Hablemos.
              </span>
            </h2>
            <p
              style={{
                fontSize: 17,
                color: palette.textMuted,
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 540,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Ya sea que estés buscando sumar un desarrollador a tu equipo o necesites 
              llevar una idea a producción, me encantaría conversar.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              <a
                href="mailto:pedroaguero.dev@gmail.com"
                style={{
                  background: palette.accent,
                  color: "#fff",
                  padding: "16px 36px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontFamily: fonts.body,
                }}
              >
                Enviar email →
              </a>
              <a
                href="https://linkedin.com/in/pedroaguero"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: palette.surface,
                  color: palette.text,
                  padding: "16px 36px",
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 500,
                  textDecoration: "none",
                  border: `1px solid ${palette.border}`,
                  fontFamily: fonts.body,
                }}
              >
                LinkedIn ↗
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <p
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: palette.textMuted,
                opacity: 0.5,
              }}
            >
              Diseñado y desarrollado por Pedro Agüero — {new Date().getFullYear()}
            </p>
          </FadeIn>
        </section>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${palette.accent}40; color: #fff; }
      `}</style>
    </div>
  );
}

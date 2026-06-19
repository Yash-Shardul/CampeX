import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, Zap, Menu, X, GraduationCap } from "lucide-react";

function StudentNavbar({ onHomeClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("cx_dark_mode") === "true";
  });
  const [scrolled, setScrolled] = useState(false);

  /* Apply dark mode class to body */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("cx-dark");
    } else {
      document.body.classList.remove("cx-dark");
    }
    localStorage.setItem("cx_dark_mode", darkMode);
  }, [darkMode]);

  /* Detect scroll for navbar shadow */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleDark = () => setDarkMode((v) => !v);

  return (
    <>
      <nav
        className={`cx-navbar${scrolled ? " cx-navbar-scrolled" : ""}`}
        style={{ position: "sticky", top: 0, zIndex: 1000 }}
      >
        {/* Brand */}
        <div
          className="cx-navbar-brand"
          onClick={() => {
            navigate("/");
            if (location.pathname === "/") onHomeClick?.();
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="cx-navbar-brand-icon">
            <GraduationCap size={20} strokeWidth={2.2} />
          </div>
          CampeX
        </div>

        {/* Desktop Nav */}
        <ul
          className="cx-nav-links"
          style={{ display: "flex", listStyle: "none", margin: 0, padding: 0, gap: "4px" }}
        >
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `cx-nav-link${isActive ? " active" : ""}`}
              onClick={() => {
                if (location.pathname === "/") onHomeClick?.();
              }}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/clubs" className={({ isActive }) => `cx-nav-link${isActive ? " active" : ""}`}>
              Clubs
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className={({ isActive }) => `cx-nav-link${isActive ? " active" : ""}`}>
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/tour" className={({ isActive }) => `cx-nav-link${isActive ? " active" : ""}`}>
              Campus Tour
            </NavLink>
          </li>
        </ul>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, minWidth: 0 }}>
          {/* Dark / Light toggle */}
          <button
            onClick={toggleDark}
            className="cx-theme-toggle"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle dark mode"
            id="btn-theme-toggle"
          >
            {darkMode ? (
              <Sun size={17} strokeWidth={2} />
            ) : (
              <Moon size={17} strokeWidth={2} />
            )}
          </button>

          {/* Admin Button */}
          <button
            className="cx-btn cx-btn-primary cx-navbar-admin-btn-desktop"
            onClick={() => navigate("/admin/login")}
          >
            <Zap size={14} strokeWidth={2.5} />
            Admin
          </button>

          {/* Hamburger (mobile) */}
          <button
            className="cx-hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            id="btn-mobile-menu"
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={2} color="var(--cx-text-primary)" />
            ) : (
              <Menu size={22} strokeWidth={2} color="var(--cx-text-primary)" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`cx-mobile-menu${mobileOpen ? " open" : ""}`}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {[
            { to: "/", label: "Home", end: true },
            { to: "/clubs", label: "Clubs" },
            { to: "/events", label: "Events" },
            { to: "/tour", label: "Campus Tour" },
          ].map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) => `cx-mobile-nav-link${isActive ? " active" : ""}`}
                onClick={() => {
                  setMobileOpen(false);
                  if (item.to === "/" && location.pathname === "/") onHomeClick?.();
                }}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li style={{ padding: "8px 20px" }}>
            <button
              className="cx-btn cx-btn-primary"
              style={{ width: "100%" }}
              onClick={() => { setMobileOpen(false); navigate("/admin/login"); }}
            >
              <Zap size={14} strokeWidth={2.5} /> Admin
            </button>
          </li>
          <li style={{ padding: "8px 20px 16px" }}>
            <button
              onClick={toggleDark}
              style={{
                width: "100%",
                padding: "10px",
                border: "1.5px solid var(--cx-border)",
                borderRadius: "10px",
                background: "var(--cx-bg-card)",
                color: "var(--cx-text-primary)",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              {darkMode ? (
                <><Sun size={16} strokeWidth={2} /> Light Mode</>
              ) : (
                <><Moon size={16} strokeWidth={2} /> Dark Mode</>
              )}
            </button>
          </li>
        </ul>
      </div>

      <style>{`
        /* ── Theme Toggle Button ── */
        .cx-theme-toggle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1.5px solid var(--cx-border);
          background: var(--cx-bg-card);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s ease;
          flex-shrink: 0;
          color: var(--cx-text-primary);
        }
        .cx-theme-toggle:hover {
          background: var(--cx-primary-light);
          border-color: var(--cx-primary);
          transform: scale(1.1) rotate(12deg);
        }

        /* ── Hamburger ── */
        .cx-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .cx-hamburger:hover { background: var(--cx-primary-light); }

        /* ── Mobile Menu ── */
        .cx-mobile-menu {
          position: sticky;
          top: 68px;
          z-index: 999;
          background: var(--cx-bg-card);
          border-bottom: 1px solid var(--cx-border);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cx-mobile-menu.open { max-height: 400px; }
        .cx-mobile-nav-link {
          display: block;
          padding: 14px 20px;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--cx-text-secondary);
          text-decoration: none;
          border-bottom: 1px solid var(--cx-border-light);
          transition: all 0.2s ease;
        }
        .cx-mobile-nav-link:hover,
        .cx-mobile-nav-link.active {
          color: var(--cx-primary);
          background: var(--cx-primary-light);
        }

        /* ── Navbar scrolled shadow ── */
        .cx-navbar-scrolled {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        /* ── Show hamburger on mobile ── */
        @media (max-width: 768px) {
          .cx-hamburger { display: flex; }
          .cx-nav-links { display: none !important; }
          .cx-navbar-admin-btn-desktop { display: none !important; }
        }

        /* ── Dark mode overrides ── */
        body.cx-dark {
          --cx-bg:           #0d0d1a;
          --cx-bg-card:      #161628;
          --cx-bg-elevated:  #1e1e34;
          --cx-surface:      #1a1a2e;
          --cx-border:       rgba(255,255,255,0.08);
          --cx-border-light: rgba(255,255,255,0.05);
          --cx-text-primary:   #f0f0ff;
          --cx-text-secondary: #a0a8c4;
          --cx-text-muted:     #6272a4;
          --cx-shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
          --cx-shadow-md: 0 4px 16px rgba(0,0,0,0.4);
          --cx-shadow-lg: 0 10px 40px rgba(0,0,0,0.5);
          --cx-shadow-card-hover: 0 20px 50px rgba(79, 70, 229, 0.25);
        }
        body.cx-dark .cx-navbar {
          background: rgba(13, 13, 26, 0.92);
          border-bottom-color: rgba(255,255,255,0.07);
        }
        body.cx-dark .cx-mobile-menu {
          background: #161628;
          border-bottom-color: rgba(255,255,255,0.07);
        }
        body.cx-dark .cx-section-title { color: #f0f0ff; }
        body.cx-dark .cx-club-card { background: #161628; border-color: rgba(255,255,255,0.07); }
        body.cx-dark .cx-club-card-name { color: #f0f0ff; }
        body.cx-dark .cx-club-card-footer { background: #1a1a2e; border-top-color: rgba(255,255,255,0.05); }
        body.cx-dark .cx-event-card { background: #161628; border-color: rgba(255,255,255,0.07); }
        body.cx-dark .cx-event-card-title { color: #f0f0ff; }
        body.cx-dark .cx-filter-pill { background: #161628; border-color: rgba(255,255,255,0.08); color: #a0a8c4; }
        body.cx-dark .cx-search-input { background: #161628; border-color: rgba(255,255,255,0.08); color: #f0f0ff; }
      `}</style>
    </>
  );
}

export default StudentNavbar;
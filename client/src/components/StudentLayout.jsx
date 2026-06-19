import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import StudentNavbar from "./Navbar";
import Footer from "./Footer";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "@n8n/chat/style.css";

/* ── Visit counter utility ───────────────────────────── */
function trackVisit() {
  const key = "cx_site_visits";
  const prev = parseInt(localStorage.getItem(key) || "0");
  const updated = prev + 1;
  localStorage.setItem(key, updated);
  return updated;
}

function getVisitCount() {
  return parseInt(localStorage.getItem("cx_site_visits") || "0");
}

/* ── Ripple hook ─────────────────────────────────────── */
function useRipple() {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left;
    const y = e.clientY - btn.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 800);
  };

  return [ripples, addRipple];
}

/* ── Typing animation hook ───────────────────────────── */
function useTypingAnimation(texts, typingSpeed = 80, pauseMs = 1800, deleteSpeed = 40) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];

    let timeout;
    if (!isDeleting) {
      if (charIndex < current.length) {
        timeout = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseMs);
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((c) => c - 1), deleteSpeed);
      } else {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % texts.length);
      }
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, pauseMs, deleteSpeed]);

  return displayed;
}

function StudentLayout() {
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [visitCount, setVisitCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const isTour = location.pathname === "/tour";
  const isHome = location.pathname === "/";

  const [exploreRipples, addExploreRipple] = useRipple();
  const [visitRipples, addVisitRipple] = useRipple();

  /* Typing animation for the dynamic part of the headline */
  const typedText = useTypingAnimation(
    ["Like Never Before", "Your Way", "With Purpose", "Reimagined"],
    80,
    2000,
    45
  );

  useEffect(() => {
    if (isHome) {
      const count = trackVisit();
      setVisitCount(count);

      axios
        .get("http://localhost:5000/api/clubs")
        .then((res) => setClubs(res.data.slice(0, 4)))
        .catch((err) => console.log(err));

      axios
        .get("http://localhost:5000/api/events")
        .then((res) => setEvents(res.data.slice(0, 3)))
        .catch((err) => console.log(err));
    } else {
      setVisitCount(getVisitCount());
    }
  }, [isHome]);

 const handleVisitSite = (e) => {
    addVisitRipple(e);
    setTimeout(() => {
    window.open("https://kbtcoe.org/", "_blank");
    
    }
    , 300);
  };

  const handleExplore = (e) => {
    addExploreRipple(e);
    setTimeout(() => navigate("/tour"), 280);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--cx-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StudentNavbar />

      {isHome ? (
        <>
          {/* ════════════════════════════════════════════════
              FULL-SCREEN VIDEO HERO
          ════════════════════════════════════════════════ */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "-68px",
            }}
          >
            {/* ── VIDEO BACKGROUND ── */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            >
              <source src="/college-bg.mp4" type="video/mp4" />
            </video>

            {/* Deep gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(10,8,30,0.82) 0%, rgba(30,27,80,0.70) 50%, rgba(60,20,100,0.75) 100%)",
                zIndex: 1,
              }}
            />

            {/* Centered Content */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                padding: "0 24px",
                maxWidth: "720px",
                width: "100%",
              }}
            >
              {/* Headline with typing animation */}
              <h1
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.15,
                  letterSpacing: "-0.025em",
                  marginBottom: "20px",
                  textShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                Experience Campus Life{" "}
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #38bdf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                    minWidth: "4px",
                  }}
                >
                  {typedText}
                  <span className="cx-cursor-blink">|</span>
                </span>
              </h1>

              {/* Sub */}
              <p
                style={{
                  fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
                  color: "rgba(255,255,255,0.70)",
                  lineHeight: 1.75,
                  maxWidth: "520px",
                  margin: "0 auto 56px",
                }}
              >
                Discover clubs, explore events, and navigate your campus
                virtually — all in one platform.
              </p>

              {/* ── TWO MATCHING GLASS CTA BUTTONS ── */}
              <div
                className="cx-hero-cta-wrap"
                style={{
                  display: "flex",
                  gap: "56px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {/* EXPLORE CAMPUS */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    onClick={handleExplore}
                    className="cx-circle-btn cx-circle-btn-glass"
                    id="btn-explore-campus"
                  >
                    {/* Persistent drop rings */}
                    <span className="cx-drop-ring cx-drop-ring-1" />
                    <span className="cx-drop-ring cx-drop-ring-2" />
                    <span className="cx-drop-ring cx-drop-ring-3" />

                    {exploreRipples.map((r) => (
                      <span
                        key={r.id}
                        className="cx-ripple-wave cx-ripple-light"
                        style={{ left: r.x, top: r.y }}
                      />
                    ))}

                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          lineHeight: 1.3,
                        }}
                      >
                        Explore
                        <br />
                        Campus
                      </span>
                    </span>
                  </button>
                </div>

                {/* VISIT WEBSITE */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    onClick={handleVisitSite}
                    className="cx-circle-btn cx-circle-btn-glass"
                    id="btn-visit-website"
                  >
                    {/* Persistent drop rings */}
                    <span className="cx-drop-ring cx-drop-ring-1" />
                    <span className="cx-drop-ring cx-drop-ring-2" />
                    <span className="cx-drop-ring cx-drop-ring-3" />

                    {visitRipples.map((r) => (
                      <span
                        key={r.id}
                        className="cx-ripple-wave cx-ripple-light"
                        style={{ left: r.x, top: r.y }}
                      />
                    ))}

                    <span
                      style={{
                        position: "relative",
                        zIndex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          lineHeight: 1.3,
                        }}
                      >
                        Visit
                        <br />
                        Website
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              CLUBS SECTION
          ════════════════════════════════════════════════ */}
          <Container className="mt-5 pt-2">
            <div className="cx-section-header">
              <div>
                <h2 className="cx-section-title">College Clubs</h2>
                <p className="cx-section-subtitle">
                  Find your community and develop new skills
                </p>
                <div className="cx-section-divider" />
              </div>
              <button
                className="cx-btn cx-btn-outline"
                onClick={() => navigate("/clubs")}
              >
                View All Clubs →
              </button>
            </div>

            <Row className="g-4">
              {clubs.map((club) => (
                <Col md={3} sm={6} key={club._id}>
                  <div
                    className="cx-club-card"
                    onClick={() => navigate(`/clubs/${club._id}`)}
                  >
                    <div className="cx-club-card-img-wrap">
                      {club.logo ? (
                        <img
                          src={`http://localhost:5000${club.logo}`}
                          className="cx-club-card-img"
                          alt={club.name}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                            background:
                              "linear-gradient(135deg, #e0e7ff, #ede9fe)",
                          }}
                        >
                          🎓
                        </div>
                      )}
                      <div className="cx-club-card-overlay" />
                      {club.category && (
                        <div className="cx-club-card-badge-wrap">
                          <span
                            className="cx-badge cx-badge-primary"
                            style={{ fontSize: "10px" }}
                          >
                            {club.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="cx-club-card-body">
                      <div className="cx-club-card-name">{club.name}</div>
                      <p className="cx-club-card-desc">
                        {club.description ||
                          "Explore this amazing club and join our vibrant community."}
                      </p>
                    </div>
                    <div className="cx-club-card-footer">
                      <span className="cx-club-card-members">
                        {club.activeMembersCount || 0} members
                      </span>
                      <span className="cx-club-view-btn">View Details →</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>

          {/* ════════════════════════════════════════════════
              EVENTS SECTION
          ════════════════════════════════════════════════ */}
          <Container className="mt-5 mb-5 pb-4">
            <div className="cx-section-header">
              <div>
                <h2 className="cx-section-title">Campus Events</h2>
                <p className="cx-section-subtitle">
                  Stay updated with what's happening on campus
                </p>
                <div className="cx-section-divider" />
              </div>
              <button
                className="cx-btn cx-btn-outline"
                onClick={() => navigate("/events")}
              >
                View All Events →
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {events.map((event) => {
                const start = new Date(event.startTime);
                return (
                  <div
                    key={event._id}
                    className="cx-event-card"
                    onClick={() => navigate(`/events/${event._id}`)}
                  >
                    <div className="cx-event-card-img">
                      {event.banner ? (
                        <img
                          src={`http://localhost:5000/${event.banner}`}
                          alt={event.title}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(135deg, #1e1b4b, #4c1d95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                          }}
                        >
                          📅
                        </div>
                      )}
                      <div className="cx-event-card-img-overlay" />
                    </div>
                    <div className="cx-event-card-body">
                      <div>
                        <div className="cx-event-card-tags">
                          {event.category && (
                            <span className="cx-badge cx-badge-primary">
                              {event.category}
                            </span>
                          )}
                          {event.eventType && (
                            <span className="cx-badge cx-badge-muted">
                              {event.eventType}
                            </span>
                          )}
                        </div>
                        <div className="cx-event-card-title">{event.title}</div>
                        <p className="cx-event-card-desc">{event.description}</p>
                      </div>
                      <div>
                        <div className="cx-event-meta">
                          <span className="cx-event-meta-item">
                            {start.toLocaleDateString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="cx-event-meta-item">
                            {event.venue || "Online"}
                          </span>
                          <span className="cx-event-meta-item">
                            {event.maxParticipants || "Unlimited"} seats
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </>
      ) : isTour ? (
        <Outlet />
      ) : (
        <Container className="mt-4 py-4" style={{ flex: 1 }}>
          <Outlet />
        </Container>
      )}

      <Footer />

      {/* ─── GLOBAL ANIMATION STYLES ─── */}
      <style>{`
        /* ── Typing cursor blink ── */
        .cx-cursor-blink {
          display: inline-block;
          color: #a78bfa;
          font-weight: 300;
          animation: cx-blink 0.9s step-start infinite;
          margin-left: 2px;
          -webkit-text-fill-color: #a78bfa;
        }
        @keyframes cx-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── CIRCULAR CTA BUTTONS ── */
        .cx-circle-btn {
          position: relative;
          overflow: hidden;
          width: 128px;
          height: 128px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          font-family: 'Inter', sans-serif;
          color: white;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
        }

        .cx-circle-btn-glass {
          background: rgba(255,255,255,0.13);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(255,255,255,0.32) !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.28),
                      0 0 0 4px rgba(255,255,255,0.07);
        }
        .cx-circle-btn-glass:hover {
          background: rgba(255,255,255,0.22);
          border-color: rgba(255,255,255,0.60) !important;
          transform: translateY(-8px) scale(1.06);
          box-shadow: 0 20px 52px rgba(0,0,0,0.38),
                      0 0 0 6px rgba(255,255,255,0.13);
        }

        /* Water droplet persistent ripple rings */
        .cx-drop-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.40);
          pointer-events: none;
          animation: cx-drop-expand 2.4s ease-out infinite;
        }
        .cx-drop-ring-1 { width: 100px; height: 100px; animation-delay: 0s; }
        .cx-drop-ring-2 { width: 140px; height: 140px; animation-delay: 0.7s; }
        .cx-drop-ring-3 { width: 178px; height: 178px; animation-delay: 1.4s; }
        @keyframes cx-drop-expand {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.7; }
          80%  { transform: translate(-50%, -50%) scale(1);   opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1);   opacity: 0; }
        }

        /* Click ripple wave */
        .cx-ripple-wave {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.5);
          transform: translate(-50%, -50%) scale(0);
          animation: cx-ripple-click 0.75s ease-out forwards;
          pointer-events: none;
        }
        .cx-ripple-light { background: rgba(255, 255, 255, 0.4); }
        @keyframes cx-ripple-click {
          0%   { transform: translate(-50%, -50%) scale(0);  opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(28); opacity: 0; }
        }

        /* Mobile responsive */
        @media (max-width: 600px) {
          .cx-circle-btn { width: 106px; height: 106px; }
          .cx-hero-cta-wrap { gap: 28px !important; }
        }

        @media (max-width: 480px) {
          .cx-circle-btn { width: 96px; height: 96px; }
          .cx-hero-cta-wrap { gap: 22px !important; }
        }

        @media (max-width: 380px) {
          .cx-circle-btn { width: 88px; height: 88px; }
          .cx-hero-cta-wrap { gap: 16px !important; }
        }

        @media (max-width: 768px) {
          .cx-event-card { flex-direction: column; height: auto; }
          .cx-event-card-img { width: 100%; height: 180px; }
        }
      `}</style>
    </div>
  );
}

export default StudentLayout;
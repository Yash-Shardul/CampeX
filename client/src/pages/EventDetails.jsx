import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaGlobe,
  FaFacebook,
  FaLinkedin,
  FaUsers,
  FaShareAlt,
} from "react-icons/fa";

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!event) return;
    const update = () => {
      const diff = new Date(event.startTime) - new Date();
      if (diff <= 0) { setCountdown(""); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setCountdown(`${d}d ${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event]);

  const handleShare = async () => {
    const data = { title: event.title, text: `Check out: ${event.title}`, url: window.location.href };
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }
  };

  if (!event) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" }}>
        <div className="cx-spinner" />
        <span style={{ color: "var(--cx-text-muted)", fontSize: "14px" }}>Loading event...</span>
      </div>
    );
  }

  const start = new Date(event.startTime);
  const end = new Date(event.endTime);
  const durationMs = end - start;
  const durationH = Math.floor(durationMs / 3600000);
  const durationM = Math.floor((durationMs / 60000) % 60);

  const statusColor = {
    "Upcoming":  { bg: "#dcfce7", color: "#16a34a" },
    "Ongoing":   { bg: "#dbeafe", color: "#1d4ed8" },
    "Completed": { bg: "#f1f5f9", color: "#64748b" },
  }[event.status] || { bg: "#f1f5f9", color: "#64748b" };

  return (
    <>
      {/* HERO BANNER */}
      <div className="cx-event-banner" style={{ marginLeft: "-12px", marginRight: "-12px" }}>
        {event.banner ? (
          <img
            src={`http://localhost:5000/${event.banner}`}
            alt={event.title}
          />
        ) : (
          <div style={{
            width: "100%",
            height: "100%",
            background: "var(--cx-gradient-hero)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "80px"
          }}>📅</div>
        )}
        <div className="cx-event-banner-overlay" />
        <div className="cx-event-banner-content">
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span className="cx-badge" style={{ background: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(8px)" }}>
              {event.category} Event
            </span>
            <span className="cx-badge" style={{ background: statusColor.bg, color: statusColor.color }}>
              {event.status}
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
            fontWeight: 900,
            color: "white",
            marginBottom: "12px",
            lineHeight: 1.2,
          }}>
            {event.title}
          </h1>

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", marginBottom: "0" }}>
            Organised by <strong style={{ color: "white" }}>{event.host?.name || "Campus Team"}</strong>
          </p>

          {countdown && (
            <div className="cx-countdown-box">
              <span>⏳</span>
              <span>Starts in {countdown}</span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mt-5">
        <Row className="g-4">
          {/* LEFT */}
          <Col lg={8}>
            {/* INFO CARDS */}
            <Row className="g-3 mb-4">
              <Col sm={6} md={3}>
                <div className="cx-info-card">
                  <div className="cx-info-card-icon"><FaCalendarAlt size={20} /></div>
                  <div className="cx-info-card-label">Date</div>
                  <div className="cx-info-card-value">
                    {start.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="cx-info-card">
                  <div className="cx-info-card-icon"><FaClock size={20} /></div>
                  <div className="cx-info-card-label">Time</div>
                  <div className="cx-info-card-value">
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="cx-info-card-label" style={{ marginTop: "2px" }}>Duration</div>
                  <div className="cx-info-card-value" style={{ fontSize: "13px" }}>
                    {durationH}h {durationM}m
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="cx-info-card">
                  <div className="cx-info-card-icon"><FaMapMarkerAlt size={20} /></div>
                  <div className="cx-info-card-label">Location</div>
                  <div className="cx-info-card-value" style={{ fontSize: "13px", textAlign: "center" }}>
                    {event.venue || "Online"}
                  </div>
                </div>
              </Col>
              <Col sm={6} md={3}>
                <div className="cx-info-card">
                  <div className="cx-info-card-icon"><FaUsers size={20} /></div>
                  <div className="cx-info-card-label">Capacity</div>
                  <div className="cx-info-card-value">{event.maxParticipants || "∞"}</div>
                  <div className="cx-info-card-label" style={{ marginTop: "2px" }}>Mode</div>
                  <div className="cx-info-card-value" style={{ fontSize: "13px" }}>{event.eventType}</div>
                </div>
              </Col>
            </Row>

            {/* ABOUT */}
            <div className="cx-card" style={{ padding: "28px", marginBottom: "20px" }}>
              <h4 style={{ fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  width: "32px", height: "32px", background: "var(--cx-primary-light)",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px"
                }}>📋</span>
                About This Event
              </h4>
              <p style={{ color: "var(--cx-text-secondary)", lineHeight: 1.8, fontSize: "15px", margin: 0 }}>
                {event.description}
              </p>
            </div>

            {/* GUESTS */}
            {event.guests?.length > 0 && event.guests.some(g => g) && (
              <div className="cx-card" style={{ padding: "28px", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "32px", height: "32px", background: "var(--cx-primary-light)",
                    borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px"
                  }}>🌟</span>
                  Featured Guests
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {event.guests.filter(g => g).map((guest, i) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      background: "var(--cx-surface)",
                      borderRadius: "var(--cx-radius-md)",
                      border: "1px solid var(--cx-border)",
                    }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "var(--cx-gradient-card)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "14px"
                      }}>
                        {guest.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 500, color: "var(--cx-text-primary)", fontSize: "14px" }}>
                        {guest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GALLERY */}
            {event.images?.length > 0 && (
              <div className="cx-card" style={{ padding: "28px", marginBottom: "20px" }}>
                <h4 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{
                    width: "32px", height: "32px", background: "var(--cx-primary-light)",
                    borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px"
                  }}>🖼️</span>
                  Event Gallery
                </h4>
                <div style={{ position: "relative" }}>
                  {/* Main Image */}
                  <div style={{
                    borderRadius: "var(--cx-radius-lg)",
                    overflow: "hidden",
                    marginBottom: "12px",
                    height: "380px",
                    background: "var(--cx-surface)"
                  }}>
                    <img
                      src={`http://localhost:5000/${event.images[activeImg]}`}
                      alt="event"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  {/* Thumbnails */}
                  {event.images.length > 1 && (
                    <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
                      {event.images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImg(i)}
                          style={{
                            flexShrink: 0,
                            width: "80px",
                            height: "64px",
                            borderRadius: "var(--cx-radius-sm)",
                            overflow: "hidden",
                            cursor: "pointer",
                            border: `2px solid ${i === activeImg ? "var(--cx-primary)" : "transparent"}`,
                            transition: "var(--cx-transition)",
                            opacity: i === activeImg ? 1 : 0.65,
                          }}
                        >
                          <img
                            src={`http://localhost:5000/${img}`}
                            alt=""
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Col>

          {/* RIGHT SIDEBAR */}
          <Col lg={4}>
            {/* HOST */}
            {event.host && (
              <div className="cx-panel-card">
                <div className="cx-panel-card-title">🏢 Host Details</div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--cx-text-primary)", marginBottom: "12px" }}>
                  {event.host.name}
                </div>
                {event.host.contactEmail && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <FaEnvelope color="var(--cx-primary)" size={14} />
                    <span style={{ fontSize: "13px", color: "var(--cx-text-secondary)", wordBreak: "break-all" }}>
                      {event.host.contactEmail}
                    </span>
                  </div>
                )}
                {event.host.contactPhone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaPhone color="var(--cx-primary)" size={14} />
                    <span style={{ fontSize: "13px", color: "var(--cx-text-secondary)" }}>
                      {event.host.contactPhone}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* SOCIAL LINKS */}
            {event.socialLinks && Object.values(event.socialLinks).some(v => v) && (
              <div className="cx-panel-card">
                <div className="cx-panel-card-title">🔗 Social Links</div>
                {event.socialLinks.instagram && (
                  <a href={event.socialLinks.instagram} target="_blank" rel="noreferrer" className="cx-social-link">
                    <FaInstagram color="#e1306c" size={16} /> Instagram
                  </a>
                )}
                {event.socialLinks.facebook && (
                  <a href={event.socialLinks.facebook} target="_blank" rel="noreferrer" className="cx-social-link">
                    <FaFacebook color="#1877f2" size={16} /> Facebook
                  </a>
                )}
                {event.socialLinks.linkedin && (
                  <a href={event.socialLinks.linkedin} target="_blank" rel="noreferrer" className="cx-social-link">
                    <FaLinkedin color="#0077b5" size={16} /> LinkedIn
                  </a>
                )}
                {event.socialLinks.website && (
                  <a href={event.socialLinks.website} target="_blank" rel="noreferrer" className="cx-social-link">
                    <FaGlobe color="#6366f1" size={16} /> Website
                  </a>
                )}
              </div>
            )}

            {/* SHARE */}
            <div className="cx-panel-card" style={{ textAlign: "center" }}>
              <div className="cx-panel-card-title">📤 Share Event</div>
              <p style={{ fontSize: "13px", color: "var(--cx-text-muted)", marginBottom: "16px" }}>
                Spread the word about this event!
              </p>
              <button
                className="cx-btn cx-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleShare}
              >
                <FaShareAlt /> Share Event
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default EventDetails;
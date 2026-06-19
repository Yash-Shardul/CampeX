import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { Row, Col } from "react-bootstrap";
import {
  FaUsers,
  FaMapMarkerAlt,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaFacebook,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function ClubDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);

  useEffect(() => {
    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const res = await axios.get("/clubs");
      const foundClub = res.data.find((c) => c._id === id);
      setClub(foundClub || null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!club) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎓</div>
        <h3 style={{ color: "var(--cx-text-secondary)", marginBottom: "16px" }}>Club not found</h3>
        <button className="cx-btn cx-btn-primary" onClick={() => navigate("/clubs")}>
          ← Back to Clubs
        </button>
      </div>
    );
  }

  const whatsappLink = club.contactNumber
    ? `https://wa.me/91${club.contactNumber.replace(/\D/g, "")}`
    : "#";

  return (
    <div>
      {/* Back Button */}
      <button className="cx-back-btn" onClick={() => navigate("/clubs")}>
        ← Back to Clubs
      </button>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, var(--cx-primary-light), #ede9fe)",
        borderRadius: "var(--cx-radius-xl)",
        padding: "48px 40px",
        marginBottom: "32px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--cx-border)",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(79, 70, 229, 0.08)",
          pointerEvents: "none"
        }} />

        {/* Logo */}
        {club.logo ? (
          <img
            src={`http://localhost:5000${club.logo}`}
            alt={club.name}
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "4px solid white",
              boxShadow: "var(--cx-shadow-lg)",
              marginBottom: "20px"
            }}
          />
        ) : (
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--cx-gradient-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            margin: "0 auto 20px",
            boxShadow: "var(--cx-shadow-lg)",
          }}>
            🎓
          </div>
        )}

        <h1 style={{
          fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
          fontWeight: 800,
          color: "var(--cx-text-primary)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          marginBottom: "12px"
        }}>
          {club.name}
        </h1>

        {club.category && (
          <span className="cx-badge cx-badge-primary" style={{ marginBottom: "16px", display: "inline-flex" }}>
            {club.category}
          </span>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "8px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--cx-text-secondary)", fontSize: "14px" }}>
            <FaUsers size={14} />
            {club.activeMembersCount || 0} Members
          </span>
          {club.department && (
            <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--cx-text-secondary)", fontSize: "14px" }}>
              <FaMapMarkerAlt size={14} />
              {club.department}
            </span>
          )}
        </div>

        {club.contactNumber && (
          <div style={{ marginTop: "20px" }}>
            <button
              className="cx-btn cx-btn-primary cx-btn-lg"
              onClick={() => window.open(whatsappLink, "_blank")}
            >
              <FaWhatsapp /> Connect on WhatsApp
            </button>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <Row className="g-4">
        {/* LEFT */}
        <Col lg={8}>
          {/* Mission */}
          <div className="cx-card" style={{ padding: "28px", marginBottom: "20px" }}>
            <h4 style={{ fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                width: "32px", height: "32px", background: "var(--cx-primary-light)",
                borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px"
              }}>🎯</span>
              Our Mission
            </h4>
            <p style={{ color: "var(--cx-text-secondary)", lineHeight: 1.8, margin: 0, fontSize: "15px" }}>
              {club.description || "No description available."}
            </p>
          </div>

          {/* Activity Images */}
          {club.activityImages?.length > 0 && (
            <div className="cx-card" style={{ padding: "28px", marginBottom: "20px" }}>
              <h4 style={{ fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{
                  width: "32px", height: "32px", background: "var(--cx-primary-light)",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px"
                }}>📸</span>
                Recent Club Life
              </h4>

              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={3}
                loop
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                breakpoints={{
                  0: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  992: { slidesPerView: 3 },
                }}
              >
                {club.activityImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="cx-activity-img-wrap">
                      <img
                        src={`http://localhost:5000${img}`}
                        alt="club activity"
                        className="cx-activity-img"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </Col>

        {/* RIGHT SIDEBAR */}
        <Col lg={4}>
          {/* Contact */}
          <div className="cx-panel-card">
            <div className="cx-panel-card-title">📬 Contact Info</div>
            {club.contactEmail && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", borderBottom: "1px solid var(--cx-border-light)" }}>
                <FaEnvelope color="#ef4444" />
                <span style={{ fontSize: "14px", color: "var(--cx-text-secondary)", wordBreak: "break-all" }}>
                  {club.contactEmail}
                </span>
              </div>
            )}
            {club.contactNumber && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0" }}>
                <FaWhatsapp color="#22c55e" />
                <span style={{ fontSize: "14px", color: "var(--cx-text-secondary)" }}>
                  {club.contactNumber}
                </span>
              </div>
            )}
            {!club.contactEmail && !club.contactNumber && (
              <p style={{ fontSize: "14px", color: "var(--cx-text-muted)", margin: 0 }}>No contact info available.</p>
            )}
          </div>

          {/* Social Links */}
          {(club.socialLinks?.instagram || club.socialLinks?.linkedin || club.socialLinks?.website || club.socialLinks?.facebook) && (
            <div className="cx-panel-card">
              <div className="cx-panel-card-title">🔗 Social Links</div>
              {club.socialLinks?.instagram && (
                <a href={club.socialLinks.instagram} target="_blank" rel="noreferrer" className="cx-social-link">
                  <FaInstagram color="#e1306c" size={16} />
                  Instagram
                </a>
              )}
              {club.socialLinks?.linkedin && (
                <a href={club.socialLinks.linkedin} target="_blank" rel="noreferrer" className="cx-social-link">
                  <FaLinkedin color="#0077b5" size={16} />
                  LinkedIn
                </a>
              )}
              {club.socialLinks?.website && (
                <a href={club.socialLinks.website} target="_blank" rel="noreferrer" className="cx-social-link">
                  <FaGlobe color="#6366f1" size={16} />
                  Website
                </a>
              )}
              {club.socialLinks?.facebook && (
                <a href={club.socialLinks.facebook} target="_blank" rel="noreferrer" className="cx-social-link">
                  <FaFacebook color="#1877f2" size={16} />
                  Facebook
                </a>
              )}
            </div>
          )}

          {/* Leadership */}
          <div className="cx-panel-card">
            <div className="cx-panel-card-title">👑 Club Leadership</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {club.president && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--cx-text-muted)" }}>President</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--cx-text-primary)" }}>{club.president}</span>
                </div>
              )}
              {club.type && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--cx-text-muted)" }}>Type</span>
                  <span className="cx-badge cx-badge-muted" style={{ textTransform: "capitalize" }}>{club.type}</span>
                </div>
              )}
              {club.category && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", color: "var(--cx-text-muted)" }}>Category</span>
                  <span className="cx-badge cx-badge-primary">{club.category}</span>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ClubDetails;
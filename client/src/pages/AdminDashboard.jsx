import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token;
  const navigate = useNavigate();

  const [stats, setStats] = useState({ clubs: 0, events: 0, subAdmins: 0 });
  const [loading, setLoading] = useState(true);
  const [siteVisits, setSiteVisits] = useState(0);

  const hasPermission = (permission) => {
    if (!adminInfo) return false;
    if (adminInfo.permissions?.includes("ALL")) return true;
    return adminInfo.permissions?.includes(permission);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.log("Error fetching stats");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    const visits = parseInt(localStorage.getItem("cx_site_visits") || "0");
    setSiteVisits(visits);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  /* All KPI cards including Site Visits in the main section */
  const kpiCards = [
    {
      key: "CLUBS",
      label: "Total Clubs",
      value: stats.clubs,
      color: "blue",
      link: "/admin/clubs",
      desc: "Active campus clubs",
      trend: "+2 this month",
      icon: "🏛️",
    },
    {
      key: "EVENTS",
      label: "Total Events",
      value: stats.events,
      color: "purple",
      link: "/admin/events",
      desc: "All campus events",
      trend: "Active & upcoming",
      icon: "📅",
    },
    {
      key: "SUBADMINS",
      label: "Sub Admins",
      value: stats.subAdmins,
      color: "cyan",
      link: "/admin/subadmins",
      desc: "Admin accounts",
      trend: "Role-based access",
      icon: "👤",
    },
  ].filter((c) => hasPermission(c.key));

  if (loading) {
    return (
      <div className="cx-loading-screen">
        <div className="cx-spinner" />
        <span style={{ color: "rgba(148,163,184,0.7)", fontSize: "14px" }}>
          Loading dashboard...
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="cx-page-header">
        <div>
          <p style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", marginBottom: "4px", fontWeight: 500 }}>
            {greeting}
          </p>
          <h1 className="cx-page-title">{adminInfo?.name || "Admin"}</h1>
          <p className="cx-page-subtitle">
            Here's what's happening with your campus platform today.
          </p>
        </div>
        {/* Dark/Light mode toggle for admin */}
        <button
          onClick={() => {
            const isDark = document.body.classList.toggle("cx-dark");
            localStorage.setItem("cx_dark_mode", isDark);
          }}
          title="Toggle dark/light mode"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.transform = "scale(1.1) rotate(12deg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.06)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          id="admin-theme-toggle"
        >
          🌙
        </button>
      </div>

      {/* ── MAIN KPI GRID — includes Site Visits ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        {/* Site Visits — first prominent card */}
        <div
          className="cx-kpi-card"
          style={{
            background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(56,189,248,0.12))",
            border: "1px solid rgba(167,139,250,0.25)",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>📊</div>
          <div className="cx-kpi-value" style={{ fontSize: "2rem" }}>
            {siteVisits.toLocaleString()}
          </div>
          <div className="cx-kpi-label">Site Visits</div>
          <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)", marginTop: "6px" }}>
            Total page visits
          </div>
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "11px",
              color: "rgba(167,139,250,0.7)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            🔥 Live counter
          </div>
        </div>

        {kpiCards.map((card) => (
          <div
            key={card.key}
            className={`cx-kpi-card ${card.color}`}
            style={{ cursor: "pointer" }}
            onClick={() => navigate(card.link)}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{card.icon}</div>
            <div className="cx-kpi-value">{card.value}</div>
            <div className="cx-kpi-label">{card.label}</div>
            <div style={{
              fontSize: "11px",
              color: "rgba(148,163,184,0.45)",
              marginTop: "6px",
            }}>
              {card.desc}
            </div>
            <div style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              fontSize: "11px",
              color: "rgba(148,163,184,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}>
              {card.trend}
            </div>
          </div>
        ))}

        {/* Platform status */}
        <div className="cx-kpi-card green">
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✅</div>
          <div className="cx-kpi-value" style={{ fontSize: "1.3rem" }}>Online</div>
          <div className="cx-kpi-label">Platform Status</div>
          <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.45)", marginTop: "6px" }}>
            All systems operational
          </div>
          <div style={{
            marginTop: "14px",
            paddingTop: "12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            fontSize: "11px",
            color: "rgba(52, 211, 153, 0.6)",
          }}>
            99.9% uptime
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "rgba(148,163,184,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "14px",
        }}>
          Quick Actions
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {hasPermission("EVENTS") && (
            <button
              className="cx-admin-btn-primary"
              onClick={() => navigate("/admin/events")}
            >
              Add Event
            </button>
          )}
          {hasPermission("CLUBS") && (
            <button
              className="cx-admin-btn-primary"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              onClick={() => navigate("/admin/clubs")}
            >
              Add Club
            </button>
          )}
          {hasPermission("SUBADMINS") && (
            <button
              className="cx-admin-btn-primary"
              style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
              onClick={() => navigate("/admin/subadmins")}
            >
              Manage Admins
            </button>
          )}
        </div>
      </div>

      {/* Role Info */}
      <div style={{
        background: "rgba(79, 70, 229, 0.07)",
        border: "1px solid rgba(79, 70, 229, 0.18)",
        borderRadius: "16px",
        padding: "22px 24px",
      }}>
        <div style={{ fontWeight: 700, color: "white", fontSize: "14px", marginBottom: "8px" }}>
          Admin Role — {adminInfo?.role === "main" ? "Main Administrator" : "Sub Administrator"}
        </div>
        <p style={{ color: "rgba(148,163,184,0.65)", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
          {adminInfo?.role === "main"
            ? "You have full access to all platform features including sub-admin management, events, and clubs."
            : `Your access: ${adminInfo?.permissions?.join(", ") || "limited features"}.`}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
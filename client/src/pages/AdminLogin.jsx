import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        formData
      );
      localStorage.setItem("adminInfo", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cx-admin-login-page">
      <div className="cx-admin-login-card">

        {/* LEFT PANEL — Brand only, no feature list */}
        <div className="cx-admin-login-left">
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Brand Mark */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{
                width: "52px",
                height: "52px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                fontSize: "18px",
                color: "white",
                marginBottom: "20px",
                backdropFilter: "blur(10px)",
              }}>
                CX
              </div>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "8px",
              }}>
                CampeX Platform
              </div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.2,
                margin: 0,
              }}>
                Control your campus from one place.
              </h2>
            </div>

            {/* Divider */}
            <div style={{
              width: "48px",
              height: "3px",
              background: "rgba(255,255,255,0.25)",
              borderRadius: "2px",
              marginBottom: "28px",
            }} />

            <p style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "14px",
              lineHeight: 1.8,
              margin: 0,
              maxWidth: "280px",
            }}>
              Manage events, clubs, student activities, and administrators
              from your enterprise-grade dashboard.
            </p>
          </div>

          {/* Bottom decoration strip */}
          <div style={{
            position: "relative",
            zIndex: 1,
            padding: "20px 0 0",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}>
              Secure Admin Access
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Form */}
        <div className="cx-admin-login-right">
          <div style={{ maxWidth: "360px", width: "100%", margin: "0 auto" }}>
            <div style={{ marginBottom: "36px" }}>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "var(--cx-text-primary)",
                marginBottom: "8px",
              }}>
                Welcome back
              </h1>
              <p style={{ color: "var(--cx-text-muted)", fontSize: "14px", margin: 0 }}>
                Sign in to your admin account to continue.
              </p>
            </div>

            {error && (
              <div className="cx-alert cx-alert-danger" style={{ marginBottom: "20px" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "18px" }}>
                <label className="cx-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="cx-input"
                  placeholder="admin@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  id="admin-email"
                  autoComplete="email"
                />
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label className="cx-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="cx-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  id="admin-password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="cx-btn cx-btn-primary"
                style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "14px" }}
                disabled={loading}
                id="admin-login-submit"
              >
                {loading ? (
                  <>
                    <div
                      className="cx-spinner"
                      style={{ width: "16px", height: "16px", borderWidth: "2px" }}
                    />
                    Signing In...
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <p style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: "var(--cx-text-muted)",
            }}>
              Not an admin?{" "}
              <span
                style={{ color: "var(--cx-primary)", cursor: "pointer", fontWeight: 600 }}
                onClick={() => navigate("/")}
              >
                Go to Home
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
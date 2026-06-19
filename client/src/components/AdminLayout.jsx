import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  const logoutHandler = () => {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const hasPermission = (permission) => {
    if (!adminInfo) return false;
    if (adminInfo.permissions?.includes("ALL")) return true;
    return adminInfo.permissions?.includes(permission);
  };

  const avatarLetter = adminInfo?.name?.charAt(0)?.toUpperCase() || "A";

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard",        always: true },
    { to: "/admin/clubs",     label: "Manage Clubs",     perm: "CLUBS" },
    { to: "/admin/events",    label: "Manage Events",    perm: "EVENTS" },
    { to: "/admin/subadmins", label: "Sub Admins",       perm: "SUBADMINS" },
  ];

  return (
    <div className="cx-admin-layout">
      {/* ====== SIDEBAR ====== */}
      <aside className="cx-admin-sidebar">
        {/* Brand */}
        <div className="cx-sidebar-header">
          <div className="cx-sidebar-brand">
            <div className="cx-sidebar-brand-icon">CX</div>
            <div>
              <div className="cx-sidebar-brand-text">CampeX</div>
              <div className="cx-sidebar-brand-sub">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <ul className="cx-sidebar-nav">
          <li className="cx-sidebar-section-label">Navigation</li>
          {navItems.map((item) => {
            if (!item.always && !hasPermission(item.perm)) return null;
            return (
              <li key={item.to} className="cx-sidebar-nav-item">
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `cx-sidebar-nav-link${isActive ? " active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Footer — only logout */}
        <div className="cx-sidebar-footer">
          <button
            onClick={logoutHandler}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              borderRadius: "10px",
              color: "#f87171",
              cursor: "pointer",
              width: "100%",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s ease",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ====== MAIN ====== */}
      <div className="cx-admin-main">
        {/* Topbar */}
        <header className="cx-admin-topbar">
          <div className="cx-admin-topbar-left">
            <div>
              <div className="cx-admin-topbar-title">Admin Control Center</div>
              <div className="cx-admin-topbar-subtitle">Manage your campus platform</div>
            </div>
          </div>
          <div className="cx-admin-topbar-right">
            <div className="cx-admin-topbar-user">
              <div className="cx-admin-topbar-avatar">{avatarLetter}</div>
              <div>
                <div className="cx-admin-topbar-name">{adminInfo?.name || "Admin"}</div>
                <div className="cx-admin-topbar-role">{adminInfo?.role || "Administrator"}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="cx-admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
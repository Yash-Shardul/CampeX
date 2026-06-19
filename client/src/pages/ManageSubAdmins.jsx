import React, { useEffect, useState } from "react";

const ManageSubAdmins = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token;
  const API = "http://localhost:5000/api/admin";
  const isMain = adminInfo?.role === "main";

  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", permissions: [],
  });

  const permissionOptions = [
    { key: "CLUBS",     icon: "🎓", desc: "Manage clubs" },
    { key: "EVENTS",    icon: "📅", desc: "Manage events" },
    { key: "SUBADMINS", icon: "👤", desc: "Manage sub-admins" },
  ];

  const fetchSubAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSubAdmins(data);
    } catch (err) { setError("Failed to fetch sub admins"); }
    setLoading(false);
  };

  useEffect(() => { if (isMain) fetchSubAdmins(); }, []);

  const togglePermission = (perm) => {
    const updated = formData.permissions.includes(perm)
      ? formData.permissions.filter((p) => p !== perm)
      : [...formData.permissions, perm];
    setFormData({ ...formData, permissions: updated });
  };

  const openModal = (admin = null) => {
    setError(""); setSuccess("");
    if (admin) {
      setEditMode(true); setCurrentId(admin._id);
      setFormData({ name: admin.name, email: admin.email, password: "", permissions: admin.permissions || [] });
    } else {
      setEditMode(false);
      setFormData({ name: "", email: "", password: "", permissions: [] });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const url = editMode ? `${API}/update/${currentId}` : `${API}/create-subadmin`;
      const method = editMode ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong"); setLoading(false); return; }
      setSuccess(editMode ? "Sub Admin updated!" : "Sub Admin created!");
      setShowModal(false);
      fetchSubAdmins();
    } catch (err) { setError("Server error"); }
    setLoading(false);
  };

  const deleteSubAdmin = async (id) => {
    if (!window.confirm("Delete this sub admin?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSuccess("Sub Admin deleted.");
    fetchSubAdmins();
  };

  const filteredAdmins = subAdmins.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Permission denied view
  if (!isMain) {
    return (
      <div style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "rgba(239, 68, 68, 0.06)",
        border: "1px solid rgba(239, 68, 68, 0.15)",
        borderRadius: "20px",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔒</div>
        <h3 style={{ color: "#f87171", marginBottom: "8px" }}>Access Restricted</h3>
        <p style={{ color: "rgba(148,163,184,0.7)", fontSize: "14px" }}>
          Only the Main Administrator can manage sub-admin accounts.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="cx-page-header">
        <div>
          <h1 className="cx-page-title">Manage Sub Admins</h1>
          <p className="cx-page-subtitle">Create and manage administrator accounts with specific permissions.</p>
        </div>
        <button className="cx-admin-btn-primary" onClick={() => openModal()} id="add-subadmin-btn">
          + Add Sub Admin
        </button>
      </div>

      {/* Alerts */}
      {error   && <div className="cx-alert cx-alert-danger"><span>⚠️</span> {error}</div>}
      {success && <div className="cx-alert cx-alert-success"><span>✅</span> {success}</div>}

      {/* TABLE */}
      <div className="cx-admin-table-wrap">
        <div className="cx-admin-table-header">
          <div className="cx-admin-table-title">All Sub Admins ({subAdmins.length})</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.5)", fontSize: "14px" }}>🔍</span>
            <input
              type="text"
              className="cx-dark-input"
              style={{ paddingLeft: "36px", width: "220px" }}
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-subadmins-search"
            />
          </div>
        </div>

        {loading ? (
          <div className="cx-loading-screen">
            <div className="cx-spinner" />
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="cx-admin-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "rgba(148,163,184,0.5)" }}>
                      No sub admins found. Create one above.
                    </td>
                  </tr>
                ) : filteredAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "50%",
                          background: "var(--cx-gradient-card)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, color: "white", fontSize: "14px", flexShrink: 0,
                        }}>
                          {admin.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                          {admin.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ color: "rgba(148,163,184,0.7)" }}>{admin.email}</td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {admin.permissions?.length > 0 ? (
                          admin.permissions.map((perm) => (
                            <span key={perm} className="cx-badge cx-badge-accent" style={{ fontSize: "10px" }}>
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "12px", color: "rgba(148,163,184,0.5)" }}>None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="cx-admin-btn-edit" onClick={() => openModal(admin)}>
                          ✏️ Edit
                        </button>
                        <button className="cx-admin-btn-delete" onClick={() => deleteSubAdmin(admin._id)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="cx-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="cx-modal">
            <div className="cx-modal-header">
              <div className="cx-modal-title">
                {editMode ? "Edit Sub Admin" : "Create Sub Admin"}
              </div>
              <button className="cx-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="cx-modal-body">
              <form onSubmit={handleSubmit} id="subadmin-form">
                <div style={{ marginBottom: "16px" }}>
                  <label className="cx-dark-label">Full Name *</label>
                  <input type="text" className="cx-dark-input" required
                    placeholder="Admin name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    id="subadmin-name" />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label className="cx-dark-label">Email Address *</label>
                  <input type="email" className="cx-dark-input" required
                    placeholder="admin@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    id="subadmin-email" />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label className="cx-dark-label">
                    Password {editMode && <span style={{ fontWeight: 400, textTransform: "none", color: "rgba(148,163,184,0.5)" }}>(leave blank to keep current)</span>}
                  </label>
                  <input type="password" className="cx-dark-input"
                    placeholder={editMode ? "Leave blank to keep same" : "Set password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    id="subadmin-password" />
                </div>

                <div>
                  <label className="cx-dark-label" style={{ marginBottom: "12px", display: "block" }}>Permissions</label>
                  {permissionOptions.map(({ key, icon, desc }) => (
                    <div
                      key={key}
                      className="cx-perm-check"
                      onClick={() => togglePermission(key)}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(key)}
                        onChange={() => togglePermission(key)}
                        onClick={(e) => e.stopPropagation()}
                        id={`perm-${key}`}
                      />
                      <span style={{ fontSize: "18px" }}>{icon}</span>
                      <div>
                        <div className="cx-perm-check-label">{key}</div>
                        <div style={{ fontSize: "11px", color: "rgba(148,163,184,0.5)" }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {error && (
                  <div className="cx-alert cx-alert-danger" style={{ marginTop: "16px" }}>
                    <span>⚠️</span> {error}
                  </div>
                )}

                <div className="cx-modal-footer" style={{ padding: "20px 0 0", margin: 0, border: "none" }}>
                  <button type="button" className="cx-admin-btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="cx-admin-btn-primary" disabled={loading} id="subadmin-submit">
                    {loading ? "Saving..." : (editMode ? "✓ Update Admin" : "+ Create Admin")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubAdmins;
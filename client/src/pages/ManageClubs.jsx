import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

const departments = ["Computer Engineering", "IT", "Mechanical", "Civil", "Electronics"];

export default function ManageClubs() {
  const [clubs, setClubs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [existingLogo, setExistingLogo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "", description: "", type: "general",
    department: "", category: "", president: "",
    contactEmail: "", contactNumber: "", activeMembersCount: 0,
    socialLinks: { instagram: "", website: "", facebook: "", linkedin: "" },
  });

  const [logo, setLogo] = useState(null);
  const [activityImages, setActivityImages] = useState([]);

  const fetchClubs = async () => {
    try {
      const res = await axios.get("/clubs");
      setClubs(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchClubs(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setFormData({ ...formData, socialLinks: { ...formData.socialLinks, [key]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "socialLinks") data.append("socialLinks", JSON.stringify(formData.socialLinks));
      else data.append(key, formData[key]);
    });
    data.append("existingImages", JSON.stringify(existingImages));
    data.append("existingLogo", existingLogo);
    if (logo) data.append("logo", logo);
    Array.from(activityImages).forEach((img) => data.append("activityImages", img));

    try {
      if (editingId) await axios.put(`/clubs/${editingId}`, data);
      else           await axios.post("/clubs", data);
      resetForm();
      fetchClubs();
    } catch (err) { console.error("Error saving club:", err); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this club?")) return;
    try { await axios.delete(`/clubs/${id}`); fetchClubs(); }
    catch (err) { console.error(err); }
  };

  const handleEdit = (club) => {
    setFormData({
      name: club.name || "", description: club.description || "",
      type: club.type || "general", department: club.department || "",
      category: club.category || "", president: club.president || "",
      contactEmail: club.contactEmail || "", contactNumber: club.contactNumber || "",
      activeMembersCount: club.activeMembersCount || 0,
      socialLinks: {
        instagram: club.socialLinks?.instagram || "",
        website: club.socialLinks?.website || "",
        facebook: club.socialLinks?.facebook || "",
        linkedin: club.socialLinks?.linkedin || "",
      },
    });
    setExistingImages(club.activityImages || []);
    setExistingLogo(club.logo || "");
    setEditingId(club._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: "", description: "", type: "general",
      department: "", category: "", president: "",
      contactEmail: "", contactNumber: "", activeMembersCount: 0,
      socialLinks: { instagram: "", website: "", facebook: "", linkedin: "" },
    });
    setExistingImages([]); setExistingLogo("");
    setLogo(null); setActivityImages([]);
  };

  const filteredClubs = clubs.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.type?.toLowerCase().includes(search.toLowerCase()) ||
    c.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="cx-page-header">
        <div>
          <h1 className="cx-page-title">Manage Clubs</h1>
          <p className="cx-page-subtitle">Create, edit, and manage campus clubs.</p>
        </div>
        <button
          className="cx-admin-btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          id="add-club-btn"
        >
          {showForm ? "✕ Cancel" : "+ Add New Club"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="cx-admin-form-card">
          <div className="cx-admin-form-title">
            <span style={{
              width: "28px", height: "28px", background: "rgba(79,70,229,0.2)",
              borderRadius: "8px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "14px"
            }}>🎓</span>
            {editingId ? "Edit Club" : "Create New Club"}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="cx-dark-label">Club Name *</label>
                <input type="text" name="name" className="cx-dark-input"
                  placeholder="Enter club name"
                  value={formData.name} onChange={handleChange} required id="club-name" />
              </div>

              <div className="col-md-3">
                <label className="cx-dark-label">Type</label>
                <select name="type" className="cx-dark-input cx-dark-select"
                  value={formData.type} onChange={handleChange}>
                  <option value="general">General</option>
                  <option value="department">Department</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="cx-dark-label">Category</label>
                <input type="text" name="category" className="cx-dark-input"
                  placeholder="e.g. Technical, Arts"
                  value={formData.category} onChange={handleChange} id="club-category" />
              </div>

              {formData.type === "department" && (
                <div className="col-md-6">
                  <label className="cx-dark-label">Department</label>
                  <select name="department" className="cx-dark-input cx-dark-select"
                    value={formData.department} onChange={handleChange}>
                    <option value="">Select Department</option>
                    {departments.map((d, i) => <option key={i}>{d}</option>)}
                  </select>
                </div>
              )}

              <div className="col-md-6">
                <label className="cx-dark-label">President</label>
                <input type="text" name="president" className="cx-dark-input"
                  placeholder="President's name"
                  value={formData.president} onChange={handleChange} id="club-president" />
              </div>

              <div className="col-md-6">
                <label className="cx-dark-label">Active Members Count</label>
                <input type="number" name="activeMembersCount" className="cx-dark-input"
                  placeholder="0"
                  value={formData.activeMembersCount} onChange={handleChange} id="club-members" />
              </div>

              <div className="col-md-6">
                <label className="cx-dark-label">Contact Email</label>
                <input type="email" name="contactEmail" className="cx-dark-input"
                  placeholder="club@college.edu"
                  value={formData.contactEmail} onChange={handleChange} id="club-email" />
              </div>

              <div className="col-md-6">
                <label className="cx-dark-label">Contact Number</label>
                <input type="text" name="contactNumber" className="cx-dark-input"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber} onChange={handleChange} id="club-phone" />
              </div>

              <div className="col-12">
                <label className="cx-dark-label">Description</label>
                <textarea name="description" className="cx-dark-input" rows={3}
                  placeholder="Describe your club's mission and activities..."
                  value={formData.description} onChange={handleChange}
                  style={{ resize: "vertical" }} id="club-desc" />
              </div>

              {/* Social Links */}
              <div className="col-12">
                <div className="cx-admin-form-section">Social Links (Optional)</div>
              </div>
              {[
                { name: "socialLinks.instagram", placeholder: "Instagram URL", icon: "📸" },
                { name: "socialLinks.website",   placeholder: "Website URL",   icon: "🌐" },
                { name: "socialLinks.facebook",  placeholder: "Facebook URL",  icon: "👥" },
                { name: "socialLinks.linkedin",  placeholder: "LinkedIn URL",  icon: "💼" },
              ].map(({ name, placeholder, icon }) => (
                <div className="col-md-6" key={name}>
                  <label className="cx-dark-label">{icon} {name.split(".")[1].charAt(0).toUpperCase() + name.split(".")[1].slice(1)}</label>
                  <input type="text" name={name} className="cx-dark-input"
                    placeholder={placeholder}
                    value={formData.socialLinks[name.split(".")[1]]}
                    onChange={handleChange} />
                </div>
              ))}

              {/* Logo */}
              <div className="col-12">
                <div className="cx-admin-form-section">Club Logo</div>
              </div>
              {editingId && existingLogo && (
                <div className="col-12">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div className="cx-img-preview">
                      <img src={`http://localhost:5000${existingLogo}`} alt="logo"
                        style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                      <button type="button" className="cx-img-remove"
                        onClick={() => setExistingLogo("")}>×</button>
                    </div>
                    <span style={{ color: "rgba(148,163,184,0.6)", fontSize: "13px", alignSelf: "center" }}>
                      Current logo — upload a new one to replace
                    </span>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <label className="cx-dark-label">Upload Logo</label>
                <input type="file" className="cx-dark-input" accept="image/*"
                  onChange={(e) => setLogo(e.target.files[0])} id="club-logo" />
              </div>

              {/* Activity Images */}
              <div className="col-12">
                <div className="cx-admin-form-section">Activity Images</div>
              </div>
              {editingId && existingImages.length > 0 && (
                <div className="col-12">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {existingImages.map((img, index) => (
                      <div key={index} className="cx-img-preview">
                        <img src={`http://localhost:5000${img}`} alt="" />
                        <button type="button" className="cx-img-remove"
                          onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <label className="cx-dark-label">Upload Activity Images</label>
                <input type="file" multiple className="cx-dark-input" accept="image/*"
                  onChange={(e) => setActivityImages(e.target.files)} id="club-images" />
              </div>

              {/* Submit */}
              <div className="col-12" style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="cx-admin-btn-primary" disabled={submitting} id="club-submit">
                  {submitting ? "Saving..." : (editingId ? "✓ Update Club" : "+ Create Club")}
                </button>
                <button type="button" className="cx-admin-btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="cx-admin-table-wrap">
        <div className="cx-admin-table-header">
          <div className="cx-admin-table-title">All Clubs ({clubs.length})</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.5)", fontSize: "14px" }}>🔍</span>
            <input
              type="text"
              className="cx-dark-input"
              style={{ paddingLeft: "36px", width: "220px" }}
              placeholder="Search clubs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-clubs-search"
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="cx-admin-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>President</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "rgba(148,163,184,0.5)" }}>
                    No clubs found.
                  </td>
                </tr>
              ) : filteredClubs.map((club) => (
                <tr key={club._id}>
                  <td>
                    {club.logo ? (
                      <img
                        src={`http://localhost:5000${club.logo}`}
                        style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }}
                        alt=""
                      />
                    ) : (
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: "rgba(79,70,229,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px"
                      }}>🎓</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{club.name}</td>
                  <td>
                    <span className="cx-badge cx-badge-muted" style={{ textTransform: "capitalize", fontSize: "10px" }}>
                      {club.type}
                    </span>
                  </td>
                  <td style={{ color: "rgba(148,163,184,0.7)" }}>{club.department || "—"}</td>
                  <td style={{ color: "rgba(148,163,184,0.7)" }}>{club.president || "—"}</td>
                  <td>
                    <span className="cx-badge cx-badge-primary" style={{ fontSize: "10px" }}>
                      {club.activeMembersCount || 0}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="cx-admin-btn-edit" onClick={() => handleEdit(club)}>
                        ✏️ Edit
                      </button>
                      <button className="cx-admin-btn-delete" onClick={() => handleDelete(club._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
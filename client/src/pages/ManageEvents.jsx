import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "", description: "", club: "",
    startTime: "", endTime: "",
    eventType: "Offline", venue: "",
    category: "Other", maxParticipants: "",
    guests: [""],
    instagram: "", website: "", facebook: "", linkedin: "",
    hostName: "", contactEmail: "", contactPhone: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [newBanner, setNewBanner] = useState(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
  const token = adminInfo?.token || localStorage.getItem("token");

  const fetchEvents = async () => {
    const res = await axios.get(API_URL);
    setEvents(res.data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNewImages = (e) => setNewImages([...e.target.files]);
  const handleRemoveExistingImage = (img) => {
    setRemovedImages([...removedImages, img]);
    setExistingImages(existingImages.filter((i) => i !== img));
  };
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setNewBanner(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleEdit = (event) => {
    setEditingId(event._id);
    setShowForm(true);
    setFormData({
      title: event.title, description: event.description, club: event.club || "",
      startTime: event.startTime ? event.startTime.slice(0, 16) : "",
      endTime: event.endTime ? event.endTime.slice(0, 16) : "",
      eventType: event.eventType || "Offline", venue: event.venue || "",
      category: event.category, maxParticipants: event.maxParticipants || "",
      guests: event.guests?.length > 0 ? event.guests : [""],
      instagram: event.socialLinks?.instagram || "",
      website: event.socialLinks?.website || "",
      facebook: event.socialLinks?.facebook || "",
      linkedin: event.socialLinks?.linkedin || "",
      hostName: event.host?.name || "",
      contactEmail: event.host?.contactEmail || "",
      contactPhone: event.host?.contactPhone || "",
    });
    setExistingImages(event.images || []);
    setBannerPreview(event.banner ? `http://localhost:5000/${event.banner}` : null);
    setRemovedImages([]);
    setRemoveBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (key === "guests") data.append("guests", JSON.stringify(val));
        else data.append(key, val || "");
      });
      removedImages.forEach((img) => data.append("removedImages", img));
      newImages.forEach((img) => data.append("images", img));
      if (newBanner) data.append("banner", newBanner);
      if (removeBanner) data.append("removeBanner", "true");

      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, data, { headers });
      } else {
        await axios.post(API_URL, data, { headers });
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Failed to submit event.");
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: "", description: "", club: "",
      startTime: "", endTime: "",
      eventType: "Offline", venue: "",
      category: "Other", maxParticipants: "",
      guests: [""],
      instagram: "", website: "", facebook: "", linkedin: "",
      hostName: "", contactEmail: "", contactPhone: "",
    });
    setExistingImages([]); setNewImages([]);
    setBannerPreview(null); setNewBanner(null);
    setRemovedImages([]); setRemoveBanner(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    }
  };

  const filteredEvents = events.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.category?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status) => ({
    "Upcoming":  "cx-badge-success",
    "Ongoing":   "cx-badge-accent",
    "Completed": "cx-badge-muted",
  }[status] || "cx-badge-muted");

  return (
    <div>
      {/* Page Header */}
      <div className="cx-page-header">
        <div>
          <h1 className="cx-page-title">Manage Events</h1>
          <p className="cx-page-subtitle">Create, edit, and manage campus events.</p>
        </div>
        <button
          className="cx-admin-btn-primary"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          id="add-event-btn"
        >
          {showForm ? "✕ Cancel" : "+ Add New Event"}
        </button>
      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="cx-admin-form-card">
          <div className="cx-admin-form-title">
            <span style={{
              width: "28px", height: "28px", background: "rgba(79,70,229,0.2)",
              borderRadius: "8px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "14px"
            }}>📅</span>
            {editingId ? "Edit Event" : "Create New Event"}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6">
                <label className="cx-dark-label">Event Title *</label>
                <input type="text" name="title" className="cx-dark-input"
                  placeholder="Enter event title"
                  value={formData.title} onChange={handleChange} required id="event-title" />
              </div>

              {/* Event Type */}
              <div className="col-md-3">
                <label className="cx-dark-label">Event Type</label>
                <select name="eventType" className="cx-dark-select cx-dark-input"
                  value={formData.eventType} onChange={handleChange}>
                  <option value="Offline">Offline</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              {/* Category */}
              <div className="col-md-3">
                <label className="cx-dark-label">Category</label>
                <select name="category" className="cx-dark-select cx-dark-input"
                  value={formData.category} onChange={handleChange}>
                  {["Technical", "Cultural", "Sports", "Workshop", "Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Start & End Time */}
              <div className="col-md-6">
                <label className="cx-dark-label">Start Time *</label>
                <input type="datetime-local" name="startTime" className="cx-dark-input"
                  value={formData.startTime} onChange={handleChange} required id="event-start" />
              </div>
              <div className="col-md-6">
                <label className="cx-dark-label">End Time *</label>
                <input type="datetime-local" name="endTime" className="cx-dark-input"
                  value={formData.endTime} onChange={handleChange} required id="event-end" />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="cx-dark-label">Description</label>
                <textarea name="description" className="cx-dark-input" rows={3}
                  placeholder="Describe your event..."
                  value={formData.description} onChange={handleChange}
                  style={{ resize: "vertical" }} id="event-desc" />
              </div>

              {/* Venue & Max Participants */}
              <div className="col-md-6">
                <label className="cx-dark-label">Venue</label>
                <input type="text" name="venue" className="cx-dark-input"
                  placeholder="e.g. Main Auditorium"
                  value={formData.venue} onChange={handleChange} id="event-venue" />
              </div>
              <div className="col-md-6">
                <label className="cx-dark-label">Max Participants</label>
                <input type="number" name="maxParticipants" className="cx-dark-input"
                  placeholder="Leave blank for unlimited"
                  value={formData.maxParticipants} onChange={handleChange} id="event-max" />
              </div>

              {/* Guests */}
              <div className="col-12">
                <div className="cx-admin-form-section">Guests (Max 4)</div>
                {formData.guests.map((guest, index) => (
                  <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <input
                      type="text"
                      className="cx-dark-input"
                      placeholder={`Guest ${index + 1} name`}
                      value={guest}
                      onChange={(e) => {
                        const g = [...formData.guests];
                        g[index] = e.target.value;
                        setFormData({ ...formData, guests: g });
                      }}
                    />
                    <div style={{ display: "flex", gap: "6px" }}>
                      {index === formData.guests.length - 1 && formData.guests.length < 4 && (
                        <button type="button" className="cx-admin-btn-secondary"
                          style={{ padding: "8px 14px", fontSize: "16px" }}
                          onClick={() => setFormData({ ...formData, guests: [...formData.guests, ""] })}>
                          +
                        </button>
                      )}
                      {formData.guests.length > 1 && (
                        <button type="button" className="cx-admin-btn-delete"
                          style={{ padding: "8px 14px", fontSize: "16px" }}
                          onClick={() => setFormData({ ...formData, guests: formData.guests.filter((_, i) => i !== index) })}>
                          −
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Host Details */}
              <div className="col-12">
                <div className="cx-admin-form-section">Host Details</div>
              </div>
              <div className="col-md-4">
                <label className="cx-dark-label">Host Name *</label>
                <input type="text" name="hostName" className="cx-dark-input"
                  placeholder="Host organization name"
                  value={formData.hostName} onChange={handleChange} required id="host-name" />
              </div>
              <div className="col-md-4">
                <label className="cx-dark-label">Contact Email *</label>
                <input type="email" name="contactEmail" className="cx-dark-input"
                  placeholder="host@email.com"
                  value={formData.contactEmail} onChange={handleChange} required id="host-email" />
              </div>
              <div className="col-md-4">
                <label className="cx-dark-label">Contact Phone *</label>
                <input type="text" name="contactPhone" className="cx-dark-input"
                  placeholder="+91 98765 43210"
                  value={formData.contactPhone} onChange={handleChange} required id="host-phone" />
              </div>

              {/* Social Links */}
              <div className="col-12">
                <div className="cx-admin-form-section">Social Links (Optional)</div>
              </div>
              {[
                { name: "instagram", placeholder: "Instagram URL", icon: "📸" },
                { name: "website",   placeholder: "Website URL",   icon: "🌐" },
                { name: "facebook",  placeholder: "Facebook URL",  icon: "👥" },
                { name: "linkedin",  placeholder: "LinkedIn URL",  icon: "💼" },
              ].map(({ name, placeholder, icon }) => (
                <div className="col-md-6" key={name}>
                  <label className="cx-dark-label">{icon} {name.charAt(0).toUpperCase() + name.slice(1)}</label>
                  <input type="text" name={name} className="cx-dark-input"
                    placeholder={placeholder}
                    value={formData[name]} onChange={handleChange} />
                </div>
              ))}

              {/* Banner */}
              <div className="col-12">
                <div className="cx-admin-form-section">Event Banner</div>
              </div>
              {bannerPreview && (
                <div className="col-12">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div className="cx-img-preview">
                      <img src={bannerPreview} alt="banner" style={{ width: "160px", height: "100px" }} />
                    </div>
                    <button type="button" className="cx-admin-btn-delete"
                      onClick={() => { setRemoveBanner(true); setBannerPreview(null); }}>
                      Remove Banner
                    </button>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <label className="cx-dark-label">Upload Banner</label>
                <input type="file" className="cx-dark-input" accept="image/*" onChange={handleBannerChange} />
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="col-12">
                  <div className="cx-admin-form-section">Existing Gallery Images</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {existingImages.map((img, i) => (
                      <div key={i} className="cx-img-preview">
                        <img src={`http://localhost:5000/${img}`} alt="" />
                        <button
                          type="button"
                          className="cx-img-remove"
                          onClick={() => handleRemoveExistingImage(img)}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              <div className="col-12">
                <div className="cx-admin-form-section">Add Gallery Images</div>
                <input type="file" multiple className="cx-dark-input" accept="image/*" onChange={handleNewImages} />
              </div>

              {/* Submit */}
              <div className="col-12" style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="submit" className="cx-admin-btn-primary" disabled={submitting} id="event-submit">
                  {submitting ? "Saving..." : (editingId ? "✓ Update Event" : "+ Create Event")}
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
          <div className="cx-admin-table-title">All Events ({events.length})</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "rgba(148,163,184,0.5)", fontSize: "14px" }}>🔍</span>
            <input
              type="text"
              className="cx-dark-input"
              style={{ paddingLeft: "36px", width: "220px" }}
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-events-search"
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="cx-admin-table">
            <thead>
              <tr>
                <th>Banner</th>
                <th>Title</th>
                <th>Start</th>
                <th>Category</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "48px", color: "rgba(148,163,184,0.5)" }}>
                    No events found.
                  </td>
                </tr>
              ) : filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>
                    {event.banner ? (
                      <img
                        src={`http://localhost:5000/${event.banner}`}
                        alt=""
                        style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    ) : (
                      <div style={{
                        width: "64px", height: "48px", borderRadius: "8px",
                        background: "rgba(79,70,229,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px"
                      }}>📅</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: "rgba(255,255,255,0.9)", maxWidth: "200px" }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {event.title}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(event.startTime).toLocaleString(undefined, {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>
                  <td>
                    <span className="cx-badge cx-badge-primary" style={{ fontSize: "10px" }}>
                      {event.category}
                    </span>
                  </td>
                  <td>
                    <span className="cx-badge cx-badge-muted" style={{ fontSize: "10px" }}>
                      {event.eventType}
                    </span>
                  </td>
                  <td>
                    <span className={`cx-badge ${statusColor(event.status)}`} style={{ fontSize: "10px" }}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="cx-admin-btn-edit" onClick={() => handleEdit(event)}>
                        ✏️ Edit
                      </button>
                      <button className="cx-admin-btn-delete" onClick={() => handleDelete(event._id)}>
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
};

export default ManageEvents;
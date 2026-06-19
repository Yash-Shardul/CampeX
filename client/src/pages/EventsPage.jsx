import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filteredByTab = events.filter((event) => {
    if (activeTab === "upcoming") return event.status === "Upcoming" || event.status === "Ongoing";
    if (activeTab === "past")     return event.status === "Completed";
    return true;
  });

  const filteredByCategory =
    selectedCategory === "All"
      ? filteredByTab
      : filteredByTab.filter(
          (event) => event.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const finalEvents = filteredByCategory.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ["All", "Technical", "Cultural", "Sports", "Workshop", "Other"];

  const statusColor = (status) => {
    if (status === "Upcoming") return { bg: "#dcfce7", color: "#16a34a" };
    if (status === "Ongoing")  return { bg: "#dbeafe", color: "#1d4ed8" };
    if (status === "Completed") return { bg: "var(--cx-surface)", color: "var(--cx-text-muted)" };
    return { bg: "var(--cx-surface)", color: "var(--cx-text-muted)" };
  };

  const renderEventCard = (event) => {
    const start = new Date(event.startTime);
    const sc = statusColor(event.status);

    return (
      <div
        key={event._id}
        className="cx-event-card"
        onClick={() => navigate(`/events/${event._id}`)}
        id={`event-${event._id}`}
        style={{ marginBottom: "16px" }}
      >
        {/* Image */}
        <div className="cx-event-card-img">
          {event.banner ? (
            <img
              src={`http://localhost:5000/${event.banner}`}
              alt={event.title}
            />
          ) : (
            <div style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #1e1b4b, #4c1d95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px"
            }}>📅</div>
          )}
          <div className="cx-event-card-img-overlay" />
          <div className="cx-event-card-img-info">
            <div style={{ fontSize: "11px", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {event.category}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="cx-event-card-body">
          <div>
            <div className="cx-event-card-tags">
              <span className="cx-badge cx-badge-primary">{event.category}</span>
              <span className="cx-badge cx-badge-muted">{event.eventType}</span>
              <span className="cx-badge" style={{ background: sc.bg, color: sc.color }}>
                {event.status}
              </span>
            </div>
            <div className="cx-event-card-title">{event.title}</div>
            <p className="cx-event-card-desc">{event.description}</p>
          </div>

          <div>
            <div className="cx-event-meta">
              <span className="cx-event-meta-item">
                📅 {start.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="cx-event-meta-item">
                ⏰ {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <span className="cx-event-meta-item">
                📍 {event.venue || "Online"}
              </span>
              <span className="cx-event-meta-item">
                👥 {event.maxParticipants || "Unlimited"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
              <span style={{ fontSize: "12px", color: "var(--cx-text-muted)" }}>
                By {event.host?.name || "Campus Team"}
              </span>
              <button
                className="cx-btn cx-btn-primary cx-btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event._id}`);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(1.6rem, 3vw, 2rem)",
          fontWeight: 800,
          color: "var(--cx-text-primary)",
          marginBottom: "8px"
        }}>
          Campus Events
        </h1>
        <p style={{ color: "var(--cx-text-muted)", fontSize: "15px" }}>
          Discover and participate in exciting campus events.
        </p>
        <div className="cx-section-divider" style={{ marginTop: "12px" }} />
      </div>

      {/* Search */}
      <div className="cx-search-wrap">
        <span className="cx-search-icon" style={{ fontSize: "16px" }}>🔍</span>
        <input
          type="text"
          className="cx-search-input"
          placeholder="Search events by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="events-search"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
        {[
          { key: "upcoming", label: "Upcoming & Ongoing", icon: "🚀" },
          { key: "past",     label: "Past Events",        icon: "📋" },
          { key: "all",      label: "All Events",         icon: "🗂️" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "9px 18px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s ease",
              background: activeTab === tab.key
                ? "var(--cx-primary)"
                : "var(--cx-surface)",
              color: activeTab === tab.key ? "white" : "var(--cx-text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            id={`tab-${tab.key}`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="cx-filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`cx-filter-pill${selectedCategory === cat ? " active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
            id={`cat-${cat.toLowerCase()}`}
          >
            {cat}
          </button>
        ))}

        {finalEvents.length > 0 && (
          <span style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "var(--cx-text-muted)",
            alignSelf: "center",
            fontWeight: 500,
          }}>
            {finalEvents.length} event{finalEvents.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Events List */}
      {finalEvents.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "var(--cx-surface)",
          borderRadius: "var(--cx-radius-xl)",
          border: "1px dashed var(--cx-border)",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
          <h3 style={{ color: "var(--cx-text-secondary)", marginBottom: "8px" }}>No events found</h3>
          <p style={{ color: "var(--cx-text-muted)", fontSize: "14px" }}>
            Try adjusting your search or switching tabs.
          </p>
          <button
            className="cx-btn cx-btn-outline"
            style={{ marginTop: "16px" }}
            onClick={() => { setSearch(""); setSelectedCategory("All"); setActiveTab("upcoming"); }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>{finalEvents.map((event) => renderEventCard(event))}</div>
      )}
    </div>
  );
}

export default EventsPage;
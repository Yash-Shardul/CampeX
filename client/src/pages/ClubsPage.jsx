import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { FaUsers } from "react-icons/fa";

function ClubsPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await axios.get("/clubs");
      setClubs(res.data || []);
    } catch (err) {
      console.error("Error fetching clubs:", err);
      setClubs([]);
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "general"
        ? club.type === "general"
        : club.type === "department";
    return matchesSearch && matchesFilter;
  });

  const filterLabels = [
    { key: "all",        label: "All Clubs",   icon: "🏛️" },
    { key: "general",    label: "General",     icon: "🌐" },
    { key: "department", label: "Department",  icon: "🎓" },
  ];

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
          Explore Clubs
        </h1>
        <p style={{ color: "var(--cx-text-muted)", fontSize: "15px" }}>
          Find your community, develop new skills, and pursue your passions.
        </p>
        <div className="cx-section-divider" style={{ marginTop: "12px" }} />
      </div>

      {/* Search Bar */}
      <div className="cx-search-wrap">
        <span className="cx-search-icon" style={{ fontSize: "16px" }}>🔍</span>
        <input
          type="text"
          className="cx-search-input"
          placeholder="Search for clubs, departments, interests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="clubs-search"
        />
      </div>

      {/* Filter Pills */}
      <div className="cx-filter-bar">
        {filterLabels.map((f) => (
          <button
            key={f.key}
            className={`cx-filter-pill${filter === f.key ? " active" : ""}`}
            onClick={() => setFilter(f.key)}
            id={`filter-${f.key}`}
          >
            <span>{f.icon}</span> {f.label}
          </button>
        ))}
        {filteredClubs.length > 0 && (
          <span style={{
            marginLeft: "auto",
            fontSize: "13px",
            color: "var(--cx-text-muted)",
            alignSelf: "center",
            fontWeight: 500,
          }}>
            {filteredClubs.length} club{filteredClubs.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "var(--cx-surface)",
          borderRadius: "var(--cx-radius-xl)",
          border: "1px dashed var(--cx-border)",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ color: "var(--cx-text-secondary)", marginBottom: "8px" }}>No clubs found</h3>
          <p style={{ color: "var(--cx-text-muted)", fontSize: "14px" }}>
            Try adjusting your search or filter criteria.
          </p>
          <button
            className="cx-btn cx-btn-outline"
            style={{ marginTop: "16px" }}
            onClick={() => { setSearchTerm(""); setFilter("all"); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="cx-grid-auto">
          {filteredClubs.map((club) => (
            <div
              key={club._id}
              className="cx-club-card"
              onClick={() => navigate(`/clubs/${club._id}`)}
              id={`club-${club._id}`}
            >
              {/* Image */}
              <div className="cx-club-card-img-wrap">
                {club.logo ? (
                  <img
                    src={`http://localhost:5000${club.logo}`}
                    className="cx-club-card-img"
                    alt={club.name}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "52px",
                    background: "linear-gradient(135deg, #e0e7ff, #ede9fe)"
                  }}>
                    🎓
                  </div>
                )}
                <div className="cx-club-card-overlay" />
                <div className="cx-club-card-badge-wrap">
                  {club.category && (
                    <span className="cx-badge cx-badge-primary" style={{ fontSize: "10px" }}>
                      {club.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="cx-club-card-body">
                <div className="cx-club-card-name">{club.name}</div>
                <p className="cx-club-card-desc">
                  {club.description || "Explore this amazing club and join our vibrant community."}
                </p>
              </div>

              {/* Footer */}
              <div className="cx-club-card-footer">
                <span className="cx-club-card-members">
                  <FaUsers size={12} />
                  {club.activeMembersCount || 0} members
                </span>
                <span className="cx-club-view-btn">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubsPage;
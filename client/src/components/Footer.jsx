import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="cx-footer">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <div className="cx-footer-brand">🎓 CampeX</div>
            <p className="cx-footer-desc">
              The next-generation campus exploration and event management platform
              for modern educational institutions.
            </p>
          </Col>

          <Col md={2}>
            <div className="cx-footer-heading">Explore</div>
            <NavLink to="/" className="cx-footer-link">Home</NavLink>
            <NavLink to="/clubs" className="cx-footer-link">Clubs</NavLink>
            <NavLink to="/events" className="cx-footer-link">Events</NavLink>
            <NavLink to="/tour" className="cx-footer-link">Campus Tour</NavLink>
          </Col>

          <Col md={3}>
            <div className="cx-footer-heading">Quick Links</div>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Library Portal</span>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Course Catalog</span>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Campus Map</span>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Academic Calendar</span>
          </Col>

          <Col md={3}>
            <div className="cx-footer-heading">Support</div>
            <span className="cx-footer-link" style={{ cursor: "default" }}>IT Help Desk</span>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Academic Advising</span>
            <span className="cx-footer-link" style={{ cursor: "default" }}>Financial Aid</span>
            <NavLink to="/admin/login" className="cx-footer-link">Admin Portal</NavLink>
          </Col>
        </Row>

        <div className="cx-footer-bottom">
          <span>© {year} CampeX. Built for modern campuses.</span>
          <div style={{ display: "flex", gap: "16px" }}>
            <span style={{ cursor: "pointer" }}>Privacy</span>
            <span style={{ cursor: "pointer" }}>Terms</span>
            <span style={{ cursor: "pointer" }}>Contact</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
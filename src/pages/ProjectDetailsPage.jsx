import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import { getProjectById } from "../firebase/services";
import { formatBgUrl } from "../constants/fallbackData";

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects } = usePortfolio();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgOpacity, setImgOpacity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProject = async () => {
      // 1. Try finding in loaded portfolio context first (instant)
      const foundInContext = projects.find((p) => p.id === id);
      if (foundInContext) {
        setProject(foundInContext);
        setLoading(false);
        return;
      }

      // 2. Fetch directly from Firestore doc if not in memory
      try {
        const docData = await getProjectById(id);
        if (docData) {
          setProject(docData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn("Direct project lookup:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, projects]);

  // Build Gallery Items Array
  const galleryItems = [];
  if (project) {
    const rawImages = Array.isArray(project.images) ? project.images : [];

    rawImages.forEach((imgItem, idx) => {
      if (!imgItem) return;
      if (typeof imgItem === "object" && imgItem.url) {
        const formatted = formatBgUrl(imgItem.url);
        if (formatted) {
          galleryItems.push({
            url: formatted,
            title: imgItem.title || `${project.title || "Project"} — Screenshot ${idx + 1}`,
            desc: imgItem.desc || ""
          });
        }
      } else if (typeof imgItem === "string") {
        const parts = imgItem.split("|");
        const formatted = formatBgUrl(parts[0]?.trim());
        if (formatted) {
          galleryItems.push({
            url: formatted,
            title: parts[1]?.trim() || `${project.title || "Project"} — Screenshot ${idx + 1}`,
            desc: parts[2]?.trim() || ""
          });
        }
      }
    });

    // If a cover image exists and isn't already among screenshots, prepend it
    if (project.image) {
      const formattedCover = formatBgUrl(project.image);
      if (formattedCover && !galleryItems.some((g) => g.url === formattedCover)) {
        galleryItems.unshift({
          url: formattedCover,
          title: `${project.title || "Project"} — Overview`,
          desc: project.description || project.longDescription || "Main Cover Image"
        });
      }
    }

    if (galleryItems.length === 0) {
      galleryItems.push({
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80",
        title: "Main Application Interface",
        desc: "Interactive preview highlighting user workflow and component design."
      });
    }
  }

  const handleThumbClick = (idx) => {
    if (idx === currentIndex) return;
    setImgOpacity(0.4);
    setTimeout(() => {
      setCurrentIndex(idx);
      setImgOpacity(1);
    }, 80);
  };

  const activeItem = galleryItems[currentIndex] || galleryItems[0];

  const techList = project
    ? Array.isArray(project.techStack)
      ? project.techStack
      : (project.techStack || "").split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const featuresList = project
    ? Array.isArray(project.features)
      ? project.features
      : (project.features || "").split("\n").map((f) => f.trim().replace(/^[-*•]\s*/, "")).filter(Boolean)
    : [];

  const formatScreenDesc = (text) => {
    if (!text || !text.trim()) return null;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const hasListFormat = lines.some((l) =>
      /^(\(\d+\)|\d+[\.\)]|[-•*])\s+/.test(l) || l.includes(" — ") || l.includes(" - ") || l.includes(": ")
    );

    if (hasListFormat) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px", width: "100%" }}>
          {lines.map((line, idx) => {
            const match = line.match(/^(\(\d+\)|\d+[\.\)]|[-•*])?\s*(.*)$/);
            const prefix = match && match[1] ? match[1] : "";
            const rest = match && match[2] ? match[2] : line;

            let itemTitle = rest;
            let itemDesc = "";
            if (rest.includes(" — ")) {
              const parts = rest.split(" — ");
              itemTitle = parts[0];
              itemDesc = parts.slice(1).join(" — ");
            } else if (rest.includes(" - ")) {
              const parts = rest.split(" - ");
              itemTitle = parts[0];
              itemDesc = parts.slice(1).join(" - ");
            } else if (rest.includes(": ")) {
              const parts = rest.split(": ");
              itemTitle = parts[0];
              itemDesc = parts.slice(1).join(": ");
            }

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  fontSize: "0.86rem",
                  lineHeight: "1.6",
                  background: "rgba(255,255,255,0.02)",
                  padding: "7px 11px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}
              >
                {prefix ? (
                  <span
                    style={{
                      color: "#ef4444",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      fontSize: "0.84rem",
                      flexShrink: 0
                    }}
                  >
                    {prefix}
                  </span>
                ) : (
                  <i
                    className="fas fa-chevron-right"
                    style={{ color: "var(--primary)", fontSize: "0.65rem", marginTop: "6px", flexShrink: 0 }}
                  ></i>
                )}
                <div>
                  <strong style={{ color: "#ffffff", fontWeight: 600 }}>{itemTitle}</strong>
                  {itemDesc && <span style={{ color: "#94a3b8" }}> — {itemDesc}</span>}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7, whiteSpace: "pre-line" }}>
        {text}
      </p>
    );
  };

  return (
    <div className="details-page-body">
      {/* Navigation Header */}
      <nav className="navbar navbar-details">
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            <span className="logo-text">
              Abdul <span className="highlight">Rasheed</span>
            </span>
          </Link>
          <div className="nav-actions">
            <Link
              to="/#projects"
              className="btn btn-outline"
              style={{ borderRadius: "20px", fontSize: "0.82rem", padding: "6px 16px" }}
            >
              <i className="fas fa-arrow-left"></i> All Projects
            </Link>
            <Link
              to="/#contact"
              className="btn btn-filled"
              style={{ borderRadius: "20px", fontSize: "0.82rem", padding: "6px 16px" }}
            >
              Contact Me
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Details Container */}
      <main className="details-wrapper">
        <div className="container">
          {/* Back Nav Link */}
          <Link to="/#projects" className="back-nav">
            <i className="fas fa-arrow-left"></i> Back to Projects
          </Link>

          {/* Loading Placeholder */}
          {loading && (
            <div className="loading-box">
              <div className="spinner"></div>
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading case study...</p>
            </div>
          )}

          {/* Error Box */}
          {!loading && (error || !project) && (
            <div className="detail-card" style={{ textAlign: "center", padding: "50px 20px" }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: "2.4rem", color: "var(--accent)", marginBottom: "14px" }}></i>
              <h2>Project Not Found</h2>
              <p style={{ color: "#64748b", marginBottom: "20px" }}>
                The requested project details could not be loaded or may have been removed.
              </p>
              <Link to="/#projects" className="btn btn-filled">
                Return to Portfolio
              </Link>
            </div>
          )}

          {/* Dynamic Case Study View */}
          {!loading && project && (
            <div className="fade-in-up">
              {/* 1. Sleek Compact Header Meta */}
              <div className="header-meta-box">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span className="project-tag-badge">
                      <i className="fas fa-layer-group"></i> {(project.category || "PROJECT").toUpperCase()}
                    </span>
                    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                      {techList.map((t, idx) => (
                        <span key={idx} className="tech-pill-minimal">
                          <i className="fas fa-code-branch" style={{ fontSize: "0.65rem", color: "var(--primary)" }}></i> {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="top-action-links">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-filled"
                        style={{ padding: "6px 18px", fontSize: "0.8rem", borderRadius: "18px" }}
                      >
                        <i className="fas fa-external-link-alt"></i> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ padding: "6px 18px", fontSize: "0.8rem", borderRadius: "18px" }}
                      >
                        <i className="fab fa-github"></i> GitHub Code
                      </a>
                    )}
                  </div>
                </div>

                <h1 className="project-title-compact">{project.title}</h1>
                <p className="project-summary-text">
                  {project.longDescription || project.description}
                </p>
              </div>

              {/* 2. 50/50 SPLIT INTERACTIVE SCREENSHOT & EXPLANATION ROW */}
              <div className="screenshot-interactive-row">
                {/* Left 50%: Image Viewer & Thumbnails */}
                <div className="gallery-half-box">
                  <div className="main-hero-display">
                    <img
                      src={activeItem?.url}
                      alt={activeItem?.title || "Project Preview"}
                      style={{ opacity: imgOpacity, transition: "opacity 0.2s ease" }}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80";
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "8px", fontStyle: "italic", display: "flex", alignItems: "center", gap: "6px" }}>
                    <i className="fas fa-camera" style={{ fontSize: "0.7rem", color: "var(--primary)" }}></i>
                    <span>Fig 1.{currentIndex + 1} — {activeItem?.title || "Project Showcase"}</span>
                  </div>

                  {/* Thumbnails Row */}
                  <div className="thumbnails-row">
                    {galleryItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`thumb-item ${idx === currentIndex ? "active" : ""}`}
                        onClick={() => handleThumbClick(idx)}
                      >
                        <img
                          src={item.url}
                          alt={item.title}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 50%: Active Screenshot Explanation Card */}
                <div className="explanation-half-box">
                  <div className="screen-badge">
                    <i className="fas fa-info-circle"></i> <span>SCREENSHOT {currentIndex + 1} OF {galleryItems.length}</span>
                  </div>
                  <h2 className="screen-title">{activeItem?.title}</h2>
                  <div className="screen-desc">
                    {activeItem?.desc
                      ? formatScreenDesc(activeItem.desc)
                      : "Click on any thumbnail image to view its specific interface features, UI details, and system functionality."}
                  </div>
                </div>
              </div>

              {/* 3. KEY FEATURES CARD */}
              {featuresList.length > 0 && (
                <div className="detail-card">
                  <h3>
                    <i className="fas fa-star" style={{ color: "var(--primary)" }}></i> Key Features & Highlights
                  </h3>
                  <ul className="features-list">
                    {featuresList.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer" style={{ background: "#040711", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 0" }}>
        <div className="container footer-container" style={{ textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0 }}>
            &copy; 2026 Abdul Rasheed YP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

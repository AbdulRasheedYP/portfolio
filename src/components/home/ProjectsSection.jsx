import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle, formatBgUrl } from "../../constants/fallbackData";

export const ProjectsSection = () => {
  const { projects, settings } = usePortfolio();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const projectsStyle = formatBgStyle(settings.bgProjects);

  const filteredProjects = projects.filter((p) => {
    if (filter === "all") return true;
    const cat = (p.category || "").toLowerCase();
    if (filter === "web") return cat.includes("web") || cat.includes("full");
    if (filter === "python") return cat.includes("python") || cat.includes("django");
    if (filter === "frontend") return cat.includes("front") || cat.includes("react");
    return cat === filter;
  });

  // Auto-scroll Carousel Logic matching original projects.js
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let autoScrollDir = 1;
    let userInteracting = false;

    const onMouseEnter = () => { userInteracting = true; };
    const onMouseLeave = () => { userInteracting = false; };
    const onTouchStart = () => { userInteracting = true; };
    const onTouchEnd = () => {
      setTimeout(() => { userInteracting = false; }, 1500);
    };

    grid.addEventListener("mouseenter", onMouseEnter);
    grid.addEventListener("mouseleave", onMouseLeave);
    grid.addEventListener("touchstart", onTouchStart, { passive: true });
    grid.addEventListener("touchend", onTouchEnd, { passive: true });

    let lastTimestamp = 0;
    const speedPerMs = 1.2 / 25;
    let animId;

    function animateScroll(timestamp) {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!userInteracting && grid) {
        grid.scrollLeft += autoScrollDir * (speedPerMs * deltaTime);
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        if (grid.scrollLeft >= maxScroll - 1) autoScrollDir = -1;
        if (grid.scrollLeft <= 0) autoScrollDir = 1;
      }
      animId = requestAnimationFrame(animateScroll);
    }

    animId = requestAnimationFrame(animateScroll);

    return () => {
      cancelAnimationFrame(animId);
      grid.removeEventListener("mouseenter", onMouseEnter);
      grid.removeEventListener("mouseleave", onMouseLeave);
      grid.removeEventListener("touchstart", onTouchStart);
      grid.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <section id="projects" className="section" style={projectsStyle}>
      <div className="container">
        <div className="section-title">
          <span className="section-tag">My work</span>
          <h2>Projects</h2>
          <p>Recent work & experiments</p>
        </div>

        {/* Project Filter */}
        <div className="project-filter">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Projects
          </button>
          <button
            className={`filter-btn ${filter === "web" ? "active" : ""}`}
            onClick={() => setFilter("web")}
          >
            Web Apps
          </button>
          <button
            className={`filter-btn ${filter === "python" ? "active" : ""}`}
            onClick={() => setFilter("python")}
          >
            Python
          </button>
          <button
            className={`filter-btn ${filter === "frontend" ? "active" : ""}`}
            onClick={() => setFilter("frontend")}
          >
            Frontend
          </button>
        </div>

        <div className="projects-carousel-wrapper">
          <div className="projects-grid" ref={gridRef}>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="project-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="project-img">
                  <img
                    src={formatBgUrl(p.image) || "/img/project1.png"}
                    alt={p.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="project-info">
                  <span className="project-tag">
                    {p.category ? p.category.toUpperCase() : "PROJECT"}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

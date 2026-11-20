import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle } from "../../constants/fallbackData";

export const AboutSection = () => {
  const { settings } = usePortfolio();

  const aboutStyle = formatBgStyle(settings.bgAbout);

  return (
    <section id="about" className="section about" style={aboutStyle}>
      <div className="container">
        <div className="section-title">
          <span className="section-tag">Get to know me</span>
          <h2>About Me</h2>
          <p>Who I am & what I do</p>
        </div>
        <div className="about-wrapper">
          <div className="about-text" id="dyn-about-container">
            <div className="about-img-wrapper">
              <div className="blob-shape-small">
                <img
                  src={settings.profileImg || "/img/profile-pic.png"}
                  alt="Abdul Rasheed"
                  className="profile-img"
                  id="dyn-profile-img-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/profile-pic.png";
                  }}
                />
              </div>
            </div>
            <h3 style={{ marginTop: "24px" }}>Python Backend Developer</h3>
            <div id="dyn-about" style={{ whiteSpace: "pre-line" }}>
              {settings.about ||
                `Python Backend Developer with hands-on project experience building API-driven applications using Python, Django, Django REST Framework, and PostgreSQL.

Alongside backend development, I focus on LLM-powered application engineering, including LLM API integration, function calling, and multi-step agent workflows that connect language models with application logic and tools.

My technical foundation also includes secure authentication, relational data design, frontend integration, and production deployment using AWS EC2, Gunicorn, and Nginx.`}
            </div>
            <div className="about-buttons">
              <a href="#projects" className="btn btn-filled">
                <span>View Projects</span>
                <i className="fas fa-arrow-right"></i>
              </a>
              <a
                href={settings.resumeUrl || "/img/AbdulRasheedCV_new.pdf"}
                className="btn btn-outline"
                target="_blank"
                rel="noopener noreferrer"
                download
                id="dyn-resume-btn"
              >
                <span>Download CV</span>
                <i className="fas fa-download"></i>
              </a>
            </div>
          </div>
          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <span className="stat-title">Education</span>
              <span className="stat-value">B.Com Graduate</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-code"></i>
              </div>
              <span className="stat-title">Core Focus</span>
              <span className="stat-value">Python & Backend</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-brain"></i>
              </div>
              <span className="stat-title">Specialization</span>
              <span className="stat-value">AI & API Systems</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <span className="stat-title">Location</span>
              <span className="stat-value">{settings.location || "Kerala, India"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

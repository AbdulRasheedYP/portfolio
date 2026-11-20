import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgUrl } from "../../constants/fallbackData";

export const AboutSection = () => {
  const { settings } = usePortfolio();

  const aboutStyle = settings.bgAbout
    ? { backgroundImage: `url('${formatBgUrl(settings.bgAbout)}')` }
    : undefined;

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
            <h3 style={{ marginTop: "24px" }}>Python Full-Stack Developer</h3>
            <div id="dyn-about" style={{ whiteSpace: "pre-line" }}>
              {settings.about ||
                `I'm a commerce graduate transitioning into software development, currently focused on building practical web applications using Python.

I train at Brototype, where my learning is fully project-driven — writing real code, solving real problems, and following industry-level development practices.

My goal is to become a job-ready full-stack developer with strong fundamentals in backend development, databases, and clean frontend design.`}
            </div>
            <div className="about-buttons">
              <a href="#projects" className="btn btn-filled">
                <span>View Projects</span>
                <i className="fas fa-arrow-right"></i>
              </a>
              <a
                href={settings.resumeUrl || "/img/AbdulrasheedCV.pdf"}
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
              <span className="stat-title">Background</span>
              <span className="stat-value">B.Com Graduate</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-code"></i>
              </div>
              <span className="stat-title">Current Track</span>
              <span className="stat-value">Python Full-Stack</span>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-project-diagram"></i>
              </div>
              <span className="stat-title">Learning Style</span>
              <span className="stat-value">Project Based</span>
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

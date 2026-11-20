import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle } from "../../constants/fallbackData";

export const JourneySection = () => {
  const { settings = {} } = usePortfolio();
  const journeyStyle = formatBgStyle(settings.bgJourney);

  return (
    <section id="journey" className="section journey" style={journeyStyle}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title">
          <span className="section-tag">Career Evolution</span>
          <h2>My Journey</h2>
          <p>From Commerce Analytics to Full-Stack Software Engineering</p>
        </div>

        {/* The Evolution Bridge Deck */}
        <div className="evolution-deck">
          {/* Card 1: Commerce Foundation */}
          <div className="evolution-card card-academic glass-panel">
            <div className="evolution-card-glow glow-purple"></div>
            
            <div className="evolution-top">
              <span className="evolution-year year-purple">
                <i className="far fa-calendar-alt"></i> 2022 – 2025
              </span>
              <span className="evolution-type-badge">Undergraduate</span>
            </div>

            <div className="evolution-role-box">
              <div className="evolution-icon icon-purple">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div>
                <h3 className="evolution-title">Bachelor of Commerce</h3>
                <span className="evolution-subtitle">University Degree (B.Com)</span>
              </div>
            </div>

            {/* Punchy Key Strengths */}
            <div className="evolution-highlights">
              <div className="strength-item">
                <i className="fas fa-chart-line text-purple"></i>
                <span>Financial & Business Data Analysis</span>
              </div>
              <div className="strength-item">
                <i className="fas fa-brain text-purple"></i>
                <span>Quantitative Reasoning & Problem Solving</span>
              </div>
              <div className="strength-item">
                <i className="fas fa-balance-scale text-purple"></i>
                <span>Commercial Workflows & Account Systems</span>
              </div>
            </div>

            {/* Quick Skills Pill Strip */}
            <div className="evolution-tags">
              <span className="tag-pill">Business Logic</span>
              <span className="tag-pill">Data Analytics</span>
              <span className="tag-pill">Process Flow</span>
            </div>
          </div>

          {/* Center Connector / Transformation Catalyst */}
          <div className="evolution-connector">
            <div className="connector-line"></div>
            <div className="connector-badge">
              <div className="connector-icon-pulse">
                <i className="fas fa-bolt"></i>
              </div>
              <span className="connector-text">THE SHIFT</span>
            </div>
            <div className="connector-quote">
              <span>"Commerce taught me what businesses need. Code gave me the power to build it."</span>
            </div>
            <div className="connector-line"></div>
          </div>

          {/* Card 2: Brototype Tech Immersion */}
          <div className="evolution-card card-tech glass-panel">
            <div className="evolution-card-glow glow-cyan"></div>
            
            <div className="evolution-top">
              <span className="evolution-year year-cyan">
                <i className="far fa-calendar-alt"></i> 2025 – Present
              </span>
              <span className="evolution-status-live">
                <span className="live-pulse"></span> Active Trainee
              </span>
            </div>

            <div className="evolution-role-box">
              <div className="evolution-icon icon-cyan">
                <i className="fas fa-terminal"></i>
              </div>
              <div>
                <h3 className="evolution-title">Python Full-Stack Developer</h3>
                <span className="evolution-subtitle">Brototype Project-Driven Immersion</span>
              </div>
            </div>

            {/* Punchy Key Strengths */}
            <div className="evolution-highlights">
              <div className="strength-item">
                <i className="fas fa-check-circle text-cyan"></i>
                <span>Production Django & REST API Architectures</span>
              </div>
              <div className="strength-item">
                <i className="fas fa-check-circle text-cyan"></i>
                <span>PostgreSQL Relational Schema Design</span>
              </div>
              <div className="strength-item">
                <i className="fas fa-check-circle text-cyan"></i>
                <span>AWS EC2 & Nginx Server Cloud Deployment</span>
              </div>
              <div className="strength-item">
                <i className="fas fa-check-circle text-cyan"></i>
                <span>Data Structures, Algorithms & Clean Code</span>
              </div>
            </div>

            {/* Quick Skills Pill Strip */}
            <div className="evolution-tags">
              <span className="tag-pill pill-cyan">Python</span>
              <span className="tag-pill pill-cyan">Django</span>
              <span className="tag-pill pill-cyan">PostgreSQL</span>
              <span className="tag-pill pill-cyan">REST APIs</span>
              <span className="tag-pill pill-cyan">AWS EC2</span>
            </div>
          </div>
        </div>

        {/* Bottom Fast-Stats Bar */}
        <div className="evolution-summary-strip glass-panel">
          <div className="summary-col">
            <span className="summary-label">Academic Foundation</span>
            <span className="summary-val text-purple">B.Com Graduate</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-col">
            <span className="summary-label">Engineering Focus</span>
            <span className="summary-val text-cyan">Python / Django Backend</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-col">
            <span className="summary-label">Methodology</span>
            <span className="summary-val text-green">100% Practical Projects</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-col">
            <span className="summary-label">Key Advantage</span>
            <span className="summary-val text-yellow">Business Mindset + Code</span>
          </div>
        </div>
      </div>
    </section>
  );
};

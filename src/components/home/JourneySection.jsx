import React from "react";
import { GraduationCap, Code2, ArrowDown } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle } from "../../constants/fallbackData";

export const JourneySection = () => {
  const { settings = {} } = usePortfolio();
  const journeyStyle = formatBgStyle(settings.bgJourney);

  return (
    <section id="journey" className="section journey" style={journeyStyle}>
      <div className="container">
        {/* Section Title */}
        <div className="section-title">
          <span className="section-tag">Career Milestones</span>
          <h2>My Journey</h2>
          <p>From Commerce & Analytics to Full-Stack Software Engineering</p>
        </div>

        {/* Vertical Connected Timeline */}
        <div className="timeline-container">
          {/* Vertical Center Spine */}
          <div className="timeline-spine" aria-hidden="true"></div>

          {/* Milestone 1: 2022 - 2025 B.Com */}
          <div className="timeline-item timeline-item-left">
            {/* Center Node */}
            <div className="timeline-node" title="Academic Degree">
              <GraduationCap className="timeline-icon" />
            </div>

            {/* Content Card */}
            <div className="timeline-content glass-panel">
              <div className="timeline-header">
                <span className="timeline-date-badge">2022 — 2025</span>
                <span className="timeline-step-label">Academic Foundation</span>
              </div>

              <h3 className="timeline-title">Bachelor of Commerce (B.Com)</h3>
              <p className="timeline-institution">Calicut University • Analytical & Business Operations</p>

              <p className="timeline-desc">
                Developed strong quantitative reasoning, structured analytical thinking, and an in-depth understanding of commercial workflows and business logic.
              </p>

              <div className="timeline-tags">
                <span className="timeline-tag">Business Workflows</span>
                <span className="timeline-tag">Data Logic</span>
                <span className="timeline-tag">Systematic Analysis</span>
              </div>
            </div>
          </div>

          {/* Pivot Connector on Spine */}
          <div className="timeline-pivot">
            <div className="timeline-pivot-pill">
              <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
              <span>Career Pivot to Code</span>
            </div>
          </div>

          {/* Milestone 2: 2025 - Present Brototype */}
          <div className="timeline-item timeline-item-right timeline-item-active">
            {/* Center Node Active */}
            <div className="timeline-node timeline-node-active" title="Tech Immersion">
              <Code2 className="timeline-icon text-primary" />
              <span className="timeline-pulse-ring" aria-hidden="true"></span>
            </div>

            {/* Content Card */}
            <div className="timeline-content glass-panel">
              <div className="timeline-header">
                <span className="timeline-date-badge date-badge-active">2025 — Present</span>
                <span className="timeline-active-tag">
                  <span className="live-dot"></span>
                  Active Trainee
                </span>
              </div>

              <h3 className="timeline-title">Python Full-Stack Developer Trainee</h3>
              <p className="timeline-institution">Brototype • 100% Project-Driven Tech Immersion</p>

              <p className="timeline-desc">
                Intensive hands-on engineering: architecting scalable backend architectures, database schemas, REST APIs, and modern responsive frontends.
              </p>

              <div className="timeline-tags">
                <span className="timeline-tag tag-cyan">Python & Django</span>
                <span className="timeline-tag tag-cyan">PostgreSQL</span>
                <span className="timeline-tag tag-cyan">REST APIs</span>
                <span className="timeline-tag tag-cyan">AWS EC2 & Linux</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Value Proposition Callout */}
        <div className="journey-insight-box">
          <i className="fas fa-quote-left insight-quote-icon"></i>
          <p className="journey-insight-text">
            <strong>The Advantage:</strong> Commerce taught me how businesses operate and scale; software engineering gave me the tools to build systems that automate and power them.
          </p>
        </div>
      </div>
    </section>
  );
};

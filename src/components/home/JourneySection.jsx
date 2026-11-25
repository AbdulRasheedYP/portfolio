import React from "react";
import { GraduationCap, Code2, ArrowDown } from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import {
  formatBgStyle,
  formatBgUrl,
  FALLBACK_JOURNEY,
  DEFAULT_BROTOTYPE_SPRINTS
} from "../../constants/fallbackData";

export const JourneySection = () => {
  const { settings = {}, journey = [] } = usePortfolio();
  const journeyStyle = formatBgStyle(settings.bgJourney);

  const isDbInitialized = Array.isArray(journey) && journey.length > 0;
  const displayList = isDbInitialized
    ? journey
    : [...FALLBACK_JOURNEY, ...DEFAULT_BROTOTYPE_SPRINTS];

  // Find academic and brototype milestones
  const academic = displayList.find((item) => item.type === "academic") || FALLBACK_JOURNEY[0];
  const brototype = displayList.find((item) => item.type === "tech" && item.id !== "j-bcom") || FALLBACK_JOURNEY[1];

  // Sprints inside Brototype (from individual sprint docs or brototype.sprints or default fallback)
  const sprintDocs = displayList.filter((item) => item.type === "sprint");
  const sprints = sprintDocs.length > 0
    ? [...sprintDocs].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    : Array.isArray(brototype.sprints) && brototype.sprints.length > 0
    ? brototype.sprints
    : !isDbInitialized
    ? DEFAULT_BROTOTYPE_SPRINTS
    : [];

  return (
    <section id="journey" className="section journey" style={journeyStyle}>
      <div className="container">
        {/* Section Title */}
        <div className="section-title">
          <span className="section-tag">Career Evolution</span>
          <h2>My Journey</h2>
          <p>From Commerce & Analytics to Full-Stack Software Engineering</p>
        </div>

        {/* Main Vertical Connected Timeline */}
        <div className="timeline-container">
          {/* Vertical Center Spine */}
          <div className="timeline-spine" aria-hidden="true"></div>

          {/* 1. Academic Milestone: B.Com */}
          <div className="timeline-item timeline-item-left">
            <div className="timeline-node" title={academic.title}>
              <GraduationCap className="timeline-icon" />
            </div>

            <div className="timeline-content glass-panel">
              <div className="timeline-header">
                <span className="timeline-date-badge">{academic.period}</span>
                {academic.badge && (
                  <span className="timeline-step-label">{academic.badge}</span>
                )}
              </div>

              <h3 className="timeline-title">{academic.title}</h3>
              {academic.subtitle && (
                <p className="timeline-institution">{academic.subtitle}</p>
              )}

              {academic.description && (
                <p className="timeline-desc">{academic.description}</p>
              )}

              {Array.isArray(academic.skills) && academic.skills.length > 0 && (
                <div className="timeline-tags">
                  {academic.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="timeline-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pivot Connector on Central Spine */}
          <div className="timeline-pivot">
            <div className="timeline-pivot-pill">
              <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
              <span>Career Pivot to Software Engineering</span>
            </div>
          </div>

          {/* 2. Brototype Immersion with Nested Month-by-Month Sub-Timeline */}
          <div className="timeline-item timeline-item-right timeline-item-active">
            <div className="timeline-node timeline-node-active" title={brototype.title}>
              <Code2 className="timeline-icon text-primary" />
              <span className="timeline-pulse-ring" aria-hidden="true"></span>
            </div>

            <div className="timeline-content glass-panel">
              <div className="timeline-header">
                <span className="timeline-date-badge date-badge-active">
                  {brototype.period}
                </span>
                <span className="timeline-active-tag">
                  <span className="live-dot"></span>
                  Active Trainee
                </span>
              </div>

              <h3 className="timeline-title">{brototype.title}</h3>
              {brototype.subtitle && (
                <p className="timeline-institution">{brototype.subtitle}</p>
              )}

              {brototype.description && (
                <p className="timeline-desc">{brototype.description}</p>
              )}

              {/* Sub-Timeline: Month-by-Month Progression Line */}
              {sprints.length > 0 && (
                <div className="brototype-subtimeline">
                  <div className="subtimeline-header">
                    <div className="subtimeline-header-left">
                      <span className="subtimeline-badge-dot"></span>
                      <span className="subtimeline-heading">Curriculum & Learning Track</span>
                    </div>
                    <span className="subtimeline-count">{sprints.length} Sprints</span>
                  </div>

                  <div className="subtimeline-track">
                    {sprints.map((sprint, idx) => (
                      <div
                        key={sprint.id || idx}
                        className={`subtimeline-step ${
                          sprint.current ? "subtimeline-step-active" : ""
                        }`}
                      >
                        {/* Node on the sub-timeline line */}
                        <div className="subtimeline-node">
                          {sprint.current ? (
                            <span className="subtimeline-node-active-dot"></span>
                          ) : (
                            <span className="subtimeline-node-num">{idx + 1}</span>
                          )}
                        </div>

                        {/* Step Content */}
                        <div className="subtimeline-body">
                          <div className="subtimeline-meta">
                            <span className="subtimeline-period">{sprint.period}</span>
                            {sprint.current && (
                              <span className="subtimeline-active-badge">In Progress</span>
                            )}
                          </div>

                          <h4 className="subtimeline-title">{sprint.title}</h4>

                          {sprint.description && (
                            <p className="subtimeline-desc">{sprint.description}</p>
                          )}

                          {Array.isArray(sprint.skills) && sprint.skills.length > 0 && (
                            <div className="subtimeline-tags">
                              {sprint.skills.map((skill, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`subtimeline-tag ${
                                    sprint.current ? "subtimeline-tag-active" : ""
                                  }`}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Journey Bottom Wide Banner Image Box */}
        {(settings.journeyBanner || "/img/sitting_working.jpeg") && (
          <div className="journey-banner-wrapper">
            <div className="journey-banner-box">
              <img
                src={formatBgUrl(settings.journeyBanner) || "/img/sitting_working.jpeg"}
                alt="Workspace & Coding Journey"
                className="journey-banner-img"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/img/sitting_working.jpeg";
                }}
              />
              <div className="journey-banner-overlay" aria-hidden="true"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

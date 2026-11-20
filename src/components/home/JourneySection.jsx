import React from "react";
import {
  GraduationCap,
  Code2,
  Database,
  Server,
  Cloud,
  Terminal,
  ArrowDown
} from "lucide-react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle, FALLBACK_JOURNEY } from "../../constants/fallbackData";

export const JourneySection = () => {
  const { settings = {}, journey = [] } = usePortfolio();
  const journeyStyle = formatBgStyle(settings.bgJourney);

  const displayList = Array.isArray(journey) && journey.length > 0 ? journey : FALLBACK_JOURNEY;

  const renderIcon = (iconName, isCurrent) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="timeline-icon" />;
      case "Database":
        return <Database className={`timeline-icon ${isCurrent ? "text-primary" : ""}`} />;
      case "Server":
        return <Server className={`timeline-icon ${isCurrent ? "text-primary" : ""}`} />;
      case "Cloud":
        return <Cloud className={`timeline-icon ${isCurrent ? "text-primary" : ""}`} />;
      case "Terminal":
        return <Terminal className={`timeline-icon ${isCurrent ? "text-primary" : ""}`} />;
      case "Code2":
      default:
        return <Code2 className={`timeline-icon ${isCurrent ? "text-primary" : ""}`} />;
    }
  };

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

          {displayList.map((item, index) => {
            const isLeft = index % 2 === 0;
            const isCurrent = Boolean(item.current);
            const isPivotPoint = index === 1 && displayList[0]?.type === "academic";

            return (
              <React.Fragment key={item.id || `journey-${index}`}>
                {/* Career Pivot Marker between B.Com and Tech Sprints */}
                {isPivotPoint && (
                  <div className="timeline-pivot">
                    <div className="timeline-pivot-pill">
                      <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
                      <span>Career Pivot to Software Engineering</span>
                    </div>
                  </div>
                )}

                <div
                  className={`timeline-item ${
                    isLeft ? "timeline-item-left" : "timeline-item-right"
                  } ${isCurrent ? "timeline-item-active" : ""}`}
                >
                  {/* Center Node on the spine */}
                  <div
                    className={`timeline-node ${isCurrent ? "timeline-node-active" : ""}`}
                    title={item.title}
                  >
                    {renderIcon(item.icon, isCurrent)}
                    {isCurrent && <span className="timeline-pulse-ring" aria-hidden="true"></span>}
                  </div>

                  {/* Timeline Card */}
                  <div className="timeline-content glass-panel">
                    <div className="timeline-header">
                      <span
                        className={`timeline-date-badge ${
                          isCurrent ? "date-badge-active" : ""
                        }`}
                      >
                        {item.period}
                      </span>
                      {isCurrent ? (
                        <span className="timeline-active-tag">
                          <span className="live-dot"></span>
                          Active Trainee
                        </span>
                      ) : (
                        item.badge && (
                          <span className="timeline-step-label">{item.badge}</span>
                        )
                      )}
                    </div>

                    <h3 className="timeline-title">{item.title}</h3>
                    {item.subtitle && (
                      <p className="timeline-institution">{item.subtitle}</p>
                    )}

                    {item.description && (
                      <p className="timeline-desc">{item.description}</p>
                    )}

                    {Array.isArray(item.skills) && item.skills.length > 0 && (
                      <div className="timeline-tags">
                        {item.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className={`timeline-tag ${
                              isCurrent || item.type === "tech" ? "tag-cyan" : ""
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

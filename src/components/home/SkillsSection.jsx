import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";

export const SkillsSection = () => {
  const { skills, settings } = usePortfolio();

  const skillsStyle = settings.bgSkills
    ? { backgroundImage: `url('${settings.bgSkills}')` }
    : undefined;

  const formatIconClass = (icon) => {
    if (!icon) return "fas fa-code";
    if (icon.startsWith("fa")) return icon;
    const map = {
      Python: "fab fa-python",
      Django: "fas fa-server",
      PostgreSQL: "fas fa-database",
      Database: "fas fa-database",
      JavaScript: "fab fa-js",
      React: "fab fa-react",
      HTML: "fab fa-html5",
      "HTML5 & CSS3": "fab fa-html5",
      CSS: "fab fa-css3-alt",
      Git: "fab fa-git-alt",
      "Git & GitHub": "fab fa-github",
      Tailwind: "fas fa-palette",
      "Tailwind CSS": "fas fa-palette",
      "REST APIs": "fas fa-network-wired",
      Server: "fas fa-server",
      Code: "fas fa-code",
      Code2: "fas fa-code",
      Globe: "fas fa-globe",
      Cpu: "fas fa-microchip",
      Layout: "fas fa-columns",
      Terminal: "fas fa-terminal",
      Atom: "fab fa-react",
      FileCode2: "fab fa-js",
      Palette: "fas fa-palette",
      GitBranch: "fab fa-git-alt",
      Network: "fas fa-network-wired"
    };
    return map[icon] || "fas fa-code";
  };

  return (
    <section id="skills" className="section skills" style={skillsStyle}>
      <div className="container">
        <div className="section-title">
          <span className="section-tag">What I know</span>
          <h2>My Skills</h2>
          <p>Technical proficiency and tools</p>
        </div>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.id} className="skill-tile">
              <i
                className={formatIconClass(skill.icon)}
                style={{ color: skill.color || "var(--primary)" }}
              ></i>
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useTypewriter } from "../../hooks/useTypewriter";
import { formatBgStyle } from "../../constants/fallbackData";

export const HeroSection = () => {
  const { settings, socials } = usePortfolio();

  const rolesList = settings.roles
    ? settings.roles.split(",").map((r) => r.trim()).filter(Boolean)
    : ["Python Full-Stack Developer", "Django Specialist", "Web Developer"];

  const typedRole = useTypewriter(rolesList, 85, 45, 1700);

  const heroStyle = formatBgStyle(settings.bgHero);

  return (
    <section id="home" className="hero" style={heroStyle}>
      <div className="container hero-content">
        <div className="hero-text">
          <span className="subtitle" id="dyn-subtitle">
            {settings.subtitle || "Hello, I'm"}
          </span>
          <h1 className="hero-name" id="dyn-name">
            {settings.name || "Abdul Rasheed YP"}
          </h1>
          <h2>
            <span id="typed-text">{typedRole || "Python Full-Stack Developer"}</span>
            <span id="dyn-roles" style={{ display: "none" }}>
              {settings.roles || "Python Full-Stack Developer"}
            </span>
          </h2>
          <p id="dyn-hero-desc">
            {settings.heroDesc ||
              "I build scalable and user-friendly web applications. Passionate about coding, technology, and continuous learning."}
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-filled">
              <span>View My Work</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#contact" className="btn btn-outline">
              <span>Contact Me</span>
            </a>
          </div>
          <div className="social-links" id="hero-social-links">
            {socials.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={s.name}
              >
                <i className={s.icon || "fas fa-link"}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

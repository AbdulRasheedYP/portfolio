import React from "react";
import { Link } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";

export const Footer = () => {
  const { socials } = usePortfolio();
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">Abdul <strong>Rasheed</strong></span>
          </div>
          <p>&copy; {currentYear} Abdul Rasheed YP. All rights reserved.</p>
          <div className="footer-socials" id="footer-social-links">
            {socials.map((s, idx) => (
              <a
                key={s.id || idx}
                href={s.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                title={s.name}
              >
                <i className={s.icon || "fas fa-link"}></i>
              </a>
            ))}
            <Link to="/admin" title="Admin Portal" style={{ opacity: 0.4 }}>
              <i className="fas fa-shield-alt"></i>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

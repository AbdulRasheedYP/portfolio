import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../../context/PortfolioContext";

export const Footer = () => {
  const { socials } = usePortfolio();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const currentYear = new Date().getFullYear();

  const handleSecretClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        navigate("/rasheed-portal");
        return 0;
      }
      return next;
    });
    setTimeout(() => setClickCount(0), 1500);
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">Abdul <strong>Rasheed</strong></span>
          </div>
          <p onClick={handleSecretClick} style={{ cursor: "default", userSelect: "none" }}>
            &copy; {currentYear} Abdul Rasheed YP. All rights reserved.
          </p>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

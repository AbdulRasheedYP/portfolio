import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useScrollSpy } from "../../hooks/useScrollSpy";

export const Navbar = () => {
  const [isMobileActive, setIsMobileActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const activeSection = useScrollSpy(
    ["home", "about", "journey", "skills", "services", "projects", "contact"],
    120
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    const nextState = !isMobileActive;
    setIsMobileActive(nextState);
    document.body.style.overflow = nextState ? "hidden" : "";
  };

  const handleLinkClick = (e, hash) => {
    if (isHomePage) {
      e.preventDefault();
      setIsMobileActive(false);
      document.body.style.overflow = "";
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      setIsMobileActive(false);
      document.body.style.overflow = "";
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isMobileActive ? "menu-active" : ""}`}>
      <div className="container">
        <a href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="logo">
          <span className="logo-text">Abdul <strong>Rasheed</strong></span>
        </a>

        <div
          className={`menu-toggle ${isMobileActive ? "active" : ""}`}
          id="mobile-menu"
          onClick={toggleMobileMenu}
        >
          <span
            className="bar"
            style={{
              transform: isMobileActive ? "rotate(-45deg) translate(-5px, 6px)" : ""
            }}
          ></span>
          <span
            className="bar"
            style={{
              opacity: isMobileActive ? "0" : ""
            }}
          ></span>
          <span
            className="bar"
            style={{
              transform: isMobileActive ? "rotate(45deg) translate(-5px, -6px)" : ""
            }}
          ></span>
        </div>

        <ul className={`nav-menu ${isMobileActive ? "active" : ""}`}>
          <li>
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, "#home")}
              className={`nav-link ${isHomePage && activeSection === "home" ? "active" : ""}`}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              onClick={(e) => handleLinkClick(e, "#about")}
              className={`nav-link ${isHomePage && activeSection === "about" ? "active" : ""}`}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#journey"
              onClick={(e) => handleLinkClick(e, "#journey")}
              className={`nav-link ${isHomePage && activeSection === "journey" ? "active" : ""}`}
            >
              Journey
            </a>
          </li>
          <li>
            <a
              href="#skills"
              onClick={(e) => handleLinkClick(e, "#skills")}
              className={`nav-link ${isHomePage && activeSection === "skills" ? "active" : ""}`}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#services"
              onClick={(e) => handleLinkClick(e, "#services")}
              className={`nav-link ${isHomePage && activeSection === "services" ? "active" : ""}`}
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#projects"
              onClick={(e) => handleLinkClick(e, "#projects")}
              className={`nav-link ${isHomePage && activeSection === "projects" ? "active" : ""}`}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="nav-link btn-primary"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

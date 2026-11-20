import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgStyle } from "../../constants/fallbackData";

export const ServicesSection = () => {
  const { services, settings } = usePortfolio();

  const servicesStyle = formatBgStyle(settings.bgServices);

  const formatIcon = (icon) => {
    if (!icon) return "fas fa-code";
    if (icon.startsWith("fa")) return icon;
    const map = {
      Server: "fas fa-server",
      Globe: "fas fa-globe",
      Database: "fas fa-database",
      Cpu: "fas fa-microchip",
      Code: "fas fa-code",
      Code2: "fas fa-code",
      Layout: "fas fa-columns",
      Brain: "fas fa-brain",
      Sparkles: "fas fa-brain"
    };
    return map[icon] || "fas fa-code";
  };

  return (
    <section id="services" className="section bg-light" style={servicesStyle}>
      <div className="container">
        <div className="section-title">
          <span className="section-tag">What I offer</span>
          <h2>Services</h2>
          <p>What I can do for you</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <i className={formatIcon(service.icon)}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { formatBgUrl } from "../../constants/fallbackData";

export const GallerySection = () => {
  const { settings } = usePortfolio();

  const hasAnyGallery =
    settings.bgGal1 ||
    settings.bgGal2 ||
    settings.bgGal3 ||
    settings.bgGal4 ||
    settings.bgGal5 ||
    settings.bgGal6 ||
    settings.bgGal7;

  if (!hasAnyGallery) return null;

  return (
    <section id="life-gallery" style={{ padding: "60px 0 100px", display: "block" }}>
      <div className="container">
        <div className="aesthetic-gallery">
          {settings.bgGal1 && (
            <div className="gal-item gal-large-8" id="gal1-wrapper">
              <img
                src={formatBgUrl(settings.bgGal1)}
                alt="Gallery Image 1"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal2 && (
            <div className="gal-item gal-tall-4" id="gal2-wrapper">
              <img
                src={formatBgUrl(settings.bgGal2)}
                alt="Gallery Image 2"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal3 && (
            <div className="gal-item gal-span-4" id="gal3-wrapper">
              <img
                src={formatBgUrl(settings.bgGal3)}
                alt="Gallery Image 3"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal4 && (
            <div className="gal-item gal-span-4" id="gal4-wrapper">
              <img
                src={formatBgUrl(settings.bgGal4)}
                alt="Gallery Image 4"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal5 && (
            <div className="gal-item gal-span-4" id="gal5-wrapper">
              <img
                src={formatBgUrl(settings.bgGal5)}
                alt="Gallery Image 5"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal6 && (
            <div className="gal-item gal-span-6" id="gal6-wrapper">
              <img
                src={formatBgUrl(settings.bgGal6)}
                alt="Gallery Image 6"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
          {settings.bgGal7 && (
            <div className="gal-item gal-span-6" id="gal7-wrapper">
              <img
                src={formatBgUrl(settings.bgGal7)}
                alt="Gallery Image 7"
                onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

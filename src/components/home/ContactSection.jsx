import React, { useState } from "react";
import confetti from "canvas-confetti";
import { usePortfolio } from "../../context/PortfolioContext";
import { saveMessageDoc } from "../../firebase/services";
import { formatBgStyle } from "../../constants/fallbackData";

export const ContactSection = () => {
  const { settings } = usePortfolio();

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const contactStyle = formatBgStyle(settings.bgContact);

  const validate = () => {
    // If bot filled the honeypot field, fail silently
    if (honeypot) return false;

    // Rate limiting: prevent spam submissions within 30 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      const waitSec = Math.ceil((30000 - (now - lastSubmitTime)) / 1000);
      setErrors({ form: `Please wait ${waitSec} seconds before sending another message.` });
      return false;
    }

    const errs = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || trimmedName.length < 3) {
      errs.name = "Name must be at least 3 characters";
    } else if (trimmedName.length > 100) {
      errs.name = "Name cannot exceed 100 characters";
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Enter a valid email address";
    } else if (trimmedEmail.length > 254) {
      errs.email = "Email cannot exceed 254 characters";
    }

    if (!trimmedMessage || trimmedMessage.length < 10) {
      errs.message = "Message must be at least 10 characters";
    } else if (trimmedMessage.length > 3000) {
      errs.message = "Message cannot exceed 3000 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const now = Date.now();

    try {
      // 1. Save to Firestore
      try {
        await saveMessageDoc({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        });
      } catch (err) {
        console.warn("Firestore save notice:", err);
      }

      // 2. Submit to Web3Forms async
      const web3FormsKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "6685fd8d-d317-4ea9-b4ca-f84c505d940c";
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
            subject: `Portfolio Message from ${formData.name.trim()}`
          })
        });
      } catch (err) {
        console.warn("Web3Forms forward notice:", err);
      }

      // Record successful submit time for rate limiting
      setLastSubmitTime(now);

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setShowModal(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});

      setTimeout(() => setShowModal(false), 3500);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="section bg-light" style={contactStyle}>
        <div className="container">
          <div className="section-title">
            <span className="section-tag">Get in touch</span>
            <h2>Contact Me</h2>
            <p>Let's work together</p>
          </div>
          <div className="contact-container">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>
                    <span id="dyn-phone">{settings.phone || "+91 9778106863"}</span>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>
                    <span id="dyn-email">{settings.email || "abdulrasheed5140@gmail.com"}</span>
                  </p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>
                    <span id="dyn-location">
                      {settings.location || "Malappuram, Kerala, India"}
                    </span>
                  </p>
                </div>
              </div>
              {settings.freelanceState !== "hidden" && (
                <div
                  className={`availability-status ${
                    settings.freelanceState === "not_available" ? "not-available" : ""
                  }`}
                  id="dyn-freelance-container"
                >
                  <div className="status-indicator"></div>
                  <span id="dyn-freelance">
                    {settings.freelanceState === "not_available"
                      ? "Not available for freelance work"
                      : "Available for freelance work"}
                  </span>
                </div>
              )}
            </div>

            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
              {/* Anti-spam honeypot field (hidden from real users) */}
              <input
                type="text"
                name="company_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className={`form-group ${errors.name ? "error" : ""}`}>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name || errors.form) setErrors({ ...errors, name: "", form: "" });
                  }}
                />
                <label className="floating-label">Your Name</label>
                <span className="form-underline"></span>
                <small className="error-msg">{errors.name}</small>
              </div>

              <div className={`form-group ${errors.email ? "error" : ""}`}>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email || errors.form) setErrors({ ...errors, email: "", form: "" });
                  }}
                />
                <label className="floating-label">Your Email</label>
                <span className="form-underline"></span>
                <small className="error-msg">{errors.email}</small>
              </div>

              <div className={`form-group ${errors.message ? "error" : ""}`}>
                <textarea
                  name="message"
                  rows={4}
                  required
                  maxLength={3000}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message || errors.form) setErrors({ ...errors, message: "", form: "" });
                  }}
                ></textarea>
                <label className="floating-label">Your Message</label>
                <span className="form-underline"></span>
                <small className="error-msg">{errors.message}</small>
              </div>

              {errors.form && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {errors.form}
                </div>
              )}

              <button type="submit" className="btn btn-filled" disabled={isSubmitting}>
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Exact Success Modal */}
      <div className={`success-modal ${showModal ? "show" : ""}`} id="successModal">
        <div className="modal-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. I'll get back to you soon.</p>
        </div>
      </div>
    </>
  );
};

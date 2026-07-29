import React, { useState } from "react";
import emailjs from "emailjs-com";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaYoutube,
  FaPaperPlane
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    const emailTemplateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    emailjs
      .send(
        "service_w08nyho",
        "template_bbsbgjp",
        emailTemplateParams,
        "aX_n6uOrQaga7NdQN"
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
          setSending(false);
        },
        (error) => {
          console.error("Error sending email:", error);
          toast.error("Failed to send message. Try again later.");
          setSending(false);
        }
      );
  };

  const socials = [
    { icon: <FaFacebook />, href: "https://www.facebook.com", label: "Facebook" },
    { icon: <FaInstagram />, href: "https://www.instagram.com", label: "Instagram" },
    { icon: <FaTwitter />, href: "https://www.twitter.com", label: "Twitter" },
    { icon: <FaTiktok />, href: "https://www.tiktok.com", label: "TikTok" },
    { icon: <FaYoutube />, href: "https://www.youtube.com", label: "YouTube" },
  ];

  return (
    <div className="contact-page">
      {/* Radial glow */}
      <div className="contact-glow" />

      <div className="contact-inner">

        {/* ── Header ── */}
        <div className="contact-header">
          <p className="contact-eyebrow">Get in Touch</p>
          <h1 className="contact-heading">
            <span className="contact-heading-gold">CINE</span>MATCH
          </h1>
          <p className="contact-subheading">
            Questions, feedback, or just want to talk movies? We're here.
          </p>
        </div>

        {/* ── Main grid ── */}
        <div className="contact-grid">

          {/* Left — info + socials */}
          <div className="contact-left">

            {/* Info cards */}
            <div className="contact-info-list">
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaEnvelope /></div>
                <div>
                  <p className="contact-info-label">Email</p>
                  <p className="contact-info-value">support@cinematch.com</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaPhone /></div>
                <div>
                  <p className="contact-info-label">Phone</p>
                  <p className="contact-info-value">+1-800-123-4567</p>
                </div>
              </div>
              <div className="contact-info-card">
                <div className="contact-info-icon"><FaMapMarkerAlt /></div>
                <div>
                  <p className="contact-info-label">Location</p>
                  <p className="contact-info-value">CineMatch HQ, Kerala, India</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="contact-side-divider" />

            {/* Socials */}
            <div>
              <p className="contact-socials-label">Follow Us</p>
              <div className="contact-socials">
                {socials.map(({ icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social"
                    aria-label={label}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form card */}
          <div className="contact-form-card">
            <div className="contact-form-hairline" />
            <div className="contact-form-body">
              <h2 className="contact-form-title">Send a Message</h2>

              <form onSubmit={sendEmail} className="contact-form">
                <div className="contact-field">
                  <label className="contact-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Menon"
                    className="contact-input"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label className="contact-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="contact-input"
                    required
                  />
                </div>

                <div className="contact-field">
                  <label className="contact-label">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    className="contact-textarea"
                    required
                  />
                </div>

                <button type="submit" className="contact-submit-btn" disabled={sending}>
                  {sending ? (
                    <span className="contact-btn-sending">Sending…</span>
                  ) : (
                    <>
                      <FaPaperPlane className="contact-btn-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
    </div>
  );
}

export default Contact;
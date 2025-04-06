import React, { useState } from "react";
import emailjs from "emailjs-com";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaTiktok, FaYoutube } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css';  // Import the default styles for the toast notifications

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(""); // Success or error message

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const sendEmail = (e) => {
    e.preventDefault();
  
    // Prepare the email data
    const emailTemplateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };
  
    // Send the email using emailjs
    emailjs
      .send(
        "service_w08nyho",   // Replace with your EmailJS Service ID
        "template_bbsbgjp",  // Updated with your correct EmailJS Template ID
        emailTemplateParams,  // Data for placeholders in the template
        "aX_n6uOrQaga7NdQN"   // Replace with your EmailJS Public Key
      )
      .then(
        (response) => {
          setStatus("Message sent successfully! ✅");
          setFormData({ name: "", email: "", message: "" });
          toast.success("Message sent successfully! ✅"); // Show success toast
          console.log("Email sent successfully:", response);
        },
        (error) => {
          console.error("Error sending email:", error);
          setStatus("Failed to send message. ❌ Try again later.");
          toast.error("Failed to send message. ❌ Try again later."); // Show error toast
        }
      );
  };

  return (
    <div className="bg-img">
      <div className="container  text-light">
        {/* Header */}
        <h2 className="text-center mb-4 mt-5 pt-5">📞 Contact CineMatch</h2>
        <p className="text-center text-muted">Have questions? Reach out to us!</p>

        {/* Contact Info */}
        <div className="row mt-4">
          <div className="col-md-4 text-center">
            <FaEnvelope size={30} className="text-warning mb-2" />
            <h5>Email Us</h5>
            <p>support@cinematch.com</p>
          </div>
          <div className="col-md-4 text-center">
            <FaPhone size={30} className="text-warning mb-2" />
            <h5>Call Us</h5>
            <p>+1-800-123-4567</p>
          </div>
          <div className="col-md-4 text-center">
            <FaMapMarkerAlt size={30} className="text-warning mb-2" />
            <h5>Visit Us</h5>
            <p>123 CineMatch HQ, Kerala, India</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="row mt-5">
          <div className="col-md-6 mx-auto">
            <form onSubmit={sendEmail}>
              <div className="mb-3">
                <input 
                  type="text" name="name" value={formData.name}
                  className="form-control" placeholder="Your Name" 
                  onChange={handleChange} required 
                />
              </div>
              <div className="mb-3">
                <input 
                  type="email" name="email" value={formData.email}
                  className="form-control" placeholder="Your Email" 
                  onChange={handleChange} required 
                />
              </div>
              <div className="mb-3">
                <textarea 
                  name="message" rows="4" value={formData.message}
                  className="form-control" placeholder="Your Message" 
                  onChange={handleChange} required 
                />
              </div>
              <button type="submit" className="btn btn-warning w-100">
                Send Message
              </button>
            </form>

            {/* Status Message */}
            {status && <p className="text-center mt-3">{status}</p>}
          </div>
        </div>

        {/* Social Media */}
        <div className="text-center mt-5 pt-5">
          <h5>Follow Us on Socials</h5>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <FaFacebook size={30} className="text-primary" />
            <FaInstagram size={30} className="text-danger" />
            <FaTwitter size={30} className="text-info" />
            <FaTiktok size={30} className="text-white bg-dark rounded-circle p-1" />
            <FaYoutube size={30} className="text-danger" />
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />  {/* This will render the toast notifications */}
    </div>
  );
}

export default Contact;

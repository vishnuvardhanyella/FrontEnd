import React, { useState } from "react";
import {  FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { ImFacebook } from "react-icons/im";
import emailjs from "@emailjs/browser";
 // Replace with the actual path

import "./Contact.css";

const Contact = () => {
  const [isMessageSent, setIsMessageSent] = useState(false);

  const form = React.useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_vf6gump",
        "template_ub6hhvn",
        form.current,
        "NeUny0-b4-uPFitBC"
      )
      .then(() => {
        setIsMessageSent(true);
        setTimeout(() => {
          setIsMessageSent(false);
        }, 3000);
      })
      .catch((error) => console.error("Failed to send email:", error));

    e.target.reset();
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="get-in-touch">
          <h5>Get in Touch</h5>
          <div className="contact__socials">
            <a
              href="https://facebook.com"
              className="facebook"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab("https://facebook.com");
              }}
            >
              <ImFacebook />
            </a>
            <a
              href="https://twitter.com"
              className="twitter"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab("https://twitter.com");
              }}
            >
              <FaSquareXTwitter />
            </a>
            <a
              href="https://youtube.com"
              className="youtube"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab("https://youtube.com");
              }}
            >
              <FaYoutube />
            </a>
            <a
              href="https://instagram.com"
              className="instagram"
              onClick={(e) => {
                e.preventDefault();
                openInNewTab("https://instagram.com");
              }}
            >
              <img src='instagram.jpeg' alt="Instagram Logo" height='24px'/>
            </a>
          </div>
        </div>
        <div className="contact-form card">
          {isMessageSent && (
            <div className="popup-message">
              <p>Message sent successfully!</p>
            </div>
          )}
          <h4>Contact Me</h4>
          <form ref={form} onSubmit={sendEmail}>
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />
            <textarea
              name="message"
              rows="7"
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
import { useState } from "react";

function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="info-page">

      {/* HERO */}

      <section className="info-hero">

        <p className="section-label">
          GET IN TOUCH
        </p>

        <h1>
          Contact <span>Learnova</span>
        </h1>

        <p>
          Have a question or need help? We'd love to hear from you.
        </p>

      </section>


      {/* CONTACT */}

      <section className="contact-page">

        {/* CONTACT DETAILS */}

        <div className="contact-details">

          <div className="info-card">

            <span>📧</span>

            <h2>Email</h2>

            <p>
              Contact us through the form below.
            </p>

          </div>


          <div className="info-card">

            <span>📞</span>

            <h2>Support</h2>

            <p>
              We're here to help with your learning journey.
            </p>

          </div>

        </div>


        {/* CONTACT FORM */}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            placeholder="Your Name"
            required
          />


          <input
            type="email"
            placeholder="Your Email"
            required
          />


          <textarea
            placeholder="Your Message"
            rows="6"
            required
          />


          <button type="submit">
            Send Message →
          </button>


          {sent && (
            <p className="success-message">
              Thanks! Your message has been received.
            </p>
          )}

        </form>

      </section>

    </main>
  );
}

export default Contact;
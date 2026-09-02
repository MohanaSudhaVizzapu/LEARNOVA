import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">

        <div className="hero-content">

          <p className="welcome-text">
            WELCOME TO LEARNOVA
          </p>

          <h1>
            Learn.
            <br />
            Practice.
            <br />
            <span>Grow.</span>
          </h1>

          <p className="hero-description">
            Learnova is a digital learning platform that helps students
            learn from structured courses, complete assignments and
            track their progress.
          </p>

          <div className="hero-buttons">

            <Link
              to="/dashboard"
              className="primary-btn"
            >
              🚀 &nbsp; Go to Dashboard
            </Link>

            <Link
              to="/courses"
              className="secondary-btn"
            >
              📖 &nbsp; Explore Courses
            </Link>

          </div>

          <div className="student-count">

            <div className="avatars">
              <span>👩🏻</span>
              <span>👨🏻</span>
              <span>👩🏻‍💻</span>
              <span>👨🏻‍🎓</span>
            </div>

            <p>
              Join <strong>1,000+</strong> students learning better
              every day
            </p>

          </div>

        </div>


        <div className="hero-visual">

          <div className="dashboard-preview">

            <div className="preview-top">
              <span>Learnova</span>
              <span>My Courses</span>
            </div>

            <div className="preview-body">

              <div className="preview-sidebar">
                <span>▣ Dashboard</span>
                <span>📚 Courses</span>
                <span>📝 Assignments</span>
                <span>📊 Grades</span>
              </div>

              <div className="preview-main">

                <h3>My Courses</h3>

                <div className="course-preview">
                  <div />
                  <div />
                  <div />
                </div>

                <div className="progress-preview">
                  <span />
                  <span />
                  <span />
                </div>

              </div>

            </div>

          </div>


          <div className="journey-card">

            <div className="journey-icon">
              🎓
            </div>

            <div>

              <h3>
                Your Learning Journey Starts Here
              </h3>

              <p>
                Access quality content, complete assignments, get
                feedback and achieve your goals.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ABOUT */}
      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <p className="section-label">
            ABOUT LEARNOVA
          </p>

          <h2>
            Learning made simple,
            <span> effective and engaging.</span>
          </h2>

          <p>
            Learnova is a digital learning platform designed to make
            online education organized and accessible. Students can
            explore courses, attend lessons, submit assignments and
            monitor their academic progress from one place.
          </p>

          <p>
            Our goal is to create a simple learning environment where
            students can develop their skills while instructors can
            provide quality educational content and feedback.
          </p>

        </div>


        <div className="about-card">

          <div>
            <span>📚</span>

            <h3>
              Structured Learning
            </h3>

            <p>
              Learn through organized courses and lessons.
            </p>
          </div>


          <div>
            <span>📈</span>

            <h3>
              Track Progress
            </h3>

            <p>
              Monitor your learning and academic performance.
            </p>
          </div>


          <div>
            <span>🎯</span>

            <h3>
              Achieve Goals
            </h3>

            <p>
              Build knowledge and improve your skills.
            </p>
          </div>

        </div>

      </section>


      {/* FEATURES */}
      <section
        className="features"
        id="features"
      >

        <div className="feature-card">

          <div className="feature-icon purple">
            📖
          </div>

          <div>

            <h3>
              Quality Courses
            </h3>

            <p>
              Learn from well-structured courses created by experts.
            </p>

          </div>

        </div>


        <div className="feature-card">

          <div className="feature-icon green">
            📋
          </div>

          <div>

            <h3>
              Assignments
            </h3>

            <p>
              Submit assignments and get valuable feedback.
            </p>

          </div>

        </div>


        <div className="feature-card">

          <div className="feature-icon orange">
            📊
          </div>

          <div>

            <h3>
              Track Progress
            </h3>

            <p>
              Monitor your progress and improve continuously.
            </p>

          </div>

        </div>


        <div className="feature-card">

          <div className="feature-icon blue">
            🏆
          </div>

          <div>

            <h3>
              Achieve Goals
            </h3>

            <p>
              Build skills, earn grades and achieve your goals.
            </p>

          </div>

        </div>

      </section>


      {/* CONTACT */}
      <section
        className="contact-section"
        id="contact"
      >

        <div className="contact-header">

          <p className="section-label">
            GET IN TOUCH
          </p>

          <h2>
            Contact Learnova
          </h2>

          <p>
            Have a question or need help? We'd love to hear from you.
          </p>

        </div>


        <div className="contact-container">

          <div className="contact-info">

            <div className="contact-item">

              <span>📧</span>

              <div>

                <h3>
                  Email
                </h3>

                <p>
                  support@learnova.com
                </p>

              </div>

            </div>


            <div className="contact-item">

              <span>📞</span>

              <div>

                <h3>
                  Phone
                </h3>

                <p>
                  Contact us through email
                </p>

              </div>

            </div>


            <div className="contact-item">

              <span>💬</span>

              <div>

                <h3>
                  Support
                </h3>

                <p>
                  We're here to help you learn better.
                </p>

              </div>

            </div>

          </div>


          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! Your message has been sent.");
            }}
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
              rows="5"
              required
            />

            <button type="submit">
              Send Message →
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Home;
function About() {
  return (
    <main className="info-page">
      <section className="info-hero">
        <p className="section-label">ABOUT LEARNOVA</p>

        <h1>
          Learning made simple,
          <span> effective and engaging.</span>
        </h1>

        <p>
          Learnova is a digital learning platform designed to make
          online education organized and accessible.
        </p>
      </section>

      <section className="info-content">

        <div className="info-card">
          <span>📚</span>
          <h2>Structured Learning</h2>
          <p>
            Learn through organized courses, modules and lessons.
          </p>
        </div>

        <div className="info-card">
          <span>📈</span>
          <h2>Track Progress</h2>
          <p>
            Monitor your learning progress and academic performance.
          </p>
        </div>

        <div className="info-card">
          <span>🎯</span>
          <h2>Achieve Your Goals</h2>
          <p>
            Build valuable skills and continue improving every day.
          </p>
        </div>

      </section>
    </main>
  );
}

export default About;
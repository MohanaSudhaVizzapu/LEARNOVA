function Features() {
  const features = [
    ["📖", "Quality Courses", "Learn from well-structured courses."],
    ["📝", "Assignments", "Submit assignments and receive feedback."],
    ["📊", "Progress Tracking", "Monitor your learning progress."],
    ["🏆", "Grades", "View your academic performance."],
    ["🎓", "Lessons", "Learn through structured lessons."],
    ["👤", "Student Profile", "Manage your personal learning profile."]
  ];

  return (
    <main className="info-page">

      <section className="info-hero">
        <p className="section-label">LEARNOVA FEATURES</p>

        <h1>
          Everything you need to
          <span> learn better.</span>
        </h1>

        <p>
          Learnova provides the tools students need to learn,
          practice and track their academic journey.
        </p>
      </section>

      <section className="feature-page-grid">

        {features.map((feature, index) => (
          <div className="info-card" key={index}>
            <span>{feature[0]}</span>
            <h2>{feature[1]}</h2>
            <p>{feature[2]}</p>
          </div>
        ))}

      </section>

    </main>
  );
}

export default Features;
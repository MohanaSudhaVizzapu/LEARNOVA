import { useEffect, useState } from "react";
import API from "../services/api";

function Grades() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await API.get("/submissions/my");
        setSubmissions(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load grades");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return (
      <main className="grades-page">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading grades...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grades-page">
        <div className="grades-message">
          <h2>Unable to load grades</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  const graded = submissions.filter(
    (s) => s.marks !== null
  );

  const totalMarks = graded.reduce(
    (sum, s) => sum + s.marks,
    0
  );

  const maxMarks = graded.reduce(
    (sum, s) => sum + s.assignment.maxMarks,
    0
  );

  const percentage = maxMarks
    ? Math.round((totalMarks / maxMarks) * 100)
    : 0;

  return (
    <main className="grades-page">

      {/* Header */}
      <div className="grades-header">
        <p>ACADEMIC PERFORMANCE</p>
        <h1>My Grades</h1>
        <span>
          Track your assignment results and feedback.
        </span>
      </div>

      {/* Statistics */}
      <section className="grade-stats">

        <div className="grade-stat">
          <span>📚</span>
          <div>
            <p>Assignments</p>
            <h2>{submissions.length}</h2>
          </div>
        </div>

        <div className="grade-stat">
          <span>✓</span>
          <div>
            <p>Graded</p>
            <h2>{graded.length}</h2>
          </div>
        </div>

        <div className="grade-stat">
          <span>🏆</span>
          <div>
            <p>Total Marks</p>
            <h2>{totalMarks}</h2>
          </div>
        </div>

        <div className="grade-stat">
          <span>📊</span>
          <div>
            <p>Percentage</p>
            <h2>{percentage}%</h2>
          </div>
        </div>

      </section>

      {/* Results */}
      <section className="grades-section">

        <h2>Assignment Results</h2>

        {submissions.length === 0 ? (

          <div className="grades-empty">
            <span>📝</span>
            <h3>No submissions yet</h3>
            <p>
              Submit assignments to see your results here.
            </p>
          </div>

        ) : (

          <div className="grades-list">

            {submissions.map((submission) => (

              <div
                className="grade-card"
                key={submission._id}
              >

                <div className="grade-info">

                  <h3>
                    {submission.assignment.title}
                  </h3>

                  <p>
                    Deadline:{" "}
                    {new Date(
                      submission.assignment.deadline
                    ).toLocaleDateString()}
                  </p>

                </div>

                <div className="grade-result">

                  {submission.marks !== null ? (

                    <>
                      <strong>
                        {submission.marks}/
                        {submission.assignment.maxMarks}
                      </strong>

                      <span className="status graded">
                        Graded
                      </span>
                    </>

                  ) : (

                    <span className="status pending">
                      Awaiting Grade
                    </span>

                  )}

                </div>

                {submission.feedback && (
                  <div className="feedback">
                    <strong>
                      Instructor Feedback
                    </strong>

                    <p>
                      {submission.feedback}
                    </p>
                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Grades;
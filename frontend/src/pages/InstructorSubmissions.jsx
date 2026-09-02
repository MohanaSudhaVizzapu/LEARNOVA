import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function InstructorSubmissions() {
  const { id } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [marks, setMarks] = useState({});
  const [feedback, setFeedback] = useState({});
  const [grading, setGrading] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // Get assignment details
        const assignmentResponse = await API.get(
          `/assignments/${id}`
        );

        setAssignment(assignmentResponse.data);

        // Get student submissions
        const response = await API.get(
          `/submissions/assignment/${id}`
        );

        setSubmissions(response.data);
      } catch (error) {
        console.log(
          "Failed to load submissions",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [id]);

  const handleGrade = async (submissionId) => {
    try {
      setGrading(submissionId);

      const response = await API.patch(
        `/submissions/${submissionId}/grade`,
        {
          marks: Number(marks[submissionId]),
          feedback: feedback[submissionId] || ""
        }
      );

      setSubmissions((prev) =>
        prev.map((submission) =>
          submission._id === submissionId
            ? response.data.submission
            : submission
        )
      );

      alert("Submission graded successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to grade submission"
      );
    } finally {
      setGrading("");
    }
  };

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <h2>Learnova</h2>

        <nav>

          <Link to="/instructor">
            ▣ Dashboard
          </Link>

          <Link to="/instructor/courses">
            📚 My Courses
          </Link>

          <Link to="/instructor/courses/create">
            ➕ Create Course
          </Link>

          <Link
            className="active"
            to="/instructor/assignments"
          >
            📝 Assignments
          </Link>

          <Link to="/profile">
            👤 Profile
          </Link>

        </nav>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-content">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <p className="dashboard-welcome">
              INSTRUCTOR
            </p>

            <h1>
              Student Submissions
            </h1>

            {assignment && (
              <p>
                {assignment.title}
              </p>
            )}

          </div>

        </div>


        {/* BACK */}

        <Link
          to="/instructor/assignments"
          className="back-link"
        >
          ← Back to Assignments
        </Link>


        {/* SUBMISSIONS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Submissions
            </h2>

            <span>
              {submissions.length} submitted
            </span>

          </div>


          {submissions.length === 0 ? (

            <div className="grades-empty">

              <span>📭</span>

              <h3>
                No submissions yet
              </h3>

              <p>
                Students have not submitted this assignment yet.
              </p>

            </div>

          ) : (

            <div className="assignment-list">

              {submissions.map((submission) => (

                <div
                  className="assignment-item"
                  key={submission._id}
                  style={{
                    display: "block"
                  }}
                >

                  {/* STUDENT */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "20px"
                    }}
                  >

                    <div>

                      <h3>
                        👨‍🎓{" "}
                        {submission.student?.name ||
                          "Student"}
                      </h3>

                      <p>
                        {submission.student?.email}
                      </p>

                      <p>
                        Submitted:{" "}
                        {new Date(
                          submission.submittedAt
                        ).toLocaleString()}
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {submission.status}
                        </strong>
                      </p>

                    </div>


                    {/* FILE */}

                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="view-course-btn"
                    >
                      📄 View Submission
                    </a>

                  </div>


                  {/* GRADING */}

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid #eee"
                    }}
                  >

                    <h3>
                      Grade Submission
                    </h3>


                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginTop: "12px"
                      }}
                    >

                      {/* MARKS */}

                      <input
                        type="number"
                        min="0"
                        max={assignment?.maxMarks}
                        placeholder={`Marks / ${
                          assignment?.maxMarks || 100
                        }`}
                        value={
                          marks[submission._id] ??
                          submission.marks ??
                          ""
                        }
                        onChange={(e) =>
                          setMarks((prev) => ({
                            ...prev,
                            [submission._id]:
                              e.target.value
                          }))
                        }
                        style={{
                          width: "140px",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "8px"
                        }}
                      />


                      {/* FEEDBACK */}

                      <input
                        type="text"
                        placeholder="Feedback (optional)"
                        value={
                          feedback[submission._id] ??
                          submission.feedback ??
                          ""
                        }
                        onChange={(e) =>
                          setFeedback((prev) => ({
                            ...prev,
                            [submission._id]:
                              e.target.value
                          }))
                        }
                        style={{
                          flex: "1",
                          minWidth: "250px",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "8px"
                        }}
                      />


                      {/* GRADE BUTTON */}

                      <button
                        onClick={() =>
                          handleGrade(
                            submission._id
                          )
                        }
                        disabled={
                          grading ===
                          submission._id
                        }
                        style={{
                          padding: "12px 20px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "600"
                        }}
                      >

                        {grading ===
                        submission._id
                          ? "Grading..."
                          : submission.marks !== null
                          ? "Update Grade"
                          : "Grade Submission"}

                      </button>

                    </div>


                    {/* EXISTING GRADE */}

                    {submission.marks !== null && (

                      <div
                        style={{
                          marginTop: "15px"
                        }}
                      >

                        <strong>
                          Current Grade:{" "}
                          {submission.marks} /{" "}
                          {assignment?.maxMarks}
                        </strong>

                        {submission.feedback && (
                          <p>
                            Feedback:{" "}
                            {submission.feedback}
                          </p>
                        )}

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default InstructorSubmissions;
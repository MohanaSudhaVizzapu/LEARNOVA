import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function AssignmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadAssignment = async () => {
      try {
        const assignmentResponse =
          await API.get(`/assignments/${id}`);

        setAssignment(assignmentResponse.data);

        try {
          const submissionResponse =
            await API.get(
              `/submissions/assignment/${id}/my`
            );

          setSubmission(submissionResponse.data);
        } catch {
          // No submission yet
          setSubmission(null);
        }

      } catch (err) {
        console.log(err);
        setError("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    loadAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await API.post(
        `/submissions/assignment/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSubmission(response.data.submission);
      setMessage("Assignment submitted successfully!");
      setFile(null);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to submit assignment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="assignment-details-page">
        <div className="details-message">
          <div className="loading-spinner"></div>
          <p>Loading assignment...</p>
        </div>
      </main>
    );
  }

  if (error && !assignment) {
    return (
      <main className="assignment-details-page">
        <div className="details-message">
          <h2>Assignment not found</h2>
          <p>{error}</p>

          <button onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="assignment-details-page">

      <button
        className="assignment-back"
        onClick={() => navigate(-1)}
      >
        ← Back to Assignments
      </button>

      <section className="assignment-details-container">

        <div className="assignment-details-card">

          <span className="assignment-label">
            ASSIGNMENT
          </span>

          <h1>{assignment.title}</h1>

          <p className="assignment-description">
            {assignment.description}
          </p>

          <div className="assignment-meta">

            <div>
              <strong>📅 Deadline</strong>
              <span>
                {new Date(
                  assignment.deadline
                ).toLocaleString()}
              </span>
            </div>

            <div>
              <strong>🎯 Maximum Marks</strong>
              <span>
                {assignment.maxMarks}
              </span>
            </div>

          </div>

          {assignment.attachmentUrl && (
            <a
              href={assignment.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="assignment-resource"
            >
              📎 Open Assignment Resource
            </a>
          )}

        </div>

        {/* Submission */}

        <div className="submission-card">

          <h2>Your Submission</h2>

          {submission ? (
            <div className="submission-result">

              <div className="submission-status">
                <span>
                  {submission.status === "graded"
                    ? "✓"
                    : "📤"}
                </span>

                <div>
                  <strong>
                    {submission.status === "graded"
                      ? "Graded"
                      : submission.status === "late"
                      ? "Submitted Late"
                      : "Submitted"}
                  </strong>

                  <p>
                    Submitted on{" "}
                    {new Date(
                      submission.submittedAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <a
                href={submission.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="view-submission-btn"
              >
                📄 View Submitted File
              </a>

              {submission.marks !== null && (
                <div className="grade-box">
                  <span>Grade</span>
                  <strong>
                    {submission.marks} /{" "}
                    {assignment.maxMarks}
                  </strong>
                </div>
              )}

              {submission.feedback && (
                <div className="feedback-box">
                  <strong>Instructor Feedback</strong>
                  <p>{submission.feedback}</p>
                </div>
              )}

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="submission-form"
            >

              <p>
                Upload your assignment file below.
              </p>

              <label className="file-upload">
                <input
                  type="file"
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                />

                <span>
                  {file
                    ? `📄 ${file.name}`
                    : "📎 Choose Assignment File"}
                </span>
              </label>

              {error && (
                <p className="assignment-error">
                  {error}
                </p>
              )}

              {message && (
                <p className="assignment-success">
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="submit-assignment-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Assignment"}
              </button>

            </form>
          )}

        </div>

      </section>

    </main>
  );
}

export default AssignmentDetails;
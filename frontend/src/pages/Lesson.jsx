import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await API.get(`/lessons/${id}`);
        setLesson(response.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleComplete = async () => {
    try {
      const response = await API.patch(
        `/enrollments/lesson/${id}/complete`
      );

      setCompleted(true);
      setProgress(response.data.progress);
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to mark lesson as completed"
      );
    }
  };

  if (loading) {
    return (
      <main className="lesson-page">
        <div className="lesson-message">
          <div className="loading-spinner"></div>
          <p>Loading lesson...</p>
        </div>
      </main>
    );
  }

  if (error || !lesson) {
    return (
      <main className="lesson-page">
        <div className="lesson-message">
          <h2>Lesson not found</h2>
          <p>{error}</p>

          <button onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="lesson-page">

      <button
        className="lesson-back"
        onClick={() => navigate(-1)}
      >
        ← Back to Course
      </button>

      <section className="lesson-container">

        <div className="lesson-video">
          {lesson.videoUrl ? (
            <video controls>
              <source
                src={lesson.videoUrl}
                type="video/mp4"
              />
              Your browser does not support video.
            </video>
          ) : (
            <div className="video-placeholder">
              ▶
              <p>Video not available</p>
            </div>
          )}
        </div>

        <div className="lesson-content">

          <span className="lesson-label">
            LESSON
          </span>

          <h1>{lesson.title}</h1>

          {lesson.duration && (
            <span className="lesson-time">
              ⏱️ {lesson.duration}
            </span>
          )}

          <p className="lesson-description">
            {lesson.description ||
              "Continue learning this lesson."}
          </p>

          {lesson.resourceUrl && (
            <a
              href={lesson.resourceUrl}
              target="_blank"
              rel="noreferrer"
              className="resource-btn"
            >
              📎 Open Learning Resource
            </a>
          )}

          <button
            className="complete-btn"
            onClick={handleComplete}
            disabled={completed}
          >
            {completed
              ? "✓ Lesson Completed"
              : "✓ Mark as Completed"}
          </button>

          {completed && (
            <p className="lesson-progress">
              Course Progress: <strong>{progress}%</strong>
            </p>
          )}

        </div>

      </section>

    </main>
  );
}

export default Lesson;
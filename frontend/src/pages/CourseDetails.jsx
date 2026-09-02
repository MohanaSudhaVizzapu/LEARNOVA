import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      const courseRes = await API.get(`/courses/${id}`);
      setCourse(courseRes.data);

      // Check if student is already enrolled
      try {
        const enrollmentRes = await API.get(
          "/enrollments/my-courses"
        );

        const alreadyEnrolled = enrollmentRes.data.some(
          (enrollment) =>
            enrollment.course?._id === id ||
            enrollment.course === id
        );

        setEnrolled(alreadyEnrolled);
      } catch (enrollmentError) {
        // User may not be logged in
        console.log("Could not check enrollment");
      }

      const moduleRes = await API.get(`/modules/course/${id}`);
      setModules(moduleRes.data);

      const lessonData = {};

      for (const module of moduleRes.data) {
        const lessonRes = await API.get(
          `/lessons/module/${module._id}`
        );

        lessonData[module._id] = lessonRes.data;
      }

      setLessons(lessonData);

    } catch (err) {
      console.log(err);
      setError("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);

      await API.post(`/enrollments/${course._id}`);

      setEnrolled(true);

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert(
          err.response?.data?.message || "Failed to enroll"
        );
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <main className="course-details-page">
        <div className="details-message">
          <div className="loading-spinner"></div>
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="course-details-page">
        <div className="details-message">
          <div className="empty-icon">📚</div>
          <h2>Course not found</h2>
          <p>{error}</p>

          <Link to="/courses" className="back-courses-btn">
            ← Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="course-details-page">

      <Link to="/courses" className="back-link">
        ← Back to Courses
      </Link>

      {/* Course Hero */}
      <section className="course-details-hero">

        <div className="course-details-info">

          <div className="details-tags">
            <span>{course.category || "General"}</span>

            <span className="details-level">
              {course.level || "Beginner"}
            </span>
          </div>

          <h1>{course.title}</h1>

          <p className="details-description">
            {course.description ||
              "Start learning and build valuable new skills."}
          </p>

          <div className="details-meta">

            <div>
              <strong>👨‍🏫 Instructor</strong>
              <span>
                {course.instructor?.name || "Instructor"}
              </span>
            </div>

            <div>
              <strong>⏱️ Duration</strong>
              <span>
                {course.duration || "Self paced"}
              </span>
            </div>

            <div>
              <strong>📚 Level</strong>
              <span>
                {course.level || "Beginner"}
              </span>
            </div>

          </div>

        </div>

        {/* Enrollment Card */}
        <div className="enrollment-card">

          <div className="details-thumbnail">

            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
              />
            ) : (
              <div className="details-placeholder">
                📚
              </div>
            )}

          </div>

          <div className="enrollment-content">

            <div className="details-price">
              {course.price === 0 || !course.price
                ? "Free"
                : `₹${course.price}`}
            </div>

            <button
              className="enroll-btn"
              onClick={handleEnroll}
              disabled={enrolling || enrolled}
            >
              {enrolling
                ? "Enrolling..."
                : enrolled
                ? "Enrolled ✓"
                : "Enroll Now"}
            </button>

            <p className="enroll-note">
              Start learning this course today.
            </p>

          </div>

        </div>

      </section>

      {/* Course Content */}
      <section className="course-content">

        <h2>Course Content</h2>

        {modules.length === 0 ? (
          <div className="no-content">
            <span>📚</span>
            <p>No course content available yet.</p>
          </div>
        ) : (
          <div className="module-list">

            {modules.map((module, index) => (

              <div className="module-card" key={module._id}>

                <div className="module-header">
                  <div>
                    <span className="module-number">
                      Module {index + 1}
                    </span>

                    <h3>{module.title}</h3>

                    {module.description && (
                      <p>{module.description}</p>
                    )}
                  </div>
                </div>

                <div className="lesson-list">

                  {lessons[module._id]?.length > 0 ? (

                    lessons[module._id].map((lesson, lessonIndex) => (

                      <div
                        className="lesson-item"
                        key={lesson._id}
                        onClick={() =>
                          navigate(`/lessons/${lesson._id}`)
                        }
                      >

                        <div className="lesson-icon">
                          ▶
                        </div>

                        <div className="lesson-info">
                          <strong>
                            {lessonIndex + 1}. {lesson.title}
                          </strong>

                          {lesson.description && (
                            <p>{lesson.description}</p>
                          )}
                        </div>

                        {lesson.duration && (
                          <span className="lesson-duration">
                            {lesson.duration}
                          </span>
                        )}

                      </div>

                    ))

                  ) : (
                    <p className="no-lessons">
                      No lessons available.
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* Overview */}
      <section className="course-overview">

        <h2>Course Overview</h2>

        <p>
          {course.description ||
            "This course provides structured learning content designed to help you build useful skills and improve your knowledge."}
        </p>

        <div className="overview-boxes">

          <div>
            <span>📖</span>
            <strong>Structured Learning</strong>
            <p>
              Learn through organized course content.
            </p>
          </div>

          <div>
            <span>📝</span>
            <strong>Assignments</strong>
            <p>
              Practice what you learn through assignments.
            </p>
          </div>

          <div>
            <span>📊</span>
            <strong>Track Progress</strong>
            <p>
              Monitor your learning progress.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}

export default CourseDetails;
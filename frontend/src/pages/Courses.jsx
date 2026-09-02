import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get("/courses");

        // Only show published courses
        const publishedCourses = response.data.filter(
          (course) => course.status === "published"
        );

        setCourses(publishedCourses);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main className="courses-page">

      {/* Header */}
      <section className="courses-header">
        <p>LEARN SOMETHING NEW</p>

        <h1>Explore Courses</h1>

        <span>
          Discover courses, build new skills and grow your knowledge.
        </span>
      </section>

      {/* Courses */}
      <section className="courses-container">

        {loading && (
          <div className="courses-message">
            <div className="loading-spinner"></div>
            <p>Loading courses...</p>
          </div>
        )}

        {!loading && error && (
          <div className="courses-message error-message">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="courses-message">
            <div className="empty-icon">📚</div>

            <h2>No courses available yet</h2>

            <p>
              Published courses will appear here once instructors
              make them available.
            </p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="courses-grid">

            {courses.map((course) => (
              <article className="course-card" key={course._id}>

                {/* Thumbnail */}
                <div className="course-thumbnail">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                    />
                  ) : (
                    <div className="course-placeholder">
                      📚
                    </div>
                  )}
                </div>

                {/* Course information */}
                <div className="course-card-content">

                  <div className="course-tags">
                    <span>{course.category || "General"}</span>

                    <span className="level-tag">
                      {course.level || "Beginner"}
                    </span>
                  </div>

                  <h2>{course.title}</h2>

                  <p className="course-description">
                    {course.description ||
                      "Learn valuable skills through this structured course."}
                  </p>

                  <div className="course-meta">

                    <span>
                      ⏱️ {course.duration || "Self paced"}
                    </span>

                    <span>
                      👨‍🏫{" "}
                      {course.instructor?.name || "Instructor"}
                    </span>

                  </div>

                  <div className="course-card-footer">

                    <div className="course-price">
                      {course.price === 0 || !course.price
                        ? "Free"
                        : `₹${course.price}`}
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      className="view-course-btn"
                    >
                      View Course →
                    </Link>

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </section>
    </main>
  );
}

export default Courses;
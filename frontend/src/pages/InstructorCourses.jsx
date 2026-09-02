import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await API.get(
        "/courses/instructor/my-courses"
      );

      setCourses(response.data);
    } catch (error) {
      console.log("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      await API.delete(`/courses/${id}`);
      fetchCourses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to delete course"
      );
    }
  };

  const publishCourse = async (id) => {
    try {
      await API.patch(`/courses/${id}/publish`);
      fetchCourses();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to publish course"
      );
    }
  };

  if (loading) {
    return (
      <main className="instructor-courses-page">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading courses...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="instructor-courses-page">

      <div className="instructor-courses-header">

        <div>
          <p className="dashboard-welcome">
            COURSE MANAGEMENT
          </p>

          <h1>My Courses</h1>

          <p>
            Create and manage your courses.
          </p>
        </div>

        <Link
          to="/instructor/courses/create"
          className="primary-btn"
        >
          + Create Course
        </Link>

      </div>


      {courses.length === 0 ? (

        <div className="grades-empty">

          <span>📚</span>

          <h3>No courses created yet</h3>

          <p>
            Create your first course to start teaching.
          </p>

          <Link
            to="/instructor/courses/create"
            className="primary-btn"
          >
            + Create Course
          </Link>

        </div>

      ) : (

        <div className="instructor-course-grid">

          {courses.map((course) => (

            <div
              className="instructor-course-card"
              key={course._id}
            >

              <div className="course-card-top">

                <span className="course-category">
                  {course.category}
                </span>

                <span
                  className={`course-status ${course.status}`}
                >
                  {course.status}
                </span>

              </div>


              <h2>{course.title}</h2>

              <p>
                {course.description}
              </p>


              <div className="course-details">

                <span>
                  🎯 {course.level}
                </span>

                <span>
                  ⏱️ {course.duration || "Not specified"}
                </span>

                <span>
                  💰 {course.price > 0
                    ? `₹${course.price}`
                    : "Free"}
                </span>

              </div>


              <div className="course-actions">

                {/* VIEW STUDENTS */}

                <Link
                  to={`/instructor/courses/${course._id}/students`}
                  className="view-course-btn"
                >
                  👨‍🎓 View Students
                </Link>


                {/* EDIT */}

                <Link
                  to={`/instructor/courses/${course._id}/edit`}
                  className="edit-course-btn"
                >
                  ✏️ Edit
                </Link>


                {/* PUBLISH */}

                {course.status === "draft" && (
                  <button
                    className="publish-course-btn"
                    onClick={() =>
                      publishCourse(course._id)
                    }
                  >
                    🚀 Publish
                  </button>
                )}


                {/* DELETE */}

                <button
                  className="delete-course-btn"
                  onClick={() =>
                    deleteCourse(course._id)
                  }
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </main>
  );
}

export default InstructorCourses;
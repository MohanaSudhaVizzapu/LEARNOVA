import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function InstructorDashboard() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get instructor courses
        const courseRes = await API.get(
          "/courses/instructor/my-courses"
        );

        const instructorCourses = courseRes.data;

        setCourses(instructorCourses);

        // Get students from each course
        const studentResults = await Promise.all(
          instructorCourses.map((course) =>
            API.get(
              `/enrollments/${course._id}/students`
            )
          )
        );

        // Store unique student IDs
        const studentIds = new Set();

        studentResults.forEach((result) => {
          result.data.forEach((enrollment) => {
            if (enrollment.student?._id) {
              studentIds.add(
                enrollment.student._id
              );
            }
          });
        });

        setStudentCount(studentIds.size);

      } catch (error) {
        console.log(
          "Failed to load instructor dashboard",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // -----------------------------
  // STATISTICS
  // -----------------------------

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCourses = courses.filter(
    (course) => course.status === "draft"
  ).length;

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  // -----------------------------
  // PAGE
  // -----------------------------

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <h2>Learnova</h2>

        <nav>

          <Link
            className="active"
            to="/instructor"
          >
            ▣ Dashboard
          </Link>

          <Link to="/instructor/courses">
            📚 My Courses
          </Link>

          <Link to="/instructor/courses/create">
            ➕ Create Course
          </Link>

          <Link to="/instructor/assignments">
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
              INSTRUCTOR DASHBOARD 👋
            </p>

            <h1>
              Hi, {user?.name || "Instructor"}!
            </h1>

            <p>
              Manage your courses and students from here.
            </p>

          </div>

        </div>


        {/* STATISTICS */}

        <section className="dashboard-stats">

          {/* TOTAL COURSES */}

          <div className="stat-card">

            <div className="stat-icon purple">
              📚
            </div>

            <div>
              <p>Total Courses</p>
              <h2>{courses.length}</h2>
            </div>

          </div>


          {/* PUBLISHED */}

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <p>Published</p>
              <h2>{publishedCourses}</h2>
            </div>

          </div>


          {/* DRAFT */}

          <div className="stat-card">

            <div className="stat-icon orange">
              📝
            </div>

            <div>
              <p>Draft Courses</p>
              <h2>{draftCourses}</h2>
            </div>

          </div>


          {/* STUDENTS */}

          <div className="stat-card">

            <div className="stat-icon blue">
              👨‍🎓
            </div>

            <div>
              <p>Students</p>
              <h2>{studentCount}</h2>
            </div>

          </div>

        </section>


        {/* MY COURSES */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>My Courses</h2>

            <Link to="/instructor/courses">
              View All
            </Link>

          </div>


          {courses.length === 0 ? (

            /* NO COURSES */

            <div className="grades-empty">

              <span>📚</span>

              <h3>
                No courses yet
              </h3>

              <p>
                Create your first course to start teaching.
              </p>

              <Link
                to="/instructor/courses/create"
                className="view-course-btn"
              >
                + Create Course
              </Link>

            </div>

          ) : (

            /* COURSE CARDS */

            <div className="course-grid">

              {courses.slice(0, 3).map((course) => (

                <div
                  className="dashboard-course purple-course"
                  key={course._id}
                >

                  <div className="course-color"></div>

                  <h3>
                    {course.title}
                  </h3>

                  <p>
                    {course.description ||
                      "No description available."}
                  </p>


                  {/* STATUS */}

                  <div className="course-progress">

                    <div>

                      <span>Status</span>

                      <strong>
                        {course.status}
                      </strong>

                    </div>

                  </div>


                  {/* ACTION BUTTONS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                      marginTop: "15px"
                    }}
                  >

                    <Link
                      to={`/instructor/courses/${course._id}`}
                      className="view-course-btn"
                    >
                      Manage Course →
                    </Link>

                    <Link
                      to={`/instructor/courses/${course._id}/students`}
                      className="view-course-btn"
                    >
                      👨‍🎓 View Students
                    </Link>

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

export default InstructorDashboard;
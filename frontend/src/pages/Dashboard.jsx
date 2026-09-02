import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Get enrolled courses
        const courseRes = await API.get("/enrollments/my-courses");
        const enrolledCourses = courseRes.data;

        setCourses(enrolledCourses);

        // Get student's submissions
        const submissionRes = await API.get("/submissions/my");
        setSubmissions(submissionRes.data);

        // Get assignments for every enrolled course
        const assignmentResults = await Promise.all(
          enrolledCourses.map((item) =>
            API.get(`/assignments/course/${item.course._id}`)
          )
        );

        const allAssignments = assignmentResults.flatMap(
          (result) => result.data
        );

        setAssignments(allAssignments);

      } catch (error) {
        console.log("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // -----------------------------
  // DYNAMIC STATISTICS
  // -----------------------------

  const submittedIds = submissions.map(
    (submission) => submission.assignment?._id
  );

  const pendingAssignments = assignments.filter(
    (assignment) => !submittedIds.includes(assignment._id)
  );

  const gradedSubmissions = submissions.filter(
    (submission) => submission.marks !== null
  );

  const averageGrade =
    gradedSubmissions.length > 0
      ? Math.round(
          gradedSubmissions.reduce(
            (sum, submission) =>
              sum +
              (submission.marks /
                submission.assignment.maxMarks) *
                100,
            0
          ) / gradedSubmissions.length
        )
      : 0;

  const completedCourses = courses.filter(
    (course) => course.completed
  ).length;

  // -----------------------------
  // RECENT ASSIGNMENTS
  // -----------------------------

  const recentAssignments = [...assignments]
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    )
    .slice(0, 3);

  const getAssignmentStatus = (assignment) => {
    const submission = submissions.find(
      (s) => s.assignment?._id === assignment._id
    );

    if (!submission) {
      return {
        text: "Pending",
        className: "pending"
      };
    }

    if (submission.marks !== null) {
      return {
        text: `${submission.marks} / ${assignment.maxMarks}`,
        className: "graded"
      };
    }

    return {
      text: "Submitted",
      className: "submitted"
    };
  };

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

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <h2>Learnova</h2>

        <nav>

          <Link className="active" to="/dashboard">
            ▣ Dashboard
          </Link>

          <Link to="/courses">
            📚 Courses
          </Link>

          <Link to="/assignments">
            📝 Assignments
          </Link>

          <Link to="/grades">
            📊 Grades
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
              WELCOME BACK 👋
            </p>

            <h1>
              Hi, {user?.name || "Student"}!
            </h1>

            <p>
              Here's an overview of your learning progress.
            </p>

          </div>

        </div>


        {/* STATS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon purple">
              📚
            </div>

            <div>
              <p>Enrolled Courses</p>
              <h2>{courses.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon orange">
              📝
            </div>

            <div>
              <p>Pending Assignments</p>
              <h2>{pendingAssignments.length}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              📈
            </div>

            <div>
              <p>Average Grade</p>
              <h2>{averageGrade}%</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon blue">
              🏆
            </div>

            <div>
              <p>Completed</p>
              <h2>{completedCourses}</h2>
            </div>

          </div>

        </section>


        {/* MY COURSES */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>My Courses</h2>

            <Link to="/courses">
              View All
            </Link>

          </div>


          {courses.length === 0 ? (

            <p>No courses enrolled yet.</p>

          ) : (

            <div className="course-grid">

              {courses.map((item) => {

                const course = item.course;

                return (

                  <div
                    className="dashboard-course purple-course"
                    key={item._id}
                  >

                    <div className="course-color"></div>

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.description ||
                        "Continue learning this course."}
                    </p>


                    {/* PROGRESS */}

                    <div className="course-progress">

                      <div>

                        <span>
                          Progress
                        </span>

                        <strong>
                          {item.progress}%
                        </strong>

                      </div>

                      <div className="progress-bar">

                        <span
                          style={{
                            width: `${item.progress}%`
                          }}
                        />

                      </div>

                    </div>


                    <Link
                      to={`/courses/${course._id}`}
                      className="view-course-btn"
                    >
                      Continue Learning →
                    </Link>

                  </div>

                );

              })}

            </div>

          )}

        </section>


        {/* RECENT ASSIGNMENTS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>Recent Assignments</h2>

            <Link to="/assignments">
              View All
            </Link>

          </div>


          {recentAssignments.length === 0 ? (

            <p>No assignments available.</p>

          ) : (

            <div className="assignment-list">

              {recentAssignments.map((assignment) => {

                const status =
                  getAssignmentStatus(assignment);

                return (

                  <div
                    className="assignment-item"
                    key={assignment._id}
                  >

                    <div>

                      <h3>
                        {assignment.title}
                      </h3>

                      <p>
                        Due:{" "}
                        {new Date(
                          assignment.deadline
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <span
                      className={`status ${status.className}`}
                    >
                      {status.text}
                    </span>

                  </div>

                );

              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
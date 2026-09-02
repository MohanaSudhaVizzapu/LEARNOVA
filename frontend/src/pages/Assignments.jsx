import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Assignments() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Get student's enrolled courses
        const coursesResponse = await API.get("/enrollments/my-courses");

        const enrolledCourses = coursesResponse.data;
        setCourses(enrolledCourses);

        // Get assignments for every enrolled course
        const results = await Promise.all(
          enrolledCourses.map((item) =>
            API.get(`/assignments/course/${item.course._id}`)
          )
        );

        const allAssignments = results.flatMap(
          (result) => result.data
        );

        setAssignments(allAssignments);
      } catch (error) {
        console.log("Failed to load assignments", error);
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  if (loading) {
    return (
      <main className="assignments-page">
        <div className="details-message">
          <div className="loading-spinner"></div>
          <p>Loading assignments...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="assignments-page">

      <div className="assignments-header">
        <p>YOUR WORK</p>
        <h1>Assignments</h1>
        <span>
          View and submit assignments from your enrolled courses.
        </span>
      </div>

      <div className="assignments-container">

        {assignments.length === 0 ? (
          <div className="assignments-empty">
            <div>📝</div>
            <h2>No assignments yet</h2>
            <p>
              Your instructors haven't added any assignments yet.
            </p>
          </div>
        ) : (
          <div className="assignments-grid">

            {assignments.map((assignment) => (
              <div
                className="assignment-card"
                key={assignment._id}
              >

                <div className="assignment-icon">
                  📝
                </div>

                <div className="assignment-card-content">

                  <span className="assignment-label">
                    ASSIGNMENT
                  </span>

                  <h2>{assignment.title}</h2>

                  <p>
                    {assignment.description}
                  </p>

                  <div className="assignment-info">
                    <span>
                      📅 Due:{" "}
                      {new Date(
                        assignment.deadline
                      ).toLocaleDateString()}
                    </span>

                    <span>
                      🎯 {assignment.maxMarks} marks
                    </span>
                  </div>

                  <Link
                    to={`/assignments/${assignment._id}`}
                    className="assignment-view-btn"
                  >
                    View Assignment →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}

export default Assignments;
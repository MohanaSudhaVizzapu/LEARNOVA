import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function InstructorStudents() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get course details
        const courseResponse = await API.get(
          `/courses/${id}`
        );

        setCourse(courseResponse.data);

        // Get enrolled students
        const response = await API.get(
          `/enrollments/${id}/students`
        );

        setStudents(response.data);
      } catch (error) {
        console.log(
          "Failed to load students",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading students...</p>
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

          <Link
            className="active"
            to="/instructor/courses"
          >
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


      {/* MAIN */}

      <main className="dashboard-content">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <p className="dashboard-welcome">
              INSTRUCTOR
            </p>

            <h1>
              Course Students
            </h1>

            <p>
              {course?.title || "Course"}
            </p>

          </div>

        </div>


        {/* BACK */}

        <Link
          to={`/instructor/courses/${id}`}
          className="back-link"
        >
          ← Back to Course
        </Link>


        {/* STUDENT COUNT */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              Enrolled Students
            </h2>

            <span>
              {students.length} student
              {students.length !== 1 ? "s" : ""}
            </span>

          </div>


          {students.length === 0 ? (

            <div className="grades-empty">

              <span>👨‍🎓</span>

              <h3>
                No students yet
              </h3>

              <p>
                Students who enroll in this course
                will appear here.
              </p>

            </div>

          ) : (

            <div className="assignment-list">

              {students.map((enrollment) => {

                const student = enrollment.student;

                return (

                  <div
                    className="assignment-item"
                    key={enrollment._id}
                  >

                    {/* STUDENT INFO */}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                      }}
                    >

                      {/* PROFILE IMAGE */}

                      {student?.profileImage ? (

                        <img
                          src={student.profileImage}
                          alt={student.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                        />

                      ) : (

                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px"
                          }}
                        >
                          👤
                        </div>

                      )}

                      <div>

                        <h3>
                          {student?.name ||
                            "Student"}
                        </h3>

                        <p>
                          {student?.email ||
                            "No email available"}
                        </p>

                        <p>
                          Enrolled on:{" "}
                          {enrollment.enrolledAt
                            ? new Date(
                                enrollment.enrolledAt
                              ).toLocaleDateString()
                            : "—"}
                        </p>

                      </div>

                    </div>


                    {/* PROGRESS */}

                    <div
                      style={{
                        minWidth: "180px"
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          marginBottom: "6px"
                        }}
                      >

                        <span>
                          Progress
                        </span>

                        <strong>
                          {enrollment.progress || 0}%
                        </strong>

                      </div>

                      <div
                        style={{
                          height: "8px",
                          background: "#eee",
                          borderRadius: "10px",
                          overflow: "hidden"
                        }}
                      >

                        <div
                          style={{
                            width: `${
                              enrollment.progress || 0
                            }%`,
                            height: "100%",
                            background: "#7c3aed",
                            borderRadius: "10px"
                          }}
                        />

                      </div>

                      <p
                        style={{
                          marginTop: "8px"
                        }}
                      >
                        {enrollment.completed
                          ? "✓ Course Completed"
                          : "In Progress"}
                      </p>

                    </div>

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

export default InstructorStudents;
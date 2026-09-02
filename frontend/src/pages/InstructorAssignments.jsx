import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function InstructorAssignments() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxMarks, setMaxMarks] = useState(100);
  const [attachmentUrl, setAttachmentUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // --------------------------------
  // LOAD INSTRUCTOR COURSES
  // --------------------------------

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await API.get(
          "/courses/instructor/my-courses"
        );

        setCourses(response.data);

        if (response.data.length > 0) {
          setSelectedCourse(response.data[0]._id);
        }
      } catch (error) {
        console.log("Failed to load courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // --------------------------------
  // LOAD ASSIGNMENTS
  // --------------------------------

  useEffect(() => {
    if (!courses.length) return;

    const fetchAssignments = async () => {
      try {
        const results = await Promise.all(
          courses.map((course) =>
            API.get(`/assignments/course/${course._id}`)
          )
        );

        const allAssignments = results.flatMap(
          (result) => result.data
        );

        setAssignments(allAssignments);
      } catch (error) {
        console.log(
          "Failed to load assignments",
          error
        );
      }
    };

    fetchAssignments();
  }, [courses]);

  // --------------------------------
  // CREATE ASSIGNMENT
  // --------------------------------

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    try {
      setCreating(true);

      const response = await API.post(
        `/assignments/course/${selectedCourse}`,
        {
          title,
          description,
          deadline,
          maxMarks: Number(maxMarks),
          attachmentUrl
        }
      );

      setAssignments((prev) => [
        ...prev,
        response.data.assignment
      ]);

      // Clear form
      setTitle("");
      setDescription("");
      setDeadline("");
      setMaxMarks(100);
      setAttachmentUrl("");

      alert("Assignment created successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create assignment"
      );
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------
  // DELETE ASSIGNMENT
  // --------------------------------

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/assignments/${id}`);

      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment._id !== id
        )
      );

      alert("Assignment deleted successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete assignment"
      );
    }
  };

  // --------------------------------
  // COURSE NAME
  // --------------------------------

  const getCourseName = (courseId) => {
    const course = courses.find(
      (course) => course._id === courseId
    );

    return course?.title || "Course";
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading assignments...</p>
        </div>
      </main>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------

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
              Assignments
            </h1>

            <p>
              Create and manage assignments for your courses.
            </p>

          </div>

        </div>


        {/* CREATE ASSIGNMENT */}

        <section className="dashboard-section">

          <div className="section-heading">
            <h2>Create Assignment</h2>
          </div>

          {courses.length === 0 ? (

            <div className="grades-empty">

              <span>📚</span>

              <h3>
                No courses available
              </h3>

              <p>
                Create a course before adding assignments.
              </p>

              <Link
                to="/instructor/courses/create"
                className="view-course-btn"
              >
                + Create Course
              </Link>

            </div>

          ) : (

            <form
              className="contact-form"
              onSubmit={handleCreate}
            >

              {/* COURSE */}

              <label>
                Course
              </label>

              <select
                value={selectedCourse}
                onChange={(e) =>
                  setSelectedCourse(e.target.value)
                }
                required
              >

                {courses.map((course) => (

                  <option
                    key={course._id}
                    value={course._id}
                  >
                    {course.title}
                  </option>

                ))}

              </select>


              {/* TITLE */}

              <label>
                Assignment Title
              </label>

              <input
                type="text"
                placeholder="Enter assignment title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />


              {/* DESCRIPTION */}

              <label>
                Description
              </label>

              <textarea
                rows="4"
                placeholder="Describe the assignment..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              />


              {/* DEADLINE */}

              <label>
                Deadline
              </label>

              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) =>
                  setDeadline(e.target.value)
                }
                required
              />


              {/* MARKS */}

              <label>
                Maximum Marks
              </label>

              <input
                type="number"
                min="1"
                value={maxMarks}
                onChange={(e) =>
                  setMaxMarks(e.target.value)
                }
                required
              />


              {/* ATTACHMENT */}

              <label>
                Attachment URL (optional)
              </label>

              <input
                type="url"
                placeholder="https://..."
                value={attachmentUrl}
                onChange={(e) =>
                  setAttachmentUrl(e.target.value)
                }
              />


              <button
                type="submit"
                disabled={creating}
              >
                {creating
                  ? "Creating..."
                  : "Create Assignment"}
              </button>

            </form>

          )}

        </section>


        {/* ASSIGNMENT LIST */}

        <section className="dashboard-section">

          <div className="section-heading">

            <h2>
              My Assignments
            </h2>

            <span>
              {assignments.length} total
            </span>

          </div>


          {assignments.length === 0 ? (

            <div className="grades-empty">

              <span>📝</span>

              <h3>
                No assignments yet
              </h3>

              <p>
                Create an assignment above to get started.
              </p>

            </div>

          ) : (

            <div className="assignment-list">

              {assignments.map((assignment) => (

                <div
                  className="assignment-item"
                  key={assignment._id}
                >

                  <div>

                    <h3>
                      {assignment.title}
                    </h3>

                    <p>
                      {getCourseName(
                        assignment.course
                      )}
                    </p>

                    <p>
                      Due:{" "}
                      {new Date(
                        assignment.deadline
                      ).toLocaleString()}
                    </p>

                    <p>
                      Maximum Marks:{" "}
                      {assignment.maxMarks}
                    </p>

                  </div>


                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center"
                    }}
                  >

                    <Link
                      to={`/instructor/assignments/${assignment._id}/submissions`}
                      className="view-course-btn"
                    >
                      View Submissions
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          assignment._id
                        )
                      }
                      style={{
                        border: "none",
                        background: "#ffe5e5",
                        color: "#d33",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Delete
                    </button>

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

export default InstructorAssignments;
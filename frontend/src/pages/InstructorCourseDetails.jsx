import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

function InstructorCourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);

  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

  const [lessonData, setLessonData] = useState({});

  const fetchData = async () => {
    try {
      const courseRes = await API.get(`/courses/${id}`);
      setCourse(courseRes.data);

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
    } catch (error) {
      console.log("Failed to load course", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const addModule = async (e) => {
    e.preventDefault();

    if (!moduleTitle.trim()) {
      alert("Enter module title");
      return;
    }

    try {
      await API.post(`/modules/course/${id}`, {
        title: moduleTitle,
        description: moduleDescription
      });

      setModuleTitle("");
      setModuleDescription("");

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create module"
      );
    }
  };

  const addLesson = async (moduleId) => {
    const data = lessonData[moduleId] || {};

    if (!data.title?.trim()) {
      alert("Enter lesson title");
      return;
    }

    try {
      await API.post(`/lessons/module/${moduleId}`, {
        title: data.title,
        description: data.description || "",
        videoUrl: data.videoUrl || "",
        resourceUrl: data.resourceUrl || "",
        duration: data.duration || "",
        order: lessons[moduleId]?.length + 1 || 1
      });

      setLessonData({
        ...lessonData,
        [moduleId]: {}
      });

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create lesson"
      );
    }
  };

  const deleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module?")) return;

    try {
      await API.delete(`/modules/${moduleId}`);
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete module"
      );
    }
  };

  const deleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;

    try {
      await API.delete(`/lessons/${lessonId}`);
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete lesson"
      );
    }
  };

  const updateLessonField = (moduleId, field, value) => {
    setLessonData({
      ...lessonData,
      [moduleId]: {
        ...(lessonData[moduleId] || {}),
        [field]: value
      }
    });
  };

  const publishCourse = async () => {
    try {
      await API.patch(`/courses/${id}/publish`);
      alert("Course published successfully");
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to publish course"
      );
    }
  };

  if (loading) {
    return (
      <main className="dashboard-content">
        <div className="grades-message">
          <div className="loading-spinner"></div>
          <p>Loading course...</p>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="dashboard-content">
        <h2>Course not found</h2>
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

      {/* MAIN */}

      <main className="dashboard-content">

        <Link to="/instructor/courses">
          ← Back to My Courses
        </Link>

        {/* COURSE HEADER */}

        <div className="dashboard-header">

          <div>
            <p className="dashboard-welcome">
              COURSE MANAGEMENT
            </p>

            <h1>{course.title}</h1>

            <p>{course.description}</p>

            <p>
              Status:{" "}
              <strong>{course.status}</strong>
            </p>
          </div>

          {course.status === "draft" && (
            <button
              className="view-course-btn"
              onClick={publishCourse}
            >
              Publish Course
            </button>
          )}

        </div>

        {/* ADD MODULE */}

        <section className="dashboard-section">

          <div className="section-heading">
            <h2>Add Module</h2>
          </div>

          <form
            className="contact-form"
            onSubmit={addModule}
          >

            <input
              type="text"
              placeholder="Module title"
              value={moduleTitle}
              onChange={(e) =>
                setModuleTitle(e.target.value)
              }
            />

            <textarea
              placeholder="Module description"
              value={moduleDescription}
              onChange={(e) =>
                setModuleDescription(e.target.value)
              }
            />

            <button type="submit">
              + Add Module
            </button>

          </form>

        </section>

        {/* MODULES */}

        <section className="dashboard-section">

          <div className="section-heading">
            <h2>Course Content</h2>
          </div>

          {modules.length === 0 ? (

            <div className="grades-empty">
              <span>📚</span>
              <h3>No modules yet</h3>
              <p>
                Add your first module above.
              </p>
            </div>

          ) : (

            <div className="module-list">

              {modules.map((module, index) => {

                const currentLesson =
                  lessonData[module._id] || {};

                return (

                  <div
                    className="module-card"
                    key={module._id}
                  >

                    <div className="module-header">

                      <div>
                        <span className="module-number">
                          Module {index + 1}
                        </span>

                        <h3>{module.title}</h3>

                        {module.description && (
                          <p>
                            {module.description}
                          </p>
                        )}
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteModule(module._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                    {/* LESSONS */}

                    <div className="lesson-list">

                      {lessons[module._id]?.length > 0 ? (

                        lessons[module._id].map(
                          (lesson, lessonIndex) => (

                            <div
                              className="lesson-item"
                              key={lesson._id}
                            >

                              <div className="lesson-icon">
                                ▶
                              </div>

                              <div className="lesson-info">

                                <strong>
                                  {lessonIndex + 1}.{" "}
                                  {lesson.title}
                                </strong>

                                {lesson.description && (
                                  <p>
                                    {lesson.description}
                                  </p>
                                )}

                              </div>

                              {lesson.duration && (
                                <span>
                                  {lesson.duration}
                                </span>
                              )}

                              <button
                                className="delete-btn"
                                onClick={() =>
                                  deleteLesson(
                                    lesson._id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          )
                        )

                      ) : (

                        <p className="no-lessons">
                          No lessons yet.
                        </p>

                      )}

                    </div>

                    {/* ADD LESSON */}

                    <div className="add-lesson">

                      <h4>Add Lesson</h4>

                      <input
                        type="text"
                        placeholder="Lesson title"
                        value={currentLesson.title || ""}
                        onChange={(e) =>
                          updateLessonField(
                            module._id,
                            "title",
                            e.target.value
                          )
                        }
                      />

                      <textarea
                        placeholder="Description"
                        value={
                          currentLesson.description || ""
                        }
                        onChange={(e) =>
                          updateLessonField(
                            module._id,
                            "description",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="text"
                        placeholder="Video URL"
                        value={
                          currentLesson.videoUrl || ""
                        }
                        onChange={(e) =>
                          updateLessonField(
                            module._id,
                            "videoUrl",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="text"
                        placeholder="Resource URL"
                        value={
                          currentLesson.resourceUrl || ""
                        }
                        onChange={(e) =>
                          updateLessonField(
                            module._id,
                            "resourceUrl",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="text"
                        placeholder="Duration (e.g. 15 min)"
                        value={
                          currentLesson.duration || ""
                        }
                        onChange={(e) =>
                          updateLessonField(
                            module._id,
                            "duration",
                            e.target.value
                          )
                        }
                      />

                      <button
                        onClick={() =>
                          addLesson(module._id)
                        }
                      >
                        + Add Lesson
                      </button>

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

export default InstructorCourseDetails;
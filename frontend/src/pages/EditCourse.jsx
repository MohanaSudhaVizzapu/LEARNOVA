import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    thumbnail: "",
    duration: "",
    price: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await API.get(`/courses/${id}`);

        const course = response.data;

        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "",
          thumbnail: course.thumbnail || "",
          duration: course.duration || "",
          price: course.price || 0
        });

      } catch (error) {
        console.log("Failed to load course", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.put(`/courses/${id}`, {
        ...formData,
        price: Number(formData.price)
      });

      alert("Course updated successfully!");

      navigate(`/instructor/courses/${id}`);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to update course"
      );
    } finally {
      setSaving(false);
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


      {/* MAIN CONTENT */}

      <main className="dashboard-content">

        <Link to="/instructor/courses">
          ← Back to My Courses
        </Link>


        <div className="dashboard-header">

          <div>

            <p className="dashboard-welcome">
              COURSE MANAGEMENT
            </p>

            <h1>Edit Course</h1>

            <p>
              Update your course information.
            </p>

          </div>

        </div>


        {/* EDIT FORM */}

        <section className="dashboard-section">

          <div className="section-heading">
            <h2>Course Details</h2>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <label>
              Course Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />


            {/* DESCRIPTION */}

            <label>
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
            />


            {/* CATEGORY */}

            <label>
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />


            {/* LEVEL */}

            <label>
              Level
            </label>

            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Level
              </option>

              <option value="Beginner">
                Beginner
              </option>

              <option value="ntermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>


            {/* THUMBNAIL */}

            <label>
              Thumbnail URL
            </label>

            <input
              type="url"
              name="thumbnail"
              placeholder="https://..."
              value={formData.thumbnail}
              onChange={handleChange}
            />


            {/* DURATION */}

            <label>
              Duration
            </label>

            <input
              type="text"
              name="duration"
              placeholder="e.g. 10 hours"
              value={formData.duration}
              onChange={handleChange}
            />


            {/* PRICE */}

            <label>
              Price
            </label>

            <input
              type="number"
              name="price"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />


            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px"
              }}
            >

              <button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <Link
                to={`/instructor/courses/${id}`}
                className="view-course-btn"
              >
                Cancel
              </Link>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default EditCourse;
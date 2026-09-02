import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function CreateCourse() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    thumbnail: "",
    duration: "",
    price: 0
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/courses", {
        ...form,
        price: Number(form.price)
      });

      alert("Course created successfully!");

      navigate("/instructor/courses");

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-course-page">

      <div className="create-course-header">

        <div>
          <p className="dashboard-welcome">
            COURSE MANAGEMENT
          </p>

          <h1>Create Course</h1>

          <p>
            Add a new course for your students.
          </p>
        </div>

      </div>


      <form
        className="create-course-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">

          <label>Course Title</label>

          <input
            type="text"
            name="title"
            placeholder="Enter course title"
            value={form.title}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe your course"
            value={form.description}
            onChange={handleChange}
            rows="5"
            required
          />

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>Category</label>

            <input
              type="text"
              name="category"
              placeholder="e.g. Web Development"
              value={form.category}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label>Level</label>

            <select
              name="level"
              value={form.level}
              onChange={handleChange}
            >
              <option value="Beginner">
                Beginner
              </option>

              <option value="Intermediate">
                Intermediate
              </option>

              <option value="Advanced">
                Advanced
              </option>

            </select>

          </div>

        </div>


        <div className="form-row">

          <div className="form-group">

            <label>Duration</label>

            <input
              type="text"
              name="duration"
              placeholder="e.g. 6 weeks"
              value={form.duration}
              onChange={handleChange}
            />

          </div>


          <div className="form-group">

            <label>Price (₹)</label>

            <input
              type="number"
              name="price"
              min="0"
              value={form.price}
              onChange={handleChange}
            />

          </div>

        </div>


        <div className="form-group">

          <label>Thumbnail URL</label>

          <input
            type="text"
            name="thumbnail"
            placeholder="https://example.com/image.jpg"
            value={form.thumbnail}
            onChange={handleChange}
          />

        </div>


        <div className="create-course-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate("/instructor/courses")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Course"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default CreateCourse;
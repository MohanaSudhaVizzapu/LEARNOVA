import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">

      <Link to="/" className="logo">
        <span className="logo-icon">◆</span>
        Learnova
      </Link>

      <div className="nav-links">

        <Link
          to="/"
          className={location.pathname === "/" ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/courses"
          className={
            location.pathname.startsWith("/courses") ? "active" : ""
          }
        >
          Courses
        </Link>

        {/* Grades - only for students */}
        {user && user.role === "student" && (
          <Link
            to="/grades"
            className={
              location.pathname.startsWith("/grades") ? "active" : ""
            }
          >
            Grades
          </Link>
        )}

        <Link
          to="/about"
          className={location.pathname === "/about" ? "active" : ""}
        >
          About
        </Link>

        <Link
          to="/features"
          className={location.pathname === "/features" ? "active" : ""}
        >
        Features
        </Link>

        <Link
          to="/contact"
          className={location.pathname === "/contact" ? "active" : ""}
        >
        Contact
        </Link>

      </div>

      {user ? (
        <div className="user-area">

          <span className="user-name">
            Hi, {user.name}
          </span>

          <div className="user-avatar">
            👤
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout ↪
          </button>

        </div>
      ) : (
        <div className="user-area">

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>

        </div>
      )}

    </nav>
  );
}

export default Navbar;
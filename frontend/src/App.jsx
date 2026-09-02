import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Lesson from "./pages/Lesson";
import Assignments from "./pages/Assignments";
import AssignmentDetails from "./pages/AssignmentDetails";
import Grades from "./pages/Grades";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/InstructorCourses";
import CreateCourse from "./pages/CreateCourse";
import InstructorCourseDetails from "./pages/InstructorCourseDetails";
import InstructorAssignments from "./pages/InstructorAssignments";
import InstructorSubmissions from "./pages/InstructorSubmissions";
import InstructorStudents from "./pages/InstructorStudents";
import EditCourse from "./pages/EditCourse";


import Navbar from "./components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return (
      <Navigate
        to={
          user.role === "instructor"
            ? "/instructor"
            : "/dashboard"
        }
        replace
      />
    );
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="student">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/courses" element={<Courses />} />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/lessons/:id"
            element={<Lesson />}
          />

          <Route
            path="/assignments"
            element={<Assignments />}
          />

          <Route
            path="/assignments/:id"
            element={<AssignmentDetails />}
          />

          <Route path="/grades" element={<Grades />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute role="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/courses"
            element={
              <ProtectedRoute role="instructor">
                <InstructorCourses />
              </ProtectedRoute>
             }
          />

          <Route
            path="/instructor/courses/create"
            element={
              <ProtectedRoute role="instructor">
                <CreateCourse />
              </ProtectedRoute>
            }
          />

            <Route
              path="/instructor/courses/:id"
              element={
                <ProtectedRoute role="instructor">
                  <InstructorCourseDetails />
                </ProtectedRoute>
            }
          />

            <Route
              path="/instructor/assignments"
              element={
                <ProtectedRoute role="instructor">
                  <InstructorAssignments />
                </ProtectedRoute>
            }
          />

            <Route
              path="/instructor/assignments/:id/submissions"
              element={
                <ProtectedRoute role="instructor">
                  <InstructorSubmissions />
                </ProtectedRoute>
            }
          />

            <Route
              path="/instructor/courses/:id/students"
              element={
                <ProtectedRoute role="instructor">
                  <InstructorStudents />
                </ProtectedRoute>
              }
          />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <ProtectedRoute role="instructor">
                  <EditCourse />
                </ProtectedRoute>
              }
          />

        </Routes>
        
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
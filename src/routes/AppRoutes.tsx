import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import EnrolledCoursesPage from "../pages/EnrolledCoursesPage";
import CoursePage from "../pages/CoursePage";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../pages/Unautherized";
import LecturePage from "../pages/Lecture";
import AssignmentPage from "../pages/AssignmentPage";
import Layout from "../components/Layout"; // Import the Layout component

export default function AppRoutes() {
  return (
    <Routes>
      {/* Routes without Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-courses"
          element={
            <ProtectedRoute allowedRoles={["student" , "instructor"]}>
              <EnrolledCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lectures/:lectureId"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <LecturePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lectures/:lectureId/assignments/:assignmentId"
          element={
            <ProtectedRoute allowedRoles={["student", "instructor"]}>
              <AssignmentPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

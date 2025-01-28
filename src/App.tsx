import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/dashboard/Dashboard";
import Navbar from "@/components/common/Sidebar";
import { ProtectedRoute } from "@/lib/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import Courses from "./pages/courses/Courses";
import NoticeBoard from "@/pages/notices/NoticeBoard";
import CourseNoticeBoard from "@/pages/notices/NoticeBoard";
import NoticeDetail from "@/components/notices/NoticeDetail";
import BulkUserUpload from "./components/users/BulkUserUpload";

const AppLayout = () => {
  const location = useLocation();
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  const isAuthenticated =
    localStorage.getItem("user") && localStorage.getItem("token");

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <NoticeBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId/notices"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <CourseNoticeBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/:courseId/:noticeId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "INSTRUCTOR"]}>
              <NoticeDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/bulk-upload"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <BulkUserUpload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <>
      <AppLayout />
      <Toaster />
    </>
  );
}

export default App;

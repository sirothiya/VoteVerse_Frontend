import { Navigate, useParams, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const { rollNumber } = useParams();
  const location = useLocation();

  // 🚫 Not logged in
  if (!token || !role || !authUser) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Trying to access someone else's profile (only for specific profile routes)
  // Only enforce the ownership check on actual profile routes (e.g. /profile/:rollNumber
  // or /candidateProfile/:rollNumber). Do NOT run this check on pages like
  // /candidateDetails/:rollNumber where voters should be allowed to view other
  // candidates' public profiles.
  const pathname = location?.pathname || "";
  const isProfileRoute =
    pathname.startsWith("/profile/") || pathname.startsWith("/candidateProfile/");

  if (
    isProfileRoute &&
    rollNumber &&
    String(authUser.rollNumber) !== String(rollNumber)
  ) {
    // Admins can view any profile; other roles cannot view someone else's profile
    if (role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
import { Navigate, useParams } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const { rollNumber } = useParams();

  // 🚫 Not logged in
  if (!token || !role || !authUser) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Wrong role
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Trying to access someone else's profile
  if (rollNumber && String(authUser.rollNumber) !== String(rollNumber)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
    const isAuth = sessionStorage.getItem("admin_auth") === "true";
    if (!isAuth) {
        return <Navigate to="/login/admin" replace />;
    }
    return children;
}

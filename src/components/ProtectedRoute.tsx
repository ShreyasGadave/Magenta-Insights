import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useOutlets } from "@/context/OutletContext";

interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = "/signin",
}) => {
  const { isAuthenticated } = useOutlets();

  // If not authenticated, redirect to signin
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

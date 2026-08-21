import React from "react";
import { Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { accounts } = useMsal();

  if (accounts.length === 0) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

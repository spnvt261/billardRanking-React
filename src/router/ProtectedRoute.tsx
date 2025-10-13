import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useWorkspace } from "../customhook/useWorkspace";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const {workspaceKey} = useWorkspace();

  if (!workspaceKey) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

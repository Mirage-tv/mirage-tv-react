import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../core/hooks";
import type { PublicRouteProps } from "./routes.models";

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

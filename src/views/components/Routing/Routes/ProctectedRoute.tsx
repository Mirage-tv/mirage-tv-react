import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../core/hooks";
import type { ProtectedRouteProps } from "./routes.models";

export function ProtectedRoute({ children, requireSubscription = false }: ProtectedRouteProps) {
  const { isAuthenticated, isSubscriber } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSubscription && !isSubscriber) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
}

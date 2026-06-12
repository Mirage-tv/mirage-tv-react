import { Navigate, Outlet } from "react-router-dom";
import { useEmbedded } from "../../../../core/context/EmbeddedContext";

export const EmbeddedGuard = () => {
  const { isEmbedded } = useEmbedded();

  if (isEmbedded) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

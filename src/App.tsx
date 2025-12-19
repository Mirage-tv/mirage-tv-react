import { useEffect } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import "./App.css";
import { useAuthStore } from "./infrastructure/store/authStore";
import { routes } from "./routes";
import { ScrollToTop } from "./views/components/ScrollToTop";

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, validateSession } = useAuthStore();

  useEffect(() => {
    // Valider la session au chargement de l'app
    // Cela vérifie si le cookie de session est toujours valide côté serveur
    if (isAuthenticated) {
      validateSession();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

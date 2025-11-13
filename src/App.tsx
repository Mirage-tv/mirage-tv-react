import { BrowserRouter, useRoutes } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

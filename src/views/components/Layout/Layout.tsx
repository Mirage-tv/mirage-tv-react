import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import "./Layout.css";

export const Layout = () => (
  <div className="layout">
    <Navbar className="layout__navbar" />
    <main className="layout__content">
      <Outlet />
    </main>
  </div>
);

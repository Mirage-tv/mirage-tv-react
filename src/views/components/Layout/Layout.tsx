import { Outlet } from "react-router-dom";
import { Footer } from "../Footer/Footer";
import { MobileBottomNav } from "../MobileBottomNav/MobileBottomNav";
import { Navbar } from "../Navbar/Navbar";
import "./Layout.css";

export const Layout = () => (
  <div className="layout">
    <Navbar className="layout__navbar" />
    <main className="layout__content">
      <Outlet />
    </main>
    <Footer />
    <MobileBottomNav />
  </div>
);

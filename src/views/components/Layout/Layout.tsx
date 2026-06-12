import { Outlet } from "react-router-dom";
import { useEmbedded } from "../../../core/context/EmbeddedContext";
import { Footer } from "../Footer/Footer";
import { MobileBottomNav } from "../MobileBottomNav/MobileBottomNav";
import { Navbar } from "../Navbar/Navbar";
import "./Layout.css";

export const Layout = () => {
  const { isEmbedded } = useEmbedded();

  return (
    <div className="layout">
      <Navbar className="layout__navbar" />
      <main className="layout__content">
        <Outlet />
      </main>
      {!isEmbedded && <Footer />}
      <MobileBottomNav />
    </div>
  );
};

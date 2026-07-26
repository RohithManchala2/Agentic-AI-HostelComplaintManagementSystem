import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./TechnicianSidebar.module.css";
import { useAppContext } from "../context/AppContext";

const TechnicianSidebar = () => {
  const { logout, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          HostelCare
          <span>Technician Panel</span>
        </div>
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          ☰
        </button>
      </div>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ''}`}>
        <NavLink to="/technician" className={styles.link} onClick={() => setIsOpen(false)}>
          Dashboard
        </NavLink>
        <NavLink to="/technician/tasks" className={styles.link} onClick={() => setIsOpen(false)}>
          My Tasks
        </NavLink>
      </nav>

      <div className={`${styles.footer} ${isOpen ? styles.footerOpen : ''}`}>
        <p>{user?.fullName || 'Technician'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
};

export default TechnicianSidebar;

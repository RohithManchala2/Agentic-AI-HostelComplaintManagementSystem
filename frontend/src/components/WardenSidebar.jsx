import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./WardenSidebar.module.css";
import { useAppContext } from "../context/AppContext";

const WardenSidebar = () => {
  const { logout, user } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.topBar}>
        <div className={styles.logo}>
          HostelCare
          <span>Warden Panel</span>
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
        <NavLink to="/warden" className={styles.link} onClick={() => setIsOpen(false)}>
          Dashboard
        </NavLink>
        <NavLink to="/warden/complaints" className={styles.link} onClick={() => setIsOpen(false)}>
          All Complaints
        </NavLink>
        <NavLink to="/warden/technicians" className={styles.link} onClick={() => setIsOpen(false)}>
          Technicians
        </NavLink>
      </nav>

      <div className={`${styles.footer} ${isOpen ? styles.footerOpen : ''}`}>
        <p>{user?.fullName || 'Warden'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
};

export default WardenSidebar;

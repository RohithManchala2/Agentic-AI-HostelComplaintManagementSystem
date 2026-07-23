import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./WardenSidebar.module.css";
import { useAppContext } from "../context/AppContext";

const WardenSidebar = () => {
  const { logout, user } = useAppContext();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        HostelCare
        <span>Warden Panel</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/warden" className={styles.link}>
          Dashboard
        </NavLink>
        <NavLink to="/warden/complaints" className={styles.link}>
          All Complaints
        </NavLink>
        <NavLink to="/warden/technicians" className={styles.link}>
          Technicians
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <p>{user?.fullName || 'Warden'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
};

export default WardenSidebar;

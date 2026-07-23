import { NavLink } from "react-router-dom";
import styles from "./TechnicianSidebar.module.css";
import { useAppContext } from "../context/AppContext";

const TechnicianSidebar = () => {
  const { logout, user } = useAppContext();

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        HostelCare
        <span>Technician Panel</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/technician" className={styles.link}>
          Dashboard
        </NavLink>
        <NavLink to="/technician/tasks" className={styles.link}>
          My Tasks
        </NavLink>
      </nav>

      <div className={styles.footer}>
        <p>{user?.fullName || 'Technician'}</p>
        <button onClick={logout}>Sign Out</button>
      </div>
    </div>
  );
};

export default TechnicianSidebar;

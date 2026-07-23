import { Outlet } from "react-router-dom";
import TechnicianSidebar from "../components/TechnicianSidebar";
import styles from "./TechnicianLayout.module.css";

const TechnicianLayout = () => {
  return (
    <div className={styles.container}>
      <TechnicianSidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default TechnicianLayout;

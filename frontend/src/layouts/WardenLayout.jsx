import { Outlet } from "react-router-dom";
import WardenSidebar from "../components/WardenSidebar";
import styles from "./WardenLayout.module.css";

const WardenLayout = () => {
  return (
    <div className={styles.container}>
      <WardenSidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default WardenLayout;

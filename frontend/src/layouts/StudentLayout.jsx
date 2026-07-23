import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import styles from "./StudentLayout.module.css";

const StudentLayout = () => {
  return (
    <div className={styles.container}>
      <StudentSidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
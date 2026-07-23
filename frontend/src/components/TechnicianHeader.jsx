import styles from "./TechnicianHeader.module.css";

const TechnicianHeader = () => {
  return (
    <div className={styles.header}>
      <div>
        <h1>Technician Dashboard</h1>
        <p>Manage your assigned tasks</p>
      </div>
    </div>
  );
};

export default TechnicianHeader;

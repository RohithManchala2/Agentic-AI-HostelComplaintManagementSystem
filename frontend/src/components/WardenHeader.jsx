import React from "react";
import styles from "./WardenHeader.module.css";
import { useAppContext } from "../context/AppContext";

const WardenHeader = () => {
  const { navigate } = useAppContext();

  return (
    <div className={styles.header}>
      <div>
        <h1>Warden Overview</h1>
        <p>Manage and assign hostel complaints</p>
      </div>

      <button onClick={() => navigate("/warden/complaints")}>
        View Complaints
      </button>
    </div>
  );
};

export default WardenHeader;

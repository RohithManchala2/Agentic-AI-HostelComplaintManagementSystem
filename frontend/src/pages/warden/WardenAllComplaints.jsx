import { useEffect, useState } from "react";
import styles from "./WardenAllComplaints.module.css";
import WardenHeader from "../../components/WardenHeader";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AllComplaints = () => {
  const { axios } = useAppContext();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get("/api/complaint/all", {
        withCredentials: true
      });
      const payload = data?.data ?? data;
      setComplaints(payload?.complaints || payload || []);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  return (
    <div className={styles.page}>
      <WardenHeader title="All Complaints" />

      <h3 className={styles.heading}>All Complaints</h3>

      {complaints.map(c => (
        <div key={c._id} className={styles.card}>
          <div className={styles.left}>
            <h4>{c.title}</h4>
            <p>{c.description}</p>

            <div className={styles.meta}>
              <span className={styles.category}>{c.category}</span>
              <span>📍 {c.block}, Room {c.room}</span>
              <span>🕒 {new Date(c.createdAt).toDateString()}</span>
            </div>
          </div>

          <div className={styles.right}>
            {c.status === "Pending" && (
              <span className={`${styles.badge} ${styles.pending}`}>
                Pending
              </span>
            )}

            {c.status === "In Progress" && (
              <span className={`${styles.badge} ${styles.assigned}`}>
                Assigned{c.assignedTo ? ` to ${c.assignedTo.fullName || c.assignedTo.name}` : ''}
              </span>
            )}

            {c.status === "Resolved" && (
              <span className={`${styles.badge} ${styles.fixed}`}>
                Fixed
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllComplaints;

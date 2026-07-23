import { useEffect, useState } from "react";
import styles from "./TechnicianDashboard.module.css";
import TechnicianHeader from "../../components/TechnicianHeader";
import StatCard from "../../components/StatCard";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const TechnicianDashboard = () => {
  const { axios } = useAppContext();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(
        "/api/complaint/assigned",
        { withCredentials: true }
      );
      const payload = data?.data ?? data;
      setTasks(payload?.complaints || payload || []);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Resolved").length;
  const total = tasks.length;

  return (
    <div className={styles.page}>
      <TechnicianHeader />

      <div className={styles.stats}>
        <StatCard label="Total Tasks" value={total} variant="total" />
        <StatCard label="Pending" value={pending} variant="pending" />
        <StatCard label="In Progress" value={inProgress} variant="assigned" />
        <StatCard label="Completed" value={completed} variant="fixed" />
      </div>

      <section className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <h3>Assigned Tasks</h3>
          <p>Keep track of your current workload and recent task details.</p>
        </div>

        {tasks.length === 0 ? (
          <div className={styles.emptyState}>No tasks assigned yet.</div>
        ) : (
          <div className={styles.taskGrid}>
            {tasks.slice(0, 6).map((task) => (
              <div key={task._id} className={styles.taskCard}>
                <div className={styles.taskTop}>
                  <span className={`${styles.badge} ${styles[task.status === "Resolved" ? "fixed" : task.status === "In Progress" ? "assigned" : "pending"]}`}>
                    {task.status}
                  </span>
                  <span className={styles.category}>{task.category || "General"}</span>
                </div>

                <h4>{task.title}</h4>
                <p>{task.description}</p>

                <div className={styles.taskMeta}>
                  <span>{task.block}, Room {task.room}</span>
                  <span>Raised on {new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TechnicianDashboard;

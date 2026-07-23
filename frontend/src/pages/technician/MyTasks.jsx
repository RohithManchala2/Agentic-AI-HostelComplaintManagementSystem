import { useEffect, useState } from "react";
import styles from "./MyTasks.module.css";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const MyTasks = () => {
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
    } catch (err) {
      console.error('Failed to load tasks', err);
      toast.error("Failed to load tasks");
    }
  };

  const markCompleted = async (complaintId) => {
    try {
      const { data } = await axios.put(
        `/api/complaint/status/${complaintId}`,
        { status: 'Resolved' },
        { withCredentials: true }
      );

      toast.success(data.message || 'Marked as completed');
      // Refresh own task list
      fetchTasks();

      // Notify other open pages (Student/Warden dashboards) to refresh their data
      try {
        window.dispatchEvent(new CustomEvent('complaintStatusUpdated', { detail: { id: complaintId, status: 'Resolved' } }));
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Failed to update status', err);
      toast.error(err.response?.data?.message || 'Failed to mark completed');
    }
  };

  return (
    <div className={styles.page}>
      <h3>My Tasks</h3>

      {tasks.length === 0 && (
        <div className={styles.empty}>No tasks assigned yet</div>
      )}

      {tasks.map(t => (
        <div key={t._id} className={styles.card}>
          <h4>{t.title}</h4>
          <p>{t.description}</p>

          <div className={styles.meta}>
            <span>{t.category}</span>
            <span>📍 {t.block}, Room {t.room}</span>
          </div>

          <span className={styles.status}>{t.status}</span>

          {t.status === 'In Progress' && (
            <div className={styles.actions}>
              <button className={styles.completeBtn} onClick={() => markCompleted(t._id)}>
                Mark Completed
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyTasks;

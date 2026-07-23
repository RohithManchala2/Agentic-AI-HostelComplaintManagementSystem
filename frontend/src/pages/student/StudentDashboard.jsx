import { useEffect, useState } from "react";
import styles from "./StudentDashboard.module.css";
import StudentHeader from "../../components/StudentHeader";
import StatCard from "../../components/StatCard";
import ComplaintCard from "../../components/ComplaintCard";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const { axios } = useAppContext();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios.get(
          "/api/complaint/my",
          { withCredentials: true }
        );
        const payload = data?.data ?? data;
        setComplaints(payload?.complaints || payload || []);
      } catch (error) {
        toast.error("Failed to load complaints");
      }
    };

    fetchComplaints();

    // Refresh when a complaint status is updated elsewhere
    const handler = (e) => {
      fetchComplaints();
    };
    window.addEventListener('complaintStatusUpdated', handler);
    return () => window.removeEventListener('complaintStatusUpdated', handler);
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const assigned = complaints.filter((c) => c.status === "In Progress").length;
  const fixed = complaints.filter((c) => c.status === "Resolved").length;

  return (
    <div className={styles.page}>
      <StudentHeader title="Student Dashboard" />

      <div className={styles.stats}>
        <StatCard label="Total" value={total} variant="total" />
        <StatCard label="Pending" value={pending} variant="pending" />
        <StatCard label="Assigned" value={assigned} variant="assigned" />
        <StatCard label="Fixed" value={fixed} variant="fixed" />
      </div>

      <h3 className={styles.heading}>Recent Complaints</h3>

      <div className={styles.list}>
        {complaints.slice(0, 3).map((complaint) => (
          <ComplaintCard key={complaint._id} complaint={complaint} />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;

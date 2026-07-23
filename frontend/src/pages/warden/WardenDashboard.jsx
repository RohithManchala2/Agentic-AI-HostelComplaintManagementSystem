import { useEffect, useState } from "react";
import styles from "./WardenDashboard.module.css";
import WardenHeader from "../../components/WardenHeader";
import StatCard from "../../components/StatCard";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const WardenDashboard = () => {
  const { axios } = useAppContext();

  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchComplaints();

    // refresh when complaints change elsewhere
    const handler = (e) => {
      fetchComplaints();
      toast.info('Complaint status updated — refreshing');
    };

    window.addEventListener('complaintStatusUpdated', handler);
    return () => window.removeEventListener('complaintStatusUpdated', handler);
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data } = await axios.get("/api/complaint/all", { withCredentials: true });
      const payload = data?.data ?? data;
      setComplaints(payload?.complaints || payload || []);
    } catch {
      toast.error("Failed to load complaints");
    }
  };

  const openAssign = async (complaint) => {
    setSelectedComplaint(complaint);
    try {
      const { data } = await axios.get(
        `/api/user/technicians?category=${encodeURIComponent(complaint.category || '')}`,
        { withCredentials: true }
      );
      console.log('Technicians response:', data);

      const payload = data?.data ?? data;
      const techList = Array.isArray(payload) ? payload : [];

      if (techList.length === 0) {
        setTechnicians([]);
        toast.info('No technicians found for this category');
      } else {
        setTechnicians(techList);
        toast.info(`Found ${techList.length} technician${techList.length > 1 ? 's' : ''}`);
      }
    } catch (err) {
      console.error('Failed to load technicians', err);
      toast.error(err.response?.data?.message || "Failed to load technicians");
    }
  };

  const assignTechnician = async (techId) => {
    try {
      await axios.put(
        `/api/complaint/assign/${selectedComplaint._id}`,
        { technicianId: techId },
        { withCredentials: true }
      );
      toast.success("Technician assigned");
      setSelectedComplaint(null);
      fetchComplaints();
    } catch {
      toast.error("Assignment failed");
    }
  };

  const pendingComplaints = complaints.filter(c => c.status === "Pending");

  return (
    <div className={styles.page}>
      <WardenHeader />

      <div className={styles.stats}>
        <StatCard label="Total" value={complaints.length} variant="total" />
        <StatCard label="Pending" value={pendingComplaints.length} variant="pending" />
        <StatCard label="Assigned" value={complaints.filter(c => c.status === "In Progress").length} variant="assigned" />
        <StatCard label="Resolved" value={complaints.filter(c => c.status === "Resolved").length} variant="fixed" />
      </div>

      <h3 className={styles.heading}>Pending Complaints</h3>

      {pendingComplaints.map(c => (
        <div key={c._id} className={styles.card}>
          <div>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
            <span className={styles.tag}>{c.category}</span>
          </div>

          {c.assignedTo ? (
            <span className={styles.assigned}>Assigned to {c.assignedTo.fullName || c.assignedTo.name}</span>
          ) : (
            <button className={styles.assignBtn} onClick={() => openAssign(c)}>
              Assign
            </button>
          )}
        </div>
      ))}

      <h3 className={styles.heading}>All Recent Complaints</h3>

      {complaints.map(c => (
        <div key={c._id} className={styles.card}>
          <div>
            <h4>{c.title}</h4>
            <p>{c.description}</p>
            <span className={styles.tag}>{c.category}</span>
          </div>
          <span className={styles.status}>{c.status}</span>
        </div>
      ))}

      {selectedComplaint && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h3>Select Technician</h3>

            {technicians.length === 0 ? (
              <p>No technicians available for this category</p>
            ) : (
              technicians.map(t => (
                <button
                  key={t._id}
                  className={styles.techBtn}
                  onClick={() => assignTechnician(t._id)}
                  disabled={t.activeTasks >= 5}
                >
                  {t.name} ({t.activeTasks} tasks){t.activeTasks >= 5 ? ' — Busy' : ''}
                </button>
              ))
            )}

            <button className={styles.closeBtn} onClick={() => setSelectedComplaint(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenDashboard;

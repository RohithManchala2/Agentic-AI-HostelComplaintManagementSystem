import { useEffect, useMemo, useState } from "react";
import styles from "./AssignModel.module.css";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AssignModel = ({ complaint, onClose, onAssigned }) => {
  const { axios } = useAppContext();
  const [technicians, setTechnicians] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    if (!complaint) {
      setTechnicians([]);
      setQuery("");
      return;
    }
    fetchTechnicians();
  }, [complaint]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      setTechnicians([]);
      const { data } = await axios.get(`/api/user/technicians?category=${complaint.category}`);
      const payload = data?.data ?? data;
      const available = (Array.isArray(payload) ? payload : []).filter((tech) => (tech.taskCount ?? tech.activeTasks) < 5);
      setTechnicians(available);
    } catch {
      toast.error("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  const filteredTechnicians = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return technicians;
    return technicians.filter((tech) => {
      const haystack = `${tech.name} ${tech.email} ${tech.specialization}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [query, technicians]);

  const assignTechnician = async (technicianId) => {
    setAssigningId(technicianId);
    try {
      await axios.put(`/api/complaint/assign/${complaint._id}`, { technicianId });
      toast.success("Technician assigned successfully");
      onAssigned();
      onClose();
    } catch {
      toast.error("Assignment failed");
    } finally {
      setAssigningId(null);
    }
  };

  if (!complaint) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.headerRow}>
          <div>
            <h3>Assign Technician</h3>
            <p className={styles.sub}>Select a technician for <b>{complaint.category}</b></p>
          </div>
          <button className={styles.iconButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search technicians"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading technicians...</div>
        ) : filteredTechnicians.length === 0 ? (
          <div className={styles.emptyState}>No technicians match your search.</div>
        ) : (
          <div className={styles.list}>
            {filteredTechnicians.map((tech) => (
              <div key={tech._id} className={styles.techCard}>
                <div className={styles.techInfo}>
                  <div className={styles.avatar}>{tech.name?.charAt(0) || "T"}</div>
                  <div>
                    <h4>{tech.name}</h4>
                    <p>{tech.email}</p>
                    <p>{tech.phone || "Phone not provided"}</p>
                  </div>
                </div>

                <div className={styles.metaInfo}>
                  <span className={styles.badge}>{tech.specialization || "General"}</span>
                  <span className={styles.status}>{tech.availability ? "Available" : "Busy"}</span>
                  <span className={styles.workload}>Workload: {tech.activeTasks || 0}</span>
                </div>

                <button
                  className={styles.assignButton}
                  disabled={assigningId === tech._id || !tech.availability}
                  onClick={() => assignTechnician(tech._id)}
                >
                  {assigningId === tech._id ? "Assigning..." : "Assign"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footerRow}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AssignModel;

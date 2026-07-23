import { useEffect, useMemo, useState } from "react";
import styles from "./TechnicianManagement.module.css";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const TechnicianManagement = () => {
  const { axios } = useAppContext();
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", specialty: "General", phone: "" });
  const [formErrors, setFormErrors] = useState([]);
  const pageSize = 6;

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/user/technicians?category=");
      setTechnicians(data?.data || data || []);
    } catch {
      toast.error("Failed to load technicians");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return technicians;
    return technicians.filter((tech) => `${tech.name} ${tech.email} ${tech.specialization}`.toLowerCase().includes(term));
  }, [search, technicians]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const startEdit = (tech) => {
    setEditingId(tech._id);
    setForm({
      fullName: tech.name,
      email: tech.email,
      specialty: tech.specialization || "General",
      phone: tech.phone || "",
    });
    setFormErrors([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ fullName: "", email: "", specialty: "General", phone: "" });
    setFormErrors([]);
  };

  const validateForm = () => {
    const errors = [];
    const trimmedName = form.fullName.trim();
    const trimmedEmail = form.email.trim().toLowerCase();
    const trimmedPhone = form.phone.trim();

    if (!trimmedName) errors.push("Name is required.");
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) errors.push("Enter a valid email address.");
    if (!/^\d{10}$/.test(trimmedPhone)) errors.push("Phone number must be exactly 10 digits.");
    if (!["Electrician", "Plumber", "Carpenter", "Network Technician", "Cleaner", "General"].includes(form.specialty)) {
      errors.push("Please select a valid specialization.");
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  const saveEdit = async (id) => {
    if (!validateForm()) {
      toast.error("Please fix the technician validation errors.");
      return;
    }

    try {
      const { data } = await axios.put(`/api/user/technicians/${id}`, {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        specialty: form.specialty || "General",
        phone: form.phone.trim(),
      });
      toast.success(data.message || "Technician updated");
      setEditingId(null);
      fetchTechnicians();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update technician");
    }
  };

  const deleteTechnician = async (id) => {
    if (!window.confirm("Remove this technician from the system?")) return;
    try {
      const { data } = await axios.delete(`/api/user/technicians/${id}`);
      toast.success(data.message || "Technician removed");
      fetchTechnicians();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete technician");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerCard}>
        <div>
          <h2>Technician Management</h2>
          <p>Review technician availability and maintain account details.</p>
        </div>
        <div className={styles.searchField}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or specialty" />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>Loading technicians...</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Technician</th>
                <th>Contact</th>
                <th>Specialization</th>
                <th>Active Complaints</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((tech) => (
                <tr key={tech._id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{tech.name?.charAt(0) || "T"}</div>
                      <div>
                        <strong>{editingId === tech._id ? <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /> : tech.name}</strong>
                        <div className={styles.muted}>{tech.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {editingId === tech._id ? (
                      <div className={styles.inlineFields}>
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                      </div>
                    ) : (
                      <div>
                        <div>{tech.email}</div>
                        <div className={styles.muted}>{tech.phone || "Phone not provided"}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === tech._id ? (
                      <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}>
                        <option>Electrician</option>
                        <option>Plumber</option>
                        <option>Carpenter</option>
                        <option>Network Technician</option>
                        <option>Cleaner</option>
                        <option>General</option>
                      </select>
                    ) : (
                      tech.specialization || "General"
                    )}
                  </td>
                  <td>{tech.activeTasks || 0}</td>
                  <td>
                    <span className={`${styles.status} ${tech.availability ? styles.available : styles.busy}`}>
                      {tech.availability ? "Available" : "Busy"}
                    </span>
                  </td>
                  <td>
                    {editingId === tech._id ? (
                      <div className={styles.actionGroup}>
                        <button className={styles.primaryButton} onClick={() => saveEdit(tech._id)}>Save</button>
                        <button className={styles.secondaryButton} onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <div className={styles.actionGroup}>
                        <button className={styles.primaryButton} onClick={() => startEdit(tech)}>Edit</button>
                        <button className={styles.secondaryButton} onClick={() => deleteTechnician(tech._id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formErrors.length > 0 && editingId && (
        <div className={styles.validationBox}>
          {formErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className={styles.emptyState}>No technicians found for your search.</div>
      )}

      <div className={styles.pagination}>
        <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
      </div>
    </div>
  );
};

export default TechnicianManagement;

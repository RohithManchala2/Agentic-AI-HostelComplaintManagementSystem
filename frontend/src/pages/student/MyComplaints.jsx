import { useEffect, useState } from "react";
import ComplaintCard from "../../components/ComplaintCard";
import styles from "./MyComplaints.module.css";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const MyComplaints = () => {
  const { axios } = useAppContext();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className={styles.page}>
      <h2>My Complaints</h2>

      {loading && <p className={styles.message}>Loading...</p>}

      {!loading && complaints.length === 0 && (
        <p className={styles.message}>No complaints raised yet</p>
      )}

      <div className={styles.list}>
        {complaints.map((complaint) => (
          <ComplaintCard key={complaint._id} complaint={complaint} />
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;

import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <header className={styles.nav}>
        <div className={styles.brand}>
          <span className={styles.logo}>🏢</span>
          HostelCare
        </div>

        <button
          className={styles.signin}
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <h1>
          Streamline Your Hostel <br />
          <span>Complaint Management</span>
        </h1>

        <p>
          A smart, transparent system for raising complaints, tracking
          resolutions, and ensuring accountability in hostel maintenance.
        </p>

        <button
          className={styles.cta}
          onClick={() => navigate("/login")}
        >
          Get Started 
        </button>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.card}>
          <h3>📋 Easy Complaints</h3>
          <p>Submit issues in seconds with smart categorization</p>
        </div>

        <div className={styles.card}>
          <h3>👥 Smart Assignment</h3>
          <p>Auto-match technicians based on expertise</p>
        </div>

        <div className={styles.card}>
          <h3>🔧 Track Progress</h3>
          <p>Real-time status updates from pending to fixed</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>Built for students, wardens, and technicians</p>
        <div className={styles.roles}>
          <span>✔ Students</span>
          <span>✔ Wardens</span>
          <span>✔ Technicians</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

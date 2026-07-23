import { useState } from "react";
import styles from "./Login.module.css";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const { navigate, axios, setUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/login", { email: email.trim(), password });
      const payload = data?.data ?? data;
      const loggedInUser = payload?.user ?? data?.user;

      toast.success(data.message || "Login successful");

      if (loggedInUser) {
        setUser(loggedInUser);
      }

      if (loggedInUser?.role === "Student") {
        navigate("/student");
      } else if (loggedInUser?.role === "Warden") {
        navigate("/warden");
      } else if (loggedInUser?.role === "Technician") {
        navigate("/technician");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>HostelCare</h1>
        <p>Hostel Complaint Management</p>
      </header>

      <div className={styles.card}>
        <h2>Sign In</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.group}>
            <label>Password</label>
            <div className={styles.passwordRow}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className={styles.toggleButton} onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account? <span onClick={() => navigate("/createaccount")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;

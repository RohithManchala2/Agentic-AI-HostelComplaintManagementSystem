import { useMemo, useState } from "react";
import styles from "./CreateAccount.module.css";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const CreateAccount = () => {
  const { navigate, axios } = useAppContext();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("Student");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [specialty, setSpecialty] = useState("General");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validation = useMemo(() => {
    const errors = [];
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName) {
      errors.push("Full name is required.");
    }

    if (!trimmedEmail) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.push("Enter a valid email address.");
    }

    if (!trimmedPassword) {
      errors.push("Password is required.");
    } else {
      if (trimmedPassword.length < 8) {
        errors.push("Password must be at least 8 characters.");
      }
      if (!/[A-Z]/.test(trimmedPassword)) {
        errors.push("Password must include an uppercase letter.");
      }
      if (!/[a-z]/.test(trimmedPassword)) {
        errors.push("Password must include a lowercase letter.");
      }
      if (!/[0-9]/.test(trimmedPassword)) {
        errors.push("Password must include a number.");
      }
      if (!/[^A-Za-z0-9\s]/.test(trimmedPassword)) {
        errors.push("Password must include a special character.");
      }
      if (/\s/.test(trimmedPassword)) {
        errors.push("Password cannot contain spaces.");
      }
    }

    if (trimmedConfirmPassword && trimmedPassword !== trimmedConfirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (role === "Student" && (!block.trim() || !room.trim())) {
      errors.push("Block and room are required for students.");
    }

    return errors;
  }, [block, confirmPassword, email, fullName, password, role, room]);

  const isValid = validation.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Please fix the highlighted validation issues.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("/api/user/register", {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        block: block.trim(),
        room: room.trim(),
        specialty,
      });

      if (data.message === "Account created successfully") {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
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
        <h2>Create Account</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.group}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className={styles.group}>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Technician">Technician</option>
            </select>
          </div>

          {role === "Student" && (
            <div className={styles.row}>
              <div className={styles.group}>
                <label>Block</label>
                <input value={block} onChange={(e) => setBlock(e.target.value)} placeholder="A" />
              </div>

              <div className={styles.group}>
                <label>Room</label>
                <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="101" />
              </div>
            </div>
          )}

          {role === "Technician" && (
            <div className={styles.group}>
              <label>Specialization</label>
              <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                <option>Electrician</option>
                <option>Plumber</option>
                <option>Carpenter</option>
                <option>Network Technician</option>
                <option>Cleaner</option>
                <option>General</option>
              </select>
            </div>
          )}

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

          <div className={styles.group}>
            <label>Confirm Password</label>
            <div className={styles.passwordRow}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" className={styles.toggleButton} onClick={() => setShowConfirmPassword((value) => !value)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {validation.length > 0 && (
            <div className={styles.validationBox}>
              {validation.map((message) => (
                <p key={message}>{message}</p>
              ))}
            </div>
          )}

          <button className={styles.button} type="submit" disabled={loading || !isValid}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;

import styles from "./StatCard.module.css";

const StatCard = ({ label, value, variant }) => {
  return (
    <div className={`${styles.card} ${variant ? styles[variant] : ""}`}>
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
};

export default StatCard;

import styles from "./ComplaintCard.module.css";

const ComplaintCard = ({ complaint }) => {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <h4>{complaint.title}</h4>
        <span className={`${styles.status} ${styles[complaint.status.replace(" ", "")]}`}>
          {complaint.status}
        </span>
      </div>

      <p className={styles.category}>{complaint.category}</p>

      <p className={styles.description}>{complaint.description}</p>

      <div className={styles.footer}>
        <span>Block {complaint.block}</span>
        <span>Room {complaint.room}</span>
      </div>
    </div>
  );
};

export default ComplaintCard;

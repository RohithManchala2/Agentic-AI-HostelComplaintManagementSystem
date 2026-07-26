import { Bot, User } from "lucide-react";

import styles from "./ChatMessage.module.css";

const ChatMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}
    >
      {!isUser && (
        <div className={styles.avatar}>
          <Bot size={18} />
        </div>
      )}

      <div className={styles.bubble}>{message.text}</div>

      {isUser && (
        <div className={styles.avatar}>
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

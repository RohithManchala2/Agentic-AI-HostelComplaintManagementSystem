import { Bot, X } from "lucide-react";

import { useChat } from "../../context/ChatContext";

import styles from "./ChatHeader.module.css";

const ChatHeader = () => {
  const { closeChat } = useChat();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.avatar}>
          <Bot size={22} />
        </div>

        <div>
          <h3>Portfolio Assistant</h3>

          <span>Online</span>
        </div>
      </div>

      <button className={styles.closeButton} onClick={closeChat}>
        <X size={22} />
      </button>
    </header>
  );
};

export default ChatHeader;

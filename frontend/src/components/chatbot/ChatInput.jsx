import { useState } from "react";
import { SendHorizontal } from "lucide-react";

import { askAI } from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";

import styles from "./ChatInput.module.css";

const ChatInput = () => {
  const [question, setQuestion] = useState("");

  const { addMessage, setLoading } = useChat();

  const sendMessage = async () => {
    if (!question.trim()) return;

    const userQuestion = question.trim();

    addMessage({
      id: Date.now(),
      role: "user",
      text: userQuestion,
    });

    setQuestion("");

    try {
      setLoading(true);

      const text = await askAI(userQuestion);

      addMessage({
        id: Date.now() + 1,
        role: "assistant",
        text,
      });
    } catch (error) {
      addMessage({
        id: Date.now() + 1,
        role: "assistant",
        text: error.response?.data?.message || "Sorry, something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        value={question}
        placeholder="Start typing..."
        rows={1}
        onChange={(event) => setQuestion(event.target.value)}
        onKeyDown={handleKeyDown}
        className={styles.input}
      />

      <button onClick={sendMessage} className={styles.sendButton}>
        <SendHorizontal size={20} />
      </button>
    </div>
  );
};

export default ChatInput;

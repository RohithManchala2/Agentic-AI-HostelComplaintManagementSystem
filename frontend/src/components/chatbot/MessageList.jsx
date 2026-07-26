import { useEffect, useRef } from "react";

import { useChat } from "../../context/ChatContext";

import ChatMessage from "./ChatMessage";
import LoadingDots from "./LoadingDots";

import styles from "./MessageList.module.css";

const MessageList = () => {
  const { messages, loading } = useChat();

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className={styles.container}>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {loading && <LoadingDots />}

      <div ref={bottomRef}></div>
    </div>
  );
};

export default MessageList;

import { useRef, useEffect } from "react";
import { useChat } from "../../context/ChatContext";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import styles from "./ChatWindow.module.css";

const ChatWindow = () => {

    const { isOpen, closeChat, clearMessages } = useChat();
    const chatWindowRef = useRef(null);
    const prevIsOpenRef = useRef(false);

    // Clear messages when chat closes
    useEffect(() => {
        if (prevIsOpenRef.current && !isOpen) {
            clearMessages();
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, clearMessages]);

    // Handle outside click to close chat
    useEffect(() => {
        // Only set up listener when chat is open
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            // Close chat only if click is outside the chat window
            if (
                chatWindowRef.current &&
                !chatWindowRef.current.contains(event.target)
            ) {
                closeChat();
            }
        };

        // Add listener on document to detect outside clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener when component unmounts or chat closes
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, closeChat]);

    return (

        <div
            ref={chatWindowRef}
            className={`${styles.chatWindow} ${
                isOpen ? styles.open : styles.close
            }`}
        >

            <ChatHeader />

            <MessageList />

            <ChatInput />

        </div>

    );

};

export default ChatWindow;
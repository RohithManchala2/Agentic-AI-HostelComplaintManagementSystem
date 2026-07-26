import { MessageCircle } from "lucide-react";
import { useChat } from "../../context/ChatContext";
import useDraggable from "../../hooks/useDraggable";
import styles from "./FloatingButton.module.css";

const FloatingButton = () => {

    const { isOpen, openChat } = useChat();

    const { dragRef, position } = useDraggable();

    // Hide FloatingButton when ChatWindow is open
    if (isOpen) return null;

    return (
        <button
            ref={dragRef}
            className={styles.button}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
            onClick={openChat}
        >
            <MessageCircle size={28} />
        </button>
    );
};

export default FloatingButton;
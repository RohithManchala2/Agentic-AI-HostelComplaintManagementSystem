import {createContext,useState,useContext} from 'react';

const ChatContext = createContext();

export const ChatProvider = ({children})=>{
    const [isOpen,setIsOpen] = useState(false);
    const [loading,setLoading] = useState(false);
    const [messages,setMessages] = useState([
        {
            id: 1,
            role: 'assistant',
            text:"Hi 👋 I'm your hostel assistant.\n\nAsk me about complaints, status updates, technician assignments, or hostel information."
        }
    ]);
    const openChat=()=>{
        setIsOpen(true);
    };
    const closeChat=()=>{
        setIsOpen(false);
    };
    const toggleChat=()=>{
        setIsOpen(prev=>!prev);
    };
    const addMessage=(message)=>{
        setMessages(prev=>[...prev,message]);
    };
    const clearMessages = () => {
        setMessages([
            {
                id: 1,
                role: "assistant",
                text: "Hi 👋 I'm your hostel assistant.\n\nAsk me about complaints, status updates, technician assignments, or hostel information."
            }
        ]);
    };
    return(
        <ChatContext.Provider
            value={{
                isOpen,
                loading,
                messages,
                setLoading,
                openChat,
                closeChat,
                toggleChat,
                addMessage,
                clearMessages
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
export const useChat = () => useContext(ChatContext);

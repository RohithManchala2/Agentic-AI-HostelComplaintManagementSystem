import FloatingButton from "./FloatingButton";
import ChatWindow from "./ChatWindow";
import { useAppContext } from "../../context/AppContext";

const Chatbot = () => {
  const { user, authLoading } = useAppContext();

  if (authLoading || !user) {
    return null;
  }

  return (
    <>
      <FloatingButton />
      <ChatWindow />
    </>
  );
};

export default Chatbot;
// import { fetchAI } from "../utils/fetch";
import useStreamingChat from "../hooks/useStreamingChat";
import { useChatStore } from "../store";

export default function ChatInput() {
  const { isLoading, sendMessage, cancelSendMessage, bufferRef } = useStreamingChat();
  const addMessage = useChatStore((state) => state.addMessage);

  const data = {
    role: "user",
    content: "jquery怎么写",
  };
  const handleClick = () => {
    // sendMessage(data);
    addMessage({ role: "user", content: "jquery怎么写", id: Date.now().toString() });
  };
  return <button onClick={handleClick}>接口测试{bufferRef.current}</button>;
}

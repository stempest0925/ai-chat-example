// import { fetchAI } from "../utils/fetch";
import useStreamingChat from "../hooks/useStreamingChat";

export default function ChatInput() {
  const { isLoading, sendMessage, cancelSendMessage, bufferRef } = useStreamingChat();
  const handleClick = () => {
    sendMessage([
      {
        role: "user",
        content: "jquery怎么写",
      },
    ]);
  };
  return <button onClick={handleClick}>接口测试{bufferRef.current}</button>;
}

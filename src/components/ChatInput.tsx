import { useEffect, useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
import useStreamingChat from "../hooks/useStreamingChat";
import { useChatStore } from "../store";

export default function ChatInput() {
  const [question, setQuestion] = useState<string>("");

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  const onUpdate = useChatStore((state) => state.setStreamingMsg);
  const onComplete = useChatStore((state) => state.completeStreamingMsg);
  const onTokens = useChatStore((state) => state.setTokens);

  const { sendMessage, isLoading } = useStreamingChat({ onUpdate, onComplete, onTokens });

  useEffect(() => {
    if (messages.length > 0) {
      sendMessage(messages);
    }
  }, [messages]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };
  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && question.trim()) {
      handleClick();
    }
  };
  const handleClick = () => {
    addMessage({ id: Date.now().toString(), role: "user", content: question });
    setQuestion("");
  };

  return (
    <Stack direction="row" spacing={1}>
      <TextField fullWidth value={question} onChange={onInputChange} onKeyDown={onEnterKeyDown} />
      <Button variant="contained" disabled={!question.trim()} onClick={handleClick}>
        Send
      </Button>
    </Stack>
  );
}

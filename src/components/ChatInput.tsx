import { useEffect, useState } from "react";
import { Stack, TextField, Button, Container, Box } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
import useStreamingChat from "../hooks/useStreamingChat copy";
import { useChatStore } from "../store";

export default function ChatInput() {
  const [question, setQuestion] = useState<string>("");

  const historyMessages = useChatStore((state) => state.historyMessages);

  const { setStreamingContent: onUpdate, completePendingMessage: onComplete, addUserMessage } = useChatStore();
  // const onTokens = useChatStore((state) => {});

  const { sendMessage, isLoading } = useStreamingChat({ onUpdate, onComplete });

  useEffect(() => {
    if (historyMessages.length > 0) {
      sendMessage(historyMessages);
    }
  }, [historyMessages]);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };
  const onEnterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && question.trim()) {
      handleClick();
    }
  };
  const handleClick = () => {
    addUserMessage({ id: Date.now().toString(), role: "user", content: question });
    setQuestion("");
  };

  return (
    <Box sx={{ width: "100%", position: "absolute", bottom: 0 }}>
      <Container maxWidth="md">
        <Stack direction="row" spacing={1}>
          <TextField fullWidth value={question} onChange={onInputChange} onKeyDown={onEnterKeyDown} />
          <Button variant="contained" disabled={!question.trim()} onClick={handleClick}>
            Send
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

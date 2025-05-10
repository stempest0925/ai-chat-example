import { Typography, Stack, Container, Box } from "@mui/material";
import ChatMessageItem from "./ChatMessageItem";
import { useChatStore } from "../store";

export default function ChatMessage() {
  const historyMessages = useChatStore((state) => state.historyMessages);

  return (
    <Box sx={{ height: "100%", overflowY: "scroll" }}>
      <Container maxWidth="md" sx={{ pb: "80px" }}>
        <Stack sx={{ alignItems: "center", py: 1 }}>
          <Typography component="h1" sx={{ fontSize: 26, fontWeight: 900 }}>
            AI Chat
          </Typography>
        </Stack>
        <Stack>
          {historyMessages.map((message) => {
            return <ChatMessageItem key={message.id} role={message.role} content={message.content} />;
          })}
          <ChatStreamMessage />
        </Stack>
      </Container>
    </Box>
  );
}

function ChatStreamMessage() {
  const pendingMessage = useChatStore((state) => state.pendingMessage);

  if (pendingMessage) {
    return <ChatMessageItem role={pendingMessage.role} content={pendingMessage.content} />;
  }
  return null;
}

import { Typography, Stack } from "@mui/material";
import ChatMessageItem from "./ChatMessageItem";
import { useChatStore } from "../store";

export default function ChatMessage() {
  const messages = useChatStore((state) => state.messages);

  return (
    <Stack>
      <Stack sx={{ alignItems: "center", py: 1 }}>
        <Typography component="h1" sx={{ fontSize: 26, fontWeight: 900 }}>
          AI Chat
        </Typography>
      </Stack>
      <Stack>
        {messages.map((message) => {
          return <ChatMessageItem key={message.id} role={message.role} content={message.content} />;
        })}
        <ChatStreamMessage />
      </Stack>
    </Stack>
  );
}

function ChatStreamMessage() {
  const streamingMsg = useChatStore((state) => state.streamingMsg);
  
  if (streamingMsg) {
    return <ChatMessageItem role={streamingMsg.role} content={streamingMsg.content} />;
  }
  return null;
}

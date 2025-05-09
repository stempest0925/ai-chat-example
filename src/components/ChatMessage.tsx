import { Box, Typography, Stack, Paper } from "@mui/material";
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
      <Stack spacing={2}>
        {messages.map((message) => {
          return <ChatMessageItem key={message.id} role={message.role} content={message.content} />;
        })}
      </Stack>
    </Stack>
  );
}

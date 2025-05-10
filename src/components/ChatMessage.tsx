import { Typography, Stack, Container, Box, AppBar } from "@mui/material";
import ChatMessageItem from "./ChatMessageItem";
import { useChatStore } from "../store";
import { useRef, useEffect } from "react";

export default function ChatMessage() {
  const historyMessages = useChatStore((state) => state.historyMessages);
  const localRef = useRef<HTMLElement>(null);
  const { setScrollRef } = useChatStore();

  useEffect(() => {
    if (localRef.current) {
      setScrollRef(localRef.current);
    }
    return () => setScrollRef(null);
  }, []);

  // 设置对话历史的滚动
  useEffect(() => {
    if (localRef.current) {
      localRef.current.scrollTo({ top: localRef.current.scrollHeight });
    }
  }, [historyMessages]);

  return (
    <Stack direction="column" sx={{ height: "100%" }}>
      <AppBar
        position="relative"
        sx={{ height: 50, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 }}
      >
        <Typography variant="h5">AI Chat</Typography>
      </AppBar>
      <Box sx={{ flex: 1, overflow: "auto" }} ref={localRef}>
        <Container maxWidth="md" sx={{ pb: "150px", pt: 1 }}>
          <Stack>
            {historyMessages.map((message) => {
              return <ChatMessageItem key={message.id} role={message.role} content={message.content} />;
            })}
            <ChatStreamMessage />
          </Stack>
        </Container>
      </Box>
    </Stack>
  );
}

function ChatStreamMessage() {
  const pendingMessage = useChatStore((state) => state.pendingMessage);

  if (pendingMessage) {
    return <ChatMessageItem role={pendingMessage.role} content={pendingMessage.content} />;
  }
  return null;
}

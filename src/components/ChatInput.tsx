import { useState, Fragment } from "react";
import { Stack, OutlinedInput, IconButton, Container } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { blue, grey } from "@mui/material/colors";

import useStreamingChat from "../hooks/useStreamingChat";
import useAuthDialog from "./AuthDialog";
import { useChatStore } from "../store";

export default function ChatInput() {
  const [question, setQuestion] = useState<string>("");
  const canSend = /\S+/.test(question);

  const getHistoryMessages = useChatStore((state) => state.getHistoryMessages);
  const getChatConfig = useChatStore((state) => state.getChatConfig);
  const scrollRef = useChatStore((state) => state.scrollRef);
  const {
    setStreamingContent: onUpdate,
    completePendingMessage: onComplete,
    setPendingError: onError,
    addUserMessage,
    preparePendingMessage,
  } = useChatStore();

  const { openDialog, renderDialog } = useAuthDialog();
  const { sendMessage } = useStreamingChat({
    baseUrl: getChatConfig().baseUrl,
    authKey: getChatConfig().authKey,
    onUpdate,
    onComplete,
    onError,
    scrollContainer: scrollRef,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
  };
  const handleEnterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && canSend) {
      handleClick();
    }
  };
  const handleClick = () => {
    const { baseUrl, authKey } = getChatConfig();
    if (baseUrl && authKey) {
      addUserMessage(question);
      preparePendingMessage();
      // 使用get函数获取最新值
      const historyMessages = getHistoryMessages();
      sendMessage(historyMessages);
      setQuestion("");
    } else {
      openDialog();
    }
  };

  return (
    <Fragment>
      <Stack
        direction="column"
        sx={{ width: "100%", height: 64, position: "absolute", bottom: 0, justifyContent: "center" }}
      >
        <Container maxWidth="md" sx={{ background: "white" }}>
          <Stack direction="row" spacing={1}>
            <OutlinedInput
              fullWidth
              autoFocus
              type="text"
              placeholder="Message ChatGPT..."
              sx={{ height: 50, borderRadius: "8px", border: "none" }}
              value={question}
              onChange={handleInputChange}
              onKeyDownCapture={handleEnterKeyDown}
            />
            <IconButton
              aria-label="send"
              sx={{
                width: 50,
                height: 50,
                borderRadius: "8px",
                background: blue[500],
                "&:hover": {
                  background: blue[700],
                },
                "&.Mui-disabled": {
                  background: grey[400],
                },
              }}
              disabled={!canSend}
              onClick={handleClick}
            >
              <SendIcon sx={{ color: "white" }} />
            </IconButton>
          </Stack>
        </Container>
      </Stack>
      {renderDialog()}
    </Fragment>
  );
}

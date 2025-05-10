import * as React from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as OPEN_AI from "../constants/openAI";
import { useChatStore } from "../store";

export default function useAuthDialog() {
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState("");

  const { setChatConfig } = useChatStore();
  const isErrorKey = !/^sk-or-\S+$/.test(key);

  const openDialog = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
    setKey("");
  };
  const handleProxyClick = () => {
    setChatConfig({
      baseUrl: OPEN_AI.PROXY_API_ADDRESS,
      authKey: OPEN_AI.PROXY_API_KEY,
    });
    closeDialog();
  };
  const handleKeyClick = () => {
    if (!isErrorKey) {
      setChatConfig({
        baseUrl: OPEN_AI.OpenAI_API_ADDRESS,
        authKey: key,
      });
      closeDialog();
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const renderDialog = () => {
    return (
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>设置 OpenAI 访问秘钥</DialogTitle>
        <DialogContent>
          <DialogContentText>
            在线聊天需要 OpenAI 的访问秘钥才可以开展对话。
            <br />
            <br />
            1. 点击 "使用代理" 快速开始。
            <br />
            2. 在下方填入 OpenRouter 秘钥，点击使用。
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            type="text"
            margin="dense"
            variant="standard"
            placeholder="API Key..."
            value={key}
            onChange={handleInputChange}
          />
          {key.trim() !== "" && isErrorKey && (
            <Typography sx={{ color: "red", fontSize: "12px" }}>无效的API Key.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleProxyClick}>
            使用代理
          </Button>
          <Button variant="contained" disabled={isErrorKey} onClick={handleKeyClick}>
            使用秘钥
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return { renderDialog, openDialog };
}

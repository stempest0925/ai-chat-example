import { Box, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import Markdown from "react-markdown";
import "github-markdown-css/github-markdown.css";
import { grey } from "@mui/material/colors";

import chatgptAvatar from "../assets/images/chatgpt-avatar.jpg";
import userAvatar from "../assets/images/user-avatar.jpg";

const Item = styled(Paper)(({ theme }) => ({
  boxShadow: "none",
  padding: theme.spacing(1),
}));

interface IProps {
  role: ChatRoleType;
  content: string;
}
// 根据不同的角色渲染组件
export default function ChatMessageItem({ role, content }: IProps) {
  if (role === "user") {
    return (
      <Item>
        <Stack direction="column" spacing={1} sx={{ alignItems: "flex-end" }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end" }}>
            <Typography component="h4" sx={{ color: "black", fontWeight: 700 }}>
              You
            </Typography>
            <Box sx={{ width: 32, height: 32, ml: 1, overflow: "hidden", borderRadius: "50%" }}>
              <img src={userAvatar} alt="avatar" style={{ width: "100%", height: "100%" }} />
            </Box>
          </Stack>

          <Box sx={{ background: "#eff6ff", px: 2, py: 1.5, borderRadius: "12px" }}>
            <Typography sx={{ wordBreak: "break-word" }}>{content}</Typography>
          </Box>
        </Stack>
      </Item>
    );
  }
  if (role === "assistant") {
    return (
      <Item>
        <Stack direction="column" spacing={1} sx={{ alignItems: "flex-start" }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Box sx={{ width: 32, height: 32, mr: 1, overflow: "hidden", borderRadius: "50%" }}>
              <img src={chatgptAvatar} alt="avatar" style={{ width: "100%", height: "100%" }} />
            </Box>
            <Typography component="h4" sx={{ color: "black  ", fontWeight: 700 }}>
              ChatGPT
            </Typography>
          </Stack>
          <Box className="markdown-body" sx={{ py: 0.5, pl: 5, wordBreak: "break-word" }}>
            <Markdown>{content}</Markdown>
          </Box>
        </Stack>
      </Item>
    );
  }
  if (role === "system") {
    return (
      <Item>
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
          <Typography
            component="h6"
            sx={{ color: "white", fontSize: "13px", background: grey[300], px: "9px", py: "3px", borderRadius: "3px" }}
          >
            哈喽，我是小A，你的人工智能助手，有什么可以帮到你？
          </Typography>
        </Stack>
      </Item>
    );
  }
  return null;
}

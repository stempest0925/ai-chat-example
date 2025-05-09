import { Box, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import gptImage from "../assets/images/chatgpt-avatar.jpg";
import userImage from "../assets/images/user-avatar.jpg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "none",
  padding: theme.spacing(1),
}));

interface IProps {
  role: string;
  content: string;
}

export default function ChatMessageItem({ role, content }: IProps) {
  if (role === "user") {
    return (
      <Item>
        <Stack direction="column" spacing={1} sx={{ alignItems: "flex-end" }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end" }}>
            <Typography component="h4" sx={{ color: "#000000", fontWeight: 700 }}>
              You
            </Typography>
            <Box sx={{ width: 32, height: 32, ml: 1, overflow: "hidden", borderRadius: "50%" }}>
              <img src={userImage} alt="avatar" style={{ width: "100%", height: "100%" }} />
            </Box>
          </Stack>

          <Box sx={{ background: "#eff6ff", px: 2, py: 1.5, borderRadius: "12px" }}>
            <Typography>{content}</Typography>
          </Box>
        </Stack>
      </Item>
    );
  }

  return (
    <Item>
      <Stack direction="column" spacing={1} sx={{ alignItems: "flex-start" }}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Box sx={{ width: 32, height: 32, mr: 1, overflow: "hidden", borderRadius: "50%" }}>
            <img src={gptImage} alt="avatar" style={{ width: "100%", height: "100%" }} />
          </Box>
          <Typography component="h4" sx={{ color: "#000000", fontWeight: 700 }}>
            ChatGPT
          </Typography>
        </Stack>
        <Box sx={{ py: 0.5, pl: 5 }}>
          <Typography>{content}</Typography>
        </Box>
      </Stack>
    </Item>
  );
}

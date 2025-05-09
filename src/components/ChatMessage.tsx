import { Box, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import gptImage from "../assets/images/chatgpt-avatar.jpg";
// import userImage from "../assets/images/user-avatar.jpg";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  boxShadow: "none",
  padding: theme.spacing(1),
}));

export default function ChatMessage() {
  return (
    <Stack>
      <Stack sx={{ alignItems: "center", py: 1 }}>
        <Typography component="h1" sx={{ fontSize: 26, fontWeight: 900 }}>
          AI Chat
        </Typography>
      </Stack>
      <Stack spacing={4}>
        <Item>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box sx={{ width: 32, height: 32, overflow: "hidden", borderRadius: "50%" }}>
              <img src={gptImage} alt="avatar" loading="lazy" style={{ width: "100%", height: "100%" }} />
            </Box>
            <Typography component="h4" sx={{ color: "#000000", fontWeight: 700 }}>
              ChatGPT
            </Typography>
          </Stack>
          <Box sx={{ py: 1 }}>
            <Typography>
              2. 优势 分层架构：埋点逻辑与业务组件完全解耦，符合“关注点分离”原则。
              非侵入式：不修改原组件代码，通过包裹组件实现功能增强。 统一管理：所有埋点逻辑集中在 HOC
              中，便于维护和复用。 3. 劣势 组件层级嵌套：多层 HOC 可能导致 React 组件树臃肿，增加调试难度。
              生命周期覆盖限制：无法直接监控函数组件的细粒度生命周期（如 useEffect 阶段）。 Props 冲突风险：若 HOC 传递
              Props 与组件原有 Props 同名，可能导致意外行为。
            </Typography>
          </Box>
        </Item>
      </Stack>
    </Stack>
  );
}

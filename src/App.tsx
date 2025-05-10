import React from "react";
import { CssBaseline, Box } from "@mui/material";

import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
        <ChatMessage />
        <ChatInput />
      </Box>
    </React.Fragment>
  );
}

export default App;

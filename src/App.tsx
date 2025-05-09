import React from "react";
import { CssBaseline, Container } from "@mui/material";

import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="md" sx={{ minHeight: "100%", p: 0 }}>
        <ChatMessage />
        <ChatInput />
      </Container>
    </React.Fragment>
  );
}

export default App;

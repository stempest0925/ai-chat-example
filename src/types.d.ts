type ChatMessageType = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatResponseChunkType = {
  choices: {
    delta: { role: "assistant"; content: string };
  }[];
  usage?: {
    total_tokens: number;
  };
};

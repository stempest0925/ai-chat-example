type ChatRoleType = "user" | "assistant" | "system";

interface IChatMessage {
  role: ChatRoleType;
  content: string;
}

interface IChatResponseChunk {
  choices: {
    delta: { role: "assistant"; content: string };
  }[];
  usage?: {
    total_tokens: number;
  };
}

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type MessagesType = ChatMessageType & { id: string };

interface ChatState {
  nowTokens: number;
  messages: MessagesType[];
  addMessage: (message: MessagesType) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set) => ({
    nowTokens: 0,
    messages: [{ id: "11", role: "assistant", content: "zheshineirong" }],
    addMessage: (message) =>
      set((state) => {
        state.messages.push(message);
      }),
  }))
);

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IMessages extends IChatMessage {
  id: string;
}

interface ChatState {
  nowTokens: number; // tokens
  messages: IMessages[]; // 历史信息
  streamingMsg: IMessages | null; // 推送信息

  addMessage: (message: IMessages) => void;
  setStreamingMsg: (content: string) => void;
  completeStreamingMsg: () => void;
  setTokens: (tokens: number) => void;
  getContextMessages: () => IMessages[];
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    nowTokens: 0,
    messages: [],
    streamingMsg: null,
    // 添加信息
    addMessage: (message) => {
      set((state) => {
        state.messages.push(message);
        state.streamingMsg = {
          id: Date.now().toString(),
          role: "assistant",
          content: "",
        };
      });
    },
    // 设置流式内容
    setStreamingMsg: (content) => {
      set((state) => {
        if (state.streamingMsg) {
          state.streamingMsg.content += content;
        }
      });
    },
    // 完成流式信息
    completeStreamingMsg: () => {
      set((state) => {
        if (state.streamingMsg) {
          state.messages.push(state.streamingMsg);
          state.streamingMsg = null;
        }
      });
    },
    // 设置 Tokens
    setTokens: (tokens) => {
      set((state) => (state.nowTokens = tokens));
    },
    // 获取最新的上下文信息
    getContextMessages: () => {
      const { nowTokens, messages } = get();
      const lens = messages.length;

      if (nowTokens < 16000 && lens > 1) {
        const arr = messages.slice(1, lens);
        return arr;
      } else {
        return messages;
      }
    },
  }))
);

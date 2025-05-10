import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IMessages extends IChatMessage {
  id: string;
}

interface ChatState {
  currentTokens: number; // tokens
  historyMessages: IMessages[]; // 历史信息
  pendingMessage: IMessages | null; // 推送信息
  isPending: boolean;

  addUserMessage: (message: IMessages) => void;
  preparePendingMessage: () => void;
  setStreamingContent: (content: string) => void;
  setPendingError: (content: string) => void;
  completePendingMessage: () => void;
  // setTokens: (tokens: number) => void;
  // getContextMessages: (maxTokens: number) => IMessages[];
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    currentTokens: 0,
    historyMessages: [],
    pendingMessage: null,
    isPending: false,
    // 添加用户信息
    addUserMessage: (message) => {
      set((state) => {
        state.historyMessages.push(message);
      });
    },
    // 准备流式信息
    preparePendingMessage: () => {
      set((state) => {
        state.pendingMessage = {
          id: "streaming-" + Date.now(),
          role: "assistant",
          content: "",
        };
        state.isPending = true;
      });
    },
    // 设置流式内容
    setStreamingContent: (content) => {
      set((state) => {
        if (state.pendingMessage) {
          state.pendingMessage.content += content;
        }
      });
    },
    // 设置流式错误 1. 所在的地区不受支持 2. 与 OpenAI 服务器交互出现问题 3.当前对话已超出 ChatGPT 的最大长度限制
    setPendingError: (content) => {
      set((state) => {
        state.historyMessages.push(
          state.pendingMessage
            ? { ...state.pendingMessage, content }
            : {
                id: "streaming-" + Date.now(),
                role: "assistant",
                content,
              }
        );
        state.pendingMessage = null;
        state.isPending = false;
      });
    },
    // 完成流式信息
    completePendingMessage: () => {
      set((state) => {
        if (state.pendingMessage) {
          state.historyMessages.push(state.pendingMessage);
          state.pendingMessage = null;
          state.isPending = false;
        }
      });
    },

    // 设置 Tokens
    // setTokens: (tokens) => {
    //   set((state) => (state.nowTokens = tokens));
    // },
    // 获取最新的上下文信息
    // getContextMessages: () => {
    //   const { nowTokens, messages } = get();
    //   const lens = messages.length;

    //   if (nowTokens < 16000 && lens > 1) {
    //     const arr = messages.slice(1, lens);
    //     return arr;
    //   } else {
    //     return messages;
    //   }
    // },
  }))
);

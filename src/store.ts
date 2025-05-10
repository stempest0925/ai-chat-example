import type { WritableDraft } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface IMessages extends IChatMessage {
  id: string;
}
type ChatConfig = {
  baseUrl: string;
  authKey: string;
};

interface ChatState {
  config: ChatConfig;
  currentTokens: number; // tokens
  historyMessages: IMessages[]; // 历史信息
  pendingMessage: IMessages | null; // 推送信息
  isPending: boolean;
  scrollRef: HTMLElement | null;

  getHistoryMessages: () => IMessages[];
  getChatConfig: () => ChatConfig;
  setChatConfig: (config: ChatConfig) => void;
  addUserMessage: (content: string) => void;
  preparePendingMessage: () => void;
  setStreamingContent: (content: string) => void;
  setPendingError: (error: Error) => void;
  completePendingMessage: (content: string) => void;
  setScrollRef: (ref: HTMLElement | null) => void;
}

export const useChatStore = create<ChatState>()(
  immer((set, get) => ({
    config: {
      baseUrl: "",
      authKey: "",
    },
    currentTokens: 0,
    historyMessages: [
      { id: "system-01", role: "system", content: "你叫小A，是一个乐于助人的人工智能助手，能够解决诸多问题。" },
    ],
    pendingMessage: null,
    isPending: false,
    scrollRef: null,
    // 确保获取最新historyMessages
    getHistoryMessages: () => {
      const { historyMessages } = get();
      return historyMessages;
    },
    // 获取配置
    getChatConfig: () => {
      const { config } = get();
      return config;
    },
    // 设置配置
    setChatConfig: (config) => {
      set((state) => {
        state.config = config;
      });
    },
    // 添加用户信息
    addUserMessage: (content) => {
      set((state) => {
        state.historyMessages.push({
          id: "user-" + Date.now(),
          role: "user",
          content,
        });
      });
    },
    // 准备流式信息
    preparePendingMessage: () => {
      set((state) => {
        state.pendingMessage = {
          id: "assistant-" + Date.now(),
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
    setPendingError: (error) => {
      const errMsg = (error as Error).message || " OpenAI 服务器交互出现问题";
      set((state) => {
        state.historyMessages.push(
          state.pendingMessage
            ? { ...state.pendingMessage, content: errMsg }
            : {
                id: "streaming-" + Date.now(),
                role: "assistant",
                content: errMsg,
              }
        );
        state.pendingMessage = null;
        state.isPending = false;
      });
    },
    // 完成流式信息
    completePendingMessage: (content) => {
      set((state) => {
        if (state.pendingMessage) {
          state.pendingMessage.content = content;
          state.historyMessages.push(state.pendingMessage);
          state.pendingMessage = null;
          state.isPending = false;
        }
      });
    },
    // 设置滚动引用
    setScrollRef: (ref) => {
      set((state) => {
        state.scrollRef = ref as unknown as WritableDraft<HTMLElement> | null;
      });
    },
  }))
);

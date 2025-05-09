import { useState, useEffect, useRef } from "react";
import * as OPEN_AI from "../constants/openAI";

class GPTSimpleError extends Error {
  type: "OtherError" | "UnSupportedError";

  constructor(message: string, type: "OtherError" | "UnSupportedError") {
    super(message);
    this.type = type;
  }
}

export default function useStreamingChat() {
  // 持续输出buffer
  const bufferRef = useRef<string>("");
  // 请求状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 可取消
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = async (messages: ChatMessageType[]) => {
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(OPEN_AI.API_ADDRESS, {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPEN_AI.API_KEY}` },
        body: JSON.stringify({ model: OPEN_AI.MODEL, messages, stream: true }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new GPTSimpleError("No response.", "OtherError");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value).trim();
        // 忽略空行和中间提示
        if (!chunkStr || chunkStr.indexOf("OPENROUTER PROCESSING") > -1) continue;

        console.log(chunkStr);
        const parseChunkStr = chunkStr
          .split("data:")
          .map((line) => line.trim())
          .filter((line) => line);

        let chunkResult = "";
        for (const str of parseChunkStr) {
          if (str.indexOf("[DONE]") > -1) continue; // 结束标记有时候会与数据流一并推送，如果在空行部分break，则会缺失内容

          const data: ChatResponseChunkType = JSON.parse(str);
          chunkResult += data.choices[0].delta.content;
        }

        bufferRef.current = bufferRef.current + chunkResult;
      }
    } catch (error) {
      console.log("err", error);
      //   setError((error as Error).message | "与OpenAI服务建立发生错误.");
      //   这里可以直接渲染state的map，一个错误的对话返回
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSendMessage = () => {
    abortControllerRef.current?.abort();
  };

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return { isLoading, sendMessage, cancelSendMessage, bufferRef };
}

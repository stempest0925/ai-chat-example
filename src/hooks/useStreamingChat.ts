import { useState, useEffect, useRef } from "react";
import * as OPEN_AI from "../constants/openAI";

interface IProps {
  onUpdate: (content: string) => void;
  onComplete: () => void;
  onTokens: (tokens: number) => void;
}

export default function useStreamingChat({ onUpdate, onComplete, onTokens }: IProps) {
  // 请求状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 可取消
  const abortControllerRef = useRef<AbortController | null>(null);

  // 发送方法
  const sendMessage = async (messages: IChatMessage[]) => {
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(OPEN_AI.API_ADDRESS, {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPEN_AI.API_KEY}` },
        body: JSON.stringify({ model: OPEN_AI.MODEL, messages, stream: true }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("No response.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value).trim();
        // 忽略空行和中间提示
        if (!chunkStr || chunkStr.indexOf("OPENROUTER PROCESSING") > -1) continue;

        const parseChunkStr = chunkStr
          .split("data:")
          .map((line) => line.trim())
          .filter((line) => line);

        let chunkResult = "";
        for (const str of parseChunkStr) {
          if (str.indexOf("[DONE]") > -1) continue; // 结束标记有时候会与数据流一并推送，如果在空行部分break，则会缺失内容

          const data: IChatResponseChunk = JSON.parse(str);
          // if (data.usage && data.usage.total_tokens) {
          //   onTokens(data.usage.total_tokens);
          // }
          chunkResult += data.choices[0].delta.content;
        }

        onUpdate(chunkResult);
      }

      onComplete();
    } catch (error) {
      console.log(error, "与OpenAI服务建立发生错误.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSendMessage = () => {
    // abortControllerRef.current?.abort();
    // setIsLoading(false);
  };

  useEffect(() => {
    return () => {
      // abortControllerRef.current?.abort();
      // setIsLoading(false);
    };
  }, []);

  return { isLoading, sendMessage, cancelSendMessage };
}

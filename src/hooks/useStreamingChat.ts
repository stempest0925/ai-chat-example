import { useState, useEffect, useRef } from "react";
import * as OPEN_AI from "../constants/openAI";
import { throttle } from "lodash";

interface IProps {
  baseUrl: string;
  authKey: string;
  onUpdate?: (content: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
  scrollContainer?: HTMLElement | null;
}

export default function useStreamChat({ baseUrl, authKey, onUpdate, onComplete, onError, scrollContainer }: IProps) {
  // 请求状态
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 可取消
  const abortControllerRef = useRef<AbortController | null>(null);
  // 节流滚动
  const throttleScrollRef = useRef(
    throttle((container: HTMLElement) => {
      container.scrollTo({ top: container.scrollHeight });
    }, 100)
  );

  // 发送方法
  const sendMessage = async (messages: IChatMessage[]) => {
    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(baseUrl, {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authKey}` },
        body: JSON.stringify({ model: OPEN_AI.MODEL, messages, stream: true }),
        signal: abortControllerRef.current.signal,
      });
      if (!response.ok) throw new Error("Call api error.");
      if (!response.body) throw new Error("No response.");

      const reader = response.body.getReader();

      const fullContent = await processOpenAIStream(reader);

      onComplete(fullContent);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理OpenAI流式数据（已改为官方处理模版）
  const processOpenAIStream = async (reader: ReadableStreamDefaultReader) => {
    if (!reader) onError(new Error("Response body is not readable."));

    const decoder = new TextDecoder();
    let fullContent = "";
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const lineEnd = buffer.indexOf("\n");
          if (lineEnd === -1) break;

          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed: IChatResponseChunk = JSON.parse(data);
              const content = parsed.choices[0].delta.content;

              if (content) {
                fullContent += content;
                if (onUpdate) onUpdate(content);
                if (scrollContainer) {
                  throttleScrollRef.current(scrollContainer);
                }
              }
            } catch (e) {
              onError(e as Error);
            }
          }
        }
      }
      return fullContent;
    } finally {
      reader.cancel();
    }
  };

  // 取消发送
  const cancelSendMessage = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  useEffect(() => {
    return () => {
      cancelSendMessage();
    };
  }, []);

  return { isLoading, sendMessage, cancelSendMessage };
}

import { useState, useEffect, useRef } from "react";
import * as OPEN_AI from "../constants/openAI";
import { processOpenAIStream } from "../utils/streamHelper";

interface IProps {
  onUpdate: (content: string) => void;
  onComplete: (fullContent: string) => void;
}

export default function useStreamChat({ onUpdate, onComplete }: IProps) {
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
      await processOpenAIStream({
        reader,
        onUpdate,
        onComplete,
        onError: (e) => {
          console.log(e);
        },
      });
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

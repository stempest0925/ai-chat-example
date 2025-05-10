// OpenAI Router 官方推荐流式处理方案
type ProcessOpenAIStreamProps = {
  reader: ReadableStreamDefaultReader;
  onUpdate?: (content: string) => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
};
export async function processOpenAIStream({ reader, onUpdate, onComplete, onError }: ProcessOpenAIStreamProps) {
  if (!reader) {
    throw new Error("Response body is not readable.");
  }

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
            const parsed = JSON.parse(data);
            const content = parsed.choices[0].delta.content;
            if (content) {
              fullContent += content;
              if (onUpdate) onUpdate(content);
            }
          } catch (e) {
            onError(e as Error);
          }
        }
      }
    }
    console.log(fullContent, onComplete)
    onComplete(fullContent);
  } finally {
    reader.cancel();
  }
}

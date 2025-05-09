import { API_ADDRESS, API_KEY, MODEL } from "../constants/openAI";

type GPTMessageType = {
  role: "system" | "user";
  content: string;
};

export async function fetchAI(messages: GPTMessageType[]): GPTMessageType {
  try {
    const response = await fetch(API_ADDRESS, {
      method: "post",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({ model: MODEL, messages }),
    });
    const result = await response.json();
    console.log(result);

    return { role: "system", content: "temp" };
    if (result.error) {
      throw new Error(result.error.code == 403 ? "您所在的地区不受支持." : "与OpenAI服务建立发生错误.");
    }
  } catch (error) {
    // API错误埋点，可记录
    return { role: "system", content: (error as Error).message };
  }
}

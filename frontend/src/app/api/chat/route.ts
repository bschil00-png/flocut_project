import { openai } from "@/lib/openai";

function getCharacterPrompt(mode: string) {
  switch (mode) {
    case "friendly":
      return "너는 매우 친절하고 부드러운 말투를 쓰는 상담사다.";
    case "dev_helper":
      return "너는 비관적인 스타일의 20대 개발자다.";
    case "cute":
      return "너는 귀엽고 말끝을 '~잉', '~오' 등으로 말한다.";
    default:
      return "너는 일반적인 AI 조수이다.";
  }
}

export async function POST(req: Request) {
  const { messages, summary, characterMode } = await req.json();

  const prompt = getCharacterPrompt(characterMode);

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: `
${prompt}

대화 요약:
${summary ?? "요약 없음"}
        `,
      },
      ...messages.slice(-10),
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const event of response) {
        if (event.type === "response.output_text.delta") {
          controller.enqueue(encoder.encode(event.delta));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

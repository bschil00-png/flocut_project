// 경로: /src/app/api/chat/route_summarize/route.ts


import {openai} from "@/lib/openai";

export async function POST(req: Request) {
  const {messages} = await req.json();

  const text = messages
    .map((m: any) => `${m.role}: ${m.content}`)
    .join("\n");

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
              대화를 중립적인 문장으로 2~3문장 요약해줘.
              캐릭터 말투, 감탄사, 귀여운 표현 등은 완전히 제거하고
              사실적인 내용만 유지해.
            `,
      }
      ,
      {role: "user", content: text},
    ],
  });

  return new Response(res.choices[0].message.content);
}

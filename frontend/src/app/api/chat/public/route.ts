import {openai} from "@/lib/openai";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions";


// 프론트엔드에 노출 X
const SYSTEM_PROMPT = `
    너는 문서·음성 기반 AI 요약 플랫폼 **FLOCUT**의 공식 퍼블릭 챗봇이다.
    
    [FLOCUT 서비스 개요]
    - FLOCUT은 문서와 음성을 AI로 요약·정리하는 플랫폼이다.
    - 주요 기능:
      · 문서 업로드 → AI 요약 → 노트 저장
      · 음성 녹음/업로드 → STT → AI 요약
      · 워크스페이스에서 노트 관리 및 검색
    - 퍼블릭 환경: 서비스 소개 및 간단한 체험
    - 워크스페이스: 본격적인 문서·음성 관리 및 저장
    - 현재 FLOCUT은 무료로 제공되고 있다.
    
    [역할]
    1. FLOCUT의 기능, 사용 방법, 활용 흐름, 제한 사항을
       사용자 질문 맥락에 맞게 명확하고 친절하게 설명한다.
    
    2. 문서 요약, 음성 요약, 워크스페이스 개념에 대해
       “어떻게 사용하는지”를 중심으로 안내한다.
       퍼블릭 환경에서는 실제 파일 업로드, 개인 문서 처리,
       저장 및 관리 기능을 수행하지 않는다.
    
    3. 사용자가 **300자 이내의 텍스트를 직접 입력한 경우**,
       간단한 요약이나 문장 정리와 같은
       “맛보기 수준의 시연”을 제공할 수 있다.
       이 결과는 저장되지 않으며 일회성 응답임을 분명히 한다.
    
    4. 입력된 텍스트가 과도하게 길 경우,
       전체 요약을 시도하지 말고 핵심적인 일부만 예시로 보여주며
       전체 문서 관리는 워크스페이스에서 가능하다고 안내한다.
    
    5. 개인 데이터, 저장, 관리, 히스토리, 검색과 관련된 요청이 들어오면
       해당 기능은 로그인 후 워크스페이스에서 가능하다고 설명한다.
       차단하거나 거부하는 어조가 아니라,
       다음 단계를 자연스럽게 제안하는 방식으로 응답한다.
    
    6. 너는 사용자를 장기적으로 기억하지 않는다.
       이전 대화를 기억하고 있다는 인상을 주는 표현을 사용하지 않는다.
    
    [톤 & 태도]
    - 전문적이되 부담스럽지 않은 말투를 사용한다.
    - 친절하지만 과장하거나 과도한 능력을 주장하지 않는다.
    - 답변 말미에는 필요할 경우
      워크스페이스 이용을 부드럽게 제안할 수 있다.
    
    [워크스페이스 유도 예시]
    - “더 긴 문서는 워크스페이스에서 저장하며 관리할 수 있어요.”
    - “이 결과를 보관하려면 워크스페이스에서 노트로 남기실 수 있어요.”
    - “로그인하시면 모든 요약을 한곳에서 관리할 수 있어요.”
    
    [응답 제약 및 안전 지침]
    - FLOCUT과 직접 관련 없는 질문(맛집 추천, 일반 코딩 요청 등)은
      간결하게 답변하거나 정중히 범위를 벗어났음을 알린 뒤
      FLOCUT의 기능 안내로 자연스럽게 돌아온다.
    - 제공되지 않는 기능이나 확정되지 않은 업데이트를
      있는 것처럼 말하지 않는다.
    - 이미지 생성, 실시간 통역, 개인 맞춤 학습 등
      FLOCUT에 없는 기능을 언급하지 않는다.
    - 정치, 종교, 편향적이거나 민감한 주제에 대해서는
      중립을 유지하며 답변을 피한다.
    
    [절대 금지 사항]
    - 로그인 없이 개인 문서, 파일, 노트, 요약 결과를
      저장하거나 관리한다고 말하지 않는다.
    - 긴 문서나 파일 요약을 퍼블릭 환경에서 제공한다고 약속하지 않는다.
    - 사용자의 파일이나 문서를
      “분석했다”, “확인했다”, “검토했다”고 표현하지 않는다.
    - 대화 내용이 영구적으로 저장되거나
      기억되는 것처럼 오해를 불러일으키는 표현을 사용하지 않는다.
    - 사용자의 이전 발언, 성향, 이력 등을
      알고 있다는 뉘앙스를 주지 않는다.
    
    [목표]
    너의 목표는 사용자가 FLOCUT의 가치와 사용 흐름을 이해하고,
    “이건 워크스페이스에서 제대로 써보고 싶다”는 생각이 들도록
    안내하고 체험을 제공하는 것이다.

`;


//  요약 요청일 때
const SUMMARY_PROMPT = (lineCount?: number) => `
사용자의 요청은 요약이다.
다음 규칙을 반드시 따른다:

- 원문 내용을 의미 단위로 압축한다
- 설명하지 말고 요약만 출력한다
- 불필요한 안내 문구를 포함하지 않는다
- 서비스, 워크스페이스, 기능 설명을 하지 않는다
${lineCount ? `- 반드시 ${lineCount}개의 문장으로 요약한다` : ""}
${lineCount ? `- 각 문장은 줄바꿈(엔터)으로 구분한다` : ""}
- 문장 앞에 번호, 기호, 불릿을 붙이지 않는다
`;

type SimpleChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export async function POST(req: Request): Promise<Response> {
    try {
        // 1. 요청 파싱
        const body = await req.json();

        if (!Array.isArray(body.messages)) {
            return Response.json(
                { content: "요청 형식이 올바르지 않습니다." },
                { status: 400 }
            );
        }

        const messages: SimpleChatMessage[] = body.messages;

        /**
         * 2. 최근 메시지 정리
         */
        const safeMessages: ChatCompletionMessageParam[] = messages
            .filter(
                (m): m is SimpleChatMessage =>
                    m &&
                    typeof m.content === "string" &&
                    (m.role === "user" || m.role === "assistant")
            )
            .slice(-5)
            .map(
                (m): ChatCompletionMessageParam => ({
                    role: m.role,
                    content: m.content,
                })
            );

        /**
         * 3. 마지막 사용자 메시지 추출
         */
        const lastUserMessage = [...safeMessages]
            .reverse()
            .find((m): m is ChatCompletionMessageParam & { role: "user" } =>
                m.role === "user"
            );

        /**
         * 4. 요약 요청 판별
         */
        const isSummaryRequest =
            !!lastUserMessage &&
            typeof lastUserMessage.content === "string" &&
            /요약|정리|\d+줄/.test(lastUserMessage.content);

        /**
         * 5. 줄 수 파싱
         */
        const lineMatch =
            typeof lastUserMessage?.content === "string"
                ? lastUserMessage.content.match(/(\d+)줄/)
                : null;

        const lineCount: number | undefined = lineMatch
            ? Number(lineMatch[1])
            : undefined;

        /**
         * 6. OpenAI에 전달할 메시지 구성
         */
        const messagesForAI: ChatCompletionMessageParam[] = [
            { role: "system", content: SYSTEM_PROMPT } as ChatCompletionMessageParam,
            ...(isSummaryRequest
                ? [{ role: "system", content: SUMMARY_PROMPT(lineCount) } as ChatCompletionMessageParam]
                : []),
            ...safeMessages,
        ];

        /**
         * 7. OpenAI 호출
         */
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messagesForAI,
            temperature: 0.3,
        });

        /**
         * 8. 응답 방어
         */
        const content =
            response.choices?.[0]?.message?.content ??
            "잠시 후 다시 시도해 주세요.";

        return Response.json({ content });
    } catch (error) {
        console.error("[PublicChatError]", error);

        return Response.json(
            { content: "현재 요청을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요." },
            { status: 500 }
        );
    }
}
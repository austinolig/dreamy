import { openrouter } from "@openrouter/ai-sdk-provider";
import { streamText, UIMessage, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter("openai/gpt-oss-20b:free"),
    messages: convertToModelMessages(messages),
    // async onFinish({ text }) {
    //   // Update the analysis with the complete text and mark as not streaming
    //   await prisma.dreamAnalysis.update({
    //     where: { id: analysis.id },
    //     data: {
    //       content: text,
    //       isStreaming: false,
    //     },
    //   });
    // },
  });

  return result.toUIMessageStreamResponse();
}

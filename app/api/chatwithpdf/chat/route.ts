import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { createClient } from "@/utils/supabase/server";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw Error("OpenAI Api Key not set");
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
});

export async function POST(req: Request) {
  const { messages, pdfText, analysisData, topic } = await req.json();
  const supabase = await createClient();
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToCoreMessages(messages),
    system: `You are career assistant specialized in resume analysis and providing detailed insights. You are created by Build Fast with AI.
    Follow the rules:
    - Keep the answer concise and to the point.
    - Provide accurate and relevant information.

    Give the insights based on this data:\n
    PDF Text: "${pdfText}"
    Analysis Data: "${analysisData}"
    Topic: "${topic}"`,
  });

  return result.toDataStreamResponse();
}

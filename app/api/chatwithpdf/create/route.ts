import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import { nanoid } from "nanoid";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables.");
}

const ResumeScoresSchema = z.object({
  experience_score: z.number().min(1).max(10),
  experience_feedback: z.string(),
  education_score: z.number().min(1).max(10),
  education_feedback: z.string(),
  skills_score: z.number().min(1).max(10),
  skills_feedback: z.string(),
  projects_score: z.number().min(1).max(10),
  projects_feedback: z.string(),
  overall_score: z.number().min(1).max(10),
  overall_feedback: z.string(),
});

const NodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  data: z.object({
    label: z.string(),
  }),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  style: z.object({
    backgroundColor: z.string(),
    color: z.string(),
  }),
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
  animated: z.boolean().optional(),
});

const initialNodesSchema = z.array(NodeSchema);
const initialEdgesSchema = z.array(EdgeSchema);

const finalSchema = z.object({
  nodes: initialNodesSchema,
  edges: initialEdgesSchema,
  scores: ResumeScoresSchema,
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  task_improvements: z.array(
    z.object({
      original: z.string(),
      improved: z.string(),
    })
  ),
});

type FinalSchema = z.infer<typeof finalSchema>;

export async function POST(req: NextRequest) {
  const supabase = createClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Failed to initialize Supabase client" },
      { status: 500 }
    );
  }

  const {
    data: { user },
    error: sessionError,
  } = await (await supabase).auth.getUser();

  if (sessionError || !user) {
    console.error("Error fetching user session:", sessionError);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }

  try {
    const { pdfText, topic }: { pdfText: string; topic: string } = await req.json();

    if (!pdfText || !topic) {
      return NextResponse.json(
        { error: "Missing required fields: pdfText or topic" },
        { status: 400 }
      );
    }

    const id = nanoid();
    const prompt = `Analyze the following resume text and input:

    Resume: "${pdfText}"

    Input: "${topic}"

    Create a comprehensive analysis including:
    1. A detailed mindmap of the resume with a clear title,
    2. Scores and feedback for experience, education, skills, projects, and overall,
    3. Strengths and weaknesses,
    4. Recommendations for improvement,
    5. Task improvements for better results (4-10 examples).

    Ensure the mindmap has a title and a root node. The title should be relevant to the job description.

    Provide honest evaluations and suggestions based on the resume content and job description.`;

    const { object: analysisData } = await generateObject<FinalSchema>({
      model: groq("llama-3.1-70b-versatile"),
      system: `You are an AI assistant specialized in resume analysis and providing detailed insights. 
      Generate the mindmap and analysis in this JSON format: ${JSON.stringify(finalSchema.shape)}`,
      prompt,
      schema: finalSchema,
    });

    const { data: chat, error: chatError } = await (await supabase)
      .from("resume_analysis")
      .insert({
        id,
        user_id: user.id,
        topic,
        pdf_text: pdfText,
        analysis_data: analysisData,
        created_at: new Date().toISOString(),
      })
      .select();

    if (chatError) {
      console.error("Error inserting data into resume_analysis:", chatError);
      return NextResponse.json(
        { error: "Failed to save resume analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({ chat, success: true });
  } catch (error) {
    console.error("Error analyzing resume:", error);

    if (error instanceof z.ZodError) {
      console.error("Validation error:", JSON.stringify(error.issues, null, 2));
      return NextResponse.json(
        { error: "Invalid data format", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

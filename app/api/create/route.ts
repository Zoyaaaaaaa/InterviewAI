// import { createOpenAI } from "@ai-sdk/openai";
// import { generateObject } from "ai";
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
// import { createClient } from "@/utils/supabase/server";

// const groq = createOpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Define schema for validation
// const ResumeScoresSchema = z.object({
//   experience_score: z.number().min(1).max(10),
//   experience_feedback: z.string(),
//   education_score: z.number().min(1).max(10),
//   education_feedback: z.string(),
//   skills_score: z.number().min(1).max(10),
//   skills_feedback: z.string(),
//   projects_score: z.number().min(1).max(10),
//   projects_feedback: z.string(),
//   overall_score: z.number().min(1).max(10),
//   overall_feedback: z.string(),
// });

// const NodeSchema = z.object({
//   id: z.string(),
//   type: z.string().optional(),
//   data: z.object({
//     label: z.string(),
//   }),
//   position: z.object({
//     x: z.number(),
//     y: z.number(),
//   }),
//   style: z.object({
//     backgroundColor: z.string(),
//     color: z.string(),
//   }),
// });

// const EdgeSchema = z.object({
//   id: z.string(),
//   source: z.string(),
//   target: z.string(),
//   label: z.string().optional(),
//   animated: z.boolean().optional(),
// });

// const finalSchema = z.object({
//   nodes: z.array(NodeSchema),
//   edges: z.array(EdgeSchema),
//   scores: ResumeScoresSchema,
//   strengths: z.array(z.string()),
//   weaknesses: z.array(z.string()),
//   recommendations: z.array(z.string()),
//   task_improvements: z.array(
//     z.object({
//       original: z.string(),
//       improved: z.string(),
//     })
//   ),
// });

// export async function POST(req: NextRequest) {
//   const supabase = await createClient();
//   try {
//     const { pdfText, topic } = await req.json();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();
//     if (authError||!user) {
//       throw new Error("User authentication failed.");
//     }

//     const prompt = `Analyze the following resume text and input:
//       Resume: "${pdfText}"
//       Input: "${topic}"
      
//       Create a comprehensive analysis including:
//       1. A detailed mindmap of the resume with a clear title,
//       2. Scores and feedback for experience, education, skills, projects, and overall,
//       3. Strengths and weaknesses,
//       4. Recommendations for improvement,
//       5. Task improvements for better results (4-10 examples).
      
//       Ensure the mindmap has a title and root node relevant to the job description.
      
//       Provide honest evaluations and actionable suggestions.`;

//     const { object: analysisData } = await generateObject({
//       model: groq("llama-3.1-70b-versatile"),
//       system: `You are an AI assistant specialized in resume analysis and providing detailed insights.`,
//       prompt,
//       schema: finalSchema,
//     });

//     const { data, error } = await supabase.from("resume_analysis").insert({
//       user_id: user.id,
//       pdf_text: pdfText,
//       topic,
//       scores: analysisData.scores,
//       strengths: analysisData.strengths,
//       weaknesses: analysisData.weaknesses,
//       recommendations: analysisData.recommendations,
//       task_improvements: analysisData.task_improvements,
//       nodes: analysisData.nodes,
//       edges: analysisData.edges,
//     });

//     if (error) {
//       throw new Error(`Error saving data to Supabase: ${error.message}`);
//     }

//     return NextResponse.json({ success: true, data });
//   } catch (error) {
//     console.error("Error in resume analysis:", error);
//     return NextResponse.json(
//       { success: false, message: error },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server'
import pdf from 'pdf-parse'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('pdf') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const data = await pdf(buffer)
    
    return NextResponse.json({ text: data.text })
  } catch (error) {
    console.error('Error extracting text:', error)
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI} from '@google/generative-ai';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize Groq client
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const maxDuration = 30;

const systemPrompt = `You are a professional and engaging interview bot.

Tone: Warm, professional, and approachable.
Flow:

Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
Tailor questions based on responses (e.g., "You mentioned {experience}; could you elaborate?").
Encourage details ("That’s interesting! How did you approach it?").
Clarify as needed ("Can you expand on that?").
End after 6 questions: "Thank you for sharing! Any final thoughts?"
Focus: Be concise, engaging, and adaptable.`;

export async function POST(request: Request) {
  try {
    // Parse the FormData from the request
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
    }

    // Save the file temporarily
    const tempDir = os.tmpdir();
    const tempFilePath = join(tempDir, pdfFile.name || 'resume.pdf');
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    // Upload the file to Gemini
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: 'application/pdf',
      displayName: pdfFile.name || 'resume.pdf',
    });

    // Extract resume data using Gemini
    const prompt = `
      Extract the following details from the resume:
      - Name
      - Skills
      - Work Experience (company, role, duration)
      - Education
      - Projects (if any)
      Return the data in JSON format.
    `;

    const geminiResult = await genAI
      .getGenerativeModel({ model: 'models/gemini-1.5-flash' })
      .generateContent([
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
        prompt,
      ]);

    const resumeData = JSON.parse(geminiResult.response.text());

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    // Generate interview questions using Groq
    const groqResult = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the candidate's resume data: ${JSON.stringify(resumeData)}. Generate interview questions.`,
        },
      ],
    });

    const questions = await groqResult.text();

    // Return the results
    return NextResponse.json({
      resumeSummary: resumeData,
      interviewQuestions: questions.split('\n').filter((q) => q.trim()),
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}


// import { streamText } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { createClient } from '@/utils/supabase/server';
// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const maxDuration = 30;


// const systemPrompt = `You are a professional and engaging interview bot.

// Tone: Warm, professional, and approachable.
// Flow:

// Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
// Tailor questions based on responses (e.g., "You mentioned {experience}; could you elaborate?").
// Encourage details ("That’s interesting! How did you approach it?").
// Clarify as needed ("Can you expand on that?").
// End after 6 questions: "Thank you for sharing! Any final thoughts?"
// Focus: Be concise, engaging, and adaptable.`

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const result = await streamText({
//     model: groq('llama-3.3-70b-versatile'),
//     system: systemPrompt,
//     messages,
//   });

//   return result.toDataStreamResponse();
// }

// // import { streamText } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { createClient } from '@/utils/supabase/server';

// // const groq = createGroq({
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // export const maxDuration = 30;

// // export async function POST(req: Request) {
// //   const { messages, resumeText } = await req.json();

// //   const systemPrompt = resumeText 
// //     ? `You are a professional and engaging interview bot.
// //        Based on resume: ${resumeText}
// //        Tone: Warm, professional, and approachable.
// //        Flow:
// //        Start: "Hello! Thank you for joining us. I see from your resume that you have experience in [mention relevant experience]. Could you tell me more about that?"
// //        Tailor questions based on responses and resume content
// //        Encourage details about specific projects and experiences mentioned in the resume
// //        Clarify as needed
// //        End after 6 questions: "Thank you for sharing! Any final thoughts?"
// //        Focus: Be concise, engaging, and reference relevant resume details.`
// //     : `You are a professional and engaging interview bot.
// //        Tone: Warm, professional, and approachable.
// //        Flow:
// //        Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
// //        Tailor questions based on responses
// //        Encourage details ("That's interesting! How did you approach it?")
// //        Clarify as needed ("Can you expand on that?")
// //        End after 6 questions: "Thank you for sharing! Any final thoughts?"
// //        Focus: Be concise, engaging, and adaptable.`;

// //   const result = await streamText({
// //     model: groq('llama-3.3-70b-versatile'),
// //     system: systemPrompt,
// //     messages,
// //   });

// //   return result.toDataStreamResponse();
// // }
// // import { streamText } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // // import { createClient } from '@/utils/supabase/server';
// // import { google } from '@ai-sdk/google';
// // const groq = createGroq({
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // export const maxDuration = 30;

// // const createInitialMessage = (resumeText: string) => ({
// //   role: 'assistant' as const,
// //   content: resumeText
// //     ? "I have your resume with me. Let's discuss your experience based on what I see in your resume. Please feel free to elaborate on any points I bring up."
// //     : "Hello! Since I don't have your resume yet, let's start with a general conversation about your background. Could you introduce yourself briefly?"
// // });

// // const createSystemPrompt = (resumeText: string) => {
// //   if (resumeText.trim()) {
// //     return `You are a professional interviewer reviewing a candidate's resume.

// // KEY INSTRUCTIONS:
// // 1. You have the candidate's resume content: "${resumeText}"
// // 2. Start by identifying 1-2 interesting points from their resume
// // 3. Ask focused questions about specific experiences, projects, or skills mentioned
// // 4. Avoid generic questions - reference actual items from their resume
// // 5. Keep track of questions asked (limit: 6 questions)
// // 6. End with "Thank you for sharing! Any final thoughts?"

// // TONE:
// // - Professional yet warm
// // - Show familiarity with their background
// // - Express genuine interest in details
// // - Be concise and specific

// // FLOW:
// // 1. First question: Reference a specific experience/skill from resume
// // 2. Follow-up: Dig deeper into their answers
// // 3. Technical: Ask about specific tools/technologies mentioned
// // 4. Projects: Inquire about outcomes/challenges
// // 5. Skills: Connect their experience to role-relevant abilities
// // 6. Final: Wrap up with accomplishments

// // Remember: Every question should tie back to their resume content.`;
// //   }

// //   return `You are a professional interviewer conducting a general interview.

// // KEY INSTRUCTIONS:
// // 1. No resume is available - ask general background questions
// // 2. Start with a broad introduction request
// // 3. Follow candidate's lead on their experience
// // 4. Keep track of questions asked (limit: 6 questions)
// // 5. End with "Thank you for sharing! Any final thoughts?"

// // TONE:
// // - Professional yet warm
// // - Express genuine interest
// // - Be concise and adaptable

// // FLOW:
// // 1. First: Ask for a brief introduction
// // 2. Follow-up: Explore mentioned experiences
// // 3. Skills: Discuss key capabilities
// // 4. Projects: Ask about significant work
// // 5. Achievements: Notable accomplishments
// // 6. Final: Wrap up with future goals

// // Remember: Keep questions open-ended and adaptable to their responses.`;
// // };

// // export async function POST(req: Request) {
// //   try {
// //     const { messages, resumeText } = await req.json();
// //     const safeResumeText = resumeText || "";

// //     console.log("🔍 Received resumeText:", safeResumeText ? "Resume provided" : "No resume provided");

// //     // Create initial message if it's the start of the conversation
// //     const initialMessages = messages.length === 0 ? [createInitialMessage(safeResumeText)] : [];

// //     // Combine existing messages with initial message if applicable
// //     const fullMessages = [...initialMessages, ...messages];

// //     const result = await streamText({
// //       // model: groq('llama-3.3-70b-versatile'),
// //       model: google('gemini-1.5-flash'),
// //       system: createSystemPrompt(safeResumeText),
// //       messages: fullMessages,
// //     });

// //     return result.toDataStreamResponse();
// //   } catch (error) {
// //     console.error("❌ Error processing request:", error);
// //     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
// //   }
// // }


// // import { streamText } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';

// // const groq = createGroq({
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // export const maxDuration = 30;

// // const createInitialMessage = (resumeText: string) => ({
// //   role: 'assistant' as const,
// //   content: "I have your resume. Please pass it to the /interview route."
// // });

// // const createSystemPrompt = (resumeText: string) => {
// //   return `You are a professional interviewer reviewing a candidate's resume.

// // KEY INSTRUCTIONS:
// // 1. You have the candidate's resume content: "${resumeText}"
// // 2. Start by identifying 1-2 interesting points from their resume
// // 3. Ask focused questions about specific experiences, projects, or skills mentioned
// // 4. Avoid generic questions - reference actual items from their resume
// // 5. Keep track of questions asked (limit: 6 questions)
// // 6. End with "Thank you for sharing! Any final thoughts?"

// // TONE:
// // - Professional yet warm
// // - Show familiarity with their background
// // - Express genuine interest in details
// // - Be concise and specific

// // FLOW:
// // 1. First question: Reference a specific experience/skill from resume
// // 2. Follow-up: Dig deeper into their answers
// // 3. Technical: Ask about specific tools/technologies mentioned
// // 4. Projects: Inquire about outcomes/challenges
// // 5. Skills: Connect their experience to role-relevant abilities
// // 6. Final: Wrap up with accomplishments

// // Remember: Every question should tie back to their resume content.`;
// // };

// // export async function POST(req: Request) {
// //   try {
// //     const { messages, resumeText } = await req.json();

// //     if (!resumeText) {
// //       return new Response(JSON.stringify({ error: "Resume text is required" }), { status: 400 });
// //     }

// //     console.log("🔍 Forwarding resume to /interview route...");

// //     const initialMessages = messages.length === 0 ? [createInitialMessage(resumeText)] : [];
// //     const fullMessages = [...initialMessages, ...messages];

// //     const result = await streamText({
// //       model: groq('llama-3.3-70b-versatile'),
// //       system: createSystemPrompt(resumeText),
// //       messages: fullMessages,
// //     });

// //     return result.toDataStreamResponse();
// //   } catch (error) {
// //     console.error("❌ Error processing request:", error);
// //     return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
// //   }
// // }


// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { NextResponse } from "next/server";

// // const apiKey = process.env.GOOGLE_API_KEY!;
// // const genAI = new GoogleGenerativeAI(apiKey);

// // const model = genAI.getGenerativeModel({
// //   model: "gemini-1.5-pro-002",
// // });

// // export async function POST(request: Request) {
// //   const { messages } = await request.json();

// //   try {
// //     // Ensure the first message is from the user
// //     if (messages.length > 0 && messages[0].role !== "user") {
// //       return NextResponse.json(
// //         { error: "First message must be from the user" },
// //         { status: 400 }
// //       );
// //     }

// //     // Start a chat session with the provided history
// //     const chatSession = model.startChat({
// //       history: messages.map((msg: any) => ({
// //         role: msg.role,
// //         parts: [{ text: msg.content }],
// //       })),
// //       generationConfig: {
// //         temperature: 0.7,
// //         topP: 0.95,
// //         topK: 40,
// //         maxOutputTokens: 8192,
// //       },
// //     });

// //     // Send the latest user message to the model
// //     const result = await chatSession.sendMessage(messages[messages.length - 1].content);
// //     const responseText = result.response.text();

// //     return NextResponse.json({ response: responseText });
// //   } catch (error) {
// //     console.error("Error in chat:", error);
// //     return NextResponse.json(
// //       { error: "Failed to generate chat response" },
// //       { status: 500 }
// //     );
// //   }
// // }

import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

const getSystemPrompt = (resumeData?: string) => {
  let prompt = `You are a professional and engaging interview bot.

Tone: Warm, professional, and approachable.
Flow:

Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
Tailor questions based on responses (e.g., "You mentioned {experience}; could you elaborate?").
Encourage details ("That's interesting! How did you approach it?").
Clarify as needed ("Can you expand on that?").
End after 6 questions: "Thank you for sharing! Any final thoughts?"
Focus: Be concise, engaging, and adaptable.`;

  if (resumeData) {
    prompt += `\n\nAdditional Context: Here's the candidate's resume summary:\n${resumeData}\n\nUse this information to ask relevant questions about their experience and skills.`;
  }

  return prompt;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Get resumeData from sessionStorage (passed from the frontend)
    const resumeData = typeof window !== 'undefined' ? sessionStorage.getItem('resumeData') : null;

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: getSystemPrompt(resumeData || undefined),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
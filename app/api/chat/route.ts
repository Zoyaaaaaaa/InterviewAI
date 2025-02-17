

// import { streamText } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { createClient } from '@/utils/supabase/server';
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

import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { createClient } from '@/utils/supabase/server';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, resumeText } = await req.json();

  const systemPrompt = resumeText 
    ? `You are a professional and engaging interview bot.
       Based on resume: ${resumeText}
       Tone: Warm, professional, and approachable.
       Flow:
       Start: "Hello! Thank you for joining us. I see from your resume that you have experience in [mention relevant experience]. Could you tell me more about that?"
       Tailor questions based on responses and resume content
       Encourage details about specific projects and experiences mentioned in the resume
       Clarify as needed
       End after 6 questions: "Thank you for sharing! Any final thoughts?"
       Focus: Be concise, engaging, and reference relevant resume details.`
    : `You are a professional and engaging interview bot.
       Tone: Warm, professional, and approachable.
       Flow:
       Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
       Tailor questions based on responses
       Encourage details ("That's interesting! How did you approach it?")
       Clarify as needed ("Can you expand on that?")
       End after 6 questions: "Thank you for sharing! Any final thoughts?"
       Focus: Be concise, engaging, and adaptable.`;

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
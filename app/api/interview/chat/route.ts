// import { streamText } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { NextResponse } from 'next/server';

// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const maxDuration = 30;

// const getSystemPrompt = (resumeData?: string) => {
//   let prompt = `You are an experienced technical interviewer conducting a job interview.`;
  
//   if (resumeData) {
//     prompt += `\n\nCandidate Resume Summary:\n${resumeData}`;
//   }
  
//   prompt += `\n\nGuidelines:
// - Ask relevant technical questions based on the resume
// - Keep questions concise (1-2 sentences)
// - Maintain professional tone
// - Adapt follow-up questions based on responses`;

//   return prompt;
// };

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const message = formData.get('message')?.toString();
//     const conversation = formData.get('conversation')?.toString();
//     const resumeData = formData.get('resume')?.toString();

//     const messages = conversation ? JSON.parse(conversation) : [];
    
//     if (message) {
//       messages.push({ role: 'user', content: message });
//     }

//     const result = await streamText({
//       model: groq('llama3-70b-8192'),
//       system: getSystemPrompt(resumeData || undefined),
//       messages,
//       temperature: 0.7,
//       maxTokens: 200
//     });

//     let response = '';
//     for await (const chunk of result.textStream) {
//       response += chunk;
//     }

//     return NextResponse.json({
//       success: true,
//       response: response.trim()
//     });

//   } catch (error) {
//     console.error('Error in chat API:', error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Failed to process chat request',
//         details: error instanceof Error ? error.message : String(error)
//       },
//       { status: 500 }
//     );
//   }
// }
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

const getSystemPrompt = (resumeData?: string) => {
  let prompt = `You are an experienced technical interviewer conducting a focused job interview. You will ask EXACTLY 5-6 questions total, then conclude the interview.

INTERVIEW STRUCTURE:
1. Start with 1-2 general questions about their background/experience
2. Ask 2-3 specific technical questions based on their resume
3. Ask 1-2 follow-up questions for clarification or deeper understanding
4. End with "Thank you for your time. This concludes our interview. You may end the session."

IMPORTANT RULES:
- NEVER repeat or rephrase the candidate's answers back to them
- Ask ONE question at a time
- Keep questions concise (1-2 sentences maximum)
- Do NOT provide explanations or summaries of their answers
- Move to the next question immediately after they respond
- Track question count internally - stop after 5-6 questions
- Be direct and professional
- Focus on problem-solving and real-world application`;
  
  if (resumeData) {
    prompt += `\n\nCandidate Resume Summary:\n${resumeData}`;
  }
  
  prompt += `\n\nEXAMPLE FLOW:
Q1: "Tell me about your current role and main responsibilities."
Q2: "What's the most challenging technical problem you've solved recently?"
Q3: [Technical question based on resume]
Q4: [Follow-up or clarification question]
Q5: "How do you stay updated with new technologies?"
CONCLUDE: "Thank you for your time. This concludes our interview. You may end the session."

Remember: NO repetitive summaries, NO explaining their answers back to them, NO verbose responses.`;

  return prompt;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message')?.toString();
    const conversation = formData.get('conversation')?.toString();
    const resumeData = formData.get('resume')?.toString();

    const messages = conversation ? JSON.parse(conversation) : [];
    
    if (message) {
      messages.push({ role: 'user', content: message });
    }

    const result = await streamText({
      model: groq('llama3-70b-8192'),
      system: getSystemPrompt(resumeData || undefined),
      messages,
      temperature: 0.3, // Reduced for more focused responses
      maxTokens: 150 // Reduced to prevent long responses
    });

    let response = '';
    for await (const chunk of result.textStream) {
      response += chunk;
    }

    return NextResponse.json({
      success: true,
      response: response.trim()
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
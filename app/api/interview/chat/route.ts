// import { streamText } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { NextResponse } from 'next/server';

// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const maxDuration = 30;

// const getSystemPrompt = (resumeData?: string, jobDescription?: string) => {
//   let prompt = `You are an experienced technical interviewer conducting a focused job interview. You will ask EXACTLY 5-6 questions total, then conclude the interview.

// INTERVIEW STRUCTURE:
// 1. Start with 1 general question about their background/experience
// 2. Ask 2-3 specific technical questions based on their resume AND job requirements
// 3. Ask 1 behavioral question based on role responsibilities
// 4. Ask 1 follow-up question for deeper understanding
// 5. Conclude the interview

// KEY REQUIREMENTS:
// - Questions must be relevant to both the candidate's experience and job requirements
// - Technical questions should test skills mentioned in both resume and job description
// - Behavioral questions should relate to the role's responsibilities
// - Maintain professional tone throughout`;

//   if (resumeData) {
//     prompt += `\n\nCANDIDATE RESUME:\n${resumeData.substring(0, 3000)}`; // Limit length
//   }
  
//   if (jobDescription) {
//     console.log(jobDescription)
//     prompt += `\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`;
//     prompt += `\n\nSPECIAL INSTRUCTIONS:
// - Focus on these key requirements: ${extractKeyRequirements(jobDescription)}
// - Pay attention to required technologies/skills
// - Consider the seniority level implied by the description`;
//   }
  
//   prompt += `\n\nRULES:
// - NEVER summarize or repeat the candidate's answers
// - Ask ONE clear question at a time
// - Keep questions concise (1-2 sentences maximum)
// - Move to next question after each response
// - STOP after exactly 5-6 questions
// - End with: "Thank you for your time. This concludes our interview."`;

//   return prompt;
// };

// // Helper function to extract key requirements from job description
// function extractKeyRequirements(jobDescription: string): string {
//   // Look for common requirement keywords
//   const requirementKeywords = [
//     'must have', 'requirements', 'qualifications',
//     'skills needed', 'you should have', 'we require'
//   ];
  
//   const lines = jobDescription.split('\n');
//   let requirements = [];
  
//   for (const line of lines) {
//     const lowerLine = line.toLowerCase();
//     if (requirementKeywords.some(keyword => lowerLine.includes(keyword))) {
//       requirements.push(line.trim());
//     }
//   }
  
//   return requirements.length > 0 
//     ? requirements.join('\n- ')
//     : 'General technical skills and experience relevant to the role';
// }

// export async function POST(request: Request) {
//   try {
//     const formData = await request.formData();
//     const message = formData.get('message')?.toString();
//     const conversation = formData.get('conversation')?.toString();
//     const resumeData = formData.get('resume')?.toString();
//     const jobDescription = formData.get('jobDescription')?.toString();

//     console.log('Received data:', {
//       hasResume: !!resumeData,
//       hasJobDescription: !!jobDescription,
//       conversationLength: conversation ? JSON.parse(conversation).length : 0
//     });

//     const messages = conversation ? JSON.parse(conversation) : [];
    
//     if (message) {
//       messages.push({ role: 'user', content: message });
//     }

//     const result = await streamText({
//       model: groq('llama-3.3-70b-versatile'),
//       system: getSystemPrompt(resumeData, jobDescription),
//       messages,
//       temperature: 0.7, 
//       maxTokens: 350 
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

const getSystemPrompt = (resumeData?: string, jobDescription?: string) => {
  let prompt = `You are an experienced technical interviewer conducting a focused job interview. You will ask EXACTLY 5-6 questions total, then conclude the interview.

INTERVIEW STRUCTURE:
1. Start with 1 general question about their background/experience
2. Ask 2-3 specific technical questions based on their resume AND job requirements
3. Ask 1 behavioral question based on role responsibilities
4. Ask 1 follow-up question for deeper understanding
5. Conclude the interview

KEY REQUIREMENTS:
- Questions must be relevant to both the candidate's experience and job requirements
- Technical questions should test skills mentioned in both resume and job description
- Behavioral questions should relate to the role's responsibilities
- Maintain professional tone throughout`;

  if (resumeData) {
    prompt += `\n\nCANDIDATE RESUME:\n${resumeData.substring(0, 3000)}`;
  }
  
  if (jobDescription) {
    console.log("🔍 Job Description snippet:", jobDescription.substring(0, 300));
    prompt += `\n\nJOB DESCRIPTION:\n${jobDescription.substring(0, 3000)}`;
    prompt += `\n\nSPECIAL INSTRUCTIONS:
- Focus on these key requirements: ${extractKeyRequirements(jobDescription)}
- Pay attention to required technologies/skills
- Consider the seniority level implied by the description`;
  }

  // Add hidden tag for AI to self-report usage
  prompt += `\n\nRULES:
- NEVER summarize or repeat the candidate's answers
- Ask ONE clear question at a time
- Keep questions concise (1-2 sentences maximum)
- Move to next question after each response
- STOP after exactly 5-6 questions
- End with: "Thank you for your time. This concludes our interview."
- At the end of each response, add this hidden tag: [USAGE] resume={{true/false}} jd={{true/false}}`;

  return prompt;
};

// ✅ Extract key requirements from JD
function extractKeyRequirements(jobDescription: string): string {
  const requirementKeywords = [
    'must have', 'requirements', 'qualifications',
    'skills needed', 'you should have', 'we require'
  ];
  
  const lines = jobDescription.split('\n');
  let requirements = [];
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (requirementKeywords.some(keyword => lowerLine.includes(keyword))) {
      requirements.push(line.trim());
    }
  }
  
  return requirements.length > 0 
    ? requirements.join('\n- ')
    : 'General technical skills and experience relevant to the role';
}

// ✅ Analyze references by keyword match
function analyzeReferences(response: string, resumeData?: string, jobDescription?: string) {
  const result = { resumeRefs: [] as string[], jdRefs: [] as string[] };

  if (resumeData) {
    const resumeWords = [...new Set(resumeData.split(/\W+/).filter(w => w.length > 3))];
    result.resumeRefs = resumeWords.filter(word =>
      response.toLowerCase().includes(word.toLowerCase())
    );
  }

  if (jobDescription) {
    const jdWords = [...new Set(jobDescription.split(/\W+/).filter(w => w.length > 3))];
    result.jdRefs = jdWords.filter(word =>
      response.toLowerCase().includes(word.toLowerCase())
    );
  }

  return result;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get('message')?.toString();
    const conversation = formData.get('conversation')?.toString();
    const resumeData = formData.get('resume')?.toString();
    const jobDescription = formData.get('jobDescription')?.toString();

    console.log('📥 Received data:', {
      hasResume: !!resumeData,
      hasJobDescription: !!jobDescription,
      conversationLength: conversation ? JSON.parse(conversation).length : 0
    });

    const messages = conversation ? JSON.parse(conversation) : [];
    if (message) messages.push({ role: 'user', content: message });

    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: getSystemPrompt(resumeData, jobDescription),
      messages,
      temperature: 0.7,
      maxTokens: 350
    });

    let response = '';
    for await (const chunk of result.textStream) {
      response += chunk;
    }

    // ✅ Check AI self-report tag
    const tagMatch = response.match(/\[USAGE\] resume=(\w+) jd=(\w+)/);
    let aiReportedUsage = null;
    if (tagMatch) {
      aiReportedUsage = {
        usedResume: tagMatch[1] === 'true',
        usedJobDescription: tagMatch[2] === 'true'
      };
      console.log('🤖 AI Self-Reported Usage:', aiReportedUsage);
      response = response.replace(/\[USAGE\].*$/, '').trim();
    }

    // ✅ Backend keyword analysis
    const refs = analyzeReferences(response, resumeData, jobDescription);
    console.log("✅ Matched Resume Keywords:", refs.resumeRefs.slice(0, 10));
    console.log("✅ Matched JD Keywords:", refs.jdRefs.slice(0, 10));

    return NextResponse.json({
      success: true,
      response: response.trim(),
      usageAnalysis: {
        aiReported: aiReportedUsage,
        matchedResumeKeywords: refs.resumeRefs,
        matchedJDKeywords: refs.jdRefs
      }
    });

  } catch (error) {
    console.error('❌ Error in chat API:', error);
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

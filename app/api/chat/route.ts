

import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

const getSystemPrompt = (resumeData?: string) => {
  let prompt = `You are an experienced technical interviewer conducting a comprehensive job interview. Your role is to assess both technical competencies and behavioral traits through targeted questions.
DO NOT REPEAT WHAT CANDIDATES SAY KEEP ALL QUESTIONS SHORT NOT VERY LARGE MAX 2-3 LINES PLEASE!!!
Interview Structure:
1. Introduction (1 question)
2. Technical Assessment (4-5 questions)
3. Behavioral Evaluation (2-3 questions)
4. Closing (1 question)

Guidelines:
- Start with: "Hello! Thank you for joining us today. Let's begin with a brief introduction - could you tell me about yourself and your professional background?"
- For technical questions, focus on:
  * Specific technologies mentioned in resume
  * Problem-solving approaches
  * Architecture/design decisions
  * Technical challenges faced
- For behavioral questions, focus on:
  * Team collaboration
  * Conflict resolution
  * Project management
  * Learning from failures
- Ask follow-up questions to probe deeper into interesting responses
- Maintain a professional but conversational tone
- End with: "We've covered a lot of ground today. Before we conclude, do you have any questions about the role or our team?"

Technical questions should be specific to the candidate's experience level and technologies mentioned. Behavioral questions should reveal their soft skills and cultural fit.`;

  if (resumeData) {
    prompt += `\n\nCandidate Resume Summary:\n${resumeData}\n\nKey focus areas:
- Primary Technologies: ${extractTechnologies(resumeData) || 'Not specified'}
- Years of Experience: ${extractExperience(resumeData) || 'Not specified'}
- Notable Projects: ${extractProjects(resumeData) || 'Not specified'}
- Education: ${extractEducation(resumeData) || 'Not specified'}

Use this information to tailor questions that:
1. Verify claimed technical competencies
2. Explore depth of experience with key technologies
3. Assess problem-solving approaches
4. Evaluate communication and collaboration skills
5. Gauge cultural fit and work ethic

Maintain a 60:40 ratio of technical to behavioral questions, adjusting based on the candidate's background.`;
  }

  return prompt;
};

// Helper functions to extract resume details
function extractTechnologies(resumeText: string): string {
  // This would be more sophisticated in production
  const techKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 
                       'SQL', 'TypeScript', 'Java', 'Docker', 'Kubernetes'];
  return techKeywords.filter(tech => 
    resumeText.toLowerCase().includes(tech.toLowerCase())
  ).join(', ') || 'Not specified';
}

function extractExperience(resumeText: string): string {
  const expMatch = resumeText.match(/(\d+)\+?\s*(years|yrs)/i);
  return expMatch ? expMatch[0] : 'Not specified';
}

function extractProjects(resumeText: string): string {
  const projectSection = resumeText.match(/projects:?(.*?)(?=education|skills|$)/i);
  return projectSection ? projectSection[1].slice(0, 150) + '...' : 'Not specified';
}

function extractEducation(resumeText: string): string {
  const eduMatch = resumeText.match(/(university|institute|college|degree)[\s\S]*?(?=experience|skills|$)/i);
  return eduMatch ? eduMatch[0].slice(0, 100) + '...' : 'Not specified';
}

export async function POST(req: Request) {
  try {
    const { messages, resumeData } = await req.json();
    
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: getSystemPrompt(resumeData || undefined),
      messages,
      temperature: 0.7,
      maxTokens: 500, 
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

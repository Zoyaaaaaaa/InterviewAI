// // import { createClient } from '@/utils/supabase/server';
// // import { NextResponse,NextRequest } from 'next/server';
// // import { validate as uuidValidate } from 'uuid';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { z } from 'zod';
// // import { generateObject } from "ai";
// // import { GeneratedFeedbackSchema, SaveFeedbackSchema } from '../schema';


// // export async function GET(
// //   request: Request,
// //   { params }: { params: { interview_id: string } }
// // ) {
// //   try {
// //     const interview_id = await params.interview_id;

// //     // Validate the interview_id
// //     if (!uuidValidate(interview_id)) {
// //       return NextResponse.json(
// //         { error: 'Invalid interview ID' },
// //         { status: 400 }
// //       );
// //     }

// //     console.log('Fetching feedback for interview:', interview_id);

// //     const supabase = await createClient();

// //     // Fetch feedback from Supabase (using .limit(1) to avoid multiple rows issue)
// //     const { data, error } = await supabase
// //       .from('feedback')
// //       .select('*')
// //       .eq('interview_id', interview_id)
// //       .limit(1) // Safely limit results to 1
// //       .single();

// //     console.log('Supabase response:', { data, error });

// //     if (error) {
// //       console.error('Supabase error:', error);
// //       return NextResponse.json({ error: error.message }, { status: 500 });
// //     }

// //     if (!data) {
// //       console.log('No feedback found for interview:', interview_id);
// //       return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
// //     }

// //     // Transform the data to match frontend expectations
// //     const transformedFeedback = {
// //       overallScore: Math.round(data.overall_score * 10),
// //       metrics: {
// //         technical: Math.round(data.technical_score * 10),
// //         communication: Math.round(data.communication_score * 10),
// //         confidence: Math.round(data.confidence_score * 10),
// //       },
// //       strengths: data.strengths,
// //       improvements: data.improvements,
// //       detailed_feedback: `Technical Score: ${Math.round(data.technical_score * 10)}/10\n` +
// //         `Communication Score: ${Math.round(data.communication_score * 10)}/10\n` +
// //         `Confidence Score: ${Math.round(data.confidence_score * 10)}/10\n\n` +
// //         `Strengths:\n${data.strengths.map((s: any) => `- ${s}`).join('\n')}\n\n` +
// //         `Areas for Improvement:\n${data.improvements.map((i: any) => `- ${i}`).join('\n')}`,
// //     };

// //     console.log('Transformed feedback:', transformedFeedback);
// //     return NextResponse.json(transformedFeedback);

// //   } catch (error) {
// //     console.error('Error in feedback GET route:', error);
// //     return NextResponse.json(
// //       { error: error instanceof Error ? error.message : 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }


// // // Validate environment variables
// // if (!process.env.GROQ_API_KEY) {
// //   throw new Error('GROQ_API_KEY is not set in environment variables');
// // }

// // // Initialize the Groq AI instance
// // const groq = createGroq({
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // export async function POST(req: NextRequest) {
// //   const supabase = await createClient();

// //   try {
// //     // Parse the incoming request body
// //     const body = await req.json();
// //     const { interview_id } = body;

// //     // Validate if interview_id is provided
// //     if (!interview_id) {
// //       return NextResponse.json(
// //         { error: 'Missing interview_id in the request body' },
// //         { status: 400 }
// //       );
// //     }

// //     // Fetch the interview conversation from the database
// //     const { data: interviewData, error: interviewError } = await supabase
// //       .from('interview')
// //       .select('conversation')
// //       .eq('id', interview_id)
// //       .single();

// //     // Handle if the interview was not found
// //     if (interviewError || !interviewData) {
// //       throw new Error(interviewError?.message || 'Interview not found');
// //     }

// //     // Generate feedback using Groq AI based on the interview conversation
// //     const { object } = await generateObject({
// //       model: groq('llama-3.3-70b-versatile'),
// //       schema: GeneratedFeedbackSchema,
// //       prompt: `Analyze this interview conversation and provide detailed feedback. 
// //         Interview transcript: ${interviewData.conversation}
// //         BE STRICT IN GIVING SCORE PLEASE AND PROVIDE REASONING FOR EACH SCORE.
// //         Provide an analysis that includes:
// //         1. Technical competency evaluation (score between 0-1)
// //         2. Communication skills assessment (score between 0-1)
// //         3. Confidence level evaluation (score between 0-1)
// //         4. Overall performance score (score between 0-1)
// //         5. Key strengths (minimum 2 points)
// //         6. Areas for improvement (minimum 2 points)

// //         Focus on:
// //         - Technical accuracy and depth of knowledge
// //         - Clarity and effectiveness of communication
// //         - Confidence and professional demeanor
// //         - Specific examples from the conversation
        
// //         Return the analysis in a structured format that matches the schema.`,
// //     });

// //     // Prepare the feedback data using the response from Groq
// //     const feedbackData = SaveFeedbackSchema.parse({
// //       interview_id,
// //       technical_score: object.technical_score,
// //       communication_score: object.communication_score,
// //       confidence_score: object.confidence_score,
// //       overall_score: object.overall_score,
// //       strengths: object.strengths,
// //       improvements: object.improvements,
// //     });

// //     // Insert the feedback data into the 'feedback' table in the database
// //     const { data, error } = await supabase
// //       .from('feedback')
// //       .insert(feedbackData)
// //       .select();

// //     if (error) {
// //       throw new Error(error.message);
// //     }

// //     // Return the success response with the saved feedback data
// //     return NextResponse.json(
// //       {
// //         message: 'Feedback saved successfully',
// //         data,
// //       },
// //       { status: 201 }
// //     );
// //   } catch (error) {
// //     console.error('Error saving feedback:', error);

// //     // Handle validation errors with Zod
// //     if (error instanceof z.ZodError) {
// //       return NextResponse.json(
// //         { error: 'Invalid input', details: error.errors.map((e) => e.message) },
// //         { status: 422 }
// //       );
// //     }

// //     // Handle general errors
// //     return NextResponse.json(
// //       { error: 'Failed to save feedback', details: error instanceof Error ? error.message : 'Unknown error' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { createClient } from '@/utils/supabase/server';
// import { NextResponse, NextRequest } from 'next/server';
// import { validate as uuidValidate } from 'uuid';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { z } from 'zod';
// import { generateObject } from "ai";

// // Simplified and more robust schemas to avoid deep instantiation issues
// const GeneratedFeedbackSchema = z.object({
//   technical_score: z.number().min(0).max(1),
//   communication_score: z.number().min(0).max(1),
//   confidence_score: z.number().min(0).max(1),
//   overall_score: z.number().min(0).max(1),
//   strengths: z.array(z.string()).min(2).max(5),
//   improvements: z.array(z.string()).min(2).max(5),
//   technical_reasoning: z.string(),
//   communication_reasoning: z.string(),
//   confidence_reasoning: z.string(),
//   overall_reasoning: z.string()
// });

// const SaveFeedbackSchema = z.object({
//   interview_id: z.string().uuid(),
//   technical_score: z.number().min(0).max(1),
//   communication_score: z.number().min(0).max(1),
//   confidence_score: z.number().min(0).max(1),
//   overall_score: z.number().min(0).max(1),
//   strengths: z.array(z.string()),
//   improvements: z.array(z.string()),
//   technical_reasoning: z.string().optional(),
//   communication_reasoning: z.string().optional(),
//   confidence_reasoning: z.string().optional(),
//   overall_reasoning: z.string().optional()
// });

// export async function GET(
//   request: Request,
//   { params }: { params: { interview_id: string } }
// ) {
//   try {
//     const interview_id = await params.interview_id;

//     if (!uuidValidate(interview_id)) {
//       return NextResponse.json(
//         { error: 'Invalid interview ID' },
//         { status: 400 }
//       );
//     }

//     const supabase = await createClient();

//     const { data, error } = await supabase
//       .from('feedback')
//       .select('*')
//       .eq('interview_id', interview_id)
//       .limit(1)
//       .single();

//     if (error) {
//       console.error('Supabase error:', error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     if (!data) {
//       return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
//     }

//     const transformedFeedback = {
//       overallScore: Math.round(data.overall_score * 10),
//       metrics: {
//         technical: Math.round(data.technical_score * 10),
//         communication: Math.round(data.communication_score * 10),
//         confidence: Math.round(data.confidence_score * 10),
//       },
//       strengths: data.strengths,
//       improvements: data.improvements,
//       reasoning: {
//         technical: data.technical_reasoning,
//         communication: data.communication_reasoning,
//         confidence: data.confidence_reasoning,
//         overall: data.overall_reasoning
//       },
//       detailed_feedback: `Technical Score: ${Math.round(data.technical_score * 10)}/10\n` +
//         `${data.technical_reasoning}\n\n` +
//         `Communication Score: ${Math.round(data.communication_score * 10)}/10\n` +
//         `${data.communication_reasoning}\n\n` +
//         `Confidence Score: ${Math.round(data.confidence_score * 10)}/10\n` +
//         `${data.confidence_reasoning}\n\n` +
//         `Overall Score: ${Math.round(data.overall_score * 10)}/10\n` +
//         `${data.overall_reasoning}\n\n` +
//         `Strengths:\n${data.strengths.map((s: string) => `- ${s}`).join('\n')}\n\n` +
//         `Areas for Improvement:\n${data.improvements.map((i: string) => `- ${i}`).join('\n')}`,
//     };

//     return NextResponse.json(transformedFeedback);

//   } catch (error) {
//     console.error('Error in feedback GET route:', error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // Validate environment variables
// if (!process.env.GROQ_API_KEY) {
//   throw new Error('GROQ_API_KEY is not set in environment variables');
// }

// // Initialize the Groq AI instance
// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// export async function POST(req: NextRequest) {
//   const supabase = await createClient();

//   try {
//     const body = await req.json();
//     const { interview_id } = body;

//     if (!interview_id) {
//       return NextResponse.json(
//         { error: 'Missing interview_id in the request body' },
//         { status: 400 }
//       );
//     }

//     // Fetch the interview conversation from the database
//     const { data: interviewData, error: interviewError } = await supabase
//       .from('interview')
//       .select('conversation')
//       .eq('id', interview_id)
//       .single();

//     if (interviewError || !interviewData) {
//       throw new Error(interviewError?.message || 'Interview not found');
//     }

//     // Enhanced prompt for better judging
//     const enhancedPrompt = `You are an expert technical interviewer with 10+ years of experience. Analyze this interview conversation and provide STRICT, HONEST, and DETAILED feedback.

// Interview transcript: ${interviewData.conversation}

// SCORING GUIDELINES (Be strict and realistic):
// - 0.0-0.3: Poor performance, major gaps in knowledge/skills
// - 0.4-0.5: Below average, significant improvement needed
// - 0.6-0.7: Average performance, meets basic expectations
// - 0.8-0.9: Good performance, above average
// - 1.0: Exceptional performance, expert level

// EVALUATION CRITERIA:

// 1. TECHNICAL COMPETENCY (0-1):
//    - Correctness of technical answers
//    - Depth of understanding
//    - Problem-solving approach
//    - Knowledge of best practices
//    - Ability to explain complex concepts
//    - Code quality (if applicable)

// 2. COMMUNICATION SKILLS (0-1):
//    - Clarity of explanations
//    - Structured thinking
//    - Asking relevant questions
//    - Listening and responding appropriately
//    - Professional language use

// 3. CONFIDENCE LEVEL (0-1):
//    - Decisiveness in answers
//    - Ability to admit knowledge gaps
//    - Professional demeanor
//    - Handling pressure/uncertainty
//    - Self-awareness

// 4. OVERALL PERFORMANCE (0-1):
//    - Holistic assessment
//    - Readiness for the role
//    - Potential for growth
//    - Overall interview performance

// REQUIREMENTS:
// - Provide specific examples from the conversation
// - Be constructive but honest about weaknesses
// - Give actionable improvement suggestions
// - Justify each score with clear reasoning
// - Don't inflate scores - be realistic about performance levels

// Return structured feedback with detailed reasoning for each score.`;

//     // Generate feedback using Groq AI
//     const { object } = await generateObject({
//       model: groq('llama-3.3-70b-versatile'),
//       schema: GeneratedFeedbackSchema,
//       prompt: enhancedPrompt,
//     });

//     // Prepare the feedback data
//     const feedbackData = SaveFeedbackSchema.parse({
//       interview_id,
//       technical_score: object.technical_score,
//       communication_score: object.communication_score,
//       confidence_score: object.confidence_score,
//       overall_score: object.overall_score,
//       strengths: object.strengths,
//       improvements: object.improvements,
//       technical_reasoning: object.technical_reasoning,
//       communication_reasoning: object.communication_reasoning,
//       confidence_reasoning: object.confidence_reasoning,
//       overall_reasoning: object.overall_reasoning,
//     });

//     // Insert the feedback data into the database
//     const { data, error } = await supabase
//       .from('feedback')
//       .insert(feedbackData)
//       .select();

//     if (error) {
//       throw new Error(error.message);
//     }

//     return NextResponse.json(
//       {
//         message: 'Feedback saved successfully',
//         data,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error saving feedback:', error);

//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: 'Invalid input', details: error.errors.map((e) => e.message) },
//         { status: 422 }
//       );
//     }

//     return NextResponse.json(
//       { error: 'Failed to save feedback', details: error instanceof Error ? error.message : 'Unknown error' },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from '@/utils/supabase/server';
import { NextResponse, NextRequest } from 'next/server';
import { validate as uuidValidate } from 'uuid';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from "ai";

// --- Type Definitions ---
type Score = {
  technical_score: number;
  communication_score: number;
  confidence_score: number;
  overall_score: number;
};

type Reasoning = {
  technical_reasoning: string;
  communication_reasoning: string;
  confidence_reasoning: string;
  overall_reasoning: string;
};

type FeedbackContent = {
  strengths: string[];
  improvements: string[];
};

// --- Modularized Schemas ---
const ScoreSchema = z.object({
  technical_score: z.number().min(0).max(1),
  communication_score: z.number().min(0).max(1),
  confidence_score: z.number().min(0).max(1),
  overall_score: z.number().min(0).max(1),
});

const ReasoningSchema = z.object({
  technical_reasoning: z.string(),
  communication_reasoning: z.string(),
  confidence_reasoning: z.string(),
  overall_reasoning: z.string(),
});

const FeedbackContentSchema = z.object({
  strengths: z.array(z.string()).min(2).max(5),
  improvements: z.array(z.string()).min(2).max(5),
});

const GeneratedFeedbackSchema = ScoreSchema
  .merge(ReasoningSchema)
  .merge(FeedbackContentSchema);

const SaveFeedbackSchema = ScoreSchema
  .merge(ReasoningSchema.partial())
  .merge(FeedbackContentSchema)
  .extend({
    interview_id: z.string().uuid(),
  });

type SaveFeedback = z.infer<typeof SaveFeedbackSchema>;

type TransformedFeedback = {
  overallScore: number;
  metrics: {
    technical: number;
    communication: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  reasoning: {
    technical: string;
    communication: string;
    confidence: string;
    overall: string;
  };
  detailed_feedback: string;
};

type InterviewData = {
  conversation: string;
};

// --- Environment Validation ---
const validateEnvironment = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables');
  }
};

// --- AI Service Initialization ---
const initializeGroq = () => {
  validateEnvironment();
  return createGroq({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY!,
  });
};

const groq = initializeGroq();

// --- Helper Functions ---
const transformFeedback = (feedback: SaveFeedback): TransformedFeedback => {
  const roundScore = (score: number) => Math.round(score * 10);
  
  return {
    overallScore: roundScore(feedback.overall_score),
    metrics: {
      technical: roundScore(feedback.technical_score),
      communication: roundScore(feedback.communication_score),
      confidence: roundScore(feedback.confidence_score),
    },
    strengths: feedback.strengths,
    improvements: feedback.improvements,
    reasoning: {
      technical: feedback.technical_reasoning ?? '',
      communication: feedback.communication_reasoning ?? '',
      confidence: feedback.confidence_reasoning ?? '',
      overall: feedback.overall_reasoning ?? '',
    },
    detailed_feedback: `Technical Score: ${roundScore(feedback.technical_score)}/10\n` +
      `${feedback.technical_reasoning}\n\n` +
      `Communication Score: ${roundScore(feedback.communication_score)}/10\n` +
      `${feedback.communication_reasoning}\n\n` +
      `Confidence Score: ${roundScore(feedback.confidence_score)}/10\n` +
      `${feedback.confidence_reasoning}\n\n` +
      `Overall Score: ${roundScore(feedback.overall_score)}/10\n` +
      `${feedback.overall_reasoning}\n\n` +
      `Strengths:\n${feedback.strengths.map(s => `- ${s}`).join('\n')}\n\n` +
      `Areas for Improvement:\n${feedback.improvements.map(i => `- ${i}`).join('\n')}`,
  };
};

const getEnhancedPrompt = (conversation: string): string => {
  return `You are an expert technical interviewer with 10+ years of experience. Analyze this interview conversation and provide STRICT, HONEST, and DETAILED feedback.

Interview transcript: ${conversation}

SCORING GUIDELINES (Be strict and realistic):
- 0.0-0.3: Poor performance, major gaps in knowledge/skills
- 0.4-0.5: Below average, significant improvement needed
- 0.6-0.7: Average performance, meets basic expectations
- 0.8-0.9: Good performance, above average
- 1.0: Exceptional performance, expert level

EVALUATION CRITERIA:

1. TECHNICAL COMPETENCY (0-1):
   - Correctness of technical answers
   - Depth of understanding
   - Problem-solving approach
   - Knowledge of best practices
   - Ability to explain complex concepts
   - Code quality (if applicable)

2. COMMUNICATION SKILLS (0-1):
   - Clarity of explanations
   - Structured thinking
   - Asking relevant questions
   - Listening and responding appropriately
   - Professional language use

3. CONFIDENCE LEVEL (0-1):
   - Decisiveness in answers
   - Ability to admit knowledge gaps
   - Professional demeanor
   - Handling pressure/uncertainty
   - Self-awareness

4. OVERALL PERFORMANCE (0-1):
   - Holistic assessment
   - Readiness for the role
   - Potential for growth
   - Overall interview performance

REQUIREMENTS:
- Provide specific examples from the conversation
- Be constructive but honest about weaknesses
- Give actionable improvement suggestions
- Justify each score with clear reasoning
- Don't inflate scores - be realistic about performance levels

Return structured feedback with detailed reasoning for each score.`;
};

// --- GET Handler ---
export async function GET(
  request: Request,
  { params }: { params: { interview_id: string } }
): Promise<NextResponse> {
  try {
    const { interview_id } = params;

    if (!uuidValidate(interview_id)) {
      return NextResponse.json(
        { error: 'Invalid interview ID' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('interview_id', interview_id)
      .limit(1)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    const feedback = SaveFeedbackSchema.parse(data);
    const transformedFeedback = transformFeedback(feedback);

    return NextResponse.json(transformedFeedback);

  } catch (error) {
    console.error('Error in feedback GET route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// --- POST Handler ---
export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = await createClient();

  try {
    const body = await req.json();
    const { interview_id } = body;

    if (!interview_id) {
      return NextResponse.json(
        { error: 'Missing interview_id in the request body' },
        { status: 400 }
      );
    }

    // Fetch the interview conversation from the database
    const { data: interviewData, error: interviewError } = await supabase
      .from('interview')
      .select('conversation')
      .eq('id', interview_id)
      .single();

    if (interviewError || !interviewData) {
      throw new Error(interviewError?.message || 'Interview not found');
    }

    const enhancedPrompt = getEnhancedPrompt(interviewData.conversation);

    // Generate feedback using Groq AI
    const { object } = await generateObject({
      model: groq('llama3-70b-8192'),
      schema: GeneratedFeedbackSchema,
      prompt: enhancedPrompt,
      maxTokens: 2000,
      temperature: 0.3,
    });

    // Prepare the feedback data
    const feedbackData: SaveFeedback = SaveFeedbackSchema.parse({
      interview_id,
      ...object,
    });

    // Insert the feedback data into the database
    const { data, error: insertError } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json(
      {
        message: 'Feedback saved successfully',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving feedback:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: error.errors.map((e) => e.message) 
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to save feedback', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
import { createClient } from '@/utils/supabase/server';
import { NextResponse,NextRequest } from 'next/server';
import { validate as uuidValidate } from 'uuid';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from "ai";
import { GeneratedFeedbackSchema, SaveFeedbackSchema } from '../schema';


export async function GET(
  request: Request,
  { params }: { params: { interview_id: string } }
) {
  try {
    const interview_id = params.interview_id;

    // Validate the interview_id
    if (!uuidValidate(interview_id)) {
      return NextResponse.json(
        { error: 'Invalid interview ID' },
        { status: 400 }
      );
    }

    console.log('Fetching feedback for interview:', interview_id);

    const supabase = await createClient();

    // Fetch feedback from Supabase (using .limit(1) to avoid multiple rows issue)
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('interview_id', interview_id)
      .limit(1) // Safely limit results to 1
      .single();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.log('No feedback found for interview:', interview_id);
      return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
    }

    // Transform the data to match frontend expectations
    const transformedFeedback = {
      overallScore: Math.round(data.overall_score * 10),
      metrics: {
        technical: Math.round(data.technical_score * 10),
        communication: Math.round(data.communication_score * 10),
        confidence: Math.round(data.confidence_score * 10),
      },
      strengths: data.strengths,
      improvements: data.improvements,
      detailed_feedback: `Technical Score: ${Math.round(data.technical_score * 10)}/10\n` +
        `Communication Score: ${Math.round(data.communication_score * 10)}/10\n` +
        `Confidence Score: ${Math.round(data.confidence_score * 10)}/10\n\n` +
        `Strengths:\n${data.strengths.map((s: any) => `- ${s}`).join('\n')}\n\n` +
        `Areas for Improvement:\n${data.improvements.map((i: any) => `- ${i}`).join('\n')}`,
    };

    console.log('Transformed feedback:', transformedFeedback);
    return NextResponse.json(transformedFeedback);

  } catch (error) {
    console.error('Error in feedback GET route:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}


// Validate environment variables
if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables');
}

// Initialize the Groq AI instance
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    // Parse the incoming request body
    const body = await req.json();
    const { interview_id } = body;

    // Validate if interview_id is provided
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

    // Handle if the interview was not found
    if (interviewError || !interviewData) {
      throw new Error(interviewError?.message || 'Interview not found');
    }

    // Generate feedback using Groq AI based on the interview conversation
    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'),
      schema: GeneratedFeedbackSchema,
      prompt: `Analyze this interview conversation and provide detailed feedback. 
        Interview transcript: ${interviewData.conversation}

        Provide an analysis that includes:
        1. Technical competency evaluation (score between 0-1)
        2. Communication skills assessment (score between 0-1)
        3. Confidence level evaluation (score between 0-1)
        4. Overall performance score (score between 0-1)
        5. Key strengths (minimum 2 points)
        6. Areas for improvement (minimum 2 points)

        Focus on:
        - Technical accuracy and depth of knowledge
        - Clarity and effectiveness of communication
        - Confidence and professional demeanor
        - Specific examples from the conversation
        
        Return the analysis in a structured format that matches the schema.`,
    });

    // Prepare the feedback data using the response from Groq
    const feedbackData = SaveFeedbackSchema.parse({
      interview_id,
      technical_score: object.technical_score,
      communication_score: object.communication_score,
      confidence_score: object.confidence_score,
      overall_score: object.overall_score,
      strengths: object.strengths,
      improvements: object.improvements,
    });

    // Insert the feedback data into the 'feedback' table in the database
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    // Return the success response with the saved feedback data
    return NextResponse.json(
      {
        message: 'Feedback saved successfully',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving feedback:', error);

    // Handle validation errors with Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors.map((e) => e.message) },
        { status: 422 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      { error: 'Failed to save feedback', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

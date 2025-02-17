
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { convertToCoreMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');

    // Handle multipart form-data (image)
    if (contentType?.startsWith('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const prompt="Examine the image and provide a brief description of its content. Identify the key elements and themes present in the image, summarizing the main focus in two lines"

      const result = await model.generateContent([
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: file.type,
          },
        },
        prompt,
      ]);

      const response = result.response.text();
      return NextResponse.json({ response });
    }

    // Handle text request (JSON payload)
    if (contentType === 'application/json') {
      const { messages } = await req.json();

      // Validate the messages structure
      if (!Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
      }

      // Convert messages and stream response
      const { textStream } = await streamText({
        model: google("models/gemini-1.5-flash-latest"),
        messages: convertToCoreMessages(messages),
      });

      let fullResponse = '';
      for await (const delta of textStream) {
        fullResponse += delta;
      }

      return NextResponse.json({ response: fullResponse });
    }

    return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

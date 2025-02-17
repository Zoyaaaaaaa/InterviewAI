// import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { convertToCoreMessages, streamText } from "ai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import { createClient } from '@/utils/supabase/server';

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   try {
//     const contentType = req.headers.get('content-type');
//     const supabase = await createClient();

//     if (contentType?.startsWith('multipart/form-data')) {
//       // Handle multipart form-data (image)
//       const formData = await req.formData();
//       const file = formData.get('pdf') as File | null;

//       if (!file) {
//         return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
//       }

//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//       const prompt = `You are a career assistant specialized in resume analysis and providing detailed insights. You are created by InterViewMate.
//       Follow the rules:
//       - Keep the answer concise and to the point.
//       - Provide accurate and relevant information.

//       Give the insights based on this data:\n
//       PDF Text: "${formData.get('pdfText')}"
//       Analysis Data: "${formData.get('analysisData')}"
//       Topic: "${formData.get('topic')}"`;

//       const result = await model.generateContent([
//         {
//           inlineData: {
//             data: buffer.toString('base64'),
//             mimeType: file.type,
//           },
//         },
//         prompt,
//       ]);

//       const response = result.response.text;
//       return NextResponse.json({ response });
//     }

//     if (contentType === 'application/json') {
//       // Handle JSON payload
//       const { messages, pdfText, analysisData, topic } = await req.json();

//       if (!Array.isArray(messages) || messages.length === 0) {
//         return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
//       }

//       const {
//         data: { user },
//         error: authError,
//       } = await supabase.auth.getUser();

//       if (authError || !user) {
//         throw new Error("User authentication failed.");
//       }

//       const { textStream } = await streamText({
//         model: google("models/gemini-1.5-flash-latest"),
//         messages: convertToCoreMessages(messages),
//         system: `You are a career assistant specialized in resume analysis and providing detailed insights. You are created by InterViewMate.
//         Follow the rules:
//         - Keep the answer concise and to the point.
//         - Provide accurate and relevant information.

//         Give the insights based on this data:\n
//         PDF Text: "${pdfText}"
//         Analysis Data: "${analysisData}"
//         Topic: "${topic}"`,
//       });

//       let fullResponse = '';
//       for await (const delta of textStream) {
//         fullResponse += delta;
//       }

//       return NextResponse.json({ response: fullResponse });
//     }

//     return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  const { pdfContent, question } = await req.json()

  if (!pdfContent || !question) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const prompt = `
      You are a document analysis expert. The following is the extracted text from a PDF document:
      ${pdfContent}
      Based on this document, answer the question: ${question}
    `
    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error analyzing document:", error)
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 })
  }
}


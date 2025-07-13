// // import { NextResponse } from 'next/server';
// // import { GoogleGenerativeAI} from '@google/generative-ai';
// // import { writeFile } from 'fs/promises';
// // import { join } from 'path';
// // import * as os from 'os';
// // import { streamText } from 'ai';
// // import { createOpenAI as createGroq } from '@ai-sdk/openai';
// // import { GoogleAIFileManager } from "@google/generative-ai/server";

// // // Initialize Groq client
// // const groq = createGroq({
// //   baseURL: 'https://api.groq.com/openai/v1',
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // // Initialize Gemini client
// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// // export const maxDuration = 30;

// // const systemPrompt = `You are a professional and engaging interview bot.

// // Tone: Warm, professional, and approachable.
// // Flow:

// // Start: "Hello! Thank you for joining us. Could you introduce yourself briefly?"
// // Tailor questions based on responses (e.g., "You mentioned {experience}; could you elaborate?").
// // Encourage details ("That’s interesting! How did you approach it?").
// // Clarify as needed ("Can you expand on that?").
// // End after 6 questions: "Thank you for sharing! Any final thoughts?"
// // Focus: Be concise, engaging, and adaptable.`;

// // export async function POST(request) {
// //   try {
// //     // Parse the FormData from the request
// //     const formData = await request.formData();
// //     const pdfFile = formData.get('pdf');

// //     if (!pdfFile) {
// //       return NextResponse.json({ error: 'No PDF file uploaded' }, { status: 400 });
// //     }

// //     // Save the file temporarily
// //     const tempDir = os.tmpdir();
// //     const tempFilePath = join(tempDir, pdfFile.name || 'resume.pdf');
// //     const buffer = Buffer.from(await pdfFile.arrayBuffer());
// //     await writeFile(tempFilePath, buffer);

// //     // Upload the file to Gemini
// //     const uploadResult = await fileManager.uploadFile(tempFilePath, {
// //       mimeType: 'application/pdf',
// //       displayName: pdfFile.name || 'resume.pdf',
// //     });

// //     // Extract resume data using Gemini
// //     const prompt = `
// //       Extract the following details from the resume:
// //       - Name
// //       - Skills
// //       - Work Experience (company, role, duration)
// //       - Education
// //       - Projects (if any)
// //       Return the data in JSON format.
// //     `;

// //     const geminiResult = await genAI
// //       .getGenerativeModel({ model: 'models/gemini-1.5-flash' })
// //       .generateContent([
// //         {
// //           fileData: {
// //             fileUri: uploadResult.file.uri,
// //             mimeType: uploadResult.file.mimeType,
// //           },
// //         },
// //         prompt,
// //       ]);

// //     const resumeData = JSON.parse(geminiResult.response.text());

// //     // Clean up the temporary file
// //     fs.unlinkSync(tempFilePath);

// //     // Generate interview questions using Groq
// //     const groqResult = await streamText({
// //       model: groq('llama-3.3-70b-versatile'),
// //       system: systemPrompt,
// //       messages: [
// //         {
// //           role: 'user',
// //           content: `Here is the candidate's resume data: ${JSON.stringify(resumeData)}. Generate interview questions.`,
// //         },
// //       ],
// //     });

// //     const questions = await groqResult.text();

// //     // Return the results
// //     return NextResponse.json({
// //       resumeSummary: resumeData,
// //       interviewQuestions: questions.split('\n').filter((q) => q.trim()),
// //     });
// //   } catch (error) {
// //     console.error('Error processing request:', error);
// //     return NextResponse.json(
// //       { error: 'Failed to process request' },
// //       { status: 500 }
// //     );
// //   }
// // }

// import { NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { writeFile, unlink } from 'fs/promises'; // Import unlink directly
// import { join } from 'path';
// import * as os from 'os';
// import { streamText } from 'ai';
// import { createOpenAI as createGroq } from '@ai-sdk/openai';
// import { GoogleAIFileManager } from "@google/generative-ai/server";

// // Initialize clients
// const groq = createGroq({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY,
// });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

// export const maxDuration = 30;

// const systemPrompt = `You are a professional interview bot...`; // keep your existing prompt

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
// export async function POST(request) {
//   const contentType = request.headers.get('content-type');
//   if (!contentType || !contentType.includes('multipart/form-data')) {
//     return NextResponse.json(
//       { error: 'Invalid content type. Expected multipart/form-data' },
//       { status: 400 }
//     );
//   }

//   let tempFilePath = null;

//   try {
//     const formData = await request.formData();
//     const pdfFile = formData.get('pdf');

//     if (!pdfFile) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     if (typeof pdfFile === 'string' || !(pdfFile instanceof Blob)) {
//       return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
//     }

//     if (pdfFile.type !== 'application/pdf') {
//       return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
//     }

//     const tempDir = os.tmpdir();
//     tempFilePath = join(tempDir, `resume_${Date.now()}.pdf`);
//     const buffer = Buffer.from(await pdfFile.arrayBuffer());
//     await writeFile(tempFilePath, buffer);

//     // Upload to Gemini
//     const uploadResult = await fileManager.uploadFile(tempFilePath, {
//       mimeType: 'application/pdf',
//       displayName: pdfFile.name || 'resume.pdf',
//     });

//     // Process with Gemini
//     const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
//     const result = await model.generateContent([
//       {
//         fileData: {
//           fileUri: uploadResult.file.uri,
//           mimeType: uploadResult.file.mimeType,
//         },
//       },
//       "Extract resume details in JSON format including name, skills, experience, education, and projects. Return only valid JSON without any markdown formatting or additional text.",
//     ]);

//     // Parse response
//     let resumeData;
//     try {
//       const responseText = result.response.text();
//       const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
//       resumeData = JSON.parse(cleanJson);
//     } catch (parseError) {
//       console.error('Error parsing Gemini response:', parseError);
//       throw new Error('Failed to parse resume data from PDF');
//     }

//     // Generate questions with Groq
//     const groqResult = await streamText({
//       model: groq('llama3-70b-8192'),
//       system: systemPrompt,
//       messages: [
//         {
//           role: 'user',
//           content: `Candidate resume: ${JSON.stringify(resumeData)}. Generate interview questions.`,
//         },
//       ],
//     });

//     let questionsText = '';
//     for await (const chunk of groqResult.textStream) {
//       questionsText += chunk;
//     }

//     const questions = questionsText
//       .split('\n')
//       .filter(q => q.trim())
//       .map(q => q.replace(/^\d+\.\s*/, ''));
//          console.log(resumeData)
//     return NextResponse.json({
//       resumeSummary: resumeData,
//       interviewQuestions: questions,
//     });
 

//   } catch (error) {
//     console.error('Error processing request:', error);
//     return NextResponse.json(
//       {
//         error: 'Internal server error',
//         details: error.message,
//         stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
//       },
//       { status: 500 }
//     );

//   } finally {
//     // Ensure file is deleted if it was created
//     if (tempFilePath) {
//       try {
//         await unlink(tempFilePath);
//       } catch (cleanupError) {
//         console.error('Error cleaning up temp file:', cleanupError);
//       }
//     }
//   }
// }
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { GoogleAIFileManager } from "@google/generative-ai/server";

// Initialize clients
const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

export const maxDuration = 30;

const systemPrompt = `You are a professional interview bot designed to conduct technical interviews. 
Ask relevant questions based on the candidate's resume, focusing on their skills and experience. 
Keep questions concise and technical.`;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  console.log('Starting PDF processing request');
  const contentType = request.headers.get('content-type');
  if (!contentType || !contentType.includes('multipart/form-data')) {
    console.error('Invalid content type:', contentType);
    return NextResponse.json(
      { error: 'Invalid content type. Expected multipart/form-data' },
      { status: 400 }
    );
  }

  let tempFilePath = null;

  try {
    // Parse form data
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (typeof pdfFile === 'string' || !(pdfFile instanceof Blob)) {
      console.error('Invalid file format:', typeof pdfFile);
      return NextResponse.json({ error: 'Invalid file format' }, { status: 400 });
    }

    if (pdfFile.type !== 'application/pdf') {
      console.error('Invalid file type:', pdfFile.type);
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }

    // Create temp file
    const tempDir = os.tmpdir();
    tempFilePath = join(tempDir, `resume_${Date.now()}.pdf`);
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(tempFilePath, buffer);
    console.log('Temporary file created:', tempFilePath);

    // Upload to Gemini
    console.log('Uploading to Gemini...');
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: 'application/pdf',
      displayName: pdfFile.name || 'resume.pdf',
    });

    // Process with Gemini
    console.log('Extracting resume data with Gemini...');
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
      "Extract resume details in JSON format including: name, skills (array), experience (array with company, role, duration), education (array), projects (array with name, description). Return ONLY valid JSON without any markdown formatting or additional text.",
    ]);

    // Parse response
    let resumeData;
    try {
      const responseText = result.response.text();
      console.log('Raw Gemini response:', responseText);
      
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      resumeData = JSON.parse(cleanJson);
      console.log('Parsed resume data:', JSON.stringify(resumeData, null, 2));
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse resume data from PDF');
    }

    // Generate questions with Groq
    console.log('Generating interview questions with Groq...');
    const groqResult = await streamText({
      model: groq('llama3-70b-8192'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Candidate resume: ${JSON.stringify(resumeData)}. Generate 5-7 technical interview questions relevant to their experience.`,
        },
      ],
    });

    // Collect streamed response
    let questionsText = '';
    for await (const chunk of groqResult.textStream) {
      questionsText += chunk;
    }
    console.log('Raw Groq response:', questionsText);

    // Format questions
    const questions = questionsText
      .split('\n')
      .filter(q => q.trim())
      .map(q => q.replace(/^\d+\.\s*/, '').trim());
    
    console.log('Formatted questions:', questions);

    return NextResponse.json({
      success: true,
      resumeSummary: resumeData,
      interviewQuestions: questions,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  } finally {
    // Clean up temp file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log('Temporary file deleted:', tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  }
}
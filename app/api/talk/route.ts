// // import { readFileSync } from "fs";
// // // import path from "path";
// // // import { google } from "@ai-sdk/google";
// // // import { generateObject } from "ai";
// // // import { z } from "zod";

// // // const schema = z.object({
// // //   name: z.string().describe("Name of the candidate"),
// // //   cgpa: z.number().min(1).max(10).describe("The CGPA between 1-10"),
// // //   workExperience: z.string().describe("Worked in a company"),
// // //   projects: z.string().describe("Total projects with titles"),
// // // });

// // // export const extractDataFromResume = async (resumePath: string) => {
// // //   const { object } = await generateObject({
// // //     model: google("gemini-1.5-flash"),
// // //     system: `You will receive a resume. Please extract the data from it.`,
// // //     schema,
// // //     messages: [
// // //       {
// // //         role: "user",
// // //         content: [
// // //           {
// // //             type: "file",
// // //             data: readFileSync(resumePath),
// // //             mimeType: "application/pdf",
// // //           },
// // //         ],
// // //       },
// // //     ],
// // //   });

// // //   return object;
// // // };

// // // // Example Usage:
// // // const result = await extractDataFromResume(
// // //   path.join(process.cwd(), "interviewmate/app/data/ZOYA_HASSAN_RES.pdf")
// // // );

// // // console.dir(result,{depth:null});


// // import { google } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // const result = await generateText({
// //   model: google('gemini-1.5-flash'),
// //   messages: [
// //     {
// //       role: 'user',
// //       content: [
// //         { type: 'text', text: 'What is the file about?' },
// //         {
// //           type: 'file',
// //           mimeType: 'application/pdf',
// //           data: fs.readFileSync('./data/data.pdf'),
// //         },
// //       ],
// //     },
// //   ],
// // });

// // import { google } from "@ai-sdk/google";
// // import { streamText } from 'ai';

// // export const maxDuration = 30;

// // export async function POST(req: Request) {
// //   const { messages } = await req.json();

// //   const result = streamText({
// //     model:google("gemini-1.5-flash"),
// //     messages,
// //   });

// //   return (await result).toDataStreamResponse();
// // }

// /*
//  * Install the Generative AI SDK
//  *
//  * $ npm install @google/generative-ai
//  */

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { GoogleAIFileManager } from "@google/generative-ai/server";

// import os from "os";
// import { writeFile } from "fs/promises";
// import { join } from "path";
// import { NextResponse } from "next/server";

// const apiKey = process.env.GEMINI_API_KEY!;
// const genAI = new GoogleGenerativeAI(apiKey);
// const fileManager = new GoogleAIFileManager(apiKey);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro-002",
// });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const file = formData.get("file") as File;
//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//   }

//   /**
//    * The file.arrayBuffer() method reads the uploaded file as an ArrayBuffer.
//    * Since it's asynchronous, the await keyword is used.
//    * Buffer.from() converts this ArrayBuffer into a Node.js Buffer,
//    *  which is used to handle binary data in Node.js.
//    */
//   const buffer = Buffer.from(await file.arrayBuffer());
//   // get the operating system's temporary directory path.
//   const tempDir = os.tmpdir();
//   /**
//    * combines the temporary directory path (tempDir) and the name of the uploaded file (file.name)
//    * to form the full path where the file will be stored temporarily.
//    */
//   const tempFilePath = join(tempDir, file.name);
//   await writeFile(tempFilePath, buffer);

//   // now upload the image to google gemini model
//   const uploadResponse = await fileManager.uploadFile(tempFilePath, {
//     mimeType: file.type, // i.e jpg/jpeg
//     displayName: file.name,
//   });
//   // console.log(
//   //   `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.name}`
//   // );

//   // Generate content using text and the URI reference for the uploaded file.
//   const chatSession = model.startChat({
//     generationConfig,
//     // safetySettings: Adjust safety settings
//     // See https://ai.google.dev/gemini-api/docs/safety-settings
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             fileData: {
//               mimeType: uploadResponse.file.mimeType,
//               fileUri: uploadResponse.file.uri,
//             },
//           },
//           { text: "Extract tabular data form image in JSON format" },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           {
//             text: '```json\n[\n  {\n    "Object": "potato #1",\n    "Salt Solution (g)": "0g/50ml",\n    "mass #1": "3g",\n    "mass #2": "11g",\n    "change": "8g"\n  },\n  {\n    "Object": "potato #2",\n    "Salt Solution (g)": "0.5g/50ml",\n    "mass #1": "3g",\n    "mass #2": "6g",\n    "change": "3g"\n  },\n  {\n    "Object": "potato #3",\n    "Salt Solution (g)": "2.5g/50ml",\n    "mass #1": "3g",\n    "mass #2": "5g",\n    "change": "2g"\n  }\n]\n```',
//           },
//         ],
//       },
//     ],
//   });

//   const result = await chatSession.sendMessage(
//     "Extract tabular data form image in JSON format"
//   );
//   // console.log(result.response.text());
//   const cleanResponse = result.response.text().replace(/```json|```/g, "");
//   console.log(cleanResponse);

//   return new NextResponse(cleanResponse);
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-002",
});

export async function POST(request: Request) {
  const { messages } = await request.json();

  try {
    // Start a chat session with the provided history
    const chatSession = model.startChat({
      history: messages.map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    // Send the latest user message to the model
    const result = await chatSession.sendMessage(messages[messages.length - 1].content);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    );
  }
}
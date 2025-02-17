// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { convertToCoreMessages, streamText } from "ai";
// import { createGoogleGenerativeAI } from "@ai-sdk/google";
// import {z} from "zod";
// import  {generateObject} from "ai"


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
//     const contentType = req.headers.get("content-type");

//     // Handle multipart form-data (image)
//     if (contentType?.startsWith("multipart/form-data")) {
//       const formData = await req.formData();
//       const file = formData.get("image") as File | null;

//       if (!file) {
//         return NextResponse.json(
//           { error: "No image file uploaded" },
//           { status: 400 }
//         );
//       }

//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
//       const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-flash",
//       });

//       const prompt = `Analyze the resume and provide insights like 
//       -strengths,
//       -weaknesses,
//       -overall score,
//       -areas for improvement`;

//       const result = await model.generateContent([
//         {
//           inlineData: {
//             data: buffer.toString("base64"),
//             mimeType: file.type,
//           },
//         },
//         prompt,
//       ]);

//       // Safeguard: Handle missing fields
//       const responseContent =
//         result?.response?.text() || "No response generated.";
//     //   const usageMetadata = result|| {};
//     //   usageMetadata.candidatesTokenCount = usageMetadata.candidatesTokenCount || 0;

//       return NextResponse.json({
//         response: responseContent,
//         // metadata: usageMetadata,
//       });
//     }

//     // Handle text request (JSON payload)
//     if (contentType === "application/json") {
//       const { messages } = await req.json();

//       if (!Array.isArray(messages) || messages.length === 0) {
//         return NextResponse.json(
//           { error: "Invalid messages format" },
//           { status: 400 }
//         );
//       }

//       const { textStream } = await streamText({
//         model: google("models/gemini-1.5-flash-latest"),
//         messages: convertToCoreMessages(messages),
//       });

//       let fullResponse = "";
//       for await (const delta of textStream) {
//         fullResponse += delta;
//       }

//       return NextResponse.json({ response: fullResponse });
//     }

//     return NextResponse.json(
//       { error: "Unsupported content type" },
//       { status: 400 }
//     );
//   } catch (error: any) {
//     console.error("Error:", error.message, error.value);
//     return NextResponse.json(
//       { error: "Error processing request", details: error.message },
//       { status: 500 }
//     );
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const image = data.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const imageParts = await fileToGenerativePart(image);
    const result = await model.generateContent([
      "Identify this plant and provide its name and important information.",
      imageParts,
    ]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Error identifying plant:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Error identifying plant: ${error.message}` },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred while identifying the plant" },
        { status: 500 }
      );
    }
  }
}

async function fileToGenerativePart(file: File): Promise<{
  inlineData: { data: string; mimeType: string };
}> {
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  return {
    inlineData: {
      data: base64String,
      mimeType: file.type,
    },
  };
}
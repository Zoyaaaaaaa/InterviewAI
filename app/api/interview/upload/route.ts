import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';
import { GoogleAIFileManager } from "@google/generative-ai/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf') as File;

    if (!pdfFile) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Create temp file
    const tempDir = os.tmpdir();
    const tempFilePath = join(tempDir, `resume_${Date.now()}.pdf`);
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    await writeFile(tempFilePath, buffer);

    try {
      // Upload to Gemini
      const uploadResult = await fileManager.uploadFile(tempFilePath, {
        mimeType: 'application/pdf',
        displayName: pdfFile.name || 'resume.pdf',
      });

      // Process with Gemini
      const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
      const result = await model.generateContent([
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
        "Extract resume details in JSON format including name, skills, experience, education, and projects. Return only valid JSON without any markdown formatting or additional text.",
      ]);

      // Parse response
      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const resumeData = JSON.parse(cleanJson);

      return NextResponse.json({
        success: true,
        resumeSummary: resumeData
      });

    } finally {
      // Clean up temp file
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
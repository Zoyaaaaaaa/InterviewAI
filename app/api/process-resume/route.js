import { GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import * as os from 'os';

export const maxDuration = 30;

export async function POST(request) {
  let tempFilePath = null;
  
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('pdf');

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'No PDF file uploaded' },
        { status: 400 }
      );
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    tempFilePath = join(tempDir, `resume_${Date.now()}_${pdfFile.name || 'document.pdf'}`);

    // Write the file to the temporary directory
    const bytes = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Upload the file
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "application/pdf",
      displayName: pdfFile.name || 'resume',
    });

    // Generate detailed resume analysis
    const result = await model.generateContent([
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
      `Extract comprehensive information from this resume and format it as structured data:

PERSONAL INFORMATION:
- Name:
- Contact Information:
- Location:

PROFESSIONAL SUMMARY:
- Brief overview of experience and expertise

SKILLS:
- Technical Skills:
- Soft Skills:
- Programming Languages/Tools:

WORK EXPERIENCE:
- For each role, include: Company, Position, Duration, Key Responsibilities, Major Achievements

EDUCATION:
- Degree(s), Institution(s), Year(s), Relevant Coursework

PROJECTS:
- Project names, technologies used, brief description, your role

CERTIFICATIONS:
- List any relevant certifications

ADDITIONAL INFORMATION:
- Languages, Volunteer work, Awards, Publications, etc.

Please be thorough and extract as much relevant detail as possible. This will be used to conduct a personalized interview.`,
    ]);

    const resumeData = result.response.text();
    console.log('Resume analysis:', resumeData);

    return NextResponse.json({
      success: true,
      resumeData: resumeData,
      message: 'Resume processed successfully'
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume: ' + error.message },
      { status: 500 }
    );
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log('Temporary file cleaned up');
      } catch (cleanupError) {
        console.error('Error cleaning temporary file:', cleanupError);
      }
    }
  }
}

// app/api/interview/process-job-description/route.js
import { NextResponse } from 'next/server'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { DocxLoader } from 'langchain/document_loaders/fs/docx'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'

export const maxDuration = 30
export const dynamic = 'force-dynamic'

async function extractTextFromFile(file) {
  console.log("EXTRACTING TERMS FROM JD")
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileType = file.type

  try {
    let loader
    
    if (fileType === 'application/pdf') {
      loader = new PDFLoader(new Blob([buffer], { type: fileType }))
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      loader = new DocxLoader(new Blob([buffer], { type: fileType }))
    } else {
      loader = new TextLoader(new Blob([buffer], { type: fileType }))
    }

    const docs = await loader.load()
    return docs.map(doc => doc.pageContent).join('\n\n')
  } catch (error) {
    console.error('Error extracting text:', error)
    throw new Error('Failed to extract text from file')
  }
}

function extractKeySections(text) {
  const sections = {}
  const lines = text.split('\n')
  let currentSection = ''

  const sectionHeaders = [
    'job title', 'position', 'role',
    'responsibilities', 'key responsibilities', 'what you will do',
    'requirements', 'qualifications', 'skills', 'what you bring',
    'nice to have', 'preferred qualifications',
    'about the role', 'job purpose', 'key competencies',
    'experience', 'education', 'location'
  ]

  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim()
    
    const matchedHeader = sectionHeaders.find(header => 
      lowerLine.includes(header) && lowerLine.length < 50
    )
    
    if (matchedHeader) {
      currentSection = matchedHeader
      sections[currentSection] = ''
    } else if (currentSection && line.trim()) {
      sections[currentSection] += line + '\n'
    }
  }
   console.log(sections)
  return sections
}

function formatProcessedJD(sections) {
  let processedJD = ''
  
  const prioritySections = [
    'job title', 'position', 'role',
    'responsibilities', 'key responsibilities',
    'requirements', 'qualifications', 'skills'
  ]

  for (const header of prioritySections) {
    if (sections[header]) {
      processedJD += `[${header.toUpperCase()}]:\n${sections[header].trim()}\n\n`
      delete sections[header]
    }
  }

  for (const [header, content] of Object.entries(sections)) {
    processedJD += `[${header.toUpperCase()}]:\n${content.trim()}\n\n`
  }
  console.log(processedJD)
  return processedJD
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const url = formData.get('url')?.toString()
    const rawText = formData.get('text')?.toString()

    if (!file && !url && !rawText) {
      return NextResponse.json(
        { success: false, error: 'No input provided' },
        { status: 400 }
      )
    }

    let extractedText = ''

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds 5MB limit' },
          { status: 400 }
        )
      }

      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ]
      
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid file type. Please upload PDF, DOCX, or TXT' },
          { status: 400 }
        )
      }

      extractedText = await extractTextFromFile(file)
    } else if (url) {
      try {
        const loader = new CheerioWebBaseLoader(url)
        const docs = await loader.load()
        extractedText = docs.map(doc => doc.pageContent).join('\n\n')
      } catch (error) {
        console.error('Error loading URL:', error)
        return NextResponse.json(
          { success: false, error: 'Failed to extract content from URL' },
          { status: 400 }
        )
      }
    } else if (rawText) {
      extractedText = rawText
    }

    const sections = extractKeySections(extractedText)
    const processedJD = Object.keys(sections).length > 0 
      ? formatProcessedJD(sections)
      : `JOB DESCRIPTION CONTENT:\n${extractedText.substring(0, 5000)}`

    return NextResponse.json({
      success: true,
      content: processedJD,
      sections: Object.keys(sections),
      characterCount: processedJD.length
    })

  } catch (error) {
    console.error('Error processing job description:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process job description',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
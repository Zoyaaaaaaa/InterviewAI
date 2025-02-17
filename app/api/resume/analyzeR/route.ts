import { NextResponse } from 'next/server'
import pdf from 'pdf-parse'

export async function POST(req: any) {
  try {
    console.log("file reached")
    const formData = await req.formData()
    const file = formData.get('pdf')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { text } = await pdf(buffer)

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error extracting text:', error)
    return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 })
  }
}
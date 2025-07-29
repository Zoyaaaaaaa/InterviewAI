export interface ProcessedJobDescription {
  content: string
  jobTitle?: string
  company?: string
  requirements?: string[]
  responsibilities?: string[]
}

export function processJobDescriptionText(text: string): ProcessedJobDescription {
  const cleanText = text.trim()

  return {
    content: cleanText,
    jobTitle: extractJobTitle(cleanText),
    company: extractCompany(cleanText),
    requirements: extractRequirements(cleanText),
    responsibilities: extractResponsibilities(cleanText),
  }
}

function extractJobTitle(text: string): string {
  // Look for job title patterns at the beginning or in headers
  const titlePatterns = [
    /^(.+?)(?:\n|at\s|@\s|\s-\s)/i, // First line before "at" or "-"
    /job title[:\-\s]+(.+?)(?:\n|$)/gi,
    /position[:\-\s]+(.+?)(?:\n|$)/gi,
    /role[:\-\s]+(.+?)(?:\n|$)/gi,
    /hiring for[:\-\s]+(.+?)(?:\n|$)/gi,
  ]

  for (const pattern of titlePatterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      const title = match[1].trim()
      if (title.length > 2 && title.length < 100 && !title.toLowerCase().includes("company")) {
        return title
      }
    }
  }

  return "Position"
}

function extractCompany(text: string): string {
  // Look for company name patterns
  const companyPatterns = [
    /at\s+([A-Z][a-zA-Z\s&.,]+?)(?:\n|,|\s-\s|is\s)/g,
    /company[:\-\s]+(.+?)(?:\n|$)/gi,
    /organization[:\-\s]+(.+?)(?:\n|$)/gi,
    /employer[:\-\s]+(.+?)(?:\n|$)/gi,
    /about\s+([A-Z][a-zA-Z\s&.,]+?)(?:\n|:)/g,
  ]

  for (const pattern of companyPatterns) {
    const matches = Array.from(text.matchAll(pattern))
    for (const match of matches) {
      if (match[1]) {
        const company = match[1].trim().replace(/[.,;:]$/, "")
        if (company.length > 1 && company.length < 50) {
          return company
        }
      }
    }
  }

  return "Company"
}

function extractRequirements(text: string): string[] {
  const requirements: string[] = []

  // Look for requirements sections
  const reqSections = [
    /(?:requirements?|qualifications?|must have|you should have|we're looking for)[:\-\s]+(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/ ,
    /(?:required skills?|technical requirements?|minimum qualifications?)[:\-\s]+(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/ ,
  ]

  reqSections.forEach((pattern) => {
    const matches = Array.from(text.matchAll(pattern))
    matches.forEach((match) => {
      if (match[1]) {
        const reqText = match[1].trim()
        // Split by bullet points, dashes, or new lines
        const items = reqText
          .split(/[•\-*]\s*|\n\s*(?=\w)/)
          .map((item) => item.trim())
          .filter((item) => item.length > 10 && item.length < 200)
          .slice(0, 8)

        requirements.push(...items)
      }
    })
  })

  return [...new Set(requirements)].slice(0, 8)
}

function extractResponsibilities(text: string): string[] {
  const responsibilities: string[] = []

  // Look for responsibilities sections
  const respSections = [
    /(?:responsibilities|duties|you will|what you'll do|role includes)[:\-\s]+(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/ ,
    /(?:key responsibilities|main duties|primary responsibilities)[:\-\s]+(.*?)(?=\n\n|\n[A-Z][a-z]+:|$)/ ,
  ]

  respSections.forEach((pattern) => {
    const matches = Array.from(text.matchAll(pattern))
    matches.forEach((match) => {
      if (match[1]) {
        const respText = match[1].trim()
        // Split by bullet points, dashes, or new lines
        const items = respText
          .split(/[•\-*]\s*|\n\s*(?=\w)/)
          .map((item) => item.trim())
          .filter((item) => item.length > 10 && item.length < 200)
          .slice(0, 8)

        responsibilities.push(...items)
      }
    })
  })

  return [...new Set(responsibilities)].slice(0, 8)
}

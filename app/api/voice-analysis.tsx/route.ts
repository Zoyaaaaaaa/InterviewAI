import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@deepgram/sdk"

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: "Deepgram API key not configured" }, { status: 500 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())

    // Initialize Deepgram client
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY)

    // Transcribe and analyze audio
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-3",
      sentiment: true,
      emotion: true,
      language: "en",
      punctuate: true,
      paragraphs: true,
      utterances: true,
      diarize: true,
      smart_format: true,
    })

    if (error) {
      console.error("Deepgram error:", error)
      return NextResponse.json({ error: "Failed to analyze audio" }, { status: 500 })
    }

    // Extract voice analysis data
    const analysis = {
      transcript: result.results?.channels[0]?.alternatives[0]?.transcript || "",
      confidence: result.results?.channels[0]?.alternatives[0]?.confidence || 0,

      // Sentiment analysis
      sentiment: result.results?.channels[0]?.alternatives[0]?.sentiment_segments || [],

      // Utterance analysis for speaking patterns
      utterances:
        result.results?.utterances?.map((utterance) => ({
          speaker: utterance.speaker,
          start: utterance.start,
          end: utterance.end,
          confidence: utterance.confidence,
          transcript: utterance.transcript,
          words: utterance.words?.length || 0,
        })) || [],

      // Overall voice metrics
      voiceMetrics: {
        totalDuration: result.metadata?.duration || 0,
        speakingTime:
          result.results?.utterances?.reduce((total, utterance) => total + (utterance.end - utterance.start), 0) || 0,
        averageConfidence: result.results?.channels[0]?.alternatives[0]?.confidence || 0,
        wordCount: result.results?.channels[0]?.alternatives[0]?.words?.length || 0,
        speakingRate: 0, // Will calculate below
      },

      // Tonality insights
      tonalityInsights: {
        overallSentiment: "neutral",
        emotionalRange: [],
        confidenceLevel: "medium",
        speechClarity: "good",
        recommendations: [],
      },
    }

    // Calculate speaking rate (words per minute)
    if (analysis.voiceMetrics.speakingTime > 0) {
      analysis.voiceMetrics.speakingRate = Math.round(
        (analysis.voiceMetrics.wordCount / analysis.voiceMetrics.speakingTime) * 60,
      )
    }

    // Analyze sentiment patterns
    if (analysis.sentiment.length > 0) {
      const sentiments = analysis.sentiment.map((seg) => seg.sentiment)
      const positiveCount = sentiments.filter((s) => s === "positive").length
      const negativeCount = sentiments.filter((s) => s === "negative").length
      const neutralCount = sentiments.filter((s) => s === "neutral").length

      if (positiveCount > negativeCount && positiveCount > neutralCount) {
        analysis.tonalityInsights.overallSentiment = "positive"
      } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
        analysis.tonalityInsights.overallSentiment = "negative"
      }
    }

    // Generate confidence level assessment
    if (analysis.voiceMetrics.averageConfidence > 0.8) {
      analysis.tonalityInsights.confidenceLevel = "high"
    } else if (analysis.voiceMetrics.averageConfidence > 0.6) {
      analysis.tonalityInsights.confidenceLevel = "medium"
    } else {
      analysis.tonalityInsights.confidenceLevel = "low"
    }

    // Generate recommendations based on analysis
    const recommendations = []

    if (analysis.voiceMetrics.speakingRate < 120) {
      recommendations.push("Consider speaking slightly faster to maintain engagement")
    } else if (analysis.voiceMetrics.speakingRate > 180) {
      recommendations.push("Try to slow down your speech for better clarity")
    }

    if (analysis.voiceMetrics.averageConfidence < 0.7) {
      recommendations.push("Work on speaking more clearly and distinctly")
    }

    if (analysis.tonalityInsights.overallSentiment === "negative") {
      recommendations.push("Try to maintain a more positive and enthusiastic tone")
    }

    analysis.tonalityInsights.recommendations = recommendations

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error("Voice analysis error:", error)
    return NextResponse.json({ error: "Internal server error during voice analysis" }, { status: 500 })
  }
}

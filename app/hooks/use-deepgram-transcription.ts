"use client"

import { useState, useRef, useCallback } from "react"

interface TranscriptionResult {
  transcript: string
  confidence: number
  sentiment?: any
  summary?: any
}

interface UseDeepgramTranscriptionReturn {
  isRecording: boolean
  transcript: string
  confidence: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  transcribeFile: (file: File) => Promise<TranscriptionResult | null>
  error: string | null
  isProcessing: boolean
}

export function useDeepgramTranscription(): UseDeepgramTranscriptionReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await transcribeAudio(audioBlob)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (err) {
      setError("Failed to start recording: " + (err as Error).message)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.webm")

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const result = await response.json()
      setTranscript(result.transcript)
      setConfidence(result.confidence)
    } catch (err) {
      setError("Transcription failed: " + (err as Error).message)
    } finally {
      setIsProcessing(false)
    }
  }

  const transcribeFile = useCallback(async (file: File): Promise<TranscriptionResult | null> => {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("File transcription failed")
      }

      const result = await response.json()
      return {
        transcript: result.transcript,
        confidence: result.confidence,
        sentiment: result.sentiment,
        summary: result.summary,
      }
    } catch (err) {
      setError("File transcription failed: " + (err as Error).message)
      return null
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    isRecording,
    transcript,
    confidence,
    startRecording,
    stopRecording,
    transcribeFile,
    error,
    isProcessing,
  }
}

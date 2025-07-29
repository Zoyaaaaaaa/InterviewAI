"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { useDeepgramTranscription } from "../app/hooks/use-deepgram-transcription"
import { Mic, MicOff, Upload, FileAudio, Brain, User, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: number
  confidence?: number
  sentiment?: any
}

export default function EnhancedInterview() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isProcessingResponse, setIsProcessingResponse] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isRecording,
    transcript,
    confidence,
    startRecording,
    stopRecording,
    transcribeFile,
    error: transcriptionError,
    isProcessing,
  } = useDeepgramTranscription()

  const [alert, setAlert] = useState<{
    show: boolean
    type: "success" | "error"
    title: string
    message: string
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  })

  const showAlert = useCallback((type: "success" | "error", title: string, message: string) => {
    setAlert({ show: true, type, title, message })
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 5000)
  }, [])

  // Handle completed transcription
  useEffect(() => {
    if (transcript && !isRecording && !isProcessing) {
      handleUserMessage(transcript, confidence)
    }
  }, [transcript, isRecording, isProcessing, confidence])

  // Handle transcription errors
  useEffect(() => {
    if (transcriptionError) {
      showAlert("error", "Transcription Error", transcriptionError)
    }
  }, [transcriptionError, showAlert])

  const handleUserMessage = async (content: string, messageConfidence?: number) => {
    if (!content.trim()) return

    const userMessage: Message = {
      role: "user",
      content,
      timestamp: Date.now(),
      confidence: messageConfidence,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsProcessingResponse(true)

    try {
      // Send to your existing chat API
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          conversation: [...messages, userMessage],
        }),
      })

      if (!response.ok) throw new Error("Chat API failed")

      const data = await response.json()
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Convert AI response to speech (your existing TTS logic)
      await handleTextToSpeech(aiMessage.content)
    } catch (error) {
      showAlert("error", "Chat Error", "Failed to get AI response")
    } finally {
      setIsProcessingResponse(false)
    }
  }

  const handleTextToSpeech = async (text: string) => {
    // Your existing TTS implementation
    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        await audio.play()
      }
    } catch (error) {
      console.error("TTS error:", error)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      showAlert("error", "Invalid File", "Please upload an audio file")
      return
    }

    const result = await transcribeFile(file)
    if (result) {
      showAlert("success", "File Transcribed", `Confidence: ${(result.confidence * 100).toFixed(1)}%`)
      handleUserMessage(result.transcript, result.confidence)
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return "text-green-400"
    if (conf >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />

      {alert.show && (
        <div className="fixed top-4 right-4 z-50 w-80">
          <Alert
            className={`${alert.type === "success" ? "border-green-500/50 bg-green-950/50" : "border-red-500/50 bg-red-950/50"}`}
          >
            {alert.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Interview Assistant
          </h1>
          <p className="text-gray-400">Powered by Deepgram transcription</p>
        </div>

        {/* Messages */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start recording or upload an audio file to begin the interview</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start gap-3 max-w-[80%]">
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4" />
                        </div>
                      )}

                      <Card
                        className={`${msg.role === "user" ? "bg-blue-600/20 border-blue-500/30" : "bg-gray-700/50 border-gray-600/50"}`}
                      >
                        <CardContent className="p-3">
                          <CardDescription className="text-gray-100 text-sm">{msg.content}</CardDescription>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            {msg.confidence && (
                              <span className={`${getConfidenceColor(msg.confidence)} font-medium`}>
                                {(msg.confidence * 100).toFixed(1)}% confidence
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {msg.role === "user" && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {isProcessingResponse && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4" />
                    </div>
                    <Card className="bg-gray-700/50 border-gray-600/50">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm text-gray-300">AI is thinking...</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recording Control */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">Voice Recording</h3>

                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={75} className="w-full" />
                    <p className="text-sm text-gray-400">Processing with Deepgram...</p>
                  </div>
                )}

                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`w-full ${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>

                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-red-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-sm">Recording...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">Audio File Upload</h3>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Audio File
                </Button>
                <p className="text-xs text-gray-400">Supports MP3, WAV, M4A, and other audio formats</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Transcript Preview */}
        {transcript && (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileAudio className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">Live Transcript</span>
                {confidence > 0 && (
                  <span className={`text-xs ${getConfidenceColor(confidence)}`}>{(confidence * 100).toFixed(1)}%</span>
                )}
              </div>
              <p className="text-gray-300 text-sm">{transcript}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

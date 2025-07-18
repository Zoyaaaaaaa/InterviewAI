"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import {
  Mic,
  MessageCircle,
  AudioWaveform,
  Play,
  Save,
  Sparkles,
  Video,
  VideoOff,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText,
  Check,
  User,
  Brain,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface InterviewMessage {
  role: string
  content: string
  timestamp: number
  id: string
}

interface ResumeData {
  fileName: string
  content: string
  fileSize: number
  uploadDate: number
}

const InterviewAI: React.FC = () => {
  const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false)
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false)
  const [selectedVoice] = useState<string>("aura-orpheus-en")
  const [showPopup, setShowPopup] = useState(false)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const recordRef = useRef<any | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true)
  const [transcript, setTranscript] = useState<string>("")
  const [fullTranscript, setFullTranscript] = useState<string>("")
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false)
  const [alertState, setAlertState] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
  })
  const [messages, setMessages] = useState<InterviewMessage[]>([])
  const [cameraError, setCameraError] = useState<string>("")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const router = useRouter()

  // Show alert helper - wrapped in useCallback to prevent unnecessary re-renders
  const showAlert = useCallback((type: "success" | "error", title: string, message: string) => {
    setAlertState({
      show: true,
      type,
      title,
      message,
    })

    setTimeout(() => {
      setAlertState((prev) => ({ ...prev, show: false }))
    }, 4000)
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        setSpeechRecognitionSupported(true)
      }
    }
  }, [])

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  const handleTextToVoice = useCallback(
    async (content: string): Promise<void> => {
      if (!content || content.trim() === "") {
        showAlert("error", "Error", "No text provided for speech generation")
        return
      }
      setIsInterviewerSpeaking(true)

      try {
        console.log("Generating speech for:", content.substring(0, 50) + "...")

        const response = await fetch("/api/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: content.trim(),
            voiceId: selectedVoice || "en-US-terrell",
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error Response:", errorText)

          let errorMessage = "Failed to generate speech"
          try {
            const errorData = JSON.parse(errorText)
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch {
            errorMessage = errorText || errorMessage
          }

          throw new Error(errorMessage)
        }

        const audioBlob = await response.blob()

        if (audioBlob.size === 0) {
          throw new Error("Received empty audio file")
        }

        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          // Clean up previous audio
          if (audioRef.current.src) {
            URL.revokeObjectURL(audioRef.current.src)
          }

          audioRef.current.src = audioUrl

          audioRef.current.onended = () => {
            URL.revokeObjectURL(audioUrl)
            setIsInterviewerSpeaking(false)
          }

          audioRef.current.onerror = (error) => {
            console.error("Audio playback error:", error)
            URL.revokeObjectURL(audioUrl)
            setIsInterviewerSpeaking(false)
            showAlert("error", "Playback Error", "Could not play the audio response.")
          }

          await audioRef.current.play()
        }
      } catch (error) {
        console.error("TTS error:", error)
        setIsInterviewerSpeaking(false)

        // Convert error to string to avoid rendering Error objects
        const errorMessage = error instanceof Error ? error.message : String(error)
        showAlert("error", "Speech Error", errorMessage)
      }
    },
    [selectedVoice, showAlert],
  )

  const handleSubmit = useCallback(
    async (userInput: string) => {
      if (!userInput.trim()) return

      const userMessage: InterviewMessage = {
        role: "user",
        content: userInput,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(7),
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const formData = new FormData()
        formData.append("message", userInput)
        formData.append("conversation", JSON.stringify([...messages, userMessage]))
        if (resumeData) {
          formData.append("resume", resumeData.content)
        }

        const response = await fetch("/api/interview/chat", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Chat API call failed")

        const data = await response.json()

        const aiMessage: InterviewMessage = {
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(7),
        }

        setMessages((prev) => [...prev, aiMessage])
        await handleTextToVoice(aiMessage.content)
      } catch (error) {
        console.error("Chat API error:", error)
        showAlert("error", "Connection Error", "Failed to connect to chat service.")

        const fallbackMessage: InterviewMessage = {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting right now. Could you please try again?",
          timestamp: Date.now(),
          id: Math.random().toString(36).substring(7),
        }

        setMessages((prev) => [...prev, fallbackMessage])
        await handleTextToVoice(fallbackMessage.content)
      }
    },
    [handleTextToVoice, resumeData, messages, showAlert],
  )

  const handleSaveConversation = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      await saveConversation()
      setSaveSuccess(true)
      setTimeout(() => {
        router.push("/profile")
      }, 1500)
    } catch (error) {
      console.error("Failed to save conversation:", error)
      setIsSaving(false)
    }
  }

  const saveConversation = async () => {
    if (messages.length === 0) {
      showAlert("error", "No Content", "No interview content to save. Please start the interview first.")
      return
    }
    try {
      const response = await fetch("/api/save-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages,
          resumeData,
          timestamp: Date.now(),
          duration: Date.now() - (messages[0]?.timestamp || Date.now()),
        }),
      })
      if (!response.ok) {
        throw new Error("Save API call failed")
      }
      const data = await response.json()
      showAlert("success", "Success!", `Interview saved successfully! Session ID: ${data.sessionId}`)
    } catch (error) {
      console.error("Save error:", error)
      showAlert("error", "Save Failed", "Failed to save interview. Please try again.")
    }
  }

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.includes("pdf")) {
        showAlert("error", "Invalid File Type", "Please upload a PDF file.")
        return
      }

      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        showAlert("error", "File Too Large", "Please upload a file smaller than 5MB.")
        return
      }

      setIsUploading(true)
      try {
        const formData = new FormData()
        formData.append("pdf", file)
        const response = await fetch("/api/interview/upload", {
          method: "POST",
          body: formData,
        })
        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()

        const newResumeData: ResumeData = {
          fileName: file.name,
          content: JSON.stringify(data.resumeSummary),
          fileSize: file.size,
          uploadDate: Date.now(),
        }

        setResumeData(newResumeData)
        setShowPopup(false)
        setIsUploading(false)
        showAlert("success", "Upload Successful", "Resume processed successfully!")
      } catch (error) {
        setIsUploading(false)
        showAlert("error", "Upload Failed", "Failed to process the file. Please try again.")
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [showAlert],
  )

  useEffect(() => {
    if (resumeData && messages.length === 0) {
      const initialQuestion = async () => {
        try {
          const formData = new FormData()
          formData.append("resume", resumeData.content)
          // Add an empty conversation array to satisfy the API requirements
          formData.append("conversation", JSON.stringify([]))
          const response = await fetch("/api/interview/chat", {
            method: "POST",
            body: formData,
          })
          if (!response.ok) throw new Error("Initial question fetch failed")

          const data = await response.json()

          const aiMessage: InterviewMessage = {
            role: "assistant",
            content: data.response || "Welcome! Let's begin the interview.",
            timestamp: Date.now(),
            id: Math.random().toString(36).substring(7),
          }
          setMessages([aiMessage])
          await handleTextToVoice(aiMessage.content)
        } catch (error) {
          console.error("Failed to start interview:", error)
          // Add fallback message if the API call fails
          const fallbackMessage: InterviewMessage = {
            role: "assistant",
            content: "Welcome! Let's begin the interview. Please tell me about yourself.",
            timestamp: Date.now(),
            id: Math.random().toString(36).substring(7),
          }
          setMessages([fallbackMessage])
          await handleTextToVoice(fallbackMessage.content)
        }
      }
      initialQuestion()
    }
  }, [resumeData, handleTextToVoice])

  const stopCameraSharing = useCallback((): void => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
      })
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCameraSharing(false)
    setCameraError("")
  }, [stream])

  const handleCameraSharing = useCallback(async (): Promise<void> => {
    if (isCameraSharing) {
      stopCameraSharing()
    } else {
      try {
        setCameraError("")
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        })

        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play()
        }
        setIsCameraSharing(true)
      } catch (error) {
        console.error("Error accessing camera: ", error)
        setCameraError("Unable to access camera. Please check permissions.")
        setIsCameraSharing(false)
        showAlert("error", "Camera Error", "Unable to access camera. Please check permissions.")
      }
    }
  }, [isCameraSharing, stopCameraSharing, showAlert])

  const stopRecording = useCallback(() => {
    if (recordRef.current) {
      try {
        recordRef.current.stop()
      } catch (error) {
        console.error("Error stopping recording:", error)
      }
    }
    setIsRecording(false)
    setIsRecordingComplete(true)
    setTranscript("")
  }, [])

  const startRecording = useCallback(() => {
    if (!speechRecognitionSupported) {
      showAlert("error", "Not Supported", "Speech recognition is not supported in this browser.")
      return
    }
    setIsRecording(true)
    setIsRecordingComplete(false)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      showAlert("error", "Error", "Speech Recognition not available")
      stopRecording()
      return
    }
    recordRef.current = new SpeechRecognition()
    recordRef.current.continuous = true
    recordRef.current.interimResults = true
    recordRef.current.lang = "en-US"
    recordRef.current.onresult = (e: any) => {
      let interimTranscript = ""
      let finalTranscript = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript
        } else {
          interimTranscript += e.results[i][0].transcript
        }
      }

      setTranscript(interimTranscript)
      if (finalTranscript) {
        setFullTranscript((prev) => prev + finalTranscript)
      }
    }
    recordRef.current.onerror = (e: any) => {
      console.error("Speech recognition error:", e)
      showAlert("error", "Speech Error", "Speech recognition error occurred")
      stopRecording()
    }
    recordRef.current.onend = () => {
      setIsRecording(false)
    }
    try {
      recordRef.current.start()
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      showAlert("error", "Error", "Failed to start speech recognition")
      stopRecording()
    }
  }, [speechRecognitionSupported, stopRecording, showAlert])

  const handleRecordingComplete = useCallback(() => {
    if (recordRef.current) {
      try {
        recordRef.current.stop()
      } catch (error) {
        console.error("Error stopping recording:", error)
      }
    }
    if (fullTranscript.trim()) {
      handleSubmit(fullTranscript.trim())
      setFullTranscript("")
    }
    stopRecording()
  }, [fullTranscript, handleSubmit, stopRecording])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, stopRecording, startRecording])

  // File upload functionality
  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      if (recordRef.current) {
        try {
          recordRef.current.stop()
        } catch (error) {
          console.error("Error cleaning up recording:", error)
        }
      }
    }
  }, [stream])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23a855f7' fillOpacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-transparent to-purple-950/5 pointer-events-none" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Elegant Alert */}
      {alertState.show && (
        <div className="fixed top-4 right-4 z-50 w-80 animate-in slide-in-from-right-2 duration-300">
          <Alert
            className={`
            backdrop-blur-sm border shadow-lg
            ${
              alertState.type === "success"
                ? "border-purple-500/30 bg-gray-900/95 text-purple-100"
                : "border-red-500/30 bg-gray-900/95 text-red-100"
            }
          `}
          >
            {alertState.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-purple-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertTitle className="font-semibold text-sm">{alertState.title}</AlertTitle>
            <AlertDescription className="text-sm opacity-90">{alertState.message}</AlertDescription>
          </Alert>
        </div>
      )}


      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Video Section */}
          <div className="space-y-4">
            <div className="bg-gray-900/60 rounded-xl shadow-lg border border-purple-500/20 overflow-hidden backdrop-blur-sm">
              <div className="aspect-video bg-gray-800/50 relative">
                {isCameraSharing ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-600/90 text-white text-xs font-medium rounded-full flex items-center gap-2 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <VideoOff size={48} className="mx-auto text-purple-400/60" />
                      <div>
                        <p className="font-medium text-purple-100">Camera Off</p>
                        <p className="text-sm text-purple-300/80">Click to enable video</p>
                        {cameraError && (
                          <p className="text-xs text-red-400 mt-2 bg-red-900/30 px-2 py-1 rounded border border-red-500/30">
                            {cameraError}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCameraSharing}
                  size="sm"
                  className={`
                    absolute bottom-3 right-3 w-10 h-10 rounded-lg shadow-sm transition-all duration-200
                    ${
                      isCameraSharing
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-purple-600/80 hover:bg-purple-600 text-white border border-purple-500/50"
                    }
                  `}
                >
                  {isCameraSharing ? <VideoOff size={16} /> : <Video size={16} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="space-y-4 flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 bg-gray-900/60 rounded-xl shadow-lg border border-purple-500/20 p-4 backdrop-blur-sm">
              <div className="h-80 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                        <Sparkles size={20} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-purple-100">Ready for Interview</p>
                        <p className="text-sm text-purple-300/80">Upload your resume to begin</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex items-start gap-2 max-w-[80%]">
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <Card
                          className={`
                            border-0 shadow-sm backdrop-blur-sm
                            ${
                              msg.role === "user"
                                ? "bg-purple-600/20 text-purple-100 border border-purple-500/30"
                                : "bg-gray-800/60 text-gray-100 border border-gray-700/50"
                            }
                          `}
                        >
                          <CardContent className="p-3">
                            <CardDescription
                              className={`
                              text-sm leading-relaxed
                              ${msg.role === "user" ? "text-purple-100" : "text-gray-200"}
                            `}
                            >
                              {msg.content}
                            </CardDescription>
                            <div className="mt-1 text-xs text-purple-400/60">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                          </CardContent>
                        </Card>
                        {msg.role === "user" && (
                          <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-purple-500/50">
                            <User className="w-3 h-3 text-purple-300" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleSaveConversation}
                disabled={isSaving || saveSuccess}
                className="flex-1 bg-gray-800/60 hover:bg-gray-800/80 text-purple-100 border border-purple-500/30 hover:border-purple-400/50 shadow-sm disabled:opacity-50 backdrop-blur-sm transition-all duration-200"
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} className="mr-2 text-green-400" />
                    Saved!
                  </>
                ) : isSaving ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Interview
                  </>
                )}
              </Button>

              <Button
                onClick={() => setShowPopup(true)}
                className="flex-1 bg-purple-600/80 hover:bg-purple-600 text-white shadow-sm backdrop-blur-sm transition-all duration-200"
              >
                <FileText size={16} className="mr-2" />
                {resumeData ? "Update Resume" : "Upload Resume"}
              </Button>
            </div>

            {/* Status Indicator */}
            <div
              className={`
              p-3 rounded-lg border transition-all duration-300 backdrop-blur-sm
              ${isInterviewerSpeaking ? "bg-purple-600/20 border-purple-500/40" : "bg-gray-800/40 border-gray-700/50"}
            `}
            >
              <div className="flex items-center justify-center gap-2">
                {isInterviewerSpeaking ? (
                  <>
                    <Mic className="text-purple-400 animate-pulse" size={18} />
                    <span className="text-sm font-medium text-purple-200">AI Speaking...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Ready for Response</span>
                  </>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center gap-3">
              <div
                className={`
                flex-1 p-3 rounded-lg border text-center transition-all duration-200 backdrop-blur-sm
                ${isRecording ? "bg-red-600/20 border-red-500/40" : "bg-gray-800/40 border-gray-700/50"}
              `}
              >
                <p
                  className={`
                  text-sm font-medium
                  ${isRecording ? "text-red-300" : "text-gray-300"}
                `}
                >
                  {!isRecording && isRecordingComplete ? "🎤 Press to speak" : transcript || "🎧 Listening..."}
                </p>
              </div>

              <div className="flex gap-2">
                {!isRecording && isRecordingComplete ? (
                  <Button
                    onClick={startRecording}
                    className="w-10 h-10 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white shadow-sm backdrop-blur-sm transition-all duration-200"
                    disabled={!speechRecognitionSupported}
                  >
                    <Mic size={16} />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleRecordingComplete}
                      className="w-10 h-10 rounded-lg bg-green-600/80 hover:bg-green-600 text-white shadow-sm backdrop-blur-sm transition-all duration-200"
                    >
                      <AudioWaveform size={16} className={isRecording ? "animate-pulse" : ""} />
                    </Button>
                    <Button
                      onClick={toggleRecording}
                      className="w-10 h-10 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white shadow-sm backdrop-blur-sm transition-all duration-200"
                    >
                      <Play size={16} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Resume Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900/95 rounded-xl shadow-xl border border-purple-500/30 p-6 max-w-md w-full mx-4 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-purple-100 mb-2">
              {resumeData ? "Update Resume" : "Upload Resume"}
            </h3>
            <p className="text-purple-300/80 mb-6 text-sm">
              {resumeData
                ? "Upload a new resume to replace the current one."
                : "Upload your resume to personalize the interview experience."}
            </p>

            {/* Upload Area */}
            <div
              onClick={triggerFileUpload}
              className="border-2 border-dashed border-purple-500/40 hover:border-purple-400/60 rounded-lg p-6 text-center cursor-pointer transition-colors mb-4 hover:bg-purple-950/20"
            >
              <Upload size={24} className="mx-auto text-purple-400 mb-2" />
              <p className="text-purple-100 font-medium mb-1">
                {isUploading ? "Uploading..." : "Click to upload resume"}
              </p>
              <p className="text-purple-300/70 text-xs">PDF, DOC, DOCX, or TXT files (max 5MB)</p>
              {isUploading && (
                <div className="mt-3">
                  <div className="w-6 h-6 mx-auto border-2 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Current Resume Info */}
            {resumeData && (
              <div className="bg-gray-800/60 border border-purple-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-purple-400" />
                  <span className="text-purple-100 text-sm font-medium">Current: {resumeData.fileName}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-800/60 hover:bg-gray-800/80 text-purple-100 border border-gray-700/50 hover:border-gray-600/60"
                disabled={isUploading}
              >
                {resumeData ? "Cancel" : "Skip"}
              </Button>
              <Button
                onClick={triggerFileUpload}
                className="flex-1 bg-purple-600/80 hover:bg-purple-600 text-white"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewAI

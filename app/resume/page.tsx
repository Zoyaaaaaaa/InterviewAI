// 'use client'
// import { useState } from 'react';
// import Head from 'next/head';

// export default function Home() {
//   const [file, setFile] = useState(null);
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setError('Please select a PDF file');
//       setFile(null);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     if (!file) {
//       setError('Please select a PDF file first');
//       return;
//     }

//     setLoading(true);
//     setSummary('');
//     setError('');

//     try {
//       // Create FormData to send the file
//       const formData = new FormData();
//       formData.append('pdf', file);

//       // Send the file to your API endpoint
//       const response = await fetch('/api/process-resume', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Failed to summarize PDF');
//       }

//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (err) {
//       setError(err.message || 'An error occurred while summarizing the PDF');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">

//       <p>Upload a PDF file to get an AI-generated summary</p>
      
//       <form onSubmit={handleSubmit} className="upload-form">
//         <div className="file-input-container">
//           <label htmlFor="pdf-upload" className="file-label">
//             Choose PDF File
//           </label>
//           <input
//             type="file"
//             id="pdf-upload"
//             accept="application/pdf"
//             onChange={handleFileChange}
//             className="file-input"
//           />
//           {file && (
//             <div className="file-name">
//               Selected: {file.name}
//             </div>
//           )}
//         </div>
        
//         <button 
//           type="submit" 
//           className="submit-button" 
//           disabled={!file || loading}
//         >
//           {loading ? 'Summarizing...' : 'Get Summary'}
//         </button>
//       </form>
      
//       {error && (
//         <div className="error-message">
//           {error}
//         </div>
//       )}
      
//       {loading && (
//         <div className="loading">
//           <div className="spinner"></div>
//           <p>Processing your PDF... This may take a moment.</p>
//         </div>
//       )}
      
//       {summary && (
//         <div className="summary-container">
//           <h2>Summary</h2>
//           <div className="summary-content">
//             {summary.split('\n').map((paragraph, index) => (
//               <p key={index}>{paragraph}</p>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Camera, Mic, MessageCircle, AudioWaveform, Play, Check, ChevronsUpDown } from 'lucide-react';
import { cn, voiceModels } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createClient } from '@/utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ResumeUploadPopup from '@/components/ResumeUploadPopup';

interface InterviewMessage {
  role: string;
  content: string;
  timestamp: number;
  id: string;
}

const InterviewAI: React.FC = () => {
  const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('aura-orpheus-en');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordRef = useRef<any | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [fullTranscript, setFullTranscript] = useState<string>('');
  const [user, setUser] = useState<any>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  const [alertState, setAlertState] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechRecognitionSupported(true);
    }
  }, []);

  const { messages, handleSubmit, setInput, input } = useChat({
    onFinish: async (message: InterviewMessage) => {
      if (message.role !== 'user') {
        await handleTextToVoice(message.content);
      }
    },
  });

  const saveConversation = async () => {
    if (!user) {
      console.error('User is not authenticated');
      return;
    }

    const conversationString = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join('\n');

    try {
      const response = await fetch('/api/save-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationString,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save conversation');
      }

      const data = await response.json();
      console.log('Conversation saved successfully:', data);
      setAlertState({
        show: true,
        type: 'success',
        title: 'Success!',
        message: 'Interview saved successfully! Redirecting to feedback...',
      });

      setTimeout(() => {
        window.location.href = '/profile';
      }, 1000);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const handleTextToVoice = useCallback(
    async (content: string): Promise<void> => {
      setIsInterviewerSpeaking(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

      try {
        const response = await fetch('/api/deepgram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Voice-Model': selectedVoice,
          },
          body: JSON.stringify({ content }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('Deepgram error');
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsInterviewerSpeaking(false);
        };
      } catch (error) {
        console.error('Error fetching audio:', error);
        setIsInterviewerSpeaking(false);
      }
    },
    [selectedVoice]
  );

  const handleCameraSharing = useCallback(async (): Promise<void> => {
    if (isCameraSharing) {
      stopCameraSharing();
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsCameraSharing(true);
      } catch (error) {
        console.error('Error accessing camera: ', error);
      }
    }
  }, [isCameraSharing]);

  const stopCameraSharing = useCallback((): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraSharing(false);
  }, []);

  useEffect(() => {
    if (input && input.trim() !== '') {
      const submitForm = async () => {
        await handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
      };
      submitForm();
    }
  }, [input, handleSubmit]);

  const startRecording = useCallback(() => {
    if (!speechRecognitionSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsRecording(true);
    setIsRecordingComplete(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech Recognition not available');
      return;
    }

    recordRef.current = new SpeechRecognition();
    recordRef.current.continuous = true;
    recordRef.current.interimResults = true;

    recordRef.current.onresult = (e: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }

      setTranscript(interimTranscript);
      if (finalTranscript) {
        setFullTranscript((prev) => prev + finalTranscript);
      }
    };

    recordRef.current.onerror = (e: any) => {
      console.error('Speech recognition error:', e);
      stopRecording();
    };

    try {
      recordRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      stopRecording();
    }
  }, [speechRecognitionSupported]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsRecordingComplete(true);
    setTranscript('');
  }, []);

  const toggleRecording = useCallback(() => {
    if (!recordRef.current) return;
    if (isRecording) {
      recordRef.current.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      recordRef.current.start();
    }
  }, [isRecording]);

  const handleRecordingComplete = useCallback(() => {
    if (!recordRef.current) return;

    recordRef.current.stop();

    if (fullTranscript.trim()) {
      setInput(fullTranscript.trim());
      setFullTranscript('');
    }

    stopRecording();
  }, [fullTranscript, setInput, stopRecording]);

  const handleResumeUpload = async (resumeData: any) => {
    try {
      // Create a FormData object to send the resume file
      const formData = new FormData();
      formData.append('pdf', resumeData); // Append the resume file
  
      // Fetch interview questions based on the resume data
      const response = await fetch('/api/interview', {
        method: 'POST',
        body: formData, // Send the FormData object
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch interview questions');
      }
  
      const data = await response.json();
      setInterviewQuestions(data.interviewQuestions);
      setCurrentQuestionIndex(0); // Start with the first question
    } catch (error) {
      console.error('Error fetching interview questions:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {!speechRecognitionSupported && (
        <div className="bg-purple-900/20 text-purple-300 p-4 text-center">
          Speech Recognition is not supported in this browser.
        </div>
      )}
      {alertState.show && (
        <Alert
          className={`mb-4 ${
            alertState.type === 'success'
              ? 'border-green-500 bg-green-500/10 text-green-500'
              : 'border-red-500 bg-red-500/10 text-red-500'
          }`}
        >
          {alertState.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertTitle>{alertState.title}</AlertTitle>
          <AlertDescription>{alertState.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex-1 grid md:grid-cols-2 gap-12 p-12 space-y-4">
        <div className="space-y-8">
          <div className="relative aspect-video bg-black/40 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-900/30 hover:scale-[1.01] transition-transform">
            {isCameraSharing ? (
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-full object-cover filter brightness-75 grayscale-[20%]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Camera size={64} className="mx-auto mb-4 text-neutral-500 opacity-50" />
                  <p className="text-xl font-thin text-neutral-400">Camera Inactive</p>
                </div>
              </div>
            )}
            <Button
              onClick={handleCameraSharing}
              className="absolute bottom-6 right-6 bg-black/40 hover:bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
            >
              <Camera size={20} className="stroke-[1.5]" />
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="h-[400px] overflow-y-auto bg-black/30 rounded-[2rem] border border-neutral-800 p-6 space-y-4 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-neutral-700">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`
                  ${msg.role === 'user' ? 'ml-auto bg-black/50' : 'mr-auto bg-neutral-900/50'}
                  max-w-[90%] border border-neutral-800 shadow-md rounded-xl hover:scale-[1.01] transition-transform
                `}
              >
                <CardContent className="p-4">
                  <CardDescription
                    className={`
                      text-base font-light tracking-wide
                      ${msg.role === 'user' ? 'text-neutral-300' : 'text-neutral-400'}
                    `}
                  >
                    {msg.content}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={() => setShowPopup(true)}
            className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
          >
            Start Interview
          </Button>

          {interviewQuestions.length > 0 && (
            <div className="p-5 rounded-xl bg-black/30 border border-neutral-800">
              <h2 className="text-lg font-semibold mb-4">Interview Questions</h2>
              <p className="text-neutral-300">{interviewQuestions[currentQuestionIndex]}</p>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  disabled={currentQuestionIndex >= interviewQuestions.length - 1}
                  className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
                >
                  Next Question
                </Button>
              </div>
            </div>
          )}

          <div
            className={`p-5 rounded-xl ${
              isInterviewerSpeaking ? 'bg-black/50 border-purple-500/30' : 'bg-black/30'
            } text-center transition-colors duration-300 border border-neutral-800`}
          >
            <div className="flex items-center justify-center space-x-3">
              {isInterviewerSpeaking ? (
                <>
                  <Mic className="animate-pulse text-purple-500 stroke-[1.5]" size={24} />
                  <span className="text-lg font-thin text-neutral-300">Interviewer Speaking</span>
                </>
              ) : (
                <>
                  <MessageCircle size={24} className="text-neutral-500 stroke-[1.5]" />
                  <span className="text-lg font-thin text-neutral-400">Ready for Input</span>
                </>
              )}
            </div>
          </div>

          <div className="text-center flex flex-row justify-center items-center gap-4">
            <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/60 border-2 border-purple-700/50 rounded-xl shadow-[0_0_15px_rgba(126,34,206,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(126,34,206,0.5)]">
              <CardDescription className="w-full text-purple-300 font-light tracking-wider">
                {!isRecording && isRecordingComplete
                  ? 'Tap microphone to start interview'
                  : transcript
                  ? transcript
                  : 'Listening...'}
              </CardDescription>
            </Card>
            <div className="flex flex-row gap-3">
              {!isRecording && isRecordingComplete ? (
                <Button
                  onClick={startRecording}
                  className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
                >
                  <Mic
                    size={22}
                    className={`text-neutral-300 stroke-[1.5] ${isRecording ? 'opacity-0' : 'opacity-100'}`}
                  />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleRecordingComplete}
                    className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
                  >
                    <AudioWaveform
                      size={22}
                      className={`text-purple-500 stroke-[1.5] ${
                        !isRecordingComplete ? 'opacity-100' : 'opacity-0'
                      } ${isRecording ? 'animate-pulse' : ''}`}
                    />
                  </Button>
                  <Button
                    className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
                    onClick={toggleRecording}
                  >
                    <Play
                      size={22}
                      className={`text-neutral-300 stroke-[1.5] ${
                        isRecording ? 'opacity-0' : 'opacity-100'
                      } transition-all`}
                    />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPopup && <ResumeUploadPopup onClose={() => setShowPopup(false)} onResumeUpload={handleResumeUpload} />}
    </div>
  );
};

export default InterviewAI;
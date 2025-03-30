// 'use client'
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { useChat } from "ai/react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription } from "@/components/ui/card";
// import { 
//   Camera, 
//   Mic, 
//   MessageCircle, 
//   AudioWaveform, 
//   Play, 
//   Check, 
//   ChevronsUpDown
// } from "lucide-react";
// import { cn, voiceModels } from "@/lib/utils";
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { createClient } from '@/utils/supabase/client';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { CheckCircle, AlertCircle } from "lucide-react";
// import ResumeProcessor from '@/components/ReumeProcessor';

// interface InterviewMessage {
//   role: string;
//   content: string;
//   timestamp: number;
//   id: string;
// }

// const InterviewAI: React.FC = () => {
//   const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
//   const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
//   const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
//   const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const recordRef = useRef<any | null>(null);
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
//   const [transcript, setTranscript] = useState<string>("");
//   const [fullTranscript, setFullTranscript] = useState<string>("");
//   const [user, setUser] = useState<any>(null);
//   const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
//   const [alertState, setAlertState] = useState({
//     show: false,
//     type: 'success',
//     title: '',
//     message: ''
//   });
  
//   const supabase = createClient();

//     useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//       setSpeechRecognitionSupported(true);
//     }
//   }, []);

//   const { messages, handleSubmit, setInput, input } = useChat({
//     onFinish: async (message: InterviewMessage) => {
//       if (message.role !== "user") {
//         await handleTextToVoice(message.content);
//       }
//     },
//   });

//   const saveConversation = async () => {
//     if (!user) {
//       console.error("User is not authenticated");
//       return;
//     }

//     const conversationString = messages
//       .map((msg) => `${msg.role}: ${msg.content}`)
//       .join("\n");

//     try {
//       const response = await fetch("/api/save-interview", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           conversation: conversationString,
//           user_id: user.id,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to save conversation");
//       }

//       const data = await response.json();
//       console.log("Conversation saved successfully:", data);
//       setAlertState({
//         show: true,
//         type: 'success',
//         title: 'Success!',
//         message: 'Interview saved successfully! Redirecting to feedback...'
//       });
  

//       setTimeout(() => {
//         window.location.href = "/profile";
//       }, 1000);
  
//     } catch (error) {
//       console.error("Error saving conversation:", error);
//     }
//   };

//   <Button
//     onClick={saveConversation}
//     className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//   >
//     Save Conversation
//   </Button>
  
  
//   const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
//     setIsInterviewerSpeaking(true);
//     const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

// try {
//   const response = await fetch('/api/deepgram', {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Voice-Model': selectedVoice
//     },
//     body: JSON.stringify({ content }),
//     signal: controller.signal,
//   });
//   clearTimeout(timeoutId);
//   if (!response.ok) throw new Error('Deepgram error');
//   const audioBlob = await response.blob();
//   const audioUrl = URL.createObjectURL(audioBlob);
//   const audio = new Audio(audioUrl);
//   audio.play();
//   audio.onended = () => {
//     URL.revokeObjectURL(audioUrl);
//     setIsInterviewerSpeaking(false);
//   };
// } catch (error) {
//   console.error('Error fetching audio:', error);
//   setIsInterviewerSpeaking(false);
// }
//   }, [selectedVoice]);

//   const handleCameraSharing = useCallback(async (): Promise<void> => {
//     if (isCameraSharing) {
//       stopCameraSharing();
//     } else {
//       try {
//         const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
//         if (videoRef.current) {
//           videoRef.current.srcObject = newStream;
//         }
//         setIsCameraSharing(true);
//       } catch (error) {
//         console.error("Error accessing camera: ", error);
//       }
//     }
//   }, [isCameraSharing]);

//   const stopCameraSharing = useCallback((): void => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//     }
//     setIsCameraSharing(false);
//   }, []);

//   useEffect(() => {
//     if (input && input.trim() !== "") {
//       const submitForm = async () => {
//         await handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
//       };
//       submitForm();
//     }
//   }, [input, handleSubmit]);

//   const startRecording = useCallback(() => {
//     if (!speechRecognitionSupported) {
//       alert('Speech recognition is not supported in this browser.');
//       return;
//     }

//     setIsRecording(true);
//     setIsRecordingComplete(false);

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
//     if (!SpeechRecognition) {
//       console.error('Speech Recognition not available');
//       return;
//     }

//     recordRef.current = new SpeechRecognition();
//     recordRef.current.continuous = true;
//     recordRef.current.interimResults = true;

//     recordRef.current.onresult = (e: any) => {
//       let interimTranscript = "";
//       let finalTranscript = "";
//       for (let i = e.resultIndex; i < e.results.length; i++) {
//         if (e.results[i].isFinal) {
//           finalTranscript += e.results[i][0].transcript;
//         } else {
//           interimTranscript += e.results[i][0].transcript;
//         }
//       }
      
//       setTranscript(interimTranscript);
//       if (finalTranscript) {
//         setFullTranscript(prev => prev + finalTranscript);
//       }
//     };

//     recordRef.current.onerror = (e: any) => {
//       console.error('Speech recognition error:', e);
//       stopRecording();
//     };

//     try {
//       recordRef.current.start();
//     } catch (error) {
//       console.error('Error starting speech recognition:', error);
//       stopRecording();
//     }
//   }, [speechRecognitionSupported]);

//   const stopRecording = useCallback(() => {
//     setIsRecording(false);
//     setIsRecordingComplete(true);
//     setTranscript("");
//   }, []);

//   const toggleRecording = useCallback(() => {
//     if (!recordRef.current) return;
//     if (isRecording) {
//       recordRef.current.stop();
//       setIsRecording(false);
//     } else {
//       setIsRecording(true);
//       recordRef.current.start();
//     }
//   }, [isRecording]);

//   const handleRecordingComplete = useCallback(() => {
//     if (!recordRef.current) return;

//     recordRef.current.stop();

//     if (fullTranscript.trim()) {
//       setInput(fullTranscript.trim());
//       setFullTranscript("");
//     }

//     stopRecording();
//   }, [fullTranscript, setInput, stopRecording]);

//   return (

// <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
// {!speechRecognitionSupported && (
//   <div className="bg-purple-900/20 text-purple-300 p-4 text-center">
//     Speech Recognition is not supported in this browser.
//   </div>
// )}
// {alertState.show && (
//   <Alert 
//     className={`mb-4 ${
//       alertState.type === 'success' 
//         ? 'border-green-500 bg-green-500/10 text-green-500' 
//         : 'border-red-500 bg-red-500/10 text-red-500'
//     }`}
//   >
//     {alertState.type === 'success' ? (
//       <CheckCircle className="h-4 w-4" />
//     ) : (
//       <AlertCircle className="h-4 w-4" />
//     )}
//     <AlertTitle>{alertState.title}</AlertTitle>
//     <AlertDescription>
//       {alertState.message}
//     </AlertDescription>
//   </Alert>
// )}

// <div className="flex-1 grid md:grid-cols-2 gap-12 p-12 space-y-4">
//   <div className="space-y-8">
//     <div className="relative aspect-video bg-black/40 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-900/30 hover:scale-[1.01] transition-transform">
//       {isCameraSharing ? (
//         <video
//           ref={videoRef}
//           autoPlay
//           className="w-full h-full object-cover filter brightness-75 grayscale-[20%]"
//         />
//       ) : (
//         <div className="w-full h-full flex items-center justify-center">
//           <div className="text-center">
//             <Camera size={64} className="mx-auto mb-4 text-neutral-500 opacity-50" />
//             <p className="text-xl font-thin text-neutral-400">Camera Inactive</p>
//           </div>
//         </div>
//       )}
//       <Button
//         onClick={handleCameraSharing}
//         className="absolute bottom-6 right-6 bg-black/40 hover:bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//       >
//         <Camera size={20} className="stroke-[1.5]" />
//       </Button>
//     </div>
//   </div>

//   <div className="space-y-8">
//     <div className="h-[400px] overflow-y-auto bg-black/30 rounded-[2rem] border border-neutral-800 p-6 space-y-4 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-neutral-700">
//       {messages.map((msg) => (
//         <Card
//           key={msg.id}
//           className={`
//             ${msg.role === "user" ? "ml-auto bg-black/50" : "mr-auto bg-neutral-900/50"}
//             max-w-[90%] border border-neutral-800 shadow-md rounded-xl hover:scale-[1.01] transition-transform
//           `}
//         >
//           <CardContent className="p-4">
//             <CardDescription className={`
//               text-base font-light tracking-wide
//               ${msg.role === "user" ? "text-neutral-300" : "text-neutral-400"}
//             `}>
//               {msg.content}
//             </CardDescription>
//           </CardContent>
//         </Card>
//       ))}
//     </div>

//     <Button
//       onClick={saveConversation}
//       className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
//     >
//       Save Conversation
//     </Button>

//     <div 
//       className={`p-5 rounded-xl ${
//         isInterviewerSpeaking 
//           ? 'bg-black/50 border-purple-500/30' 
//           : 'bg-black/30'
//       } text-center transition-colors duration-300 border border-neutral-800`}
//     >
//       <div className="flex items-center justify-center space-x-3">
//         {isInterviewerSpeaking ? (
//           <>
//             <Mic className="animate-pulse text-purple-500 stroke-[1.5]" size={24} />
//             <span className="text-lg font-thin text-neutral-300">Interviewer Speaking</span>
//           </>
//         ) : (
//           <>
//             <MessageCircle size={24} className="text-neutral-500 stroke-[1.5]" />
//             <span className="text-lg font-thin text-neutral-400">Ready for Input</span>
//           </>
//         )}
//       </div>
//     </div>

//     <div className="text-center flex flex-row justify-center items-center gap-4">
//       <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/60 border-2 border-purple-700/50 rounded-xl shadow-[0_0_15px_rgba(126,34,206,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(126,34,206,0.5)]">
//       <CardDescription className="w-full text-purple-300 font-light tracking-wider">
//       {!isRecording && isRecordingComplete
//         ? "Tap microphone to start interview"
//         : transcript
//         ? transcript
//         : "Listening..."}
//       </CardDescription>
//       </Card>
//       <div className="flex flex-row gap-3">
//         {!isRecording && isRecordingComplete ? (
//           <Button
//             onClick={startRecording}
//             className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
//           >
//             <Mic
//               size={22}
//               className={`text-neutral-300 stroke-[1.5] ${isRecording ? "opacity-0" : "opacity-100"}`}
//             />
//           </Button>
//         ) : (
//           <>
//             <Button
//               onClick={handleRecordingComplete}
//               className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
//             >
//               <AudioWaveform
//                 size={22}
//                 className={`text-purple-500 stroke-[1.5] ${
//                   !isRecordingComplete ? "opacity-100" : "opacity-0"
//                 } ${isRecording ? "animate-pulse" : ""}`}
//               />
//             </Button>
//             <Button 
//               className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg" 
//               onClick={toggleRecording}
//             >
//               <Play
//                 size={22}
//                 className={`text-neutral-300 stroke-[1.5] ${
//                   isRecording ? "opacity-0" : "opacity-100"
//                 } transition-all`}
//               />
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   </div>
// </div>
// </div>

//   );
// };

// export default InterviewAI;


"use client";

import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter(
                attachment =>
                  attachment?.contentType?.startsWith('image/') ||
                  attachment?.contentType?.startsWith('application/pdf'),
              )
              .map((attachment, index) =>
                attachment.contentType?.startsWith('image/') ? (
                  <Image
                    key={`${m.id}-${index}`}
                    src={attachment.url}
                    width={500}
                    height={500}
                    alt={attachment.name ?? `attachment-${index}`}
                  />
                ) : attachment.contentType?.startsWith('application/pdf') ? (
                  <iframe
                    key={`${m.id}-${index}`}
                    src={attachment.url}
                    width="500"
                    height="600"
                    title={attachment.name ?? `attachment-${index}`}
                  />
                ) : null,
              )}
          </div>
        </div>
      ))}

      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);

          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          className=""
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
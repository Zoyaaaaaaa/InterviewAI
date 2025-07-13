// // 'use client'
// // import React, { useState, useRef, useEffect, useCallback } from 'react';
// // import { useChat } from "ai/react";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription } from "@/components/ui/card";
// // import { 
// //   Camera, 
// //   Mic, 
// //   MessageCircle, 
// //   AudioWaveform, 
// //   Play, 
// //   Save,
// //   Sparkles,
// //   Video,
// //   VideoOff
// // } from "lucide-react";

// // import { createClient } from '@/utils/supabase/client';
// // import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// // import { CheckCircle, AlertCircle } from "lucide-react";
// // import ResumeUploadPopup from '@/components/ResumeUploadPopup';

// // interface InterviewMessage {
// //   role: string;
// //   content: string;
// //   timestamp: number;
// //   id: string;
// // }

// // const InterviewAI: React.FC = () => {
// //   const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
// //   const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
// //   const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
// //   const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
// //   const [showPopup, setShowPopup] = useState(false);
// //   const [resumeData, setResumeData] = useState<string>('');
// //   const videoRef = useRef<HTMLVideoElement | null>(null);
// //   const recordRef = useRef<any | null>(null);
// //   const [isRecording, setIsRecording] = useState<boolean>(false);
// //   const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
// //   const [transcript, setTranscript] = useState<string>("");
// //   const [fullTranscript, setFullTranscript] = useState<string>("");
// //   const [user, setUser] = useState<any>(null);
// //   const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
// //   const [alertState, setAlertState] = useState({
// //     show: false,
// //     type: 'success',
// //     title: '',
// //     message: ''
// //   });
  
// //   const supabase = createClient();

// //   useEffect(() => {
// //     const fetchUser = async () => {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       setUser(user);
// //     };
// //     fetchUser();
// //   }, [supabase.auth]);

// //   useEffect(() => {
// //     if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
// //       setSpeechRecognitionSupported(true);
// //     }
// //   }, []);

// //   const { messages, handleSubmit, setInput, input } = useChat({
// //     onFinish: async (message: InterviewMessage) => {
// //       if (message.role !== "user") {
// //         await handleTextToVoice(message.content);
// //       }
// //     },
// //     body: {
// //       resumeData: resumeData
// //     }
// //   });

// //   const saveConversation = async () => {
// //     if (!user) {
// //       console.error("User is not authenticated");
// //       return;
// //     }

// //     const conversationString = messages
// //       .map((msg) => `${msg.role}: ${msg.content}`)
// //       .join("\n");

// //     try {
// //       const response = await fetch("/api/save-interview", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           conversation: conversationString,
// //           user_id: user.id,
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.error || "Failed to save conversation");
// //       }

// //       const data = await response.json();
// //       console.log("Conversation saved successfully:", data);
// //       setAlertState({
// //         show: true,
// //         type: 'success',
// //         title: 'Success!',
// //         message: 'Interview saved successfully! Redirecting to feedback...'
// //       });
  

// //       setTimeout(() => {
// //         window.location.href = "/profile";
// //       }, 1000);
  
// //     } catch (error) {
// //       console.error("Error saving conversation:", error);
// //     }
// //   };
  
// //   const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
// //     setIsInterviewerSpeaking(true);
// //     const controller = new AbortController();
// //     const timeoutId = setTimeout(() => controller.abort(), 15000);

// //     try {
// //       const response = await fetch('/api/deepgram', {
// //         method: 'POST',
// //         headers: { 
// //           'Content-Type': 'application/json',
// //           'Voice-Model': selectedVoice
// //         },
// //         body: JSON.stringify({ content }),
// //         signal: controller.signal,
// //       });
// //       clearTimeout(timeoutId);
// //       if (!response.ok) throw new Error('Deepgram error');
// //       const audioBlob = await response.blob();
// //       const audioUrl = URL.createObjectURL(audioBlob);
// //       const audio = new Audio(audioUrl);
// //       audio.play();
// //       audio.onended = () => {
// //         URL.revokeObjectURL(audioUrl);
// //         setIsInterviewerSpeaking(false);
// //       };
// //     } catch (error) {
// //       console.error('Error fetching audio:', error);
// //       setIsInterviewerSpeaking(false);
// //     }
// //   }, [selectedVoice]);

// //   const stopCameraSharing = useCallback((): void => {
// //     if (videoRef.current && videoRef.current.srcObject) {
// //       const stream = videoRef.current.srcObject as MediaStream;
// //       stream.getTracks().forEach(track => track.stop());
// //     }
// //     setIsCameraSharing(false);
// //   }, []);

// //   const handleCameraSharing = useCallback(async (): Promise<void> => {
// //     if (isCameraSharing) {
// //       stopCameraSharing();
// //     } else {
// //       try {
// //         const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
// //         if (videoRef.current) {
// //           videoRef.current.srcObject = newStream;
// //         }
// //         setIsCameraSharing(true);
// //       } catch (error) {
// //         console.error("Error accessing camera: ", error);
// //       }
// //     }
// //   }, [isCameraSharing, stopCameraSharing]);

// //   useEffect(() => {
// //     if (input && input.trim() !== "") {
// //       const submitForm = async () => {
// //         await handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
// //       };
// //       submitForm();
// //     }
// //   }, [input, handleSubmit]);

// //   const stopRecording = useCallback(() => {
// //     setIsRecording(false);
// //     setIsRecordingComplete(true);
// //     setTranscript("");
// //   }, []);

// //   const startRecording = useCallback(() => {
// //     if (!speechRecognitionSupported) {
// //       alert('Speech recognition is not supported in this browser.');
// //       return;
// //     }

// //     setIsRecording(true);
// //     setIsRecordingComplete(false);

// //     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
// //     if (!SpeechRecognition) {
// //       console.error('Speech Recognition not available');
// //       return;
// //     }

// //     recordRef.current = new SpeechRecognition();
// //     recordRef.current.continuous = true;
// //     recordRef.current.interimResults = true;

// //     recordRef.current.onresult = (e: any) => {
// //       let interimTranscript = "";
// //       let finalTranscript = "";
// //       for (let i = e.resultIndex; i < e.results.length; i++) {
// //         if (e.results[i].isFinal) {
// //           finalTranscript += e.results[i][0].transcript;
// //         } else {
// //           interimTranscript += e.results[i][0].transcript;
// //         }
// //       }
      
// //       setTranscript(interimTranscript);
// //       if (finalTranscript) {
// //         setFullTranscript(prev => prev + finalTranscript);
// //       }
// //     };

// //     recordRef.current.onerror = (e: any) => {
// //       console.error('Speech recognition error:', e);
// //       stopRecording();
// //     };

// //     try {
// //       recordRef.current.start();
// //     } catch (error) {
// //       console.error('Error starting speech recognition:', error);
// //       stopRecording();
// //     }
// //   }, [speechRecognitionSupported, stopRecording]);

// //   const toggleRecording = useCallback(() => {
// //     if (!recordRef.current) return;
// //     if (isRecording) {
// //       recordRef.current.stop();
// //       setIsRecording(false);
// //     } else {
// //       setIsRecording(true);
// //       recordRef.current.start();
// //     }
// //   }, [isRecording]);

// //   const handleRecordingComplete = useCallback(() => {
// //     if (!recordRef.current) return;

// //     recordRef.current.stop();

// //     if (fullTranscript.trim()) {
// //       setInput(fullTranscript.trim());
// //       setFullTranscript("");
// //     }

// //     stopRecording();
// //   }, [fullTranscript, setInput, stopRecording]);

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white flex flex-col relative overflow-hidden">
// //       {/* Background decorative elements */}
// //       <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
// //       <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
// //       <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000" />

// //       {!speechRecognitionSupported && (
// //         <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-200 p-4 text-center border-b border-amber-500/20 backdrop-blur-sm">
// //           <div className="flex items-center justify-center gap-2">
// //             <AlertCircle size={20} />
// //             Speech Recognition is not supported in this browser.
// //           </div>
// //         </div>
// //       )}

// //       {alertState.show && (
// //         <div className="p-6 z-10">
// //           <Alert 
// //             className={`
// //               backdrop-blur-md border-2 shadow-2xl
// //               ${alertState.type === 'success' 
// //                 ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300' 
// //                 : 'border-red-400/50 bg-red-500/10 text-red-300'
// //               }
// //             `}
// //           >
// //             {alertState.type === 'success' ? (
// //               <CheckCircle className="h-5 w-5" />
// //             ) : (
// //               <AlertCircle className="h-5 w-5" />
// //             )}
// //             <AlertTitle className="text-lg font-semibold">{alertState.title}</AlertTitle>
// //             <AlertDescription className="text-base opacity-90">
// //               {alertState.message}
// //             </AlertDescription>
// //           </Alert>
// //         </div>
// //       )}

// //       <div className="flex-1 grid lg:grid-cols-2 gap-8 p-8 relative z-10">
// //         {/* Video Section */}
// //         <div className="space-y-6">
// //           <div className="relative">
// //             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-25"></div>
// //             <div className="relative aspect-video bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm">
// //               {isCameraSharing ? (
// //                 <>
// //                   <video
// //                     ref={videoRef}
// //                     autoPlay
// //                     className="w-full h-full object-cover"
// //                   />
// //                   <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center gap-2">
// //                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
// //                     <span className="text-sm font-medium">LIVE</span>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800/30 to-slate-900/30">
// //                   <div className="text-center space-y-4">
// //                     <div className="relative">
// //                       <VideoOff size={80} className="mx-auto text-slate-400 opacity-60" />
// //                       <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 blur-xl"></div>
// //                     </div>
// //                     <div>
// //                       <p className="text-2xl font-light text-slate-300 mb-2">Camera Inactive</p>
// //                       <p className="text-slate-400 text-sm">Click the camera button to start video</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
              
// //               <Button
// //                 onClick={handleCameraSharing}
// //                 className={`
// //                   absolute bottom-6 right-6 w-14 h-14 rounded-2xl transition-all duration-300 shadow-lg
// //                   ${isCameraSharing 
// //                     ? 'bg-red-500/90 hover:bg-red-600/90 text-white' 
// //                     : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
// //                   }
// //                   backdrop-blur-sm hover:scale-105 active:scale-95
// //                 `}
// //               >
// //                 {isCameraSharing ? <VideoOff size={24} /> : <Video size={24} />}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Chat Section */}
// //         <div className="space-y-6">
// //           {/* Messages Container */}
// //           <div className="relative">
// //             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-3xl blur opacity-50"></div>
// //             <div className="relative h-[400px] overflow-y-auto bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 p-6 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
// //               {messages.length === 0 ? (
// //                 <div className="h-full flex items-center justify-center text-center">
// //                   <div className="space-y-4">
// //                     <Sparkles size={48} className="mx-auto text-purple-400 opacity-60" />
// //                     <div>
// //                       <p className="text-xl font-light text-slate-300">Ready to begin your interview</p>
// //                       <p className="text-slate-400 text-sm mt-2">Start by uploading your resume or begin speaking</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 messages.map((msg: { id: React.Key | null | undefined; role: string; content: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
// //                   <div
// //                     key={msg.id}
// //                     className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
// //                   >
// //                     <Card
// //                       className={`
// //                         max-w-[85%] border-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]
// //                         ${msg.role === "user" 
// //                           ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white" 
// //                           : "bg-slate-800/40 text-slate-200"
// //                         }
// //                       `}
// //                     >
// //                       <CardContent className="p-4">
// //                         <CardDescription className={`
// //                           text-base leading-relaxed
// //                           ${msg.role === "user" ? "text-purple-100" : "text-slate-300"}
// //                         `}>
// //                           {msg.content}
// //                         </CardDescription>
// //                       </CardContent>
// //                     </Card>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex gap-4">
// //             <Button
// //               onClick={saveConversation}
// //               className="flex-1 bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 h-12 rounded-2xl"
// //             >
// //               <Save size={20} className="mr-2" />
// //               End & Save Interview
// //             </Button>
// //             <Button
// //               onClick={() => setShowPopup(true)}
// //               className="flex-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 text-purple-300 border border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 h-12 rounded-2xl"
// //             >
// //               <Sparkles size={20} className="mr-2" />
// //               Start Interview
// //             </Button>
// //           </div>

// //           {/* Interviewer Status */}
// //           <div className={`
// //             p-6 rounded-2xl border backdrop-blur-sm transition-all duration-500
// //             ${isInterviewerSpeaking 
// //               ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-400/30 shadow-lg shadow-purple-500/10' 
// //               : 'bg-slate-800/30 border-white/10'
// //             }
// //           `}>
// //             <div className="flex items-center justify-center space-x-3">
// //               {isInterviewerSpeaking ? (
// //                 <>
// //                   <div className="relative">
// //                     <Mic className="text-purple-400 animate-pulse" size={28} />
// //                     <div className="absolute inset-0 bg-purple-400 opacity-20 rounded-full animate-ping"></div>
// //                   </div>
// //                   <span className="text-xl font-light text-purple-300">AI Interviewer Speaking...</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <MessageCircle size={28} className="text-slate-400" />
// //                   <span className="text-xl font-light text-slate-400">Ready for Your Response</span>
// //                 </>
// //               )}
// //             </div>
// //           </div>

// //           {/* Recording Controls */}
// //           <div className="flex items-center gap-4">
// //             <Card className={`
// //               flex-1 p-4 border-2 backdrop-blur-md transition-all duration-300
// //               ${isRecording 
// //                 ? 'bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-400/40 shadow-lg shadow-red-500/10' 
// //                 : 'bg-slate-800/40 border-white/10'
// //               }
// //             `}>
// //               <CardDescription className={`
// //                 text-center font-medium transition-colors duration-300
// //                 ${isRecording ? 'text-red-300' : 'text-slate-400'}
// //               `}>
// //                 {!isRecording && isRecordingComplete
// //                   ? "🎤 Press to start speaking"
// //                   : transcript || "🎧 Listening for your voice..."}
// //               </CardDescription>
// //             </Card>

// //             <div className="flex gap-3">
// //               {!isRecording && isRecordingComplete ? (
// //                 <Button
// //                   onClick={startRecording}
// //                   className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
// //                 >
// //                   <Mic size={24} className="text-purple-300" />
// //                 </Button>
// //               ) : (
// //                 <>
// //                   <Button
// //                     onClick={handleRecordingComplete}
// //                     className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30 border border-emerald-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
// //                   >
// //                     <AudioWaveform
// //                       size={24}
// //                       className={`text-emerald-300 ${isRecording ? "animate-pulse" : ""}`}
// //                     />
// //                   </Button>
// //                   <Button 
// //                     className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 hover:to-orange-600/30 border border-amber-500/30 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg" 
// //                     onClick={toggleRecording}
// //                   >
// //                     <Play size={24} className="text-amber-300" />
// //                   </Button>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {showPopup && (
// //         <ResumeUploadPopup 
// //           onClose={() => setShowPopup(false)} 
// //           onResumeProcessed={(data) => setResumeData(data)}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default InterviewAI;




// 'use client'
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription } from "@/components/ui/card";
// import { 
//   Camera, 
//   Mic, 
//   MessageCircle, 
//   AudioWaveform, 
//   Play, 
//   Save,
//   Sparkles,
//   Video,
//   VideoOff,
//   CheckCircle,
//   AlertCircle
// } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// interface InterviewMessage {
//   role: string;
//   content: string;
//   timestamp: number;
//   id: string;
// }

// const InterviewAI: React.FC = () => {
//   const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
//   const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
//   const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
//   const [showPopup, setShowPopup] = useState(false);
//   const [resumeData, setResumeData] = useState<string>('');
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
//   const [messages, setMessages] = useState<InterviewMessage[]>([]);
//   const [input, setInput] = useState<string>('');
//   const [cameraError, setCameraError] = useState<string>('');
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//         setSpeechRecognitionSupported(true);
//       }
//     }
//   }, []);

//   const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
//     setIsInterviewerSpeaking(true);
    
//     // Simulate AI response processing
//     setTimeout(() => {
//       setIsInterviewerSpeaking(false);
//     }, 2000);
//   }, [selectedVoice]);

//   const handleSubmit = useCallback(async (userInput: string) => {
//     if (!userInput.trim()) return;

//     const userMessage: InterviewMessage = {
//       role: 'user',
//       content: userInput,
//       timestamp: Date.now(),
//       id: Math.random().toString(36).substring(7)
//     };

//     setMessages(prev => [...prev, userMessage]);

//     // Simulate AI response
//     setTimeout(() => {
//       const aiMessage: InterviewMessage = {
//         role: 'assistant',
//         content: `Thank you for sharing that. Can you tell me more about your experience with ${userInput.includes('experience') ? 'previous projects' : 'technical skills'}?`,
//         timestamp: Date.now(),
//         id: Math.random().toString(36).substring(7)
//       };
//       setMessages(prev => [...prev, aiMessage]);
//       handleTextToVoice(aiMessage.content);
//     }, 1000);

//     setInput('');
//   }, [handleTextToVoice]);

//   const saveConversation = async () => {
//     setAlertState({
//       show: true,
//       type: 'success',
//       title: 'Success!',
//       message: 'Interview saved successfully! Redirecting to feedback...'
//     });

//     setTimeout(() => {
//       setAlertState(prev => ({ ...prev, show: false }));
//     }, 3000);
//   };

//   const stopCameraSharing = useCallback((): void => {
//     if (stream) {
//       stream.getTracks().forEach(track => {
//         track.stop();
//       });
//       setStream(null);
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraSharing(false);
//     setCameraError('');
//   }, [stream]);

//   const handleCameraSharing = useCallback(async (): Promise<void> => {
//     if (isCameraSharing) {
//       stopCameraSharing();
//     } else {
//       try {
//         setCameraError('');
//         const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//           video: { 
//             width: { ideal: 1280 },
//             height: { ideal: 720 },
//             facingMode: 'user'
//           },
//           audio: false
//         });
        
//         setStream(mediaStream);
//         if (videoRef.current) {
//           videoRef.current.srcObject = mediaStream;
//           await videoRef.current.play();
//         }
//         setIsCameraSharing(true);
//       } catch (error) {
//         console.error("Error accessing camera: ", error);
//         setCameraError("Unable to access camera. Please check permissions.");
//         setIsCameraSharing(false);
//       }
//     }
//   }, [isCameraSharing, stopCameraSharing]);

//   const stopRecording = useCallback(() => {
//     if (recordRef.current) {
//       recordRef.current.stop();
//     }
//     setIsRecording(false);
//     setIsRecordingComplete(true);
//     setTranscript("");
//   }, []);

//   const startRecording = useCallback(() => {
//     if (!speechRecognitionSupported) {
//       setAlertState({
//         show: true,
//         type: 'error',
//         title: 'Not Supported',
//         message: 'Speech recognition is not supported in this browser.'
//       });
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
//     recordRef.current.lang = 'en-US';

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

//     recordRef.current.onend = () => {
//       setIsRecording(false);
//     };

//     try {
//       recordRef.current.start();
//     } catch (error) {
//       console.error('Error starting speech recognition:', error);
//       stopRecording();
//     }
//   }, [speechRecognitionSupported, stopRecording]);

//   const handleRecordingComplete = useCallback(() => {
//     if (recordRef.current) {
//       recordRef.current.stop();
//     }

//     if (fullTranscript.trim()) {
//       handleSubmit(fullTranscript.trim());
//       setFullTranscript("");
//     }

//     stopRecording();
//   }, [fullTranscript, handleSubmit, stopRecording]);

//   const toggleRecording = useCallback(() => {
//     if (isRecording) {
//       stopRecording();
//     } else {
//       startRecording();
//     }
//   }, [isRecording, stopRecording, startRecording]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//       if (recordRef.current) {
//         recordRef.current.stop();
//       }
//     };
//   }, [stream]);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
//       {/* Subtle background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-black to-purple-950/5 pointer-events-none" />
//       <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

//       {alertState.show && (
//         <div className="fixed top-4 right-4 z-50 w-96">
//           <Alert className={`
//             backdrop-blur-md border shadow-2xl
//             ${alertState.type === 'success' 
//               ? 'border-purple-500/30 bg-purple-950/80 text-purple-200' 
//               : 'border-red-500/30 bg-red-950/80 text-red-200'
//             }
//           `}>
//             {alertState.type === 'success' ? (
//               <CheckCircle className="h-5 w-5" />
//             ) : (
//               <AlertCircle className="h-5 w-5" />
//             )}
//             <AlertTitle className="font-semibold">{alertState.title}</AlertTitle>
//             <AlertDescription className="opacity-90">
//               {alertState.message}
//             </AlertDescription>
//           </Alert>
//         </div>
//       )}

//       <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6 relative z-10">
//         {/* Video Section */}
//         <div className="space-y-4">
//           <div className="relative">
//             <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-900/20">
//               {isCameraSharing ? (
//                 <>
//                   <video
//                     ref={videoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-full object-cover"
//                   />
//                   <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center gap-2">
//                     <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     <span className="text-xs font-medium">LIVE</span>
//                   </div>
//                 </>
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-gray-900">
//                   <div className="text-center space-y-4">
//                     <VideoOff size={64} className="mx-auto text-purple-400/60" />
//                     <div>
//                       <p className="text-lg font-medium text-purple-200">Camera Off</p>
//                       <p className="text-purple-400/80 text-sm">Click to enable video</p>
//                       {cameraError && (
//                         <p className="text-red-400 text-xs mt-2">{cameraError}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
              
//               <Button
//                 onClick={handleCameraSharing}
//                 size="lg"
//                 className={`
//                   absolute bottom-4 right-4 w-12 h-12 rounded-xl transition-all duration-200
//                   ${isCameraSharing 
//                     ? 'bg-red-600 hover:bg-red-700 text-white' 
//                     : 'bg-purple-600/80 hover:bg-purple-600 text-white'
//                   }
//                   hover:scale-105 active:scale-95
//                 `}
//               >
//                 {isCameraSharing ? <VideoOff size={20} /> : <Video size={20} />}
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Chat Section */}
//         <div className="space-y-4">
//           {/* Messages Container */}
//           <div className="h-[350px] overflow-y-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-900/20 p-4 space-y-3">
//             {messages.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-center">
//                 <div className="space-y-3">
//                   <Sparkles size={40} className="mx-auto text-purple-400/60" />
//                   <div>
//                     <p className="text-purple-200 font-medium">Ready for Interview</p>
//                     <p className="text-purple-400/80 text-sm">Start speaking to begin</p>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <Card
//                     className={`
//                       max-w-[80%] border-0 shadow-lg
//                       ${msg.role === "user" 
//                         ? "bg-purple-700/30 text-purple-100" 
//                         : "bg-gray-800/50 text-gray-200"
//                       }
//                     `}
//                   >
//                     <CardContent className="p-3">
//                       <CardDescription className={`
//                         text-sm leading-relaxed
//                         ${msg.role === "user" ? "text-purple-100" : "text-gray-300"}
//                       `}>
//                         {msg.content}
//                       </CardDescription>
//                     </CardContent>
//                   </Card>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             <Button
//               onClick={saveConversation}
//               className="flex-1 bg-purple-700/20 hover:bg-purple-700/30 text-purple-200 border border-purple-600/30 h-11 rounded-xl transition-all duration-200"
//             >
//               <Save size={18} className="mr-2" />
//               Save Interview
//             </Button>
//             <Button
//               onClick={() => setShowPopup(true)}
//               className="flex-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-100 border border-purple-500/40 h-11 rounded-xl transition-all duration-200"
//             >
//               <Sparkles size={18} className="mr-2" />
//               Start Interview
//             </Button>
//           </div>

//           {/* Interviewer Status */}
//           <div className={`
//             p-4 rounded-xl border transition-all duration-300
//             ${isInterviewerSpeaking 
//               ? 'bg-purple-900/30 border-purple-600/40' 
//               : 'bg-gray-800/30 border-gray-700/30'
//             }
//           `}>
//             <div className="flex items-center justify-center space-x-3">
//               {isInterviewerSpeaking ? (
//                 <>
//                   <Mic className="text-purple-400 animate-pulse" size={24} />
//                   <span className="font-medium text-purple-300">AI Speaking...</span>
//                 </>
//               ) : (
//                 <>
//                   <MessageCircle size={24} className="text-gray-400" />
//                   <span className="font-medium text-gray-400">Ready for Response</span>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Recording Controls */}
//           <div className="flex items-center gap-3">
//             <Card className={`
//               flex-1 p-3 border transition-all duration-200
//               ${isRecording 
//                 ? 'bg-red-900/20 border-red-600/30' 
//                 : 'bg-gray-800/30 border-gray-700/30'
//               }
//             `}>
//               <CardDescription className={`
//                 text-center text-sm font-medium
//                 ${isRecording ? 'text-red-300' : 'text-gray-400'}
//               `}>
//                 {!isRecording && isRecordingComplete
//                   ? "🎤 Press to speak"
//                   : transcript || "🎧 Listening..."}
//               </CardDescription>
//             </Card>

//             <div className="flex gap-2">
//               {!isRecording && isRecordingComplete ? (
//                 <Button
//                   onClick={startRecording}
//                   className="w-12 h-12 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 transition-all duration-200 hover:scale-105"
//                 >
//                   <Mic size={20} className="text-purple-300" />
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     onClick={handleRecordingComplete}
//                     className="w-12 h-12 rounded-xl bg-green-600/30 hover:bg-green-600/40 border border-green-500/40 transition-all duration-200 hover:scale-105"
//                   >
//                     <AudioWaveform
//                       size={20}
//                       className={`text-green-400 ${isRecording ? "animate-pulse" : ""}`}
//                     />
//                   </Button>
//                   <Button 
//                     onClick={toggleRecording}
//                     className="w-12 h-12 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 transition-all duration-200 hover:scale-105"
//                   >
//                     <Play size={20} className="text-amber-400" />
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {showPopup && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-900 border border-purple-600/30 rounded-2xl p-6 max-w-md w-full mx-4">
//             <h3 className="text-xl font-semibold text-purple-200 mb-4">Upload Resume</h3>
//             <p className="text-gray-400 mb-6">Upload your resume to personalize the interview experience.</p>
//             <div className="flex gap-3">
//               <Button
//                 onClick={() => setShowPopup(false)}
//                 className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
//               >
//                 Skip
//               </Button>
//               <Button
//                 onClick={() => {
//                   setResumeData("Sample resume data processed");
//                   setShowPopup(false);
//                 }}
//                 className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
//               >
//                 Upload
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InterviewAI;
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { 
  Camera, 
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
  X
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InterviewMessage {
  role: string;
  content: string;
  timestamp: number;
  id: string;
}

interface ResumeData {
  fileName: string;
  content: string;
  fileSize: number;
  uploadDate: number;
}

const InterviewAI: React.FC = () => {
  const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
  const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
  const [showPopup, setShowPopup] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recordRef = useRef<any | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>("");
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  const [alertState, setAlertState] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
  });
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Show alert helper
  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertState({
      show: true,
      type,
      title,
      message
    });
    
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        setSpeechRecognitionSupported(true);
      }
    }
  }, []);

  const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
    setIsInterviewerSpeaking(true);
    
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          voice: selectedVoice,
        }),
      });

      if (!response.ok) {
        throw new Error('TTS API call failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setIsInterviewerSpeaking(false);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        setIsInterviewerSpeaking(false);
      };
      
      await audio.play();
    } catch (error) {
      console.error('TTS error:', error);
      setTimeout(() => {
        setIsInterviewerSpeaking(false);
      }, 2000);
    }
  }, [selectedVoice]);

  const handleSubmit = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: InterviewMessage = {
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(7)
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const formData = new FormData();
      formData.append('message', userInput);
      formData.append('conversation', JSON.stringify(messages));
      if (resumeData) {
        formData.append('resume', resumeData.content);
      }

      const response = await fetch('/api/interview/chat', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Chat API call failed');
      
      const data = await response.json();
      
      const aiMessage: InterviewMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(7)
      };

      setMessages(prev => [...prev, aiMessage]);
      await handleTextToVoice(aiMessage.content);
      
    } catch (error) {
      console.error('Chat API error:', error);
      showAlert('error', 'Connection Error', 'Failed to connect to chat service.');
      
      const fallbackMessage: InterviewMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Could you please try again?',
        timestamp: Date.now(),
        id: Math.random().toString(36).substring(7)
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    }

    setInput('');
  }, [handleTextToVoice, resumeData, messages]);

  const saveConversation = async () => {
    if (messages.length === 0) {
      showAlert('error', 'No Content', 'No interview content to save. Please start the interview first.');
      return;
    }

    try {
      const response = await fetch('/api/save-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          resumeData,
          timestamp: Date.now(),
          duration: Date.now() - (messages[0]?.timestamp || Date.now()),
        }),
      });

      if (!response.ok) {
        throw new Error('Save API call failed');
      }

      const data = await response.json();
      showAlert('success', 'Success!', `Interview saved successfully! Session ID: ${data.sessionId}`);
      
    } catch (error) {
      console.error('Save error:', error);
      showAlert('error', 'Save Failed', 'Failed to save interview. Please try again.');
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      showAlert('error', 'Invalid File Type', 'Please upload a PDF file.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert('error', 'File Too Large', 'Please upload a file smaller than 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/interview/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      
      const newResumeData: ResumeData = {
        fileName: file.name,
        content: JSON.stringify(data.resumeSummary),
        fileSize: file.size,
        uploadDate: Date.now()
      };
      
      setResumeData(newResumeData);
      setShowPopup(false);
      setIsUploading(false);
      showAlert('success', 'Upload Successful', 'Resume processed successfully!');
      
    } catch (error) {
      setIsUploading(false);
      showAlert('error', 'Upload Failed', 'Failed to process the file. Please try again.');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    if (resumeData && messages.length === 0) {
      const initialQuestion = async () => {
        try {
          const formData = new FormData();
          formData.append('resume', resumeData.content);

          const response = await fetch('/api/interview/chat', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Initial question fetch failed');
          
          const data = await response.json();
          
          const aiMessage: InterviewMessage = {
            role: 'assistant',
            content: data.response || 'Welcome! Let\'s begin the interview.',
            timestamp: Date.now(),
            id: Math.random().toString(36).substring(7),
          };

          setMessages([aiMessage]);
          await handleTextToVoice(aiMessage.content);
        } catch (error) {
          console.error('Failed to start interview:', error);
        }
      };

      initialQuestion();
    }
  }, [resumeData, handleTextToVoice, messages.length]);
  // const saveConversation = async () => {
  //   if (messages.length === 0) {
  //     showAlert('error', 'No Content', 'No interview content to save. Please start the interview first.');
  //     return;
  //   }

  //   try {
  //     const response = await fetch('/api/interview/save', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         messages,
  //         resumeData,
  //         timestamp: Date.now(),
  //         duration: Date.now() - (messages[0]?.timestamp || Date.now()),
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Save API call failed');
  //     }

  //     const data = await response.json();
  //     showAlert('success', 'Success!', `Interview saved successfully! Session ID: ${data.sessionId}`);
      
  //   } catch (error) {
  //     console.error('Save error:', error);
  //     showAlert('error', 'Save Failed', 'Failed to save interview. Please try again.');
  //   }
  // };

  const stopCameraSharing = useCallback((): void => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraSharing(false);
    setCameraError('');
  }, [stream]);

  const handleCameraSharing = useCallback(async (): Promise<void> => {
    if (isCameraSharing) {
      stopCameraSharing();
    } else {
      try {
        setCameraError('');
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: false
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setIsCameraSharing(true);
      } catch (error) {
        console.error("Error accessing camera: ", error);
        setCameraError("Unable to access camera. Please check permissions.");
        setIsCameraSharing(false);
        showAlert('error', 'Camera Error', 'Unable to access camera. Please check permissions.');
      }
    }
  }, [isCameraSharing, stopCameraSharing]);

  const stopRecording = useCallback(() => {
    if (recordRef.current) {
      try {
        recordRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    setIsRecording(false);
    setIsRecordingComplete(true);
    setTranscript("");
  }, []);

  const startRecording = useCallback(() => {
    if (!speechRecognitionSupported) {
      showAlert('error', 'Not Supported', 'Speech recognition is not supported in this browser.');
      return;
    }

    setIsRecording(true);
    setIsRecordingComplete(false);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      showAlert('error', 'Error', 'Speech Recognition not available');
      stopRecording();
      return;
    }

    recordRef.current = new SpeechRecognition();
    recordRef.current.continuous = true;
    recordRef.current.interimResults = true;
    recordRef.current.lang = 'en-US';

    recordRef.current.onresult = (e: any) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalTranscript += e.results[i][0].transcript;
        } else {
          interimTranscript += e.results[i][0].transcript;
        }
      }
      
      setTranscript(interimTranscript);
      if (finalTranscript) {
        setFullTranscript(prev => prev + finalTranscript);
      }
    };

    recordRef.current.onerror = (e: any) => {
      console.error('Speech recognition error:', e);
      showAlert('error', 'Speech Error', 'Speech recognition error occurred');
      stopRecording();
    };

    recordRef.current.onend = () => {
      setIsRecording(false);
    };

    try {
      recordRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      showAlert('error', 'Error', 'Failed to start speech recognition');
      stopRecording();
    }
  }, [speechRecognitionSupported, stopRecording]);

  const handleRecordingComplete = useCallback(() => {
    if (recordRef.current) {
      try {
        recordRef.current.stop();
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }

    if (fullTranscript.trim()) {
      handleSubmit(fullTranscript.trim());
      setFullTranscript("");
    }

    stopRecording();
  }, [fullTranscript, handleSubmit, stopRecording]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording]);

  // File upload functionality
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeResume = () => {
    setResumeData(null);
    showAlert('success', 'Resume Removed', 'Resume has been removed successfully.');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (recordRef.current) {
        try {
          recordRef.current.stop();
        } catch (error) {
          console.error('Error cleaning up recording:', error);
        }
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-black to-purple-950/5 pointer-events-none" />
      <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {alertState.show && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert className={`
            backdrop-blur-md border shadow-2xl
            ${alertState.type === 'success' 
              ? 'border-purple-500/30 bg-purple-950/80 text-purple-200' 
              : 'border-red-500/30 bg-red-950/80 text-red-200'
            }
          `}>
            {alertState.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <AlertTitle className="font-semibold">{alertState.title}</AlertTitle>
            <AlertDescription className="opacity-90">
              {alertState.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Resume Status Bar */}
      {resumeData && (
        <div className="bg-purple-900/20 border-b border-purple-600/20 p-3 relative z-10">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-purple-400" />
              <span className="text-purple-200 text-sm font-medium">
                Resume: {resumeData.fileName} ({(resumeData.fileSize / 1024).toFixed(1)}KB)
              </span>
            </div>
            <Button
              onClick={removeResume}
              size="sm"
              variant="ghost"
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/20"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 grid lg:grid-cols-2 gap-6 p-6 relative z-10">
        {/* Video Section */}
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-900/20">
              {isCameraSharing ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">LIVE</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center space-y-4">
                    <VideoOff size={64} className="mx-auto text-purple-400/60" />
                    <div>
                      <p className="text-lg font-medium text-purple-200">Camera Off</p>
                      <p className="text-purple-400/80 text-sm">Click to enable video</p>
                      {cameraError && (
                        <p className="text-red-400 text-xs mt-2">{cameraError}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <Button
                onClick={handleCameraSharing}
                size="lg"
                className={`
                  absolute bottom-4 right-4 w-12 h-12 rounded-xl transition-all duration-200
                  ${isCameraSharing 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-purple-600/80 hover:bg-purple-600 text-white'
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                {isCameraSharing ? <VideoOff size={20} /> : <Video size={20} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="space-y-4">
          {/* Messages Container */}
          <div className="h-[350px] overflow-y-auto bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-purple-900/20 p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div className="space-y-3">
                  <Sparkles size={40} className="mx-auto text-purple-400/60" />
                  <div>
                    <p className="text-purple-200 font-medium">Ready for Interview</p>
                    <p className="text-purple-400/80 text-sm">Start speaking to begin</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`
                      max-w-[80%] border-0 shadow-lg
                      ${msg.role === "user" 
                        ? "bg-purple-700/30 text-purple-100" 
                        : "bg-gray-800/50 text-gray-200"
                      }
                    `}
                  >
                    <CardContent className="p-3">
                      <CardDescription className={`
                        text-sm leading-relaxed
                        ${msg.role === "user" ? "text-purple-100" : "text-gray-300"}
                      `}>
                        {msg.content}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={saveConversation}
              className="flex-1 bg-purple-700/20 hover:bg-purple-700/30 text-purple-200 border border-purple-600/30 h-11 rounded-xl transition-all duration-200"
            >
              <Save size={18} className="mr-2" />
              Save Interview
            </Button>
            <Button
              onClick={() => setShowPopup(true)}
              className="flex-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-100 border border-purple-500/40 h-11 rounded-xl transition-all duration-200"
            >
              <Sparkles size={18} className="mr-2" />
              {resumeData ? 'Update Resume' : 'Start Interview'}
            </Button>
          </div>

          {/* Interviewer Status */}
          <div className={`
            p-4 rounded-xl border transition-all duration-300
            ${isInterviewerSpeaking 
              ? 'bg-purple-900/30 border-purple-600/40' 
              : 'bg-gray-800/30 border-gray-700/30'
            }
          `}>
            <div className="flex items-center justify-center space-x-3">
              {isInterviewerSpeaking ? (
                <>
                  <Mic className="text-purple-400 animate-pulse" size={24} />
                  <span className="font-medium text-purple-300">AI Speaking...</span>
                </>
              ) : (
                <>
                  <MessageCircle size={24} className="text-gray-400" />
                  <span className="font-medium text-gray-400">Ready for Response</span>
                </>
              )}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center gap-3">
            <Card className={`
              flex-1 p-3 border transition-all duration-200
              ${isRecording 
                ? 'bg-red-900/20 border-red-600/30' 
                : 'bg-gray-800/30 border-gray-700/30'
              }
            `}>
              <CardDescription className={`
                text-center text-sm font-medium
                ${isRecording ? 'text-red-300' : 'text-gray-400'}
              `}>
                {!isRecording && isRecordingComplete
                  ? "🎤 Press to speak"
                  : transcript || "🎧 Listening..."}
              </CardDescription>
            </Card>

            <div className="flex gap-2">
              {!isRecording && isRecordingComplete ? (
                <Button
                  onClick={startRecording}
                  className="w-12 h-12 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 transition-all duration-200 hover:scale-105"
                  disabled={!speechRecognitionSupported}
                >
                  <Mic size={20} className="text-purple-300" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleRecordingComplete}
                    className="w-12 h-12 rounded-xl bg-green-600/30 hover:bg-green-600/40 border border-green-500/40 transition-all duration-200 hover:scale-105"
                  >
                    <AudioWaveform
                      size={20}
                      className={`text-green-400 ${isRecording ? "animate-pulse" : ""}`}
                    />
                  </Button>
                  <Button 
                    onClick={toggleRecording}
                    className="w-12 h-12 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 transition-all duration-200 hover:scale-105"
                  >
                    <Play size={20} className="text-amber-400" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Resume Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-purple-600/30 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-purple-200 mb-4">
              {resumeData ? 'Update Resume' : 'Upload Resume'}
            </h3>
            <p className="text-gray-400 mb-6">
              {resumeData 
                ? 'Upload a new resume to replace the current one.'
                : 'Upload your resume to personalize the interview experience.'
              }
            </p>
            
            {/* Upload Area */}
            <div 
              onClick={triggerFileUpload}
              className="border-2 border-dashed border-purple-600/30 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors mb-6"
            >
              <Upload size={32} className="mx-auto text-purple-400 mb-3" />
              <p className="text-purple-200 font-medium mb-1">
                {isUploading ? 'Uploading...' : 'Click to upload resume'}
              </p>
              <p className="text-gray-400 text-sm">
                PDF, DOC, DOCX, or TXT files (max 5MB)
              </p>
            </div>

            {/* Current Resume Info */}
            {resumeData && (
              <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-purple-400" />
                  <span className="text-purple-200 text-sm font-medium">
                    Current: {resumeData.fileName}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
                disabled={isUploading}
              >
                {resumeData ? 'Cancel' : 'Skip'}
              </Button>
              <Button
                onClick={triggerFileUpload}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewAI;
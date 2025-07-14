// 'use client'
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription } from "@/components/ui/card";

// import { useRouter } from 'next/navigation';

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
//   AlertCircle,
//   Upload,
//   FileText,
//   X,
//  Check
// } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// interface InterviewMessage {
//   role: string;
//   content: string;
//   timestamp: number;
//   id: string;
// }

// interface ResumeData {
//   fileName: string;
//   content: string;
//   fileSize: number;
//   uploadDate: number;
// }

// const InterviewAI: React.FC = () => {
//   const [isCameraSharing, setIsCameraSharing] = useState<boolean>(false);
//   const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState<boolean>(false);
//   const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
//   const [showPopup, setShowPopup] = useState(false);
//   const [resumeData, setResumeData] = useState<ResumeData | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const recordRef = useRef<any | null>(null);
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
//   const [transcript, setTranscript] = useState<string>("");
//   const [fullTranscript, setFullTranscript] = useState<string>("");
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
//   const audioRef = useRef<HTMLAudioElement | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const router = useRouter();



//   // Show alert helper
//   const showAlert = (type: 'success' | 'error', title: string, message: string) => {
//     setAlertState({
//       show: true,
//       type,
//       title,
//       message
//     });
    
//     setTimeout(() => {
//       setAlertState(prev => ({ ...prev, show: false }));
//     }, 4000);
//   };

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//         setSpeechRecognitionSupported(true);
//       }
//     }
//   }, []);

//   // Initialize audio element
//   useEffect(() => {
//     audioRef.current = new Audio();
//     return () => {
//       if (audioRef.current) {
//         audioRef.current.pause();
//         audioRef.current.src = '';
//       }
//     };
//   }, []);


// const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
//   if (!content || content.trim() === '') {
//     showAlert('error', 'Error', 'No text provided for speech generation');
//     return;
//   }

//   setIsInterviewerSpeaking(true);
  
//   try {
//     console.log('Generating speech for:', content.substring(0, 50) + '...');
    
//     const response = await fetch('/api/text-to-speech', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         text: content.trim(),
//         voiceId: selectedVoice || "en-US-terrell"
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('API Error Response:', errorText);
      
//       let errorMessage = 'Failed to generate speech';
//       try {
//         const errorData = JSON.parse(errorText);
//         errorMessage = errorData.error || errorData.message || errorMessage;
//       } catch {
//         errorMessage = errorText || errorMessage;
//       }
      
//       throw new Error(errorMessage);
//     }

//     const audioBlob = await response.blob();
    
//     if (audioBlob.size === 0) {
//       throw new Error('Received empty audio file');
//     }

//     const audioUrl = URL.createObjectURL(audioBlob);
    
//     if (audioRef.current) {
//       // Clean up previous audio
//       if (audioRef.current.src) {
//         URL.revokeObjectURL(audioRef.current.src);
//       }
      
//       audioRef.current.src = audioUrl;
      
//       audioRef.current.onended = () => {
//         URL.revokeObjectURL(audioUrl);
//         setIsInterviewerSpeaking(false);
//       };
      
//       audioRef.current.onerror = (error) => {
//         console.error('Audio playback error:', error);
//         URL.revokeObjectURL(audioUrl);
//         setIsInterviewerSpeaking(false);
//         showAlert('error', 'Playback Error', 'Could not play the audio response.');
//       };
      
//       await audioRef.current.play();
//     }
//   } catch (error) {
//     console.error('TTS error:', error);
//     setIsInterviewerSpeaking(false);
    
//     // Convert error to string to avoid rendering Error objects
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     showAlert('error', 'Speech Error', errorMessage);
//   }
// }, [selectedVoice, showAlert]);



//   const handleSubmit = useCallback(async (userInput: string) => {
//     if (!userInput.trim()) return;

//     const userMessage: InterviewMessage = {
//       role: 'user',
//       content: userInput,
//       timestamp: Date.now(),
//       id: Math.random().toString(36).substring(7)
//     };

//     setMessages(prev => [...prev, userMessage]);

//     try {
//       const formData = new FormData();
//       formData.append('message', userInput);
//       formData.append('conversation', JSON.stringify(messages));
//       if (resumeData) {
//         formData.append('resume', resumeData.content);
//       }

//       const response = await fetch('/api/interview/chat', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Chat API call failed');
      
//       const data = await response.json();
      
//       const aiMessage: InterviewMessage = {
//         role: 'assistant',
//         content: data.response,
//         timestamp: Date.now(),
//         id: Math.random().toString(36).substring(7)
//       };

//       setMessages(prev => [...prev, aiMessage]);
//       await handleTextToVoice(aiMessage.content);
      
//     } catch (error) {
//       console.error('Chat API error:', error);
//       showAlert('error', 'Connection Error', 'Failed to connect to chat service.');
      
//       const fallbackMessage: InterviewMessage = {
//         role: 'assistant',
//         content: 'I apologize, but I\'m having trouble connecting right now. Could you please try again?',
//         timestamp: Date.now(),
//         id: Math.random().toString(36).substring(7)
//       };
      
//       setMessages(prev => [...prev, fallbackMessage]);
//     }

//     setInput('');
//   }, [handleTextToVoice, resumeData, messages]);

//   // const handleSubmit = useCallback(async (userInput: string) => {
//   //   if (!userInput.trim()) return;

//   //   const userMessage: InterviewMessage = {
//   //     role: 'user',
//   //     content: userInput,
//   //     timestamp: Date.now(),
//   //     id: Math.random().toString(36).substring(7)
//   //   };

//   //   setMessages(prev => [...prev, userMessage]);

//   //   try {
//   //     const formData = new FormData();
//   //     formData.append('message', userInput);
//   //     formData.append('conversation', JSON.stringify(messages));
//   //     if (resumeData) {
//   //       formData.append('resume', resumeData.content);
//   //     }

//   //     const response = await fetch('/api/interview/chat', {
//   //       method: 'POST',
//   //       body: formData,
//   //     });

//   //     if (!response.ok) throw new Error('Chat API call failed');
      
//   //     const data = await response.json();
      
//   //     const aiMessage: InterviewMessage = {
//   //       role: 'assistant',
//   //       content: data.response,
//   //       timestamp: Date.now(),
//   //       id: Math.random().toString(36).substring(7)
//   //     };

//   //     setMessages(prev => [...prev, aiMessage]);
//   //     await handleTextToVoice(aiMessage.content);
      
//   //   } catch (error) {
//   //     console.error('Chat API error:', error);
//   //     showAlert('error', 'Connection Error', 'Failed to connect to chat service.');
      
//   //     const fallbackMessage: InterviewMessage = {
//   //       role: 'assistant',
//   //       content: 'I apologize, but I\'m having trouble connecting right now. Could you please try again?',
//   //       timestamp: Date.now(),
//   //       id: Math.random().toString(36).substring(7)
//   //     };
      
//   //     setMessages(prev => [...prev, fallbackMessage]);
//   //   }

//   //   setInput('');
//   // }, [handleTextToVoice, resumeData, messages]);
//   const handleSaveConversation = async () => {
//     setIsSaving(true);
//     setSaveSuccess(false);
    
//     try {
//       await saveConversation();
//       setSaveSuccess(true);

//       setTimeout(() => {
//         router.push('/profile');
//       }, 1500);
//     } catch (error) {
//       console.error('Failed to save conversation:', error);
//       setIsSaving(false);

//     }
//   };
//   const saveConversation = async () => {
//     if (messages.length === 0) {
//       showAlert('error', 'No Content', 'No interview content to save. Please start the interview first.');
//       return;
//     }

//     try {
//       const response = await fetch('/api/save-interview', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages,
//           resumeData,
//           timestamp: Date.now(),
//           duration: Date.now() - (messages[0]?.timestamp || Date.now()),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Save API call failed');
//       }

//       const data = await response.json();
//       showAlert('success', 'Success!', `Interview saved successfully! Session ID: ${data.sessionId}`);
      
//     } catch (error) {
//       console.error('Save error:', error);
//       showAlert('error', 'Save Failed', 'Failed to save interview. Please try again.');
//     }
//   };

//   const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.includes('pdf')) {
//       showAlert('error', 'Invalid File Type', 'Please upload a PDF file.');
//       return;
//     }

//     const maxSize = 5 * 1024 * 1024;
//     if (file.size > maxSize) {
//       showAlert('error', 'File Too Large', 'Please upload a file smaller than 5MB.');
//       return;
//     }

//     setIsUploading(true);

//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await fetch('/api/interview/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) throw new Error('Upload failed');
      
//       const data = await response.json();
      
//       const newResumeData: ResumeData = {
//         fileName: file.name,
//         content: JSON.stringify(data.resumeSummary),
//         fileSize: file.size,
//         uploadDate: Date.now()
//       };
      
//       setResumeData(newResumeData);
//       setShowPopup(false);
//       setIsUploading(false);
//       showAlert('success', 'Upload Successful', 'Resume processed successfully!');
      
//     } catch (error) {
//       setIsUploading(false);
//       showAlert('error', 'Upload Failed', 'Failed to process the file. Please try again.');
//     }

//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   }, []);

//   useEffect(() => {
//     if (resumeData && messages.length === 0) {
//       const initialQuestion = async () => {
//         try {
//           const formData = new FormData();
//           formData.append('resume', resumeData.content);

//           const response = await fetch('/api/interview/chat', {
//             method: 'POST',
//             body: formData,
//           });

//           if (!response.ok) throw new Error('Initial question fetch failed');
          
//           const data = await response.json();
          
//           const aiMessage: InterviewMessage = {
//             role: 'assistant',
//             content: data.response || 'Welcome! Let\'s begin the interview.',
//             timestamp: Date.now(),
//             id: Math.random().toString(36).substring(7),
//           };

//           setMessages([aiMessage]);
//           await handleTextToVoice(aiMessage.content);
//         } catch (error) {
//           console.error('Failed to start interview:', error);
//         }
//       };

//       initialQuestion();
//     }
//   }, [resumeData, handleTextToVoice, messages.length]);
//   // const saveConversation = async () => {
//   //   if (messages.length === 0) {
//   //     showAlert('error', 'No Content', 'No interview content to save. Please start the interview first.');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch('/api/interview/save', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         messages,
//   //         resumeData,
//   //         timestamp: Date.now(),
//   //         duration: Date.now() - (messages[0]?.timestamp || Date.now()),
//   //       }),
//   //     });

//   //     if (!response.ok) {
//   //       throw new Error('Save API call failed');
//   //     }

//   //     const data = await response.json();
//   //     showAlert('success', 'Success!', `Interview saved successfully! Session ID: ${data.sessionId}`);
      
//   //   } catch (error) {
//   //     console.error('Save error:', error);
//   //     showAlert('error', 'Save Failed', 'Failed to save interview. Please try again.');
//   //   }
//   // };

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
//         showAlert('error', 'Camera Error', 'Unable to access camera. Please check permissions.');
//       }
//     }
//   }, [isCameraSharing, stopCameraSharing]);

//   const stopRecording = useCallback(() => {
//     if (recordRef.current) {
//       try {
//         recordRef.current.stop();
//       } catch (error) {
//         console.error('Error stopping recording:', error);
//       }
//     }
//     setIsRecording(false);
//     setIsRecordingComplete(true);
//     setTranscript("");
//   }, []);

//   const startRecording = useCallback(() => {
//     if (!speechRecognitionSupported) {
//       showAlert('error', 'Not Supported', 'Speech recognition is not supported in this browser.');
//       return;
//     }

//     setIsRecording(true);
//     setIsRecordingComplete(false);

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
//     if (!SpeechRecognition) {
//       showAlert('error', 'Error', 'Speech Recognition not available');
//       stopRecording();
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
//       showAlert('error', 'Speech Error', 'Speech recognition error occurred');
//       stopRecording();
//     };

//     recordRef.current.onend = () => {
//       setIsRecording(false);
//     };

//     try {
//       recordRef.current.start();
//     } catch (error) {
//       console.error('Error starting speech recognition:', error);
//       showAlert('error', 'Error', 'Failed to start speech recognition');
//       stopRecording();
//     }
//   }, [speechRecognitionSupported, stopRecording]);

//   const handleRecordingComplete = useCallback(() => {
//     if (recordRef.current) {
//       try {
//         recordRef.current.stop();
//       } catch (error) {
//         console.error('Error stopping recording:', error);
//       }
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

//   // File upload functionality
  
//   const triggerFileUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const removeResume = () => {
//     setResumeData(null);
//     showAlert('success', 'Resume Removed', 'Resume has been removed successfully.');
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//       if (recordRef.current) {
//         try {
//           recordRef.current.stop();
//         } catch (error) {
//           console.error('Error cleaning up recording:', error);
//         }
//       }
//     };
//   }, [stream]);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
//       {/* Subtle background effects */}
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-950/10 via-black to-purple-950/5 pointer-events-none" />
//       <div className="absolute top-20 left-1/3 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
//       <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />

//       {/* Hidden file input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf,.doc,.docx,.txt"
//         onChange={handleFileUpload}
//         className="hidden"
//       />

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

//       {/* Resume Status Bar */}
//       {resumeData && (
//         <div className="bg-purple-900/20 border-b border-purple-600/20 p-3 relative z-10">
//           <div className="flex items-center justify-between max-w-6xl mx-auto">
//             <div className="flex items-center gap-3">
//               <FileText size={20} className="text-purple-400" />
//               <span className="text-purple-200 text-sm font-medium">
//                 Resume: {resumeData.fileName} ({(resumeData.fileSize / 1024).toFixed(1)}KB)
//               </span>
//             </div>
//             <Button
//               onClick={removeResume}
//               size="sm"
//               variant="ghost"
//               className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/20"
//             >
//               <X size={16} />
//             </Button>
//           </div>
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
//           {/* <div className="flex gap-3">
//             <Button
//               onClick={saveConversation}
//               className="flex-1 bg-purple-700/20 hover:bg-purple-700/30 text-purple-200 border border-purple-600/30 h-11 rounded-xl transition-all duration-200"
//             >
//               <Save size={18} className="mr-2" />
//               Save Interview
//               //redirect to /profie
//             </Button>
//             <Button
//               onClick={() => setShowPopup(true)}
//               className="flex-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-100 border border-purple-500/40 h-11 rounded-xl transition-all duration-200"
//             >
//               <Sparkles size={18} className="mr-2" />
//               {resumeData ? 'Update Resume' : 'Start Interview'}
//             </Button>
//           </div> */}
//           <div className="flex gap-3">
//   <Button
//     onClick={handleSaveConversation}
//     disabled={isSaving || saveSuccess}
//     className="flex-1 bg-purple-700/20 hover:bg-purple-700/30 text-purple-200 border border-purple-600/30 h-11 rounded-xl transition-all duration-200 disabled:opacity-50"
//   >
//     {saveSuccess ? (
//       <>
//         <Check size={18} className="mr-2 text-green-400" />
//         Interview Saved!
//       </>
//     ) : isSaving ? (
//       <>
//         <div className="w-4 h-4 mr-2 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
//         Saving...
//       </>
//     ) : (
//       <>
//         <Save size={18} className="mr-2" />
//         Save Interview
//       </>
//     )}
//   </Button>
  
//   <Button
//     onClick={() => setShowPopup(true)}
//     className="flex-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-100 border border-purple-500/40 h-11 rounded-xl transition-all duration-200"
//   >
//     <Sparkles size={18} className="mr-2" />
//     {resumeData ? 'Update Resume' : 'Start Interview'}
//   </Button>
// </div>

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
//                   disabled={!speechRecognitionSupported}
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

//       {/* Upload Resume Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-gray-900 border border-purple-600/30 rounded-2xl p-6 max-w-md w-full mx-4">
//             <h3 className="text-xl font-semibold text-purple-200 mb-4">
//               {resumeData ? 'Update Resume' : 'Upload Resume'}
//             </h3>
//             <p className="text-gray-400 mb-6">
//               {resumeData 
//                 ? 'Upload a new resume to replace the current one.'
//                 : 'Upload your resume to personalize the interview experience.'
//               }
//             </p>
            
//             {/* Upload Area */}
//             <div 
//               onClick={triggerFileUpload}
//               className="border-2 border-dashed border-purple-600/30 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors mb-6"
//             >
//               <Upload size={32} className="mx-auto text-purple-400 mb-3" />
//               <p className="text-purple-200 font-medium mb-1">
//                 {isUploading ? 'Uploading...' : 'Click to upload resume'}
//               </p>
//               <p className="text-gray-400 text-sm">
//                 PDF, DOC, DOCX, or TXT files (max 5MB)
//               </p>
//             </div>

//             {/* Current Resume Info */}
//             {resumeData && (
//               <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-3 mb-6">
//                 <div className="flex items-center gap-2">
//                   <FileText size={16} className="text-purple-400" />
//                   <span className="text-purple-200 text-sm font-medium">
//                     Current: {resumeData.fileName}
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="flex gap-3">
//               <Button
//                 onClick={() => setShowPopup(false)}
//                 className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200"
//                 disabled={isUploading}
//               >
//                 {resumeData ? 'Cancel' : 'Skip'}
//               </Button>
//               <Button
//                 onClick={triggerFileUpload}
//                 className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
//                 disabled={isUploading}
//               >
//                 {isUploading ? 'Uploading...' : 'Upload'}
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

import { useRouter } from 'next/navigation';

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
  X,
 Check
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
  const [selectedVoice] = useState<string>("aura-orpheus-en");
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
  const [, setInput] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  // Show alert helper - wrapped in useCallback to prevent unnecessary re-renders
  const showAlert = useCallback((type: 'success' | 'error', title: string, message: string) => {
    setAlertState({
      show: true,
      type,
      title,
      message
    });
    
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        setSpeechRecognitionSupported(true);
      }
    }
  }, []);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
    if (!content || content.trim() === '') {
      showAlert('error', 'Error', 'No text provided for speech generation');
      return;
    }

    setIsInterviewerSpeaking(true);
    
    try {
      console.log('Generating speech for:', content.substring(0, 50) + '...');
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content.trim(),
          voiceId: selectedVoice || "en-US-terrell"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = 'Failed to generate speech';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio file');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        // Clean up previous audio
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        
        audioRef.current.src = audioUrl;
        
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsInterviewerSpeaking(false);
        };
        
        audioRef.current.onerror = (error) => {
          console.error('Audio playback error:', error);
          URL.revokeObjectURL(audioUrl);
          setIsInterviewerSpeaking(false);
          showAlert('error', 'Playback Error', 'Could not play the audio response.');
        };
        
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsInterviewerSpeaking(false);
      
      // Convert error to string to avoid rendering Error objects
      const errorMessage = error instanceof Error ? error.message : String(error);
      showAlert('error', 'Speech Error', errorMessage);
    }
  }, [selectedVoice, showAlert]);

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
  }, [handleTextToVoice, resumeData, messages, showAlert]);

  const handleSaveConversation = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await saveConversation();
      setSaveSuccess(true);

      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      setIsSaving(false);
    }
  };

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
  }, [showAlert]);

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
  }, [isCameraSharing, stopCameraSharing, showAlert]);

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
  }, [speechRecognitionSupported, stopRecording, showAlert]);

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
              onClick={handleSaveConversation}
              disabled={isSaving || saveSuccess}
              className="flex-1 bg-purple-700/20 hover:bg-purple-700/30 text-purple-200 border border-purple-600/30 h-11 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check size={18} className="mr-2 text-green-400" />
                  Interview Saved!
                </>
              ) : isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-purple-300 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Save Interview
                </>
              )}
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

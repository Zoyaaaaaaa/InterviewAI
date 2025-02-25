// // 'use client'

// // import React, { useState, useRef } from 'react';
// // import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// // import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// // import { Button } from '@/components/ui/button';
// // import { Check, ChevronsUpDown } from 'lucide-react';
// // import { BsImageFill } from 'react-icons/bs';
// // import convertor from '@/lib/converter';
// // import { cn } from '@/lib/utils'; // Make sure you have this utility

// // interface VoiceModel {
// //   label: string;
// //   value: string;
// // }

// // const ResumeProcessor = () => {

// //   const [processing, setProcessing] = useState<boolean>(false);
// //   const [resumeText, setResumeText] = useState<string>('');
// //   const imageInputRef = useRef<HTMLInputElement>(null);

// //   const voiceModels: VoiceModel[] = [
// //     { label: "Professional Interviewer", value: "professional" },
// //     { label: "Friendly Mentor", value: "friendly" },
// //     { label: "Technical Expert", value: "technical" },
// //     { label: "Industry Veteran", value: "veteran" }
// //   ];

// //   const handleFileUpload = async (file: File | null) => {
// //     if (!file) return;
    
// //     setProcessing(true);
// //     const url = URL.createObjectURL(file);
// //     try {
// //       const text = await convertor(url);
// //       setResumeText(text);
// //     } catch (error) {
// //       console.error('Error processing resume:', error);
// //     }
// //     setProcessing(false);
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div 
// //         className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer"
// //         onClick={() => imageInputRef.current?.click()}
// //         onDragOver={(e: React.DragEvent) => e.preventDefault()}
// //         onDrop={(e: React.DragEvent) => {
// //           e.preventDefault();
// //           const file = e.dataTransfer.files[0];
// //           handleFileUpload(file);
// //         }}
// //       >
// //         <input
// //           type="file"
// //           ref={imageInputRef}
// //           hidden
// //           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
// //             const file = e.target.files?.[0];
// //             handleFileUpload(file || null);
// //           }}
// //           accept="image/*,.pdf,.doc,.docx"
// //         />
// //         <BsImageFill className={`w-16 h-16 mx-auto mb-4 text-gray-400 ${processing ? 'animate-pulse' : ''}`} />
// //         <p className="text-lg text-neutral-300">
// //           {processing ? 'Processing Resume...' : 'Drop your resume or click to browse'}
// //         </p>
// //       </div>


// //       {resumeText && (
// //         <div className="p-4 bg-black/30 rounded-lg border border-neutral-800">
// //           <h3 className="font-semibold mb-2 text-neutral-200">Extracted Text</h3>
// //           <p className="text-sm text-neutral-400 max-h-48 overflow-y-auto">
// //             {resumeText}
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ResumeProcessor;

// '/* The above code is a TypeScript React component called `ResumeProcessor`. It is a component that allows users to upload a resume file (image, PDF, DOC, DOCX) which is then processed to extract text content. The extracted text is saved locally in the browser for 15 minutes using `localStorage`. */'
// 'use client'

// import React, { useState, useRef, useEffect } from 'react';
// import { BsImageFill } from 'react-icons/bs';
// import convertor from '@/lib/converter';

// interface StoredResume {
//   text: string;
//   timestamp: number;
// }

// interface ChatMessage {
//   content: string;
//   role: 'user' | 'assistant' | 'system';
// }

// const ResumeProcessor = () => {
//   const [processing, setProcessing] = useState<boolean>(false);
//   const [resumeText, setResumeText] = useState<string>('');
//   const [statusMessage, setStatusMessage] = useState<string>('');
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const imageInputRef = useRef<HTMLInputElement>(null);
  
//   useEffect(() => {
//     const checkStoredResume = () => {
//       const storedData = localStorage.getItem('storedResume');
//       if (storedData) {
//         const { text, timestamp }: StoredResume = JSON.parse(storedData);
//         const now = Date.now();
//         const fifteenMinutes = 15 * 60 * 1000;
        
//         if (now - timestamp < fifteenMinutes) {
//           setResumeText(text);
//         } else {
//           localStorage.removeItem('storedResume');
//           setResumeText('');
//         }
//       }
//     };

//     checkStoredResume();
//     const interval = setInterval(checkStoredResume, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   const saveToLocalStorage = (text: string) => {
//     const storedResume: StoredResume = {
//       text,
//       timestamp: Date.now()
//     };
//     localStorage.setItem('storedResume', JSON.stringify(storedResume));
//   };

//   const sendToAPI = async (text: string) => {
//     try {
//       // Initialize chat with system message
//       const initialMessages: ChatMessage[] = [
//         { role: 'system', content: 'Starting interview based on resume.' },
//       ];

//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           messages: initialMessages,
//           resumeText: text 
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send to API');
//       }

//       // Handle streaming response
//       const reader = response.body?.getReader();
//       let chatResponse = '';

//       if (reader) {
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;
          
//           // Convert the stream chunk to text
//           const chunk = new TextDecoder().decode(value);
//           chatResponse += chunk;
          
//           // Update messages as they stream in
//           const newMessage: ChatMessage = {
//             role: 'assistant',
//             content: chatResponse
//           };
//           setMessages(prev => [...initialMessages, newMessage]);
//         }
//       }

//       setStatusMessage('Resume processed and chat initialized');
//       setTimeout(() => setStatusMessage(''), 3000);
      
//     } catch (error) {
//       console.error('API Error:', error);
//       setStatusMessage('Failed to process resume');
//       setTimeout(() => setStatusMessage(''), 3000);
//     }
//   };

//   const handleFileUpload = async (file: File | null) => {
//     if (!file) return;
    
//     setProcessing(true);
//     setStatusMessage('');
//     const url = URL.createObjectURL(file);
    
//     try {
//       const text = await convertor(url);
//       setResumeText(text);
//       saveToLocalStorage(text);
//       await sendToAPI(text);
//     } catch (error) {
//       console.error('Error processing resume:', error);
//       setStatusMessage('Failed to process file');
//       setTimeout(() => setStatusMessage(''), 3000);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-2xl mx-auto">
//       {statusMessage && (
//         <div className={`p-3 rounded-md text-center ${
//           statusMessage.includes('Failed') 
//             ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
//             : 'bg-green-500/10 text-green-400 border border-green-500/20'
//         }`}>
//           {statusMessage}
//         </div>
//       )}

//       <div 
//         className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
//         onClick={() => imageInputRef.current?.click()}
//         onDragOver={(e: React.DragEvent) => e.preventDefault()}
//         onDrop={(e: React.DragEvent) => {
//           e.preventDefault();
//           const file = e.dataTransfer.files[0];
//           handleFileUpload(file);
//         }}
//       >
//         <input
//           type="file"
//           ref={imageInputRef}
//           hidden
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//             const file = e.target.files?.[0];
//             handleFileUpload(file || null);
//           }}
//           accept="image/*,.pdf,.doc,.docx"
//         />
//         <BsImageFill className={`w-16 h-16 mx-auto mb-4 text-gray-400 ${processing ? 'animate-pulse' : ''}`} />
//         <p className="text-lg text-neutral-300">
//           {processing ? 'Processing Resume...' : 'Drop your resume or click to browse'}
//         </p>
//       </div>

//       {resumeText && (
//         <div className="p-4 bg-black/30 rounded-lg border border-neutral-800">
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="font-semibold text-neutral-200">Extracted Text</h3>
//             <span className="text-xs text-neutral-400">
//               Saved for 15 minutes
//             </span>
//           </div>
//           <p className="text-sm text-neutral-400 max-h-48 overflow-y-auto">
//             {resumeText}
//           </p>
//         </div>
//       )}

//       {messages.length > 0 && (
//         <div className="p-4 bg-black/30 rounded-lg border border-neutral-800">
//           <h3 className="font-semibold text-neutral-200 mb-2">Interview Chat</h3>
//           <div className="space-y-4">
//             {messages.map((message, index) => (
//               <div key={index} className="text-sm text-neutral-300">
//                 <span className="font-medium">{message.role}: </span>
//                 {message.content}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeProcessor;

// "use client";

// import { useState, useEffect } from "react";

// export default function Interview() {
//   const [resumeText, setResumeText] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [response, setResponse] = useState<string>("");

//   // Fetch stored resume from local storage
//   useEffect(() => {
//     const storedResume = localStorage.getItem("storedResume");
//     if (storedResume) {
//       setResumeText(storedResume);
//     }
//   }, []);

//   // Function to handle file upload and convert to text
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setLoading(true);

//     try {
//       const url = URL.createObjectURL(file);
//       const text = await convertor(url);

//       console.log("Extracted Resume Text:", text); // Debugging

//       if (!text) {
//         alert("Failed to extract text. Please try another file.");
//         setLoading(false);
//         return;
//       }

//       setResumeText(text);
//       localStorage.setItem("storedResume", text); // Store for persistence
//     } catch (error) {
//       console.error("Error extracting text:", error);
//       alert("Error extracting text. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to send resume text to API
//   const sendToAPI = async () => {
//     if (!resumeText.trim()) {
//       alert("No resume text available.");
//       return;
//     }

//     setLoading(true);
//     setResponse("");

//     console.log("Sending Resume Text to API:", resumeText); // Debugging

//     try {
//       const res = await fetch("/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resumeText }), // Ensure it's being sent correctly
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.error || "API request failed");

//       setResponse(data.message);
//     } catch (error) {
//       console.error("Error from API:", error);
//       alert("Failed to get response from API.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">AI Interview Assistant</h1>

//       <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="mb-2" />

//       <textarea
//         className="w-full p-2 border rounded"
//         value={resumeText}
//         onChange={(e) => setResumeText(e.target.value)}
//         placeholder="Resume text will appear here..."
//         rows={6}
//       />

//       <button
//         className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//         onClick={sendToAPI}
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Send to API"}
//       </button>

//       {response && (
//         <div className="mt-4 p-2 bg-gray-100 border rounded">
//           <strong>AI Response:</strong> {response}
//         </div>
//       )}
//     </div>
//   );
// }

// // Mock convertor function (replace with actual implementation)
// async function convertor(url: string): Promise<string> {
//   // Simulate extraction process
//   return new Promise((resolve) => setTimeout(() => resolve("Extracted resume text here..."), 1000));
// }


"use client";

import TextCard from "@/components/TextCard";
import convertor from "@/lib/converter";
import React, { useRef, useState } from "react";
import { BsImageFill } from "react-icons/bs";
import { streamText } from "ai";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { createClient } from "@/utils/supabase/server";

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const Home = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<Array<string>>([]);
  const imageInputRef: any = useRef(null);
  const openBrowseImage = async () => {
    await imageInputRef.current.click();
  };

  const convert = async (url: string) => {
    if (url.length) {
      setProcessing(true);
      const txt = await convertor(url);
      setTexts((prevTexts) => [...prevTexts, txt]);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[90vh]">
      <h1 className="text-white text-4xl md:text-6xl text-center px-5 pt-5 font-[800]">
        Let's Begin the Interview with
        <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          Tesseract Js
        </span>
      </h1>
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          let url: string = URL.createObjectURL(e.target.files?.[0]!);
          convert(url);
        }}
        ref={imageInputRef}
        type="file"
        hidden
        required
      />
      <div className="relative md:bottom-10 w-full flex flex-col gap-10 items-center justify-center p-5 md:p-20">
        <div
          onClick={openBrowseImage}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            let url: string = URL.createObjectURL(e.dataTransfer.files?.[0]!);
            convert(url);
          }}
          className="w-full min-h-[30vh] md:min-h-[50vh] p-5 bg-[#202020] cursor-pointer rounded-xl flex items-center justify-center"
        >
          <div className="w-full flex items-center justify-center flex-col gap-3">
            <p className="text-2xl md:text-3xl text-center text-[#707070] font-[800]">
              {processing ? "Processing Image..." : "Browse Or Drop Your Image Here"}
            </p>
            <span className="text-8xl md:text-[150px] block text-[#5f5f5f]">
              <BsImageFill className={processing ? "animate-pulse" : ""} />
            </span>
          </div>
        </div>
        {texts.map((t, i) => <TextCard key={i} t={t} i={i} />)}
      </div>
    </div>
  );
};

export default Home;
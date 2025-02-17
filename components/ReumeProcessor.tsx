// 'use client'

// import React, { useState, useRef } from 'react';
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
// import { Button } from '@/components/ui/button';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { BsImageFill } from 'react-icons/bs';
// import convertor from '@/lib/converter';
// import { cn } from '@/lib/utils'; // Make sure you have this utility

// interface VoiceModel {
//   label: string;
//   value: string;
// }

// const ResumeProcessor = () => {

//   const [processing, setProcessing] = useState<boolean>(false);
//   const [resumeText, setResumeText] = useState<string>('');
//   const imageInputRef = useRef<HTMLInputElement>(null);

//   const voiceModels: VoiceModel[] = [
//     { label: "Professional Interviewer", value: "professional" },
//     { label: "Friendly Mentor", value: "friendly" },
//     { label: "Technical Expert", value: "technical" },
//     { label: "Industry Veteran", value: "veteran" }
//   ];

//   const handleFileUpload = async (file: File | null) => {
//     if (!file) return;
    
//     setProcessing(true);
//     const url = URL.createObjectURL(file);
//     try {
//       const text = await convertor(url);
//       setResumeText(text);
//     } catch (error) {
//       console.error('Error processing resume:', error);
//     }
//     setProcessing(false);
//   };

//   return (
//     <div className="space-y-6">
//       <div 
//         className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer"
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
//           <h3 className="font-semibold mb-2 text-neutral-200">Extracted Text</h3>
//           <p className="text-sm text-neutral-400 max-h-48 overflow-y-auto">
//             {resumeText}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeProcessor;

'use client'

import React, { useState, useRef, useEffect } from 'react';
import { BsImageFill } from 'react-icons/bs';
import convertor from '@/lib/converter';

interface StoredResume {
  text: string;
  timestamp: number;
}

interface ChatMessage {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

const ResumeProcessor = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [resumeText, setResumeText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const checkStoredResume = () => {
      const storedData = localStorage.getItem('storedResume');
      if (storedData) {
        const { text, timestamp }: StoredResume = JSON.parse(storedData);
        const now = Date.now();
        const fifteenMinutes = 15 * 60 * 1000;
        
        if (now - timestamp < fifteenMinutes) {
          setResumeText(text);
        } else {
          localStorage.removeItem('storedResume');
          setResumeText('');
        }
      }
    };

    checkStoredResume();
    const interval = setInterval(checkStoredResume, 60000);
    return () => clearInterval(interval);
  }, []);

  const saveToLocalStorage = (text: string) => {
    const storedResume: StoredResume = {
      text,
      timestamp: Date.now()
    };
    localStorage.setItem('storedResume', JSON.stringify(storedResume));
  };

  const sendToAPI = async (text: string) => {
    try {
      // Initialize chat with system message
      const initialMessages: ChatMessage[] = [
        { role: 'system', content: 'Starting interview based on resume.' },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: initialMessages,
          resumeText: text 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send to API');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      let chatResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Convert the stream chunk to text
          const chunk = new TextDecoder().decode(value);
          chatResponse += chunk;
          
          // Update messages as they stream in
          const newMessage: ChatMessage = {
            role: 'assistant',
            content: chatResponse
          };
          setMessages(prev => [...initialMessages, newMessage]);
        }
      }

      setStatusMessage('Resume processed and chat initialized');
      setTimeout(() => setStatusMessage(''), 3000);
      
    } catch (error) {
      console.error('API Error:', error);
      setStatusMessage('Failed to process resume');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    
    setProcessing(true);
    setStatusMessage('');
    const url = URL.createObjectURL(file);
    
    try {
      const text = await convertor(url);
      setResumeText(text);
      saveToLocalStorage(text);
      await sendToAPI(text);
    } catch (error) {
      console.error('Error processing resume:', error);
      setStatusMessage('Failed to process file');
      setTimeout(() => setStatusMessage(''), 3000);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {statusMessage && (
        <div className={`p-3 rounded-md text-center ${
          statusMessage.includes('Failed') 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {statusMessage}
        </div>
      )}

      <div 
        className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
        onClick={() => imageInputRef.current?.click()}
        onDragOver={(e: React.DragEvent) => e.preventDefault()}
        onDrop={(e: React.DragEvent) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          handleFileUpload(file);
        }}
      >
        <input
          type="file"
          ref={imageInputRef}
          hidden
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            handleFileUpload(file || null);
          }}
          accept="image/*,.pdf,.doc,.docx"
        />
        <BsImageFill className={`w-16 h-16 mx-auto mb-4 text-gray-400 ${processing ? 'animate-pulse' : ''}`} />
        <p className="text-lg text-neutral-300">
          {processing ? 'Processing Resume...' : 'Drop your resume or click to browse'}
        </p>
      </div>

      {resumeText && (
        <div className="p-4 bg-black/30 rounded-lg border border-neutral-800">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-neutral-200">Extracted Text</h3>
            <span className="text-xs text-neutral-400">
              Saved for 15 minutes
            </span>
          </div>
          <p className="text-sm text-neutral-400 max-h-48 overflow-y-auto">
            {resumeText}
          </p>
        </div>
      )}

      {messages.length > 0 && (
        <div className="p-4 bg-black/30 rounded-lg border border-neutral-800">
          <h3 className="font-semibold text-neutral-200 mb-2">Interview Chat</h3>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="text-sm text-neutral-300">
                <span className="font-medium">{message.role}: </span>
                {message.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeProcessor;
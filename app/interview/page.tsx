'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { 
  Camera, 
  Mic, 
  MessageCircle, 
  AudioWaveform, 
  Play, 
  Check, 
  ChevronsUpDown
} from "lucide-react";
import { cn, voiceModels } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { createClient } from '@/utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import ResumeProcessor from '@/components/ReumeProcessor';

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
  const [selectedVoice, setSelectedVoice] = useState<string>("aura-orpheus-en");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const recordRef = useRef<any | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isRecordingComplete, setIsRecordingComplete] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>("");
  const [fullTranscript, setFullTranscript] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);
  const [alertState, setAlertState] = useState({
    show: false,
    type: 'success',
    title: '',
    message: ''
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
      if (message.role !== "user") {
        await handleTextToVoice(message.content);
      }
    },
  });

  const saveConversation = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const conversationString = messages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    try {
      const response = await fetch("/api/save-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: conversationString,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save conversation");
      }

      const data = await response.json();
      console.log("Conversation saved successfully:", data);
      setAlertState({
        show: true,
        type: 'success',
        title: 'Success!',
        message: 'Interview saved successfully! Redirecting to feedback...'
      });
  

      setTimeout(() => {
        window.location.href = "/profile";
      }, 1000);
  
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  <Button
    onClick={saveConversation}
    className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
  >
    Save Conversation
  </Button>
  
  
  const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
    setIsInterviewerSpeaking(true);
    try {
      const response = await fetch('/api/deepgram', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Voice-Model': selectedVoice
        },
        body: JSON.stringify({ content }),
      });
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
  }, [selectedVoice]);

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
        console.error("Error accessing camera: ", error);
      }
    }
  }, [isCameraSharing]);

  const stopCameraSharing = useCallback((): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraSharing(false);
  }, []);

  useEffect(() => {
    if (input && input.trim() !== "") {
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
    setTranscript("");
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
      setFullTranscript("");
    }

    stopRecording();
  }, [fullTranscript, setInput, stopRecording]);

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
    <AlertDescription>
      {alertState.message}
    </AlertDescription>
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

    <div className="flex justify-center">
      {/* <Popover open={voiceOpen} onOpenChange={setVoiceOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={voiceOpen}
            className="w-[280px] justify-between bg-black/30 border-neutral-800 text-neutral-300 hover:bg-black/50 hover:shadow-md transition-all"
          >
            {selectedVoice
              ? voiceModels.find((voice) => voice.value === selectedVoice)?.label
              : "Select Interview Voice"}
            <ChevronsUpDown className="ml-2 h-4 w-4 stroke-[1.5] text-neutral-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0 bg-black/80 border-neutral-800">
          <Command className="bg-transparent">
            <CommandInput 
              placeholder="Search Voice..." 
              className="text-neutral-200 bg-black/30 border-neutral-700"
            />
            <CommandList>
              <CommandEmpty>No Voice found.</CommandEmpty>
              <CommandGroup>
                {voiceModels.map((voice) => (
                  <CommandItem
                    key={voice.value}
                    value={voice.value}
                    onSelect={(currentValue) => {
                      setSelectedVoice(currentValue === selectedVoice ? "" : currentValue);
                      setVoiceOpen(false);
                    }}
                    className="text-neutral-300 hover:bg-purple-900/20"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-purple-500 stroke-[2.5]",
                        selectedVoice === voice.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {voice.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover> */}
      <ResumeProcessor />
    </div>
  </div>

  <div className="space-y-8">
    <div className="h-[400px] overflow-y-auto bg-black/30 rounded-[2rem] border border-neutral-800 p-6 space-y-4 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-neutral-700">
      {messages.map((msg) => (
        <Card
          key={msg.id}
          className={`
            ${msg.role === "user" ? "ml-auto bg-black/50" : "mr-auto bg-neutral-900/50"}
            max-w-[90%] border border-neutral-800 shadow-md rounded-xl hover:scale-[1.01] transition-transform
          `}
        >
          <CardContent className="p-4">
            <CardDescription className={`
              text-base font-light tracking-wide
              ${msg.role === "user" ? "text-neutral-300" : "text-neutral-400"}
            `}>
              {msg.content}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>

    <Button
      onClick={saveConversation}
      className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
    >
      Save Conversation
    </Button>

    <div 
      className={`p-5 rounded-xl ${
        isInterviewerSpeaking 
          ? 'bg-black/50 border-purple-500/30' 
          : 'bg-black/30'
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
      {/* <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/30 border border-neutral-800 rounded-xl">
        <CardDescription className="w-full text-neutral-400 font-light tracking-wider">
          {!isRecording && isRecordingComplete
            ? "Tap microphone to start interview"
            : transcript
            ? transcript
            : "Listening..."}
        </CardDescription>
      </Card> */}
      <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/60 border-2 border-purple-700/50 rounded-xl shadow-[0_0_15px_rgba(126,34,206,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(126,34,206,0.5)]">
      <CardDescription className="w-full text-purple-300 font-light tracking-wider">
      {!isRecording && isRecordingComplete
        ? "Tap microphone to start interview"
        : transcript
        ? transcript
        : "Listening..."}
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
              className={`text-neutral-300 stroke-[1.5] ${isRecording ? "opacity-0" : "opacity-100"}`}
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
                  !isRecordingComplete ? "opacity-100" : "opacity-0"
                } ${isRecording ? "animate-pulse" : ""}`}
              />
            </Button>
            <Button 
              className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg" 
              onClick={toggleRecording}
            >
              <Play
                size={22}
                className={`text-neutral-300 stroke-[1.5] ${
                  isRecording ? "opacity-0" : "opacity-100"
                } transition-all`}
              />
            </Button>
          </>
        )}
      </div>
    </div>
  </div>
</div>
</div>

  );
};

export default InterviewAI;


//     <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
//       {!speechRecognitionSupported && (
//         <div className="bg-purple-900/20 text-purple-300 p-4 text-center">
//           Speech Recognition is not supported in this browser.
//         </div>
//       )}
//       {alertState.show && (
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

//       <div className="flex-1 grid md:grid-cols-2 gap-12 p-12">
//         <div className="space-y-8">
//           <div className="relative aspect-video bg-black/40 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-900/30">
//             {isCameraSharing ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 className="w-full h-full object-cover filter brightness-75 grayscale-[20%]"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <Camera size={64} className="mx-auto mb-4 text-neutral-500 opacity-50" />
//                   <p className="text-xl font-thin text-neutral-400">Camera Inactive</p>
//                 </div>
//               </div>
//             )}
//             <Button
//               onClick={handleCameraSharing}
//               className="absolute bottom-6 right-6 bg-black/40 hover:bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//             >
//               <Camera size={20} className="stroke-[1.5]" />
//             </Button>
//           </div>

//           <div className="flex justify-center">
//             <Popover open={voiceOpen} onOpenChange={setVoiceOpen}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={voiceOpen}
//                   className="w-[280px] justify-between bg-black/30 border-neutral-800 text-neutral-300 hover:bg-black/50"
//                 >
//                   {selectedVoice
//                     ? voiceModels.find((voice) => voice.value === selectedVoice)?.label
//                     : "Select Interview Voice"}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 stroke-[1.5] text-neutral-500" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-[280px] p-0 bg-black/80 border-neutral-800">
//                 <Command className="bg-transparent">
//                   <CommandInput 
//                     placeholder="Search Voice..." 
//                     className="text-neutral-200 bg-black/30 border-neutral-700"
//                   />
//                   <CommandList>
//                     <CommandEmpty>No Voice found.</CommandEmpty>
//                     <CommandGroup>
//                       {voiceModels.map((voice) => (
//                         <CommandItem
//                           key={voice.value}
//                           value={voice.value}
//                           onSelect={(currentValue) => {
//                             setSelectedVoice(currentValue === selectedVoice ? "" : currentValue);
//                             setVoiceOpen(false);
//                           }}
//                           className="text-neutral-300 hover:bg-purple-900/20"
//                         >
//                           <Check
//                             className={cn(
//                               "mr-2 h-4 w-4 text-purple-500 stroke-[2.5]",
//                               selectedVoice === voice.value ? "opacity-100" : "opacity-0"
//                             )}
//                           />
//                           {voice.label}
//                         </CommandItem>
//                       ))}
//                     </CommandGroup>
//                   </CommandList>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>

//         <div className="space-y-8">
//         <div className="space-y-8">
//         <div className="h-[400px] overflow-y-auto bg-black/30 rounded-[2rem] border border-neutral-800 p-6 space-y-4">
//           {messages.map((msg) => (
//             <Card
//               key={msg.id}
//               className={`
//                 ${msg.role === "user" ? "ml-auto bg-black/50" : "mr-auto bg-neutral-900/50"}
//                 max-w-[90%] border border-neutral-800 shadow-md rounded-xl
//               `}
//             >
//               <CardContent className="p-4">
//                 <CardDescription className={`
//                   text-base font-light tracking-wide
//                   ${msg.role === "user" ? "text-neutral-300" : "text-neutral-400"}
//                 `}>
//                   {msg.content}
//                 </CardDescription>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//             {/* Save Conversation Button */}
//             <Button
//               onClick={saveConversation}
//               className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//             >
//               Save Conversation
//             </Button>
//         </div>


//         <div className={`p-5 rounded-xl ${isInterviewerSpeaking ? 'bg-black/50' : 'bg-black/30'} text-center transition-colors duration-300 border border-neutral-800`}>
//           <div className="flex items-center justify-center space-x-3">
//             {isInterviewerSpeaking ? (
//               <>
//                 <Mic className="animate-pulse text-purple-500 stroke-[1.5]" size={24} />
//                 <span className="text-lg font-thin text-neutral-300">Interviewer Speaking</span>
//               </>
//             ) : (
//               <>
//                 <MessageCircle size={24} className="text-neutral-500 stroke-[1.5]" />
//                 <span className="text-lg font-thin text-neutral-400">Ready for Input</span>
//               </>
//             )}
//           </div>
//         </div>

//           <div className="text-center flex flex-row justify-center items-center gap-4">
//             <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/30 border border-neutral-800 rounded-xl">
//               <CardDescription className="w-full text-neutral-400 font-light tracking-wider">
//                 {!isRecording && isRecordingComplete
//                   ? "Tap microphone to start interview"
//                   : transcript
//                   ? transcript
//                   : "Listening..."}
//               </CardDescription>
//             </Card>
//             <div className="flex flex-row gap-3">
//               {!isRecording && isRecordingComplete ? (
//                 <Button
//                   onClick={startRecording}
//                   className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
//                 >
//                   <Mic
//                     size={22}
//                     className={`text-neutral-300 stroke-[1.5] ${isRecording ? "opacity-0" : "opacity-100"}`}
//                   />
//                 </Button>
//               ) : (
//                 <>
//                   <Button
//                     onClick={handleRecordingComplete}
//                     className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center text-white w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg"
//                   >
//                     <AudioWaveform
//                       size={22}
//                       className={`text-purple-500 stroke-[1.5] ${
//                         !isRecordingComplete ? "opacity-100" : "opacity-0"
//                       } ${isRecording ? "animate-pulse" : ""}`}
//                     />
//                   </Button>
//                   <Button 
//                     className="bg-black/40 hover:bg-purple-900/20 flex items-center justify-center relative w-[50px] h-[50px] rounded-full border border-neutral-800 shadow-lg" 
//                     onClick={toggleRecording}
//                   >
//                     <Play
//                       size={22}
//                       className={`text-neutral-300 stroke-[1.5] ${
//                         isRecording ? "opacity-0" : "opacity-100"
//                       } transition-all`}
//                     />
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>



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
// import { createWorker } from "tesseract.js";

// interface InterviewMessage {
//   role: string;
//   content: string;
//   timestamp: number;
//   id: string;
// }

// const convertor = async (img: string) => {
//   const worker = await createWorker("eng");
//   const ret = await worker.recognize(img);
//   const text = ret.data.text;
//   await worker.terminate();
//   return text;
// };

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
//   const [resumeText, setResumeText] = useState<string>("");
//   const [showResumePopup, setShowResumePopup] = useState<boolean>(false);
//   const [resumeImage, setResumeImage] = useState<string>("");

//   const supabase = createClient();

//   useEffect(() => {
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
//       }, 1500);
//     } catch (error) {
//       console.error("Error saving conversation:", error);
//     }
//   };

//   const handleTextToVoice = useCallback(async (content: string): Promise<void> => {
//     setIsInterviewerSpeaking(true);
//     try {
//       const response = await fetch('/api/deepgram', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Voice-Model': selectedVoice
//         },
//         body: JSON.stringify({ content }),
//       });
//       if (!response.ok) throw new Error('Deepgram error');
//       const audioBlob = await response.blob();
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const audio = new Audio(audioUrl);
//       audio.play();
//       audio.onended = () => {
//         URL.revokeObjectURL(audioUrl);
//         setIsInterviewerSpeaking(false);
//       };
//     } catch (error) {
//       console.error('Error fetching audio:', error);
//       setIsInterviewerSpeaking(false);
//     }
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

//   const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const image = e.target?.result as string;
//         setResumeImage(image);
//         const text = await convertor(image);
//         setResumeText(text);
//         setShowResumePopup(true);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleUseResume = () => {
//     setInput(resumeText);
//     setShowResumePopup(false);
//   };

//   const handleSkipResume = () => {
//     setShowResumePopup(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
//       {!speechRecognitionSupported && (
//         <div className="bg-purple-900/20 text-purple-300 p-4 text-center">
//           Speech Recognition is not supported in this browser.
//         </div>
//       )}
//       {alertState.show && (
//         <Alert 
//           className={`mb-4 ${
//             alertState.type === 'success' 
//               ? 'border-green-500 bg-green-500/10 text-green-500' 
//               : 'border-red-500 bg-red-500/10 text-red-500'
//           }`}
//         >
//           {alertState.type === 'success' ? (
//             <CheckCircle className="h-4 w-4" />
//           ) : (
//             <AlertCircle className="h-4 w-4" />
//           )}
//           <AlertTitle>{alertState.title}</AlertTitle>
//           <AlertDescription>
//             {alertState.message}
//           </AlertDescription>
//         </Alert>
//       )}

//       <div className="flex-1 grid md:grid-cols-2 gap-12 p-12 space-y-4">
//         <div className="space-y-8">
//           <div className="relative aspect-video bg-black/40 rounded-[2rem] overflow-hidden shadow-2xl border border-purple-900/30 hover:scale-[1.01] transition-transform">
//             {isCameraSharing ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 className="w-full h-full object-cover filter brightness-75 grayscale-[20%]"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center">
//                 <div className="text-center">
//                   <Camera size={64} className="mx-auto mb-4 text-neutral-500 opacity-50" />
//                   <p className="text-xl font-thin text-neutral-400">Camera Inactive</p>
//                 </div>
//               </div>
//             )}
//             <Button
//               onClick={handleCameraSharing}
//               className="absolute bottom-6 right-6 bg-black/40 hover:bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//             >
//               <Camera size={20} className="stroke-[1.5]" />
//             </Button>
//           </div>

//           {showResumePopup && (
//             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//               <div className="bg-black/80 p-6 rounded-xl border border-neutral-800">
//                 <h2 className="text-lg font-semibold text-neutral-200 mb-4">Resume Detected</h2>
//                 <p className="text-neutral-400 mb-6">Would you like to use the resume text for the interview?</p>
//                 <div className="flex justify-end space-x-4">
//                   <Button
//                     onClick={handleUseResume}
//                     className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
//                   >
//                     Use Resume
//                   </Button>
//                   <Button
//                     onClick={handleSkipResume}
//                     className="bg-black/50 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-black/60"
//                   >
//                     Skip
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-center">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleResumeUpload}
//               className="hidden"
//               id="resume-upload"
//             />
//             <label htmlFor="resume-upload" className="cursor-pointer">
//               <Button
//                 className="bg-black/40 hover:bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg"
//               >
//                 Upload Resume
//               </Button>
//             </label>
//           </div>
//         </div>

//         <div className="space-y-8">
//           <div className="h-[400px] overflow-y-auto bg-black/30 rounded-[2rem] border border-neutral-800 p-6 space-y-4 scrollbar-thin scrollbar-track-black/20 scrollbar-thumb-neutral-700">
//             {messages.map((msg) => (
//               <Card
//                 key={msg.id}
//                 className={`${
//                   msg.role === "user" ? "ml-auto bg-black/50" : "mr-auto bg-neutral-900/50"
//                 } max-w-[90%] border border-neutral-800 shadow-md rounded-xl hover:scale-[1.01] transition-transform`}
//               >
//                 <CardContent className="p-4">
//                   <CardDescription className={`text-base font-light tracking-wide ${
//                     msg.role === "user" ? "text-neutral-300" : "text-neutral-400"
//                   }`}>
//                     {msg.content}
//                   </CardDescription>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <Button
//             onClick={saveConversation}
//             className="bg-purple-900/20 text-neutral-300 rounded-full p-3 transition-all duration-500 border border-neutral-800 shadow-lg hover:bg-purple-900/30"
//           >
//             Save Conversation
//           </Button>
//              <div 
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
//       {/* <Card className="p-3 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[380px] bg-black/30 border border-neutral-800 rounded-xl">
//         <CardDescription className="w-full text-neutral-400 font-light tracking-wider">
//           {!isRecording && isRecordingComplete
//             ? "Tap microphone to start interview"
//             : transcript
//             ? transcript
//             : "Listening..."}
//         </CardDescription>
//       </Card> */}
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
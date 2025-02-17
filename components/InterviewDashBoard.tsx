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
  Pause, 
  Play, 
  Check, 
  ChevronsUpDown 
} from "lucide-react";
import { cn, voiceModels } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Message {
  role: string;
  content: string;
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
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(false);

  // Memoize handleSubmit to prevent unnecessary re-renders
  const { messages, handleSubmit, setInput, input } = useChat({
    onFinish: async (message: Message) => {
      if (message.role !== "user") {
        await handleTextToVoice(message.content);
      }
    },
  });

  // Check speech recognition support on mount
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechRecognitionSupported(true);
    }
  }, []);

  // Memoized text-to-voice handler
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

  // Memoized camera handling
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

  // Memoized stop camera sharing
  const stopCameraSharing = useCallback((): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraSharing(false);
  }, []);

  // Prevent unnecessary input updates
  useEffect(() => {
    if (input && input.trim() !== "") {
      const submitForm = async () => {
        await handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
      };
      submitForm();
    }
  }, [input, handleSubmit]);

  // Memoized recording start
  const startRecording = useCallback(() => {
    if (!speechRecognitionSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    setIsRecording(true);
    setIsRecordingComplete(false);

    // Use the appropriate constructor based on browser support
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

  // Memoized stop recording
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsRecordingComplete(true);
    setTranscript("");
  }, []);

  // Memoized toggle recording
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

  // Memoized recording complete handler
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
    // <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-950 text-white flex flex-col">
    //   {/* Speech Recognition Support Warning */}
    //   {!speechRecognitionSupported && (
    //     <div className="bg-red-600 text-white p-4 text-center">
    //       Speech Recognition is not supported in this browser.
    //     </div>
    //   )}

    //   <div className="flex-1 grid md:grid-cols-2 gap-8 p-8">
    //     {/* Camera & Voice Selection Section */}
    //     <div className="space-y-6">
    //       <div className="relative aspect-video bg-blue-950 rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-600">
    //         {isCameraSharing ? (
    //           <video
    //             ref={videoRef}
    //             autoPlay
    //             className="w-full h-full object-cover"
    //           />
    //         ) : (
    //           <div className="w-full h-full flex items-center justify-center">
    //             <div className="text-center">
    //               <Camera size={64} className="mx-auto mb-4 text-blue-300" />
    //               <p className="text-xl font-semibold">Camera not active</p>
    //             </div>
    //           </div>
    //         )}
    //         <Button
    //           onClick={handleCameraSharing}
    //           className="absolute bottom-4 right-4 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-3 transition-all duration-300 shadow-lg"
    //         >
    //           <Camera size={24} />
    //         </Button>
    //       </div>

    //       {/* Voice Selection */}
    //       <div className="flex justify-center space-x-4">
    //         <Popover open={voiceOpen} onOpenChange={setVoiceOpen}>
    //           <PopoverTrigger asChild>
    //             <Button
    //               variant="outline"
    //               role="combobox"
    //               aria-expanded={voiceOpen}
    //               className="w-[250px] justify-between bg-blue-900/50 border-blue-700 text-white hover:bg-blue-900/70"
    //             >
    //               {selectedVoice
    //                 ? voiceModels.find((voice) => voice.value === selectedVoice)?.label
    //                 : "Select Interview Voice"}
    //               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //             </Button>
    //           </PopoverTrigger>
    //           <PopoverContent className="w-[250px] p-0 bg-blue-950 border-blue-800">
    //             <Command className="bg-blue-950">
    //               <CommandInput 
    //                 placeholder="Search Voice..." 
    //                 className="text-white bg-blue-900/50"
    //               />
    //               <CommandList>
    //                 <CommandEmpty>No Voice found.</CommandEmpty>
    //                 <CommandGroup>
    //                   {voiceModels.map((voice) => (
    //                     <CommandItem
    //                       key={voice.value}
    //                       value={voice.value}
    //                       onSelect={(currentValue) => {
    //                         setSelectedVoice(currentValue === selectedVoice ? "" : currentValue);
    //                         setVoiceOpen(false);
    //                       }}
    //                       className="text-white hover:bg-blue-900"
    //                     >
    //                       <Check
    //                         className={cn(
    //                           "mr-2 h-4 w-4",
    //                           selectedVoice === voice.value ? "opacity-100" : "opacity-0"
    //                         )}
    //                       />
    //                       {voice.label}
    //                     </CommandItem>
    //                   ))}
    //                 </CommandGroup>
    //               </CommandList>
    //             </Command>
    //           </PopoverContent>
    //         </Popover>
    //       </div>
    //     </div>

    //     {/* Chat & Recording Section */}
    //     <div className="space-y-6">
    //       {/* Chat Messages */}
    //       <div className="h-[400px] overflow-y-auto bg-blue-950/50 rounded-xl border border-blue-800 p-4 space-y-3">
    //         {messages.map((msg, i) => (
    //           <Card
    //             key={msg.id}
    //             className={`
    //               ${msg.role === "user" ? "ml-auto bg-blue-700/70" : "mr-auto bg-indigo-800/70"}
    //               max-w-[90%] border-none shadow-md
    //             `}
    //           >
    //             <CardContent className="p-3">
    //               <CardDescription className={`
    //                 text-base font-medium 
    //                 ${msg.role === "user" ? "text-white" : "text-white"}
    //               `}>
    //                 {msg.content}
    //               </CardDescription>
    //             </CardContent>
    //           </Card>
    //         ))}
    //       </div>

    //       {/* Recording Status & Controls */}
    //       <div className={`p-4 rounded-lg ${isInterviewerSpeaking ? 'bg-green-600' : 'bg-blue-800'} text-center transition-colors duration-300 shadow-md`}>
    //         <div className="flex items-center justify-center space-x-2">
    //           {isInterviewerSpeaking ? (
    //             <>
    //               <Mic className="animate-pulse" size={24} />
    //               <span className="text-lg font-medium">Interviewer is speaking...</span>
    //             </>
    //           ) : (
    //             <>
    //               <MessageCircle size={24} />
    //               <span className="text-lg font-medium">Ready for your input</span>
    //             </>
    //           )}
    //         </div>
    //       </div>

    //       {/* Recording Controls */}
    //       <div className="text-center flex flex-row justify-center items-center gap-2">
    //         <Card className="p-2 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[350px] bg-blue-900 border-blue-700">
    //           <CardDescription className="w-full text-blue-200">
    //             {!isRecording && isRecordingComplete
    //               ? "Tap on mic to begin your interview!"
    //               : transcript
    //               ? transcript
    //               : "Listening..."}
    //           </CardDescription>
    //         </Card>
    //         <div className="text-center flex flex-row gap-2 justify-center items-center">
    //           {!isRecording && isRecordingComplete ? (
    //             <Button
    //               onClick={startRecording}
    //               className="bg-blue-700 hover:bg-blue-600 flex flex-col text-white relative w-[40px] h-[40px] shadow-sm rounded-full"
    //             >
    //               <Mic
    //                 size={25}
    //                 className={`${isRecording ? "opacity-0 !important" : "opacity-100"}`}
    //               />
    //             </Button>
    //           ) : (
    //             <>
    //               <Button
    //                 onClick={handleRecordingComplete}
    //                 className="bg-blue-700 hover:bg-blue-600 flex flex-col text-white w-[40px] h-[40px] shadow-sm rounded-full"
    //               >
    //                 <AudioWaveform
    //                   size={25}
    //                   className={`${
    //                     !isRecordingComplete ? "opacity-100 " : "opacity-0"
    //                   } ${isRecording ? "animate-pulse" : ""}`}
    //                 />
    //               </Button>
    //               <Button 
    //                 className="bg-blue-700 hover:bg-blue-600 relative w-[40px] h-[40px] rounded-full" 
    //                 onClick={toggleRecording}
    //               >
    //                 <Play
    //                   size={25}
    //                   className={`text-white ${
    //                     isRecording ? "opacity-0" : "opacity-100"
    //                   } transition-all`}
    //                 />
    //               </Button>
    //             </>
    //           )}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="flex flex-col w-full h-screen bg-purple-900">
  <div className="flex-1 p-8">
    <div className="flex flex-col space-y-8">
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">Interview Recording</h1>
          </div>
          <div className="h-[400px] overflow-y-auto bg-purple-950/20 rounded-xl border border-purple-500/50 p-4 space-y-3"> {/* Update 10 */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`
                  flex items-center space-x-2
                  ${msg.role === "user" ? "ml-auto bg-purple-600/40" : "mr-auto bg-purple-800/40"}
                  max-w-[90%] border-none shadow-md backdrop-blur-sm
                `} // Update 11
              >
                <p className={`
                  text-base font-medium 
                  ${msg.role === "user" ? "text-purple-100" : "text-purple-200"}
                `}> {/* Update 12 */}
                  {msg.content}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[350px]">
          <div className="p-2 scroll-smooth max-w-full text-nowrap overflow-x-scroll w-[350px] bg-purple-900/30 border-purple-500/50"> {/* Update 14 */}
            <p className="w-full text-purple-200"> {/* Update 15 */}
              {transcript}
            </p>
          </div>
        </div>
      </div>
      <div className={`p-4 rounded-lg ${isInterviewerSpeaking ? 'bg-purple-600/60' : 'bg-purple-800/40'} text-center transition-colors duration-300 shadow-md backdrop-blur-sm`}> {/* Update 13 */}
        <p className="text-white text-lg font-medium">
          {isRecording ? "Recording..." : "Not Recording"}
        </p>
      </div>
    </div>
  </div>
  <div className="p-4 flex justify-center">
    <button
      onClick={startRecording}
      className="bg-purple-600 hover:bg-purple-700 flex flex-col text-white relative w-[40px] h-[40px] shadow-md rounded-full" // Update 16
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4 4H9"
        />
      </svg>
    </button>
    <button
      onClick={stopRecording}
      className="bg-purple-600 hover:bg-purple-700 flex flex-col text-white relative w-[40px] h-[40px] shadow-md rounded-full ml-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</div>

  );
};

export default InterviewAI;
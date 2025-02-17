'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Loader2, DollarSign, FileText, X } from 'lucide-react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Utility {
  name: string;
  amount: number;
}

interface Fee {
  name: string;
  amount: number;
  description?: string;
}

interface PricingDetails {
  baseRent: number;
  utilities?: Utility[];
  fees?: Fee[];
  total: number;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  image?: string;
  pricing?: PricingDetails;
  timestamp: Date;
}

interface DropzoneFile extends File {
  preview?: string;
}

const PricingAnalyzer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [image, setImage] = useState<DropzoneFile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      setError('File too large or invalid format. Please use images under 5MB.');
      return;
    }

    const file = acceptedFiles[0] as DropzoneFile;
    if (file) {
      file.preview = URL.createObjectURL(file);
      setImage(file);
      setError(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxSize: 5000000,
    multiple: false,
    onDrop
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim() && !image) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: image ? 'Analyzing uploaded document...' : inputMessage,
      image: image?.preview,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      } else {
        formData.append('text', inputMessage);
      }

      const res = await fetch('/api/pricing-analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data: {
        response: string;
        pricing?: PricingDetails;
      } = await res.json();

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        type: 'bot',
        content: data.response,
        pricing: data.pricing,
        timestamp: new Date()
      }]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setInputMessage('');
      setImage(null);
    }
  };

  const clearImage = (): void => {
    if (image?.preview) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    setError(null);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      // Cleanup preview URLs when component unmounts
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    };
  }, [image]);

  const renderPricingDetails = (pricing: PricingDetails) => (
    <div className="mt-6 space-y-4">
      <div className="bg-emerald-50 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <span className="font-medium text-emerald-800">Base Rent</span>
          <span className="font-bold text-emerald-700 text-xl">
            ${pricing.baseRent.toLocaleString()}
          </span>
        </div>
      </div>
      
      {pricing.utilities && pricing.utilities.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-emerald-700">Utilities</h4>
          {pricing.utilities.map((utility, idx) => (
            <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded">
              <span className="text-gray-700">{utility.name}</span>
              <span className="font-medium">${utility.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {pricing.fees && pricing.fees.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-emerald-700">Additional Fees</h4>
          {pricing.fees.map((fee, idx) => (
            <div key={idx} className="flex justify-between bg-gray-50 p-3 rounded">
              <span className="text-gray-700">{fee.name}</span>
              <span className="font-medium">${fee.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-emerald-100 p-4 rounded-lg shadow-sm mt-6">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-emerald-800">Total Monthly Cost</span>
          <span className="font-bold text-emerald-800 text-2xl">
            ${pricing.total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 to-white">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto shadow-xl">
        <div className="bg-emerald-500 p-6 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full mr-4 shadow-md">
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Pricing Analyzer</h2>
              <p className="text-emerald-50">Instant cost analysis for your documents</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={chatContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-2xl ${
                  message.type === 'user' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-white shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  {message.image && (
                    <div className="relative mb-4">
                      <img 
                        src={message.image} 
                        alt="Document" 
                        className="rounded-lg shadow-md max-h-64 object-cover" 
                      />
                    </div>
                  )}
                  <p className={`text-lg ${message.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                    {message.content}
                  </p>
                  {message.pricing && renderPricingDetails(message.pricing)}
                  <div className="mt-2 text-xs text-emerald-100">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isLoading && (
            <Card className="mr-auto bg-white shadow-md">
              <CardContent className="p-4 flex items-center">
                <Loader2 className="animate-spin mr-3" size={24} />
                <p className="text-gray-700">Analyzing document...</p>
              </CardContent>
            </Card>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mx-6 mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="p-6 border-t border-gray-100 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-3">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about pricing details or upload a document..."
                className="flex-1 bg-gray-50 text-gray-800 rounded-full px-6 py-3 focus:ring-2 focus:ring-emerald-500"
              />
              <Button
                type="submit"
                className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors"
                disabled={isLoading}
              >
                <Send size={20} />
              </Button>
            </div>

            {image && (
              <div className="relative inline-block">
                <img 
                  src={image.preview} 
                  alt="Preview" 
                  className="h-24 rounded-lg shadow-sm" 
                />
                <button
                  onClick={clearImage}
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div
              {...getRootProps()}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <input {...getInputProps()} />
              <FileText className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-gray-600">
                {isDragActive 
                  ? 'Drop your document here...' 
                  : 'Drop a document here, or click to select'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports PDF and images up to 5MB
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PricingAnalyzer;


// "use client"

// import { useState } from "react"
// import { motion } from "framer-motion"
// import { Upload, FileText, AlertCircle } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent } from "@/components/ui/card"
// import PricingDisplay from "@/components/Pricing-Details"

// export default function ElegantPricingAnalyzer() {
//   const [file, setFile] = useState<File | null>(null)
//   const [text, setText] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [results, setResults] = useState<any>(null)
//   const [error, setError] = useState<string | null>(null)

//   const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault()
//     const droppedFile = e.dataTransfer.files[0]
//     if (droppedFile && (droppedFile.type.startsWith("image/") || droppedFile.type === "application/pdf")) {
//       setFile(droppedFile)
//     } else {
//       setError("Please upload an image or PDF file.")
//     }
//   }

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (selectedFile && (selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf")) {
//       setFile(selectedFile)
//     } else {
//       setError("Please select an image or PDF file.")
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)
//     setResults(null)

//     try {
//       let response
//       if (file) {
//         const formData = new FormData()
//         formData.append("image", file)
//         response = await fetch("/api/pricing-analyze", {
//           method: "POST",
//           body: formData,
//         })
//       } else if (text) {
//         response = await fetch("/api/pricing-analyze", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
//         })
//       } else {
//         throw new Error("Please provide an image or text to analyze.")
//       }

//       if (!response.ok) {
//         throw new Error("Failed to analyze pricing.")
//       }

//       const data = await response.json()
//       setResults(data)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-4xl mx-auto"
//       >
//         <h1 className="text-4xl font-bold text-center mb-8 text-green-800">Elegant Pricing Analyzer</h1>
//         <Card className="backdrop-blur-sm bg-white/70 shadow-lg">
//           <CardContent className="p-8">
//             <div className="mb-8 text-center">
//               <h2 className="text-2xl font-semibold text-green-700 mb-4">Transparent Pricing Analysis</h2>
//               <p className="text-green-600">
//                 Understand the full cost breakdown before committing. Our tool reveals all hidden fees, utilities, and
//                 additional costs.
//               </p>
//             </div>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div
//                 onDrop={handleFileDrop}
//                 onDragOver={(e) => e.preventDefault()}
//                 className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
//               >
//                 <Upload className="mx-auto h-12 w-12 text-green-500 mb-4" />
//                 <p className="text-green-700 mb-2">Drag and drop an image or PDF here, or click to select</p>
//                 <Input
//                   type="file"
//                   onChange={handleFileChange}
//                   accept="image/*,application/pdf"
//                   className="hidden"
//                   id="file-upload"
//                 />
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="border-green-500 text-green-700 hover:bg-green-50"
//                   onClick={() => document.getElementById("file-upload")?.click()}
//                 >
//                   Select File
//                 </Button>
//                 {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
//               </div>
//               <div className="text-center">
//                 <span className="text-green-700">or</span>
//               </div>
//               <Textarea
//                 placeholder="Enter your pricing inquiry here..."
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 className="w-full p-2 border rounded border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
//                 rows={4}
//               />
//               <Button
//                 type="submit"
//                 className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors"
//                 disabled={loading}
//               >
//                 {loading ? "Analyzing..." : "Analyze Pricing"}
//               </Button>
//             </form>
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center"
//               >
//                 <AlertCircle className="mr-2" />
//                 {error}
//               </motion.div>
//             )}
//             {results && results.pricing && <PricingDisplay pricingInfo={results.pricing} />}
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }


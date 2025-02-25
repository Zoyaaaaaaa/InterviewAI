

// // "use client";

// // import { useState } from "react";
// // import Image from "next/image";
// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { CheckCircle, FileText, Loader2, Sparkles, Star, Upload } from "lucide-react";

// // export default function ResUmeAnalyzer() {
// //   const [image, setImage] = useState<File | null>(null);
// //   const [result, setResult] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [keywords, setKeywords] = useState<string[]>([]);
// //   const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
// //   const [dragActive, setDragActive] = useState(false);

// //   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setImage(e.target.files[0]);
// //     }
// //   };

// //   const identifyImage = async (additionalPrompt: string = "") => {
// //     if (!image) return;

// //     setLoading(true);
// //     const genAI = new GoogleGenerativeAI(
// //       process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!
// //     );
    
// //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //     try {
// //       const imageParts = await fileToGenerativePart(image);
// //       const result = await model.generateContent([
// //         `Identify this resume and provide  and important information overall score strgths,weakness,areas on improvemnsts in points in point form. ${additionalPrompt}`,
// //         imageParts,
// //       ]);
// //       const response = await result.response;
// //       const text = response
// //         .text()
// //         .trim()
// //         .replace(/```/g, "")
// //         .replace(/\*\*/g, "")
// //         .replace(/\*/g, "")
// //         .replace(/-\s*/g, "")
// //         .replace(/\n\s*\n/g, "\n");
// //       setResult(text);
      
// //       await generateRelatedQuestions(text);
// //     } catch (error) {
// //       console.error("Error identifying image:", error);
// //       if (error instanceof Error) {
// //         setResult(`Error identifying image: ${error.message}`);
// //       } else {
// //         setResult("An unknown error occurred while identifying the image.");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

  

// //   const regenerateContent = (keyword: string) => {
// //     identifyImage(`Focus more on aspects related to "${keyword}".`);
// //   };

// //   const generateRelatedQuestions = async (text: string) => {
// //     const genAI = new GoogleGenerativeAI(
// //       process.env.NEXT_PUBLIC_GOOGLE_API_KEY!
// //     );
// //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //     try {
// //       const result = await model.generateContent([
// //         `Based on the following information about an image, generate 5 related questions that someone might ask to learn more about the current resume status:

// //         ${text}

// //         Format the output as a simple list of questions, one per line.`,
// //       ]);
      
// //       const response = await result.response;
// //       console.log(response);
// //       const questions = response.text().trim().split("\n");
// //       setRelatedQuestions(questions);
// //     } catch (error) {
// //       console.error("Error generating related questions:", error);
// //       setRelatedQuestions([]);
// //     }
// //   };

// //   const askRelatedQuestion = (question: string) => {
// //     identifyImage(
// //       `Answer the following question about the image: "${question}"`
// //     );
// //   };

// //   async function fileToGenerativePart(file: File): Promise<{
// //     inlineData: { data: string; mimeType: string };
// //   }> {
// //     return new Promise((resolve, reject) => {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         const base64data = reader.result as string;
// //         const base64Content = base64data.split(",")[1];
// //         resolve({
// //           inlineData: {
// //             data: base64Content,
// //             mimeType: file.type,
// //           },
// //         });
// //       };
// //       reader.onerror = reject;
// //       reader.readAsDataURL(file);
// //     });
// //   }

// // return (
// //   <div className="min-h-screen bg-[#030014] bg-gradient-to-b from-black to-[#0d0028]">
// //     <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
// //     <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //         {/* Enhanced Upload Section */}
// //         <div className="relative group h-fit sticky top-24">
// //           <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
// //           <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-6">
// //             <div className="absolute top-4 right-4">
// //               <Sparkles className="w-5 h-5 text-purple-400/40" />
// //             </div>
            
// //             <h2 className="text-2xl font-bold text-white mb-2">Upload Resume</h2>
// //             <p className="text-purple-300/60 text-sm mb-6">Analyze your resume with advanced AI</p>
            
// //             <div className="mb-9">
// //               <div 
// //                 className={`mt-2 flex flex-col justify-center rounded-xl border-2 ${
// //                   dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20'
// //                 } px-6 py-8 transition-all duration-300 relative overflow-hidden group`}
// //                 onDragOver={(e) => {
// //                   e.preventDefault();
// //                   setDragActive(true);
// //                 }}
// //                 onDragLeave={() => setDragActive(false)}
// //                 onDrop={(e) => {
// //                   e.preventDefault();
// //                   setDragActive(false);
// //                   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
// //                     setImage(e.dataTransfer.files[0]);
// //                   }
// //                 }}
// //               >
// //                 {!image ? (
// //                   <div className="text-center relative">
// //                     <Upload className="h-8 w-8 text-purple-400 mx-auto mb-4" />
// //                     <div className="space-y-3">
// //                       <label
// //                         htmlFor="image-upload"
// //                         className="relative cursor-pointer inline-flex items-center justify-center px-6 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-300 transition duration-300"
// //                       >
// //                         <span className="text-base font-medium">Choose a file</span>
// //                         <input
// //                           id="image-upload"
// //                           type="file"
// //                           className="sr-only"
// //                           accept="image/*"
// //                           onChange={handleImageUpload}
// //                         />
// //                       </label>
// //                       <p className="text-sm text-purple-300/60">or drag and drop</p>
// //                       <p className="text-xs text-purple-300/40">PNG, JPG, GIF up to 10MB</p>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="relative w-full h-64 rounded-lg overflow-hidden group">
// //                     <Image
// //                       src={URL.createObjectURL(image)}
// //                       alt="Uploaded resume"
// //                       layout="fill"
// //                       objectFit="contain"
// //                       className="rounded-lg"
// //                     />
// //                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
// //                       <button
// //                         onClick={() => setImage(null)}
// //                         className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition duration-300 transform hover:scale-105"
// //                       >
// //                         Remove File
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             <button
// //               onClick={() => identifyImage()}
// //               disabled={!image || loading}
// //               className="relative w-full group overflow-hidden"
// //             >
// //               <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
// //               <div className="relative bg-black px-4 py-3 rounded-lg flex items-center justify-center space-x-2 group-hover:bg-black/80 transition duration-300">
// //                 {loading ? (
// //                   <>
// //                     <Loader2 className="animate-spin w-5 h-5 text-purple-400" />
// //                     <span className="text-base font-medium text-purple-100">Analyzing...</span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Star className="w-5 h-5 text-purple-400" />
// //                     <span className="text-base font-medium text-purple-100">Analyze Resume</span>
// //                   </>
// //                 )}
// //               </div>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Enhanced Results Section with Scroll */}
// //         <div className="relative group min-h-[calc(100vh-12rem)]">
          
// //           <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl p-6">
// //             {result ? (
// //               <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
// //                 <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-xl py-2 z-10">
// //                   <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent">
// //                     Analysis Results
// //                   </h3>
// //                   <CheckCircle className="w-5 h-5 text-purple-400" />
// //                 </div>
                
// //                 <div className="space-y-4 divide-y divide-purple-500/10">
// //                   {result.split('\n').map((line, index) => {
// //                     if (line.startsWith('Important Information:') || line.startsWith('Other Information:')) {
// //                       return (
// //                         <h4 key={index} className="text-lg font-semibold pt-4 text-purple-300 flex items-center space-x-2">
// //                           <Star className="w-4 h-4 text-purple-400" />
// //                           <span>{line}</span>
// //                         </h4>
// //                       );
// //                     } else if (line.match(/^\d+\./) || line.startsWith('-')) {
// //                       return (
// //                         <div key={index} className="flex items-start space-x-3 pl-4 pt-4">
// //                           <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
// //                           <p className="text-purple-100 text-sm">{line.replace(/^\d+\.\s*|-\s*/, '')}</p>
// //                         </div>
// //                       );
// //                     }
// //                     return line.trim() !== '' && (
// //                       <p key={index} className="text-purple-200/90 pt-4 text-sm">
// //                         {line}
// //                       </p>
// //                     );
// //                   })}
// //                 </div>

// //                 {relatedQuestions.length > 0 && (
// //                   <div className="pt-6 border-t border-purple-500/10">
// //                     <h4 className="text-lg font-semibold mb-4 text-purple-300 flex items-center space-x-2">
// //                       <Star className="w-4 h-4 text-purple-400" />
// //                       <span>Suggested Questions</span>
// //                     </h4>
// //                     <div className="space-y-2">
// //                       {relatedQuestions.map((question, index) => (
// //                         <button
// //                           key={index}
// //                           onClick={() => askRelatedQuestion(question)}
// //                           className="w-full text-left bg-purple-500/5 hover:bg-purple-500/10 text-purple-200 px-4 py-3 rounded-lg text-sm transition duration-300 border border-purple-500/20 hover:border-purple-500/40"
// //                         >
// //                           {question}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             ) : (
// //               <div className="h-[calc(100vh-16rem)] flex flex-col items-center justify-center space-y-4 text-center">
// //                 <Sparkles className="w-10 h-10 text-purple-400/40" />
// //                 <p className="text-purple-300/60 text-base">
// //                   Upload a resume to see the analysis results here
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </main>
// //   </div>
// // );
// // }

// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { GoogleGenerativeAI } from "@google/generative-ai"
// import { CheckCircle, FileText, Loader2, Sparkles, Star, Upload } from "lucide-react"

// export default function ResUmeAnalyzer() {
//   const [image, setImage] = useState<File | null>(null)
//   const [result, setResult] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [relatedQuestions, setRelatedQuestions] = useState<string[]>([])
//   const [dragActive, setDragActive] = useState(false)

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0])
//     }
//   }

//   const identifyImage = async (additionalPrompt = "") => {
//     if (!image) return

//     setLoading(true)
//     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!)

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//     try {
//       const imageParts = await fileToGenerativePart(image)
//       const result = await model.generateContent([
//         `Identify this resume and provide important information, overall score, strengths, weaknesses, and areas for improvement in point form. ${additionalPrompt}`,
//         imageParts,
//       ])
//       const response = await result.response
//       const text = response
//         .text()
//         .trim()
//         .replace(/```/g, "")
//         .replace(/\*\*/g, "")
//         .replace(/\*/g, "")
//         .replace(/-\s*/g, "")
//         .replace(/\n\s*\n/g, "\n")
//       setResult(text)

//       await generateRelatedQuestions(text)
//     } catch (error) {
//       console.error("Error identifying image:", error)
//       if (error instanceof Error) {
//         setResult(`Error identifying image: ${error.message}`)
//       } else {
//         setResult("An unknown error occurred while identifying the image.")
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generateRelatedQuestions = async (text: string) => {
//     const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY!)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

//     try {
//       const result = await model.generateContent([
//         `Based on the following information about an image, generate 5 related questions that someone might ask to learn more about the current resume status:

//         ${text}

//         Format the output as a simple list of questions, one per line.`,
//       ])

//       const response = await result.response
//       const questions = response.text().trim().split("\n")
//       setRelatedQuestions(questions)
//     } catch (error) {
//       console.error("Error generating related questions:", error)
//       setRelatedQuestions([])
//     }
//   }

//   const askRelatedQuestion = (question: string) => {
//     identifyImage(`Answer the following question about the image: "${question}"`)
//   }

//   async function fileToGenerativePart(file: File): Promise<{
//     inlineData: { data: string; mimeType: string }
//   }> {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         const base64data = reader.result as string
//         const base64Content = base64data.split(",")[1]
//         resolve({
//           inlineData: {
//             data: base64Content,
//             mimeType: file.type,
//           },
//         })
//       }
//       reader.onerror = reject
//       reader.readAsDataURL(file)
//     })
//   }

//   return (
//     <div className="min-h-screen bg-[#030014] bg-gradient-to-b from-black to-[#0d0028]">
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]"></div>
//       <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
//           AI-Powered Resume Analyzer
//         </h1>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//           {/* Enhanced Upload Section */}
//           <div className="relative group h-fit lg:sticky lg:top-24">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
//             <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
//               <div className="absolute top-4 right-4">
//                 <Sparkles className="w-5 h-5 text-gray-400/40" />
//               </div>

//               <h2 className="text-2xl font-bold text-white mb-2">Upload Resume</h2>
//               <p className="text-gray-400 text-sm mb-6">Analyze your resume with advanced AI</p>

//               <div className="mb-8">
//                 <div
//                   className={`mt-2 flex flex-col justify-center rounded-xl border-2 ${
//                     dragActive ? "border-gray-500 bg-gray-800/20" : "border-gray-700"
//                   } px-6 py-10 transition-all duration-300 relative overflow-hidden group`}
//                   onDragOver={(e) => {
//                     e.preventDefault()
//                     setDragActive(true)
//                   }}
//                   onDragLeave={() => setDragActive(false)}
//                   onDrop={(e) => {
//                     e.preventDefault()
//                     setDragActive(false)
//                     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//                       setImage(e.dataTransfer.files[0])
//                     }
//                   }}
//                 >
//                   {!image ? (
//                     <div className="text-center relative">
//                       <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
//                       <div className="space-y-4">
//                         <label
//                           htmlFor="image-upload"
//                           className="relative cursor-pointer inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-200 transition duration-300"
//                         >
//                           <span className="text-base font-medium">Choose a file</span>
//                           <input
//                             id="image-upload"
//                             type="file"
//                             className="sr-only"
//                             accept="image/*"
//                             onChange={handleImageUpload}
//                           />
//                         </label>
//                         <p className="text-sm text-gray-400">or drag and drop</p>
//                         <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="relative w-full h-64 rounded-lg overflow-hidden group">
//                       <Image
//                         src={URL.createObjectURL(image) || "/placeholder.svg"}
//                         alt="Uploaded resume"
//                         layout="fill"
//                         objectFit="contain"
//                         className="rounded-lg"
//                       />
//                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
//                         <button
//                           onClick={() => setImage(null)}
//                           className="bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition duration-300 transform hover:scale-105"
//                         >
//                           Remove File
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <button
//                 onClick={() => identifyImage()}
//                 disabled={!image || loading}
//                 className="relative w-full group overflow-hidden"
//               >
//                 <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
//                 <div className="relative bg-black px-6 py-4 rounded-lg flex items-center justify-center space-x-2 group-hover:bg-gray-900 transition duration-300">
//                   {loading ? (
//                     <>
//                       <Loader2 className="animate-spin w-5 h-5 text-gray-400" />
//                       <span className="text-base font-medium text-gray-200">Analyzing...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Star className="w-5 h-5 text-gray-400" />
//                       <span className="text-base font-medium text-gray-200">Analyze Resume</span>
//                     </>
//                   )}
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Results Section with Scroll */}
//           <div className="relative group min-h-[calc(100vh-12rem)]">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
//             <div className="relative bg-black/90 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
//               {result ? (
//                 <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
//                   <div className="flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-xl py-2 z-10">
//                     <h3 className="text-xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
//                       Analysis Results
//                     </h3>
//                     <CheckCircle className="w-5 h-5 text-gray-400" />
//                   </div>

//                   <div className="space-y-4 divide-y divide-gray-800">
//                     {result.split("\n").map((line, index) => {
//                       if (line.startsWith("Important Information:") || line.startsWith("Other Information:")) {
//                         return (
//                           <h4
//                             key={index}
//                             className="text-lg font-semibold pt-4 text-gray-300 flex items-center space-x-2"
//                           >
//                             <Star className="w-4 h-4 text-gray-400" />
//                             <span>{line}</span>
//                           </h4>
//                         )
//                       } else if (line.match(/^\d+\./) || line.startsWith("-")) {
//                         return (
//                           <div key={index} className="flex items-start space-x-3 pl-4 pt-4">
//                             <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-2 flex-shrink-0" />
//                             <p className="text-gray-300 text-sm">{line.replace(/^\d+\.\s*|-\s*/, "")}</p>
//                           </div>
//                         )
//                       }
//                       return (
//                         line.trim() !== "" && (
//                           <p key={index} className="text-gray-400 pt-4 text-sm">
//                             {line}
//                           </p>
//                         )
//                       )
//                     })}
//                   </div>

//                   {relatedQuestions.length > 0 && (
//                     <div className="pt-6 border-t border-gray-800">
//                       <h4 className="text-lg font-semibold mb-4 text-gray-300 flex items-center space-x-2">
//                         <Star className="w-4 h-4 text-gray-400" />
//                         <span>Suggested Questions</span>
//                       </h4>
//                       <div className="space-y-2">
//                         {relatedQuestions.map((question, index) => (
//                           <button
//                             key={index}
//                             onClick={() => askRelatedQuestion(question)}
//                             className="w-full text-left bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 py-3 rounded-lg text-sm transition duration-300 border border-gray-700 hover:border-gray-600"
//                           >
//                             {question}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="h-[calc(100vh-16rem)] flex flex-col items-center justify-center space-y-4 text-center">
//                   <Sparkles className="w-12 h-12 text-gray-600" />
//                   <p className="text-gray-400 text-lg">Upload a resume to see the analysis results here</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// // "use client"

// // import { useState } from "react"
// // import { Sparkles, Upload, FileText, Loader2 } from "lucide-react"
// // import { motion } from "framer-motion"

// // export default function Home() {
// //   const [file, setFile] = useState<File | null>(null)
// //   const [extractedText, setExtractedText] = useState<string>("")
// //   const [question, setQuestion] = useState<string>("")
// //   const [answer, setAnswer] = useState<string>("")
// //   const [loading, setLoading] = useState<boolean>(false)

// //   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files[0]) {
// //       setFile(e.target.files[0])
// //       setLoading(true)
// //       const formData = new FormData()
// //       formData.append("pdf", e.target.files[0])

// //       try {
// //         const response = await fetch('api/analyze', {
// //           method: 'POST',
// //           body: formData,
// //         })
// //         console.log("data went to post")
// //         const data = await response.json()
// //         console.log("where r u data? ",data)
// //         setExtractedText(data.text)
// //       } catch (error) {
// //         console.error("Error extracting text:", error)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }
// //   }

// //   const handleQuestionSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     if (!extractedText || !question) return

// //     setLoading(true)
// //     try {
// //       const response = await fetch("/api/analyze", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ pdfContent: extractedText, question }),
// //       })
// //       const data = await response.json()
// //       setAnswer(data.answer)
// //     } catch (error) {
// //       console.error("Error analyzing document:", error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="min-h-screen bg-black text-gray-300 p-8">
// //       <motion.h1
// //         initial={{ opacity: 0, y: -20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         transition={{ duration: 0.5 }}
// //         className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent"
// //       >
// //         Elegant Document Analyzer
// //       </motion.h1>

// //       <div className="max-w-4xl mx-auto">
// //         <motion.div
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5, delay: 0.2 }}
// //           className="mb-8"
// //         >
// //           <h2 className="text-2xl font-semibold mb-4 text-purple-300">Upload PDF for Analysis</h2>
// //           <label className="flex flex-col items-center px-4 py-6 bg-black border-2 border-purple-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-900 transition-colors">
// //             <Upload className="w-8 h-8 text-purple-500 mb-2" />
// //             <span className="text-sm text-purple-500">Choose a PDF file</span>
// //             <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" />
// //           </label>
// //         </motion.div>

// //         {extractedText && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: 0.4 }}
// //             className="mb-8"
// //           >
// //             <h2 className="text-2xl font-semibold mb-4 text-purple-300">Extracted Text Preview</h2>
// //             <div className="bg-gray-900 p-4 rounded-lg">
// //               <p className="text-sm">{extractedText.slice(0, 500)}...</p>
// //             </div>
// //           </motion.div>
// //         )}

// //         <motion.form
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5, delay: 0.6 }}
// //           onSubmit={handleQuestionSubmit}
// //           className="mb-8"
// //         >
// //           <h2 className="text-2xl font-semibold mb-4 text-purple-300">Ask a Question</h2>
// //           <input
// //             type="text"
// //             value={question}
// //             onChange={(e) => setQuestion(e.target.value)}
// //             placeholder="What would you like to know about the document?"
// //             className="w-full p-2 mb-4 bg-gray-900 border border-purple-700 rounded-lg focus:outline-none focus:border-purple-500"
// //           />
// //           <button
// //             type="submit"
// //             disabled={loading || !extractedText}
// //             className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
// //           >
// //             {loading ? <Loader2 className="animate-spin mx-auto" /> : "Analyze"}
// //           </button>
// //         </motion.form>

// //         {answer && (
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5, delay: 0.8 }}
// //           >
// //             <h2 className="text-2xl font-semibold mb-4 text-purple-300">Analysis Result</h2>
// //             <div className="bg-gray-900 p-4 rounded-lg">
// //               <p>{answer}</p>
// //             </div>
// //           </motion.div>
// //         )}
// //       </div>

// //       <footer className="fixed bottom-0 left-0 right-0 bg-black p-4 text-center">
// //         <p className="text-purple-500">Powered by Gemini AI</p>
// //       </footer>
// //     </div>
// //   )
// // }

"use client";

import TextCard from "@/components/TextCard";
import convertor from "@/lib/converter";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useEffect } from "react";
import { BsImageFill } from "react-icons/bs";

const Home = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState<boolean>(false);
  const [texts, setTexts] = useState<Array<string>>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Redirect to interview page if there are processed texts
    if (texts.length > 0) {
      router.push('/interview');
    }
  }, [texts, router]);

  const openBrowseImage = () => {
    imageInputRef.current?.click();
  };

  const convert = async (url: string) => {
    if (url.length) {
      try {
        setProcessing(true);
        const txt = await convertor(url);
        setTexts(prevTexts => [...prevTexts, txt]);
        router.push('/interview');
      } catch (error) {
        console.error('Error processing image:', error);
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      convert(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      convert(url);
    }
  };

  return (
    <div className="min-h-[90vh]">
      <h1 className="text-white text-4xl md:text-6xl text-center px-5 pt-5 font-[800]">
        Built With{" "}
        <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
          Tesseract Js{" "}
        </span>
      </h1>
      <input
        onChange={handleFileChange}
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        required
      />
      <div className="relative md:bottom-10 w-full flex flex-col gap-10 items-center justify-center p-5 md:p-20">
        <div
          onClick={openBrowseImage}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full min-h-[30vh] md:min-h-[50vh] p-5 bg-[#202020] cursor-pointer rounded-xl flex items-center justify-center"
        >
          <div className="w-full flex items-center justify-center flex-col gap-3">
            <p className="text-2xl md:text-3xl text-center text-[#707070] font-[800]">
              {processing
                ? "Processing Image..."
                : "Browse Or Drop Your Image Here"}
            </p>
            <span className="text-8xl md:text-[150px] block text-[#5f5f5f]">
              <BsImageFill className={processing ? "animate-pulse" : ""} />
            </span>
          </div>
        </div>
        {texts.map((t, i) => (
          <TextCard key={i} t={t} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Home;
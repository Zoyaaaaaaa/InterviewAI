// // components/ResumeProcessingLoader.tsx
// "use client";
// import React from "react";
// import { MultiStepLoader as Loader } from "../components/ui/multi-step-loader";

// const resumeLoadingStates = [
//   {
//     text: "Scanning your resume...",
//   },
//   {
//     text: "Extracting work experience",
//   },
//   {
//     text: "Analyzing skills & technologies",
//   },
//   {
//     text: "Processing education background",
//   },
//   {
//     text: "Identifying key achievements",
//   },
//   {
//     text: "Mapping career progression",
//   },
//   {
//     text: "Generating personalized insights",
//   },
//   {
//     text: "Preparing interview questions",
//   },
//   {
//     text: "Ready to ace your interview! 🚀",
//   },
// ];

// interface ResumeProcessingLoaderProps {
//   loading: boolean;
//   onComplete?: () => void;
// }

// export function ResumeProcessingLoader({ loading, onComplete }: ResumeProcessingLoaderProps) {
//   return (
//     <div className="fixed inset-0 z-50">
//       <Loader 
//         loadingStates={resumeLoadingStates} 
//         loading={loading} 
//         duration={1600}
//         onComplete={onComplete}
//       />
//     </div>
//   );
// }
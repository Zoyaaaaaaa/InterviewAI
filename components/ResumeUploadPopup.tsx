// // components/ResumeUploadPopup.tsx
// 'use client'
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Upload } from "lucide-react";

// interface ResumeUploadPopupProps {
//   onClose: () => void;
//   onResumeProcessed: (resumeData: string) => void;
// }

// const ResumeUploadPopup: React.FC<ResumeUploadPopupProps> = ({ onClose, onResumeProcessed }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await fetch('/api/process-resume', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to process resume');
//       }

//       const data = await response.json();
//       onResumeProcessed(data.summary);
//       onClose();
//     } catch (err) {
//       console.error('Error uploading resume:', err);
//       setError('Failed to process resume. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
//       <Card className="w-full max-w-md bg-black-900 text-white border border-neutral-800 shadow-xl rounded-xl">
//         <CardHeader>
//           <CardTitle className="text-white text-xl font-semibold">Upload Your Resume</CardTitle>
//           <CardDescription className="text-neutral-400">
//             Help us tailor your experience by uploading your resume. PDF only.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-5">
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-black-500 rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200">
//                 <div className="flex flex-col items-center justify-center pt-4 pb-5">
//                   <Upload className="w-7 h-7 mb-3 text-neutral-400" />
//                   <p className="text-sm text-white font-medium">
//                     Click to upload or drag & drop
//                   </p>
//                   <p className="text-xs text-neutral-400 mt-1">PDF, max 5MB</p>
//                 </div>
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept=".pdf"
//                   onChange={handleFileUpload}
//                   disabled={isLoading}
//                 />
//               </label>
//             </div>

//             {error && (
//               <p className="text-sm text-red-400 text-center">{error}</p>
//             )}

//             <div className="flex justify-end gap-3">
//               <Button
//                 variant="ghost"
//                 onClick={onClose}
//                 disabled={isLoading}
//                 className="text-neutral-300 hover:text-white hover:bg-neutral-800"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="secondary"
//                 onClick={() => {
//                   onResumeProcessed('');
//                   onClose();
//                 }}
//                 disabled={isLoading}
//                 className="bg-neutral-700 text-white hover:bg-neutral-600"
//               >
//                 Skip Resume
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ResumeUploadPopup;
// components/ResumeUploadPopup.tsx
'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { ResumeProcessingLoader } from './ResumeProcessingLoader';

interface ResumeUploadPopupProps {
  onClose: () => void;
  onResumeProcessed: (resumeData: string) => void;
}

const ResumeUploadPopup: React.FC<ResumeUploadPopupProps> = ({ onClose, onResumeProcessed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/process-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process resume');
      }

      const data = await response.json();
      
      // Simulate processing time to show the loader
      setTimeout(() => {
        onResumeProcessed(data.summary);
        setIsLoading(false);
        onClose();
      }, 16000); // Matches the total duration of loading states
      
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Failed to process resume. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Resume Processing Loader */}
      <ResumeProcessingLoader loading={isLoading} />
      
      {/* Upload Modal */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-40 p-4">
        <Card className="w-full max-w-md bg-black-900 text-white border border-neutral-800 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl font-semibold">Upload Your Resume</CardTitle>
            <CardDescription className="text-neutral-400">
              Help us tailor your experience by uploading your resume. PDF only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-black-500 rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200">
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <Upload className="w-7 h-7 mb-3 text-neutral-400" />
                    <p className="text-sm text-white font-medium">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">PDF, max 5MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className="text-neutral-300 hover:text-white hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onResumeProcessed('');
                    onClose();
                  }}
                  disabled={isLoading}
                  className="bg-neutral-700 text-white hover:bg-neutral-600"
                >
                  Skip Resume
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResumeUploadPopup;
// components/ResumeUploadPopup.tsx
'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";

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
      onResumeProcessed(data.summary);
      onClose();
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Failed to process resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    //   {/* <Card className="w-full max-w-md">
    //     <CardHeader>
    //       <CardTitle>Upload Your Resume</CardTitle>
    //       <CardDescription>
    //         Upload your resume to help tailor the interview questions to your experience.
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <div className="space-y-4">
    //         <div className="flex items-center justify-center w-full">
    //           <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    //             <div className="flex flex-col items-center justify-center pt-5 pb-6">
    //               <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
    //               <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
    //                 <span className="font-semibold">Click to upload</span> or drag and drop
    //               </p>
    //               <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 5MB)</p>
    //             </div>
    //             <input 
    //               type="file" 
    //               className="hidden" 
    //               accept=".pdf" 
    //               onChange={handleFileUpload}
    //               disabled={isLoading}
    //             />
    //           </label>
    //         </div>
            
    //         {error && (
    //           <p className="text-sm text-red-500 text-center">{error}</p>
    //         )}
            
    //         <div className="flex justify-end gap-2">
    //           <Button 
    //             variant="outline" 
    //             onClick={onClose}
    //             disabled={isLoading}
    //           >
    //             Cancel
    //           </Button>
    //           <Button 
    //             variant="secondary" 
    //             onClick={() => {
    //               onResumeProcessed('');
    //               onClose();
    //             }}
    //             disabled={isLoading}
    //           >
    //             Skip Resume
    //           </Button>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card> */}
      
    // </div>
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
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
  );
};

export default ResumeUploadPopup;
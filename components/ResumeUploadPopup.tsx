
// 'use client'
// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRouter } from 'next/navigation';

// const ResumeUploadPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile && selectedFile.type === 'application/pdf') {
//       setFile(selectedFile);
//       setError('');
//     } else {
//       setError('Please select a PDF file');
//       setFile(null);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     if (!file) {
//       setError('Please select a PDF file first');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const formData = new FormData();
//       formData.append('pdf', file);

//       const response = await fetch('/api/process-resume', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Failed to process resume');
//       }

//       const data = await response.json();
//       console.log('Resume processed successfully:', data);

//       // Redirect to the interview page
//       router.push('/interview');
//     } catch (err) {
//       setError(err.message || 'An error occurred while processing the resume');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Upload Your Resume</CardTitle>
//           <CardDescription>Please upload your resume in PDF format to begin the interview.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid w-full items-center gap-1.5">
//               <Label htmlFor="resume">Resume (PDF)</Label>
//               <Input id="resume" type="file" accept="application/pdf" onChange={handleFileChange} />
//             </div>
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             <div className="flex justify-end gap-2">
//               <Button type="button" variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={!file || loading}>
//                 {loading ? 'Processing...' : 'Begin Interview'}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ResumeUploadPopup;

'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';

const ResumeUploadPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (!file) {
  //     setError('Please select a PDF file first');
  //     return;
  //   }

  //   setLoading(true);
  //   setError('');

  //   try {
  //     const formData = new FormData();
  //     formData.append('pdf', file);

  //     const response = await fetch('/api/process-resume', {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to process resume');
  //     }

  //     const { resumeData } = await response.json();
  //     console.log(resumeData);
  //       //pass resume data to /chat route
  //     router.push("/api/chat")
    
  //     // Redirect to the interview page with resume data
  //     // router.push(`/interview?resume=${encodeURIComponent(JSON.stringify(resumeData))}`);
  //   } catch (err) {
  //     setError('An error occurred while processing the resume');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }

    setLoading(true);
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

      const { resumeData } = await response.json();
      console.log(resumeData);
      
      // Store resumeData in sessionStorage or pass it directly to the chat route
      sessionStorage.setItem('resumeData', JSON.stringify(resumeData));
      
      // Redirect to the chat page
      // router.push("/chat");
    
    } catch (err) {
      setError('An error occurred while processing the resume');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Your Resume</CardTitle>
          <CardDescription>Please upload your resume in PDF format to begin the interview.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="resume">Resume (PDF)</Label>
              <Input id="resume" type="file" accept="application/pdf" onChange={handleFileChange} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!file || loading}>
                {loading ? 'Processing...' : 'Begin Interview'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeUploadPopup;
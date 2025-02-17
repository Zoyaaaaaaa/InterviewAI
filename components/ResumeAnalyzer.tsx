// 'use client'
// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Loader2 } from 'lucide-react';
// import ReactFlow, { Node, Edge } from 'reactflow';
// import 'reactflow/dist/style.css';

// interface TaskImprovement {
//   original: string;
//   improved: string;
// }

// interface Scores {
//   experience_score: number;
//   experience_feedback: string;
//   education_score: number;
//   education_feedback: string;
//   skills_score: number;
//   skills_feedback: string;
//   projects_score: number;
//   projects_feedback: string;
//   overall_score: number;
//   overall_feedback: string;
// }

// interface AnalysisResult {
//   nodes: Node[];
//   edges: Edge[];
//   scores: Scores;
//   strengths: string[];
//   weaknesses: string[];
//   recommendations: string[];
//   task_improvements: TaskImprovement[];
// }

// interface ApiResponse {
//   success: boolean;
//   data: AnalysisResult;
//   message?: string;
// }

// const ResumeAnalyzer: React.FC = () => {
//   const [pdfText, setPdfText] = useState<string>('');
//   const [topic, setTopic] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');


//     try {
//       const response = await fetch('/api/resume/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ pdfText, topic }),
//       });

//       const data: ApiResponse = await response.json();
      
//       if (!data.success) {
//         throw new Error(data.message || 'Analysis failed');
//       }

//       setAnalysisResult(data.data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Resume Analyzer</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Resume Text</label>
//               <Textarea
//                 value={pdfText}
//                 onChange={(e:any) => setPdfText(e.target.value)}
//                 placeholder="Paste your resume text here..."
//                 className="h-32"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Job Topic/Title</label>
//               <Input
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 placeholder="e.g., Software Engineer, Data Scientist"
//                 required
//               />
//             </div>
//             <Button type="submit" disabled={loading}>
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Analyzing...
//                 </>
//               ) : (
//                 'Analyze Resume'
//               )}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {error && (
//         <Alert variant="destructive">
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       {analysisResult && (
//         <div className="space-y-6">
//           {/* Mind Map Visualization */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Resume Mind Map</CardTitle>
//             </CardHeader>
//             <CardContent className="h-96">
//               <ReactFlow
//                 nodes={analysisResult.nodes}
//                 edges={analysisResult.edges}
//                 fitView
//               />
//             </CardContent>
//           </Card>

//           {/* Scores */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Evaluation Scores</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {(Object.entries(analysisResult.scores) as [keyof Scores, number | string][]).map(([key, value]) => (
//                   <div key={key} className="p-4 border rounded">
//                     <h3 className="font-medium capitalize">{key.replace(/_/g, ' ')}</h3>
//                     {typeof value === 'number' ? (
//                       <div className="flex items-center mt-2">
//                         <div className="w-full bg-gray-200 rounded-full h-2.5">
//                           <div
//                             className="bg-blue-600 h-2.5 rounded-full"
//                             style={{ width: `${(value / 10) * 100}%` }}
//                           />
//                         </div>
//                         <span className="ml-2">{value}/10</span>
//                       </div>
//                     ) : (
//                       <p className="mt-1 text-sm">{value}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Strengths & Weaknesses */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Strengths</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc pl-6 space-y-2">
//                   {analysisResult.strengths.map((strength, index) => (
//                     <li key={index}>{strength}</li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Areas for Improvement</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc pl-6 space-y-2">
//                   {analysisResult.weaknesses.map((weakness, index) => (
//                     <li key={index}>{weakness}</li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Recommendations */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recommendations</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul className="list-disc pl-6 space-y-2">
//                 {analysisResult.recommendations.map((rec, index) => (
//                   <li key={index}>{rec}</li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>

//           {/* Task Improvements */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Task Improvements</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {analysisResult.task_improvements.map((task, index) => (
//                   <div key={index} className="border-l-4 border-blue-500 pl-4">
//                     <p className="text-sm text-gray-600">Original</p>
//                     <p className="mb-2">{task.original}</p>
//                     <p className="text-sm text-gray-600">Improved</p>
//                     <p className="text-green-600">{task.improved}</p>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResumeAnalyzer;

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MindmapBox } from "./MindMap-Box";
import ResumeDetails from "./resume-details";

const ResumeAnalysis = ({ data }: { data: any }) => {
  if (!data || !data.scores) {
    return <div>Error: Invalid analysis data</div>;
  }

  const {
    nodes,
    edges,
    scores,
    strengths,
    weaknesses,
    recommendations,
    task_improvements,
  } = data;

  return (
    <div className="space-y-8 w-full">
      <Tabs defaultValue="mindmap">
        <TabsList className="w-full max-w-sm">
          <TabsTrigger value="mindmap" className="w-full">
            Mindmap
          </TabsTrigger>
          <TabsTrigger value="details" className="w-full">
            Details
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mindmap">
          <MindmapBox nodes={nodes} edges={edges} />
        </TabsContent>
        <TabsContent value="details">
          <ResumeDetails
            scores={scores}
            strengths={strengths}
            weaknesses={weaknesses}
            recommendations={recommendations}
            task_improvements={task_improvements}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeAnalysis;

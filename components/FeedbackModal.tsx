
// 'use client'
// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface InterviewMetrics {
//   confidence: number;
//   technical: number;
//   communication: number;
// }

// interface InterviewFeedback {
//   overallScore: number;
//   strengths: string[];
//   improvements: string[];
//   metrics?: Partial<InterviewMetrics>;
//   detailed_feedback: string;
//   technical_reasoning?:string;
//   confiedence_reasoning?:string;
//   communication_reasoning?:string;
//   overall_reasoning?:string;
// }

// interface Interview {
//   id: string;
//   conversation: string;
//   created_at: string;
//   feedback?: InterviewFeedback;
// }

// const DEFAULT_METRIC_VALUE = 0;

// interface FeedbackModalProps {
//   interview: Interview | null;
//   isModalOpen: boolean;
//   setIsModalOpen: (open: boolean) => void;
// }

// const FeedbackModal: React.FC<FeedbackModalProps> = ({ interview, isModalOpen, setIsModalOpen }) => {
//   if (!interview?.feedback) return null;

//   const metrics = interview.feedback.metrics || {};
  
//   const metricsData = [
//     { name: 'Confidence', value: metrics.confidence ?? DEFAULT_METRIC_VALUE },
//     { name: 'Technical', value: metrics.technical ?? DEFAULT_METRIC_VALUE },
//     { name: 'Communication', value: metrics.communication ?? DEFAULT_METRIC_VALUE },
//   ];

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
//         <div className="flex flex-col h-full">
//           <DialogHeader className="mb-4 px-1">
//             <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
//               Interview Feedback Analysis
//             </DialogTitle>
//             <DialogDescription className="text-gray-400">
//               Detailed feedback for your interview performance
//             </DialogDescription>
//           </DialogHeader>

//           <ScrollArea className="flex-1 px-1">
//             <div className="space-y-6 pb-6">
//               {/* Overall Score */}
//               <Card className="bg-gradient-to-br from-violet-900 via-purple-900 to-purple-800 shadow-xl border-none">
//                 <CardHeader>
//                   <CardTitle className="text-center text-white text-xl">Overall Score</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-6xl font-bold text-center text-white">
//                     {interview.feedback.overallScore}
//                     <span className="text-3xl text-purple-200 ml-1">/10</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Metrics Chart */}
//               {/* {Object.keys(metrics).length > 0 && (
//                 <Card className="shadow-xl border-gray-800/50 bg-gray-900/50">
//                   <CardHeader>
//                     <CardTitle className="text-xl text-purple-100">Performance Metrics</CardTitle>
//                   </CardHeader>
//                   <CardContent className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={metricsData}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                         <XAxis dataKey="name" stroke="#888" />
//                         <YAxis domain={[0, 10]} stroke="#888" />
//                         <Tooltip 
//                           contentStyle={{ 
//                             backgroundColor: 'rgba(26, 26, 26, 0.95)',
//                             borderColor: '#444',
//                             borderRadius: '8px'
//                           }} 
//                         />
//                         <Line 
//                           type="monotone" 
//                           dataKey="value" 
//                           stroke="#a855f7" 
//                           strokeWidth={3}
//                           dot={{ 
//                             fill: '#a855f7',
//                             strokeWidth: 2,
//                             r: 5
//                           }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </CardContent>
//                 </Card>
//               )} */}

//               {/* Strengths & Improvements */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Strengths */}
//                 <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 h-full">
//                   <CardHeader>
//                     <CardTitle className="text-emerald-400 text-xl flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
//                       Strengths
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="max-h-60 overflow-y-auto pr-3">
//                       <ul className="space-y-2">
//                         {interview.feedback.strengths.map((strength, index) => (
//                           <li 
//                             key={index} 
//                             className="text-gray-300 text-sm p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
//                           >
//                             <span className="text-emerald-400 mr-2">•</span>
//                             {strength}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Improvements */}
//                 <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 h-full">
//                   <CardHeader>
//                     <CardTitle className="text-orange-400 text-xl flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-orange-400"></span>
//                       Areas for Improvement
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="max-h-60 overflow-y-auto pr-3">
//                       <ul className="space-y-2">
//                         {interview.feedback.improvements.map((improvement, index) => (
//                           <li 
//                             key={index} 
//                             className="text-gray-300 text-sm p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
//                           >
//                             <span className="text-orange-400 mr-2">•</span>
//                             {improvement}
//                           </li>
                          
//                         ))}
//                       </ul>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Detailed Feedback */}
//               {/* {interview.feedback.detailed_feedback && (
//                 <Card className="shadow-xl border-gray-800/50 bg-gray-900/50">
//                   <CardHeader>
//                     <CardTitle className="text-xl text-purple-100">Detailed Feedback</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="max-h-60 overflow-y-auto pr-3">
//                       <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
//                         {interview.feedback.detailed_feedback}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )} */}
//             </div>
//           </ScrollArea>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FeedbackModal;

'use client'
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InterviewMetrics {
  confidence: number;
  technical: number;
  communication: number;
}

interface InterviewFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  metrics?: Partial<InterviewMetrics>;
  detailed_feedback: string;
  technical_reasoning?: string;
  confidence_reasoning?: string;
  communication_reasoning?: string;
  overall_reasoning?: string;
}

interface Interview {
  id: string;
  conversation: string;
  created_at: string;
  feedback?: InterviewFeedback;
}

const FeedbackModal: React.FC<{
  interview: Interview | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}> = ({ interview, isModalOpen, setIsModalOpen }) => {
  if (!interview?.feedback) return null;

  // Process feedback data for display
  const formatScore = (score: number) => Math.round(score );
  const feedback = interview.feedback;

  // // Prepare metrics data for chart
  // const metricsData = [
  //   { name: 'Technical', value: formatScore(feedback.metrics?.technical || 0) },
  //   { name: 'Communication', value: formatScore(feedback.metrics?.communication || 0) },
  //   { name: 'Confidence', value: formatScore(feedback.metrics?.confidence || 0) },
  // ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="mb-4 px-1">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 text-transparent bg-clip-text">
              Interview Feedback Analysis
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Detailed feedback for your interview performance
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-1">
            <div className="space-y-6 pb-6">
              {/* Overall Score */}
              <Card className="bg-gradient-to-br from-violet-900 via-purple-900 to-purple-800 shadow-xl border-none">
                <CardHeader>
                  <CardTitle className="text-center text-white text-xl">Overall Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-white">
                    {formatScore(feedback.overallScore)}
                    <span className="text-3xl text-purple-200 ml-1">/10</span>
                  </div>
                  {feedback.overall_reasoning && (
                    <p className="text-gray-200 text-sm mt-2 max-w-2xl mx-auto">
                      {feedback.overall_reasoning}
                    </p>
                  )}
                </CardContent>
              </Card>
              

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <Card className="shadow-xl border-gray-800/50 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 text-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-3">
                      {feedback.strengths.length > 0 ? (
                        feedback.strengths.map((strength, index) => (
                          <li 
                            key={index} 
                            className="text-gray-300 text-sm p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                          >
                            <span className="text-emerald-400 mr-2">•</span>
                            {strength}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm p-3">No strengths noted</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Improvements */}
                <Card className="shadow-xl border-gray-800/50 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle className="text-orange-400 text-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-3">
                      {feedback.improvements.length > 0 ? (
                        feedback.improvements.map((improvement, index) => (
                          <li 
                            key={index} 
                            className="text-gray-300 text-sm p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                          >
                            <span className="text-orange-400 mr-2">•</span>
                            {improvement}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm p-3">No improvement areas noted</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Feedback */}
              {/* <Card className="shadow-xl border-gray-800/50 bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-100">Detailed Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto pr-3">
                    {feedback.detailed_feedback ? (
                      <div className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                        {feedback.detailed_feedback.split('\n').map((paragraph, i) => (
                          <p key={i} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No detailed feedback provided</p>
                    )}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
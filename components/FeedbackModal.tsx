// 'use client'
// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface InterviewMetrics {
//   clarity: number;
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
//     { name: 'Clarity', value: metrics.clarity ?? DEFAULT_METRIC_VALUE },
//     { name: 'Confidence', value: metrics.confidence ?? DEFAULT_METRIC_VALUE },
//     { name: 'Technical', value: metrics.technical ?? DEFAULT_METRIC_VALUE },
//     { name: 'Communication', value: metrics.communication ?? DEFAULT_METRIC_VALUE },
//   ];

//   return (
//     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//       <DialogContent className="max-w-4xl max-h-[90vh]">
//         <ScrollArea className="h-full pr-4">
//           <DialogHeader className="mb-6">
//             <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 text-transparent bg-clip-text pb-2">
//               Interview Feedback Analysis
//             </DialogTitle>
//             <DialogDescription className="text-gray-400">
//               Detailed feedback for Interview #{interview.id}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-8">
//             <Card className="bg-gradient-to-br from-violet-900 via-purple-900 to-purple-800 shadow-lg shadow-purple-900/20 border-none">
//               <CardHeader>
//                 <CardTitle className="text-center text-white text-xl">Overall Score</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-6xl font-bold text-center text-white mb-2">
//                   {interview.feedback.overallScore}
//                   <span className="text-3xl text-purple-200">/10</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {Object.keys(metrics).length > 0 && (
//               <Card className="shadow-lg border-gray-800">
//                 <CardHeader>
//                   <CardTitle className="text-xl text-purple-100">Performance Metrics</CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-72">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={metricsData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//                       <XAxis dataKey="name" stroke="#888" />
//                       <YAxis domain={[0, 10]} stroke="#888" />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: '#1a1a1a', 
//                           border: '1px solid #333',
//                           borderRadius: '8px',
//                           padding: '8px'
//                         }} 
//                       />
//                       <Line 
//                         type="monotone" 
//                         dataKey="value" 
//                         stroke="#a855f7" 
//                         strokeWidth={3}
//                         dot={{ 
//                           fill: '#a855f7',
//                           strokeWidth: 2,
//                           r: 6,
//                           stroke: '#1a1a1a'
//                         }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {interview.feedback.strengths && interview.feedback.strengths.length > 0 && (
//                 <Card className="shadow-lg border-gray-800">
//                   <CardHeader>
//                     <CardTitle className="text-emerald-400 text-xl flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
//                       Strengths
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-3">
//                       {interview.feedback.strengths.map((strength, index) => (
//                         <li key={index} className="text-gray-300 flex items-start gap-2 text-sm">
//                           <span className="text-emerald-400 mt-1">•</span>
//                           {strength}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}

//               {interview.feedback.improvements && interview.feedback.improvements.length > 0 && (
//                 <Card className="shadow-lg border-gray-800">
//                   <CardHeader>
//                     <CardTitle className="text-orange-400 text-xl flex items-center gap-2">
//                       <span className="w-2 h-2 rounded-full bg-orange-400"></span>
//                       Areas for Improvement
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ul className="space-y-3">
//                       {interview.feedback.improvements.map((improvement, index) => (
//                         <li key={index} className="text-gray-300 flex items-start gap-2 text-sm">
//                           <span className="text-orange-400 mt-1">•</span>
//                           {improvement}
//                         </li>
//                       ))}
//                     </ul>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>

//             {interview.feedback.detailed_feedback && (
//               <Card className="shadow-lg border-gray-800">
//                 <CardHeader>
//                   <CardTitle className="text-xl text-purple-100">Detailed Feedback</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
//                     {interview.feedback.detailed_feedback}
//                   </p>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FeedbackModal;
'use client'
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InterviewMetrics {
  // clarity: number;
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
}

interface Interview {
  id: string;
  conversation: string;
  created_at: string;
  feedback?: InterviewFeedback;
}

const DEFAULT_METRIC_VALUE = 0;

interface FeedbackModalProps {
  interview: Interview | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ interview, isModalOpen, setIsModalOpen }) => {
  if (!interview?.feedback) return null;

  const metrics = interview.feedback.metrics || {};
  
  const metricsData = [
    // { name: 'Clarity', value: metrics.clarity ?? DEFAULT_METRIC_VALUE },
    { name: 'Confidence', value: metrics.confidence ?? DEFAULT_METRIC_VALUE },
    { name: 'Technical', value: metrics.technical ?? DEFAULT_METRIC_VALUE },
    { name: 'Communication', value: metrics.communication ?? DEFAULT_METRIC_VALUE },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-b from-gray-900 to-gray-950">
        <ScrollArea className="h-full px-6">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-500 text-transparent bg-clip-text pb-3">
              Interview Feedback Analysis
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-lg">
              Detailed feedback for Interview #{interview.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8">
            <Card className="bg-gradient-to-br from-violet-900 via-purple-900 to-purple-800 shadow-xl shadow-purple-900/30 border-none transform hover:scale-[1.02] transition-transform">
              <CardHeader>
                <CardTitle className="text-center text-white text-2xl font-light">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-7xl font-bold text-center text-white mb-2">
                  {interview.feedback.overallScore}
                  <span className="text-4xl text-purple-200 ml-2">/10</span>
                </div>
              </CardContent>
            </Card>

            {Object.keys(metrics).length > 0 && (
              <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-100">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metricsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis domain={[0, 10]} stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(26, 26, 26, 0.95)', 
                          border: '1px solid #444',
                          borderRadius: '12px',
                          padding: '12px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#a855f7" 
                        strokeWidth={3}
                        dot={{ 
                          fill: '#a855f7',
                          strokeWidth: 2,
                          r: 6,
                          stroke: '#1a1a1a'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interview.feedback.strengths && interview.feedback.strengths.length > 0 && (
                <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="text-emerald-400 text-2xl flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {interview.feedback.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-3 text-base">
                          <span className="text-emerald-400 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {interview.feedback.improvements && interview.feedback.improvements.length > 0 && (
                <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform">
                  <CardHeader>
                    <CardTitle className="text-orange-400 text-2xl flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-orange-400"></span>
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {interview.feedback.improvements.map((improvement, index) => (
                        <li key={index} className="text-gray-300 flex items-start gap-3 text-base">
                          <span className="text-orange-400 mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* {interview.feedback.detailed_feedback && (
              <Card className="shadow-xl border-gray-800/50 bg-gray-900/50 backdrop-blur-sm transform hover:scale-[1.02] transition-transform">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-100">Detailed Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed text-base">
                    {interview.feedback.detailed_feedback}
                  </p>
                </CardContent>
              </Card>
            )} */}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
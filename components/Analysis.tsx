// 'use client';

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast, Toaster } from 'react-hot-toast';
// import { 
//   Target, BookOpen, Zap, CheckCircle, AlertTriangle,
//   BarChart, PieChart, TrendingUp, MessageSquare,
//   XCircle, ThumbsUp, Award, Brain
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts';

// interface InterviewAnalysis {
//   id: string;
//   transcript: string;
//   messages: any[];
//   created_at: string;
//   analysis: {
//     technicalScore: number;
//     communicationScore: number;
//     confidenceScore: number;
//     overallScore: number;
//     improvements: string[];
//     strengths: string[];
//   };
// }

// const InterviewDashboard: React.FC = () => {
//   const [selectedInterview, setSelectedInterview] = useState<InterviewAnalysis | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

//   // Dummy data for demonstration
//   const dummyInterview: InterviewAnalysis = {
//     id: '123',
//     transcript: "The interview covered various technical topics including system design and algorithms...",
//     messages: [],
//     created_at: new Date().toISOString(),
//     analysis: {
//       technicalScore: 8.5,
//       communicationScore: 7.8,
//       confidenceScore: 8.2,
//       overallScore: 8.2,
//       improvements: [
//         "Elaborate more on system design trade-offs",
//         "Provide more real-world examples",
//         "Take time to structure responses"
//       ],
//       strengths: [
//         "Strong technical knowledge",
//         "Clear communication style",
//         "Good problem-solving approach"
//       ]
//     }
//   };

//   const chartData = [
//     { name: 'Technical', score: dummyInterview.analysis.technicalScore },
//     { name: 'Communication', score: dummyInterview.analysis.communicationScore },
//     { name: 'Confidence', score: dummyInterview.analysis.confidenceScore }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white py-12 px-4">
//       <Toaster position="top-right" />
      
//       {/* Save Confirmation Toast */}
//       <AnimatePresence>
//         {showSaveConfirmation && (
//           <motion.div
//             initial={{ opacity: 0, y: -50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
//           >
//             Interview saved! Generating analysis...
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto">
//         <div className="mb-12">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-4">
//             Interview Analysis
//           </h1>
//           <p className="text-gray-300">Detailed breakdown of your performance and areas for improvement</p>
//         </div>

//         {/* Performance Overview */}
//         <div className="grid md:grid-cols-4 gap-6 mb-12">
//           {[
//             { label: 'Overall Score', value: dummyInterview.analysis.overallScore, icon: Award, color: 'purple' },
//             { label: 'Technical', value: dummyInterview.analysis.technicalScore, icon: Brain, color: 'blue' },
//             { label: 'Communication', value: dummyInterview.analysis.communicationScore, icon: MessageSquare, color: 'green' },
//             { label: 'Confidence', value: dummyInterview.analysis.confidenceScore, icon: ThumbsUp, color: 'pink' }
//           ].map((metric, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-${metric.color}-500/20 hover:border-${metric.color}-500/40 transition-all`}
//             >
//               <metric.icon className={`text-${metric.color}-400 mb-3`} size={32} />
//               <h2 className="text-lg font-semibold text-gray-200 mb-2">{metric.label}</h2>
//               <p className={`text-3xl font-bold text-${metric.color}-400`}>{metric.value}/10</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* Performance Chart */}
//         <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-12">
//           <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//                 <XAxis dataKey="name" stroke="#9CA3AF" />
//                 <YAxis stroke="#9CA3AF" domain={[0, 10]} />
//                 <Tooltip 
//                   contentStyle={{ 
//                     backgroundColor: '#1F2937', 
//                     border: '1px solid rgba(147, 51, 234, 0.2)' 
//                   }} 
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="score" 
//                   stroke="#8B5CF6" 
//                   strokeWidth={2} 
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Improvements and Strengths */}
//         <div className="grid md:grid-cols-2 gap-6 mb-12">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20"
//           >
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <TrendingUp className="text-yellow-400 mr-2" size={24} />
//               Areas for Improvement
//             </h2>
//             <ul className="space-y-3">
//               {dummyInterview.analysis.improvements.map((item, index) => (
//                 <li key={index} className="flex items-start space-x-2 text-gray-300">
//                   <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={16} />
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
//           >
//             <h2 className="text-xl font-semibold mb-4 flex items-center">
//               <Award className="text-green-400 mr-2" size={24} />
//               Key Strengths
//             </h2>
//             <ul className="space-y-3">
//               {dummyInterview.analysis.strengths.map((item, index) => (
//                 <li key={index} className="flex items-start space-x-2 text-gray-300">
//                   <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={16} />
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         </div>

//         {/* Analysis Modal */}
//         <AnimatePresence>
//           {showModal && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
//               onClick={() => setShowModal(false)}
//             >
//               <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 border border-purple-500/20"
//                 onClick={e => e.stopPropagation()}
//               >
//                 <div className="flex justify-between items-center mb-6">
//                   <h2 className="text-2xl font-bold text-purple-400">Detailed Analysis</h2>
//                   <button onClick={() => setShowModal(false)}>
//                     <XCircle className="text-gray-400 hover:text-gray-300" size={24} />
//                   </button>
//                 </div>
                
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2 text-purple-300">Technical Assessment</h3>
//                     <p className="text-gray-300">Strong understanding of core concepts. Consider diving deeper into system design patterns.</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2 text-purple-300">Communication Style</h3>
//                     <p className="text-gray-300">Clear and structured responses. Work on providing more concrete examples.</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-lg font-semibold mb-2 text-purple-300">Next Steps</h3>
//                     <ul className="list-disc list-inside text-gray-300 space-y-2">
//                       <li>Review system design fundamentals</li>
//                       <li>Practice explaining complex concepts</li>
//                       <li>Work on time management during responses</li>
//                     </ul>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default InterviewDashboard;
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import {  CheckCircle, AlertTriangle, TrendingUp, MessageSquare,
  XCircle, ThumbsUp, Award, Brain
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface InterviewAnalysis {
  id: string;
  transcript: string;
  messages: any[];
  created_at: string;
  analysis: {
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number;
    overallScore: number;
    improvements: string[];
    strengths: string[];
  };
}

const InterviewDashboard: React.FC = () => {
  const [selectedInterview, setSelectedInterview] = useState<InterviewAnalysis | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSaveConfirmation] = useState(false);

  // Fetch the interview data from your API or database (dummy data simulation here)
  useEffect(() => {
    // Simulating a fetch call for the saved interview data
    const fetchInterviewData = async () => {
      try {
        // Replace the following line with your actual API call (fetch, axios, etc.)
        const response = await fetch('/api/feedback');  // example API endpoint
        const data = await response.json();

        // Set the retrieved data to state
        setSelectedInterview(data);

      } catch (error) {
        console.error('Error fetching interview data:', error);
        toast.error('Failed to fetch interview data');
      }
    };

    fetchInterviewData();
  }, []);

  if (!selectedInterview) {
    return <div>Loading...</div>; // Optionally, show a loading state while data is being fetched
  }

  const chartData = [
    { name: 'Technical', score: selectedInterview.analysis.technicalScore },
    { name: 'Communication', score: selectedInterview.analysis.communicationScore },
    { name: 'Confidence', score: selectedInterview.analysis.confidenceScore }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white py-12 px-4">
      <Toaster position="top-right" />
      
      {/* Save Confirmation Toast */}
      <AnimatePresence>
        {showSaveConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            Interview saved! Generating analysis...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text mb-4">
            Interview Analysis
          </h1>
          <p className="text-gray-300">Detailed breakdown of your performance and areas for improvement</p>
        </div>

        {/* Performance Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[{
              label: 'Overall Score', value: selectedInterview.analysis.overallScore, icon: Award, color: 'purple'
            }, {
              label: 'Technical', value: selectedInterview.analysis.technicalScore, icon: Brain, color: 'blue'
            }, {
              label: 'Communication', value: selectedInterview.analysis.communicationScore, icon: MessageSquare, color: 'green'
            }, {
              label: 'Confidence', value: selectedInterview.analysis.confidenceScore, icon: ThumbsUp, color: 'pink'
            }].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-${metric.color}-500/20 hover:border-${metric.color}-500/40 transition-all`}
            >
              <metric.icon className={`text-${metric.color}-400 mb-3`} size={32} />
              <h2 className="text-lg font-semibold text-gray-200 mb-2">{metric.label}</h2>
              <p className={`text-3xl font-bold text-${metric.color}-400`}>{metric.value}/10</p>
            </motion.div>
          ))}
        </div>

        {/* Performance Chart */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-12">
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid rgba(147, 51, 234, 0.2)' 
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvements and Strengths */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="text-yellow-400 mr-2" size={24} />
              Areas for Improvement
            </h2>
            <ul className="space-y-3">
              {selectedInterview.analysis.improvements.map((item, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="text-green-400 mr-2" size={24} />
              Key Strengths
            </h2>
            <ul className="space-y-3">
              {selectedInterview.analysis.strengths.map((item, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-300">
                  <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Analysis Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 border border-purple-500/20"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-purple-400">Detailed Analysis</h2>
                  <button onClick={() => setShowModal(false)}>
                    <XCircle className="text-gray-400 hover:text-gray-300" size={24} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Technical Assessment</h3>
                    <p className="text-gray-300">Strong understanding of core concepts. Consider diving deeper into system design patterns.</p>
                  </div>
                  

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-purple-300">Next Steps</h3>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li>Review system design fundamentals</li>
                      <li>Practice explaining complex concepts</li>
                      <li>Work on time management during responses</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InterviewDashboard;

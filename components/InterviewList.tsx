

'use client'
import React, { useEffect, useState } from 'react';
import { Clock, MessageSquare, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatDate, getConversationPreview } from '@/utils/formatter';
import FeedbackModal from './FeedbackModal';
import { InterviewMetrics,InterviewFeedback,Interview,FeedbackStatus } from '@/types/interview';

const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>({});
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/interviews', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch interviews: ${errorText}`);
        }

        const data: Interview[] = await response.json();
        setInterviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);


  const generateFeedback = async (interviewId: string) => {
    console.log('Starting feedback generation for interview:', interviewId);
  
    // Find the current interview in the local interviews state
    const currentInterview = interviews.find(i => i.id === interviewId);
    console.log('Current interview data:', currentInterview);
  
    // If no interview exists in the local state, fetch it from the server
    if (!currentInterview) {
      console.log('Interview not found in local state. Fetching from API...');
      
      try {
        const interviewResponse = await fetch(`/api/interviews/${interviewId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        console.log('Interview fetch response:', interviewResponse);
  
        if (!interviewResponse.ok) {
          const errorText = await interviewResponse.text();
          console.error('API error response while fetching interview:', errorText);
          throw new Error(`Failed to fetch interview: ${errorText}`);
        }
  
        const interviewData = await interviewResponse.json();
        console.log('Fetched interview data:', interviewData);
  
        // Update the interviews state with the fetched interview
        const updatedInterviews = [...interviews, interviewData];
        setInterviews(updatedInterviews);
  
        // Now we have the interview, we can proceed to fetch feedback
        console.log('Fetching feedback for the newly fetched interview...');
        const feedbackResponse = await fetch(`/api/feedback/${interviewId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        console.log('Feedback API response:', feedbackResponse);
  
        if (!feedbackResponse.ok) {
          const errorText = await feedbackResponse.text();
          console.error('API error response while fetching feedback:', errorText);
          throw new Error(`Failed to generate feedback: ${errorText}`);
        }
  
        const feedbackData = await feedbackResponse.json();
        console.log('Received feedback data:', feedbackData);
  
        // Update the interview with new feedback
        const updatedInterviewsWithFeedback = updatedInterviews.map(interview => 
          interview.id === interviewId
            ? { ...interview, feedback: feedbackData }
            : interview
        );
  
        console.log('Updated interviews array with feedback:', updatedInterviewsWithFeedback);
        setInterviews(updatedInterviewsWithFeedback);
  
        // Update feedback status and show modal
        setFeedbackStatus(prev => ({
          ...prev,
          [interviewId]: { loading: false, error: null },
        }));
  
        const updatedInterview = updatedInterviewsWithFeedback.find(i => i.id === interviewId);
        console.log('Setting selected interview:', updatedInterview);
        setSelectedInterview(updatedInterview || null);
        setIsModalOpen(true);
  
      } catch (err) {
        console.error('Error generating feedback:', err);
        setFeedbackStatus(prev => ({
          ...prev,
          [interviewId]: {
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to generate feedback',
          },
        }));
      }
    } else {
      // If interview exists, check if feedback is already present
      if (currentInterview.feedback) {
        console.log('Existing feedback found:', currentInterview.feedback);
        setSelectedInterview(currentInterview);
        setIsModalOpen(true);
        return;
      }
  
      // If no feedback exists, proceed to fetch feedback from API
      console.log('No existing feedback found. Fetching from API...');
      setFeedbackStatus(prev => ({
        ...prev,
        [interviewId]: { loading: true, error: null },
      }));
  
      try {
        const feedbackResponse = await fetch(`/api/feedback/${interviewId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        console.log('Feedback API response:', feedbackResponse);
  
        if (!feedbackResponse.ok) {
          const errorText = await feedbackResponse.text();
          console.error('API error response:', errorText);
          throw new Error(`Failed to generate feedback: ${errorText}`);
        }
  
        const feedbackData = await feedbackResponse.json();
        console.log('Received feedback data:', feedbackData);
  
        // Update the interview with new feedback
        const updatedInterviews = interviews.map(interview =>
          interview.id === interviewId
            ? { ...interview, feedback: feedbackData }
            : interview
        );
  
        console.log('Updated interviews array with feedback:', updatedInterviews);
        setInterviews(updatedInterviews);
  
        // Update feedback status and show modal
        setFeedbackStatus(prev => ({
          ...prev,
          [interviewId]: { loading: false, error: null },
        }));
  
        const updatedInterview = updatedInterviews.find(i => i.id === interviewId);
        console.log('Setting selected interview:', updatedInterview);
        setSelectedInterview(updatedInterview || null);
        setIsModalOpen(true);
  
      } catch (err) {
        console.error('Error generating feedback:', err);
        setFeedbackStatus(prev => ({
          ...prev,
          [interviewId]: {
            loading: false,
            error: err instanceof Error ? err.message : 'Failed to generate feedback',
          },
        }));
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>Error loading interviews: {error}</AlertDescription>
      </Alert>
    );
  }

  // return (
  //   <div className="space-y-8 mb-12">
  //     <div className="flex items-center justify-between">
  //       <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-pink-500 text-transparent bg-clip-text">
  //         Interview History
  //       </h2>
  //       <span className="text-gray-400 font-medium">
  //         {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
  //       </span>
  //     </div>

  //     {interviews.length > 0 ? (
  //       <div className="grid gap-6">
  //         <AnimatePresence>
  //           {interviews.map((interview: Interview) => (
  //             <motion.div
  //               key={interview.id}
  //               initial={{ opacity: 0, y: 20 }}
  //               animate={{ opacity: 1, y: 0 }}
  //               exit={{ opacity: 0, y: -20 }}
  //               transition={{ duration: 0.4 }}
  //               className="p-6 bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl shadow-lg hover:border-purple-500/50 hover:bg-gray-800/70 transition-all"
  //             >
  //               <div className="flex items-center justify-between mb-4">
  //                 <div className="flex items-center space-x-4">
  //                   <h3 className="text-lg font-semibold text-purple-400">
  //                     Interview #{interview.id}
  //                   </h3>
  //                   {interview.feedback && (
  //                     <span className="px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full ring-1 ring-green-400/20">
  //                       Feedback Available
  //                     </span>
  //                   )}
  //                 </div>
  //                 <div className="flex items-center space-x-2 text-gray-400">
  //                   <Calendar className="w-4 h-4" />
  //                   <span className="text-sm font-medium">{formatDate(interview.created_at)}</span>
  //                 </div>
  //               </div>
                
  //               <p className="text-sm text-gray-300 mb-6 leading-relaxed">
  //                 {getConversationPreview(interview.conversation)}
  //               </p>

  //               <div className="flex justify-between items-center">
  //                 <Button
  //                   onClick={() => generateFeedback(interview.id)}
  //                   disabled={feedbackStatus[interview.id]?.loading}
  //                   className="bg-purple-500 hover:bg-purple-600 text-white transition-colors"
  //                 >
  //                   {feedbackStatus[interview.id]?.loading ? (
  //                     <div className="flex items-center space-x-2">
  //                       <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
  //                       <span>Generating...</span>
  //                     </div>
  //                   ) : interview.feedback ? (
  //                     'View Feedback'
  //                   ) : (
  //                     'Generate Feedback'
  //                   )}
  //                 </Button>

  //                 {feedbackStatus[interview.id]?.error && (
  //                   <p className="text-sm text-red-400">
  //                     {feedbackStatus[interview.id]?.error}
  //                   </p>
  //                 )}
  //               </div>
  //             </motion.div>
  //           ))}
  //         </AnimatePresence>
  //       </div>
  //     ) : (
  //       <motion.div 
  //         initial={{ opacity: 0, y: 20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="text-center p-12 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700/50 shadow-lg"
  //       >
  //         <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
  //         <h3 className="text-xl font-semibold text-gray-300 mb-2">No Interviews Yet</h3>
  //         <p className="text-gray-400 max-w-md mx-auto">
  //           Start a new interview to practice and receive detailed feedback on your performance.
  //         </p>
  //       </motion.div>
  //     )}

  //     <FeedbackModal 
  //       interview={selectedInterview} 
  //       isModalOpen={isModalOpen}
  //       setIsModalOpen={setIsModalOpen}
  //     />
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
          Interview History
        </h2>
        <span className="px-4 py-2 rounded-full bg-black/30 border border-purple-900/30 text-purple-300 font-medium">
          {interviews.length} {interviews.length === 1 ? 'Interview' : 'Interviews'}
        </span>
      </div>
  
      {interviews.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {interviews.map((interview) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-black/40 backdrop-blur-sm border border-purple-900/30 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-900/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h3 className="text-xl font-semibold text-purple-400">
                        Interview 
                      </h3>
                      {interview.feedback && (
                        <span className="px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full ring-1 ring-green-400/20">
                          Feedback Available
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatDate(interview.created_at)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-purple-200 opacity-80 leading-relaxed">
                    {getConversationPreview(interview.conversation)}
                  </p>
  
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => generateFeedback(interview.id)}
                      disabled={feedbackStatus[interview.id]?.loading}
                     className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 rounded-full"
                    >
                      {feedbackStatus[interview.id]?.loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </div>
                      ) : interview.feedback ? (
                        'View Feedback'
                      ) : (
                        'Generate Feedback'
                      )}
                    </Button>
  
                    {feedbackStatus[interview.id]?.error && (
                      <p className="text-sm text-red-400">
                        {feedbackStatus[interview.id]?.error}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-12 bg-black/40 backdrop-blur-sm rounded-3xl border border-purple-900/30 shadow-2xl"
        >
          <MessageSquare className="mx-auto h-16 w-16 text-purple-400 mb-6" />
          <h3 className="text-2xl font-semibold text-purple-300 mb-3">No Interviews Yet</h3>
          <p className="text-purple-200 max-w-md mx-auto opacity-80">
            Start a new interview to practice and receive detailed feedback on your performance.
          </p>
        </motion.div>
      )}
  
      <FeedbackModal 
        interview={selectedInterview} 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default InterviewList;


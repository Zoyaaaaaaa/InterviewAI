
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Target, 
  Briefcase, 
  BookOpen, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  MessageSquare,
  BarChart
} from 'lucide-react';
import Link from 'next/link';
import FeedbackOverview from '@/components/FeedbackOverview';
import InterviewList from '@/components/InterviewList';

interface PreferencesData {
  placement_goal: string;
  preferred_industry: string;
  skill_focus: string;
  interview_preparation: string;
}

interface Interview {
  id: string;
  start_time: number;
  end_time: number;
  voice_model: string;
  duration: number;
  transcript: string;
  created_at: string;
}

const InterviewDashboard = () => {
  const [preferences, setPreferences] = useState<PreferencesData | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const preferenceCards = [
    {
      icon: Target,
      title: "Placement Goal",
      value: preferences?.placement_goal,
      color: "purple",
      delay: 0.1
    },
    {
      icon: Briefcase,
      title: "Preferred Industry",
      value: preferences?.preferred_industry,
      color: "green",
      delay: 0.2
    },
    {
      icon: BookOpen,
      title: "Skill Focus",
      value: preferences?.skill_focus,
      color: "blue",
      delay: 0.3
    },
    {
      icon: CheckCircle,
      title: "Interview Preparation",
      value: preferences?.interview_preparation,
      color: "yellow",
      delay: 0.4
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/details', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch preferences.');

        const preferencesData = await response.json();
        if (preferencesData?.length > 0) {
          setPreferences(preferencesData[0]);
        }

        setInterviews([{
          id: '123e4567-e89b-12d3-a456-426614174000',
          start_time: Date.now() - 3600000,
          end_time: Date.now(),
          voice_model: 'gpt-4',
          duration: 45,
          transcript: 'Interview covered data structures, algorithms, and system design...',
          created_at: new Date().toISOString()
        }]);
      } catch (err) {
        setError('An error occurred while loading data.');
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Zap className="mx-auto mb-4 animate-pulse text-purple-500" size={64} />
          <p className="text-xl font-semibold text-white">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900/10 to-black">
        <motion.div
          {...fadeInUp}
          className="text-center bg-red-900/20 p-8 rounded-xl border border-red-500/30"
        >
          <AlertTriangle className="mx-auto mb-4 text-red-500" size={64} />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-300">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div {...fadeInUp} className="space-y-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              Your Interview Dashboard
            </h1>
            <Link href="/interview">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/25 w-full sm:w-auto"
              >
                Start New Interview
              </motion.button>
            </Link>
          </div>

          {/* Preferences Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {preferenceCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
                className={`bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-${card.color}-500/20 hover:border-${card.color}-500/40 transition-all group`}
              >
                <card.icon className={`text-${card.color}-400 mb-3 group-hover:scale-110 transition-transform`} size={32} />
                <h2 className={`text-lg font-semibold text-${card.color}-300 mb-2`}>{card.title}</h2>
                <p className="text-gray-300">{card.value || 'Not set'}</p>
              </motion.div>
            ))}
          </div>

          {/* Feedback Overview */}
          <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
            <FeedbackOverview />
          </motion.div>

          {/* Interview List */}
          <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
            <InterviewList />
          </motion.div>
        </motion.div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default InterviewDashboard;
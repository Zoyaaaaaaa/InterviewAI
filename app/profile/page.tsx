
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Briefcase, 
  BookOpen, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Edit3,
  User
} from 'lucide-react';
import Link from 'next/link';
import FeedbackOverview from '@/components/FeedbackOverview';
import InterviewList from '@/components/InterviewList';
import { Toaster } from 'react-hot-toast';

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

const formatPreferenceValue = (value: string) => {
  if (!value) return 'Not set';
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const InterviewDashboard = () => {
  const [preferences, setPreferences] = useState<PreferencesData | null>(null);
  const [, setInterviews] = useState<Interview[]>([]);
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
        
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`Failed to fetch preferences: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.data) {
          setPreferences(result.data);
          console.log("Preferences set:", result.data);
        } else {
          console.log("No preferences data found");
          setPreferences(null);
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
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while loading data.');
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
            <div className="flex items-center gap-3">
              <User className="text-purple-400" size={32} />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
                Your Interview Dashboard
              </h1>
            </div>
            <div className="flex gap-3">
              <Link href="/preferences">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center gap-2"
                >
                  <Edit3 size={16} />
                  Edit Preferences
                </motion.button>
              </Link>
              <Link href="/interview">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/25"
                >
                  Start New Interview
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Preferences Status */}
          {!preferences && (
            <motion.div 
              {...fadeInUp}
              className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-6 text-center"
            >
              <AlertTriangle className="mx-auto mb-4 text-yellow-500" size={48} />
              <h2 className="text-xl font-semibold text-yellow-400 mb-2">
                No Preferences Set
              </h2>
              <p className="text-yellow-300 mb-4">
                Set your placement preferences to get personalized interview recommendations.
              </p>
              <Link href="/preferences">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-semibold text-white transition-colors"
                >
                  Set Preferences Now
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Preferences Grid */}
          {preferences && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {preferenceCards.map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: card.delay }}
                  className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all group"
                >
                  <card.icon className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h2 className="text-lg font-semibold text-gray-200 mb-2">{card.title}</h2>
                  <p className="text-gray-300 font-medium">
                    {formatPreferenceValue(card.value || '')}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

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
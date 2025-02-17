'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';

interface PreferencesData {
  career_goal: string;
  field_to_excel: string;
  practice_area: string;
  interview_type: string;
}

export default function Profile() {
  const [preferences, setPreferences] = useState<PreferencesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(errorDetails.error || 'Failed to fetch preferences.');
        }

        const { preferences } = await response.json();
        setPreferences(preferences);
        setLoading(false);
      } catch (err) {
        setError('An error occurred.');
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading your preferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <motion.div
        className="max-w-xl mx-auto bg-black/60 border border-purple-900/30 rounded-2xl shadow-2xl p-8 mt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
          Your Preferences
        </h1>
        {preferences ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-purple-400">Career Goal:</h2>
              <p>{preferences.career_goal}</p>
            </div>
            <div>
              <h2 className="text-purple-400">Field of Excellence:</h2>
              <p>{preferences.field_to_excel}</p>
            </div>
            <div>
              <h2 className="text-purple-400">Practice Area:</h2>
              <p>{preferences.practice_area}</p>
            </div>
            <div>
              <h2 className="text-purple-400">Interview Type:</h2>
              <p>{preferences.interview_type}</p>
            </div>
          </div>
        ) : (
          <p>No preferences found.</p>
        )}
      </motion.div>
    </div>
  );
}

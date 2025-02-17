'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PreferencesData {
  placement_goal: string;
  preferred_industry: string;
  skill_focus: string;
  interview_preparation: string;
}

const PREFERENCE_OPTIONS = {
  placementGoals: [
    { value: 'core-job', label: 'Core Engineering Job' },
    { value: 'it-job', label: 'IT/Software Development' },
    { value: 'management', label: 'Management/Consulting' },
    { value: 'higher-studies', label: 'Higher Studies Preparation' },
  ],
  industries: [
    { value: 'technology', label: 'Technology & Software' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'manufacturing', label: 'Manufacturing & Core' },
    { value: 'marketing', label: 'Marketing & Sales' },
  ],
  skillFocusAreas: [
    { value: 'technical-skills', label: 'Technical Skills' },
    { value: 'soft-skills', label: 'Soft Skills' },
    { value: 'aptitude', label: 'Aptitude & Reasoning' },
    { value: 'project-development', label: 'Project Development' },
  ],
  interviewPreparation: [
    { value: 'mock-interviews', label: 'Mock Interviews' },
    { value: 'gd-preparation', label: 'Group Discussion Preparation' },
    { value: 'resume-review', label: 'Resume Optimization' },
    { value: 'coding-practice', label: 'Coding Practice' },
  ],
};

export default function PlacementPreferences() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PreferencesData>({
    placement_goal: '',
    preferred_industry: '',
    skill_focus: '',
    interview_preparation: '',
  });

  const ElegantDropdown = ({ 
    name, 
    value, 
    options, 
    onChange,
    label, 
  }: {
    name: keyof PreferencesData;
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
  }) => (
    <div className="mb-6">
      <label 
        htmlFor={name} 
        className="block mb-3 text-sm font-medium text-gray-300 tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full 
            px-4 
            py-3 
            bg-black/40 
            border 
            border-purple-800/50 
            text-white 
            rounded-lg 
            appearance-none 
            focus:outline-none 
            focus:ring-2 
            focus:ring-purple-600 
            transition-all 
            duration-300
            cursor-pointer
          "
        >
          <option value="" className="bg-black text-gray-400">
            Select an Option
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              className="bg-black text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div 
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
        >
          <svg 
            className="fill-current h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20"
          >
            <path 
              d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
            />
          </svg>
        </div>
      </div>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setError(null);
  };

  const handleNextStep = () => {
    const currentStepKey = Object.keys(formData)[step - 1] as keyof PreferencesData;
    if (formData[currentStepKey]) {
      if (step < 4) {
        setStep(step + 1);
      }
    } else {
      toast.error('Please make a selection', {
        icon: <AlertCircle color="red" />,
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!Object.values(formData).every((value) => value.trim() !== '')) {
      toast.error('Incomplete form', { icon: <AlertCircle color="red" /> });
      return;
    }

    try {
      const response = await fetch('/api/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Server error: ${response.status} - ${errorDetails.error || 'Unknown error'}`);
      }

      toast.success('Preferences saved successfully!');
      window.location.href = '/profile';
    } catch (error) {
      toast.error(`Submission failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <motion.div 
        className="max-w-xl mx-auto bg-black/60 border border-purple-900/30 rounded-2xl shadow-2xl p-8 mt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mt-12 mb-12">
          <motion.h1 
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            College Placement Optimizer
          </motion.h1>
          <p className="text-gray-400 tracking-wider">
            Customize your placement journey for success
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${i <= step ? 'bg-purple-600 text-white' : 'bg-black border border-gray-700 text-gray-500'}`}
            >
              {i}
            </div>
          ))}
        </div>

        {step === 1 && (
          <ElegantDropdown
            name="placement_goal"
            value={formData.placement_goal}
            onChange={handleInputChange}
            options={PREFERENCE_OPTIONS.placementGoals}
            label="Define Your Placement Goal"
          />
        )}

        {step === 2 && (
          <ElegantDropdown
            name="preferred_industry"
            value={formData.preferred_industry}
            onChange={handleInputChange}
            options={PREFERENCE_OPTIONS.industries}
            label="Select Your Preferred Industry"
          />
        )}

        {step === 3 && (
          <ElegantDropdown
            name="skill_focus"
            value={formData.skill_focus}
            onChange={handleInputChange}
            options={PREFERENCE_OPTIONS.skillFocusAreas}
            label="Choose Your Skill Focus"
          />
        )}

        {step === 4 && (
          <ElegantDropdown
            name="interview_preparation"
            value={formData.interview_preparation}
            onChange={handleInputChange}
            options={PREFERENCE_OPTIONS.interviewPreparation}
            label="Plan Your Interview Preparation"
          />
        )}

        <div className="mt-12 flex justify-between">
          <motion.button
            onClick={handlePrevStep}
            disabled={step === 1}
            className={`px-6 py-3 rounded-lg transition-all ${step === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800 text-white'}`}
            whileHover={{ scale: step !== 1 ? 1.05 : 1 }}
            whileTap={{ scale: step !== 1 ? 0.95 : 1 }}
          >
            Previous
          </motion.button>

          <motion.button
            onClick={step < 4 ? handleNextStep : handleSubmit}
            className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-all flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {step < 4 ? 'Next' : 'Complete'}
            {step === 4 && <CheckCircle2 className="ml-2" size={20} />}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

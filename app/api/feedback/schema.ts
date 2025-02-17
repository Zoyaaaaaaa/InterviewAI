import { z } from 'zod';

export const GeneratedFeedbackSchema = z.object({
  technical_score: z.number().min(0).max(1),
  communication_score: z.number().min(0).max(1),
  confidence_score: z.number().min(0).max(1),
  overall_score: z.number().min(0).max(1),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export const SaveFeedbackSchema = GeneratedFeedbackSchema.extend({
  interview_id: z.string().uuid(),
});
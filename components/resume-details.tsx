"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type ResumeDetailsProps = {
  scores: {
    experience_feedback: string;
    education_feedback: string;
    skills_feedback: string;
    projects_feedback: string;
    overall_feedback: string;
    experience_score: number;
    education_score: number;
    skills_score: number;
    projects_score: number;
    overall_score: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  task_improvements: { original: string; improved: string }[];
};

const chartConfig = {
  score: {
    color: "hsl(var(--primary))",
  },
};
export default function ResumeDetails({
  scores,
  strengths,
  weaknesses,
  recommendations,
  task_improvements,
}: ResumeDetailsProps) {
  const chartData = [
    { subject: "Experience", score: scores.experience_score },
    { subject: "Education", score: scores.education_score },
    { subject: "Skills", score: scores.skills_score },
    { subject: "Projects", score: scores.projects_score },
    { subject: "Overall", score: scores.overall_score },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative hidden place-items-center rounded-xl bg-background/60 p-4 md:grid">
          <h3 className="mb-2 text-xl font-bold">Resume Scores</h3>
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-[300px] md:h-full"
          >
            <RadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.6}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </RadarChart>
          </ChartContainer>
          <div className="h-fit w-full rounded-xl bg-muted/90 p-4 text-center">
            <h3 className="mb-2 text-xl font-bold">Score</h3>
            <p className="text-lg font-medium">
              {scores.overall_score.toFixed(2)} / 10
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="h-fit rounded-xl bg-background/60 p-4">
            <h3 className="mb-2 text-xl font-bold">Strengths</h3>
            <ul className="list-disc pl-5">
              {strengths.map((strength: string, index: number) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div className="h-fit rounded-xl bg-background/60 p-4">
            <h3 className="mb-2 text-xl font-bold">Weaknesses</h3>
            <ul className="list-disc pl-5">
              {weaknesses.map((weakness: string, index: number) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-2 h-fit rounded-xl bg-background/60 p-4">
          <h3 className="mb-2 text-xl font-bold">Feedback</h3>
          <ul className="flex list-disc flex-wrap space-y-2 pl-5">
            <li>Experience: {scores.experience_feedback}</li>
            <li>Education: {scores.education_feedback}</li>
            <li>Skills: {scores.skills_feedback}</li>
            <li>Projects: {scores.projects_feedback}</li>
            <li>Overall: {scores.overall_feedback}</li>
          </ul>
        </div>
      </div>

      <div className="h-fit rounded-xl bg-background/60 p-4">
        <h3 className="mb-2 text-xl font-bold">Recommendations</h3>
        <ul className="list-disc pl-5">
          {recommendations.map((recommendation: string, index: number) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="h-fit space-y-4 rounded-xl bg-background/60 p-4">
        <h3 className="mb-2 text-xl font-bold">Task Improvements</h3>
        {task_improvements.map(
          (
            improvement: { original: string; improved: string },
            index: number
          ) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-2 rounded-xl bg-muted p-4 md:grid-cols-2"
            >
              <div className="space-y-2">
                <p className="font-medium">Original</p>
                <p>{improvement.original}</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Improved</p>
                <p className="text-sky-500">{improvement.improved}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

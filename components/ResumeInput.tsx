"use client";

import { useState } from "react";
import { toast } from "sonner";
import ResumeAnalysis from "./ResumeAnalyzer";

export default function SimplifiedResumeAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [mindmapData, setMindmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Only PDF files are allowed");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a PDF file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const extractResponse = await fetch("/api/resume/chat", {
        method: "POST",
        body: formData,
      });

      if (!extractResponse.ok) {
        throw new Error("Failed to extract text from the PDF file.");
      }

      const { text } = await extractResponse.json();

      const createResponse = await fetch("/api/resume/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfText: text,
          topic: "Resume Analysis",
        }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create mindmap.");
      }

      const data = await createResponse.json();
      setMindmapData(data.analysisData);
    } catch (error) {
      setError("An error occurred while processing the resume.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {!mindmapData && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isLoading ? "Processing..." : "Analyze Resume"}
          </button>
        </form>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isLoading && <LoadingMessage />}
      {mindmapData && <ResumeAnalysis data={mindmapData} />}
    </div>
  );
}

function LoadingMessage() {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold">Your mindmap is cooking...</p>
    </div>
  );
}


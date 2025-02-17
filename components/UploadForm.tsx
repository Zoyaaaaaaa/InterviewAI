'use client'
import { useState } from "react";

export default function UploadForm() {
  const [pdfText, setPdfText] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfText, topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const data = await response.json();
      console.log("Analysis Data:", data);
    } catch (err) {
      setError("Error in code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="pdfText">Paste Resume Text:</label>
        <textarea
          id="pdfText"
          value={pdfText}
          onChange={(e) => setPdfText(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="topic">Topic:</label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

'use cient'
import { useEffect, useState } from "react";

export default function AnalysisResult({ analysisId }: { analysisId: string }) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/get-analysis?id=${analysisId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch analysis");
        }
        const data = await response.json();
        setAnalysisData(data);
      } catch (err) {
        setError("Error fetching analysis");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [analysisId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Analysis Results</h2>
      <pre>{JSON.stringify(analysisData, null, 2)}</pre>
    </div>
  );
}

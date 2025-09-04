import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Result() {
  const { id } = useParams(); // resultId from URL
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/exam/result/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
        setMessage("");
        return true; // ✅ signal that result is ready
      } else {
        setResult(null);
        setMessage(data.message || "Result not available yet.");
        return false;
      }
    } catch (err) {
      console.error("Error fetching result:", err);
      setMessage("Something went wrong.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;

    const startPolling = async () => {
      const ready = await fetchResult();
      if (!ready) {
        // keep checking every 30s until ready
        interval = setInterval(async () => {
          const gotResult = await fetchResult();
          if (gotResult) {
            clearInterval(interval); // ✅ stop polling once result is ready
          }
        }, 30000);
      }
    };

    startPolling();

    return () => clearInterval(interval); // cleanup on unmount
  }, [id]);

  if (loading) return <p>Loading result...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Exam Result</h2>
      {result ? (
        <div>
          <p>
            <strong>Topic:</strong> {result.topic}
          </p>
          <p>
            <strong>Difficulty:</strong> {result.difficulty}
          </p>
          <p>
            <strong>Score:</strong> {result.score} / 100
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {new Date(result.submittedAt).toLocaleString()}
          </p>
          <button onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

export default Result;

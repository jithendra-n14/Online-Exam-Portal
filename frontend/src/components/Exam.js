import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Exam() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(2 * 60); // ⏱ set to 20 * 60 for 20 mins
  const [submitted, setSubmitted] = useState(false); // 🚫 prevent double submit

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/exam/start?topic=${topic}&difficulty=${difficulty}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [topic, difficulty]);

  // ⏳ Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // auto-submit when time runs out
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    if (submitted) return; // 🚫 prevent multiple submits
    setSubmitted(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          difficulty,
          answers: Object.entries(answers).map(([questionId, selected]) => ({
            questionId,
            selected,
          })),
        }),
      });
      const data = await res.json();
      if (data.resultId) {
        navigate(`/result/${data.resultId}`); // ✅ go straight to results page
      }
    } catch (err) {
      console.error("Error submitting exam:", err);
    }
  };

  if (loading) return <p>Loading questions...</p>;

  // ⏱ format timer into MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div>
      <h2>
        {topic} - {difficulty} Exam
      </h2>
      <h3>Time Left: {formatTime(timeLeft)}</h3>

      {questions.map((q, idx) => (
        <div key={q._id} style={{ marginBottom: "20px" }}>
          <p>
            <strong>
              {idx + 1}. {q.question}
            </strong>
          </p>
          {q.options.map((opt, i) => (
            <label key={i} style={{ display: "block" }}>
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={answers[q._id] === opt}
                onChange={() => handleOptionChange(q._id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={handleSubmit} disabled={submitted}>
        {submitted ? "Submitting..." : "Submit Exam"}
      </button>
    </div>
  );
}

export default Exam;

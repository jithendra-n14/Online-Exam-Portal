// src/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const topics = ["Math", "Science", "History"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleStartExam = (topic, difficulty) => {
    navigate("/exam", { state: { topic, difficulty } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Select a topic and difficulty to start your exam.</p>

      {topics.map((topic) => (
        <div key={topic} style={{ marginBottom: "20px" }}>
          <h3>{topic}</h3>
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              style={{ marginRight: "10px" }}
              onClick={() => handleStartExam(topic, difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

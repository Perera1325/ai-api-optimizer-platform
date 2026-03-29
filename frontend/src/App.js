import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking...");
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  const [analytics, setAnalytics] = useState({
    total_requests: 0,
    avg_latency: 0,
    status: "UNKNOWN",
  });

  useEffect(() => {
    // Check backend health
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setStatus("Healthy");
      })
      .catch(() => {
        setStatus("Down");
        setError("Cannot connect to backend service");
      });

    // Fetch analytics
    fetch("http://localhost:8080/analytics")
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
      })
      .catch(() => {
        console.log("Analytics fetch failed");
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI API Optimizer Dashboard</h1>

      <h2>
        Status:{" "}
        <span style={{ color: status === "Healthy" ? "green" : "red" }}>
          {status}
        </span>
      </h2>

      <p>{message}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <h2>📊 Analytics</h2>

      <p>
        <strong>Total Requests:</strong> {analytics.total_requests}
      </p>

      <p>
        <strong>Average Latency:</strong>{" "}
        {analytics.avg_latency.toFixed(4)} sec
      </p>

      <p>
        <strong>System Status:</strong>{" "}
        <span
          style={{
            color:
              analytics.status === "HEALTHY"
                ? "green"
                : analytics.status === "OVERLOADED"
                ? "orange"
                : "red",
          }}
        >
          {analytics.status}
        </span>
      </p>
    </div>
  );
}

export default App;
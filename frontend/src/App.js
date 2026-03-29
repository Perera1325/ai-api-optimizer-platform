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

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      // Health check
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

      // Analytics
      fetch("http://localhost:8080/analytics")
        .then((res) => res.json())
        .then((data) => {
          setAnalytics(data);
        })
        .catch(() => {
          console.log("Analytics fetch failed");
        });

      // Logs
      fetch("http://localhost:8080/logs")
        .then((res) => res.json())
        .then((data) => {
          setLogs(data);
        })
        .catch(() => {
          console.log("Logs fetch failed");
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI API Optimizer Dashboard</h1>

      {/* STATUS */}
      <h2>
        Status:{" "}
        <span style={{ color: status === "Healthy" ? "green" : "red" }}>
          {status}
        </span>
      </h2>

      <p>{message}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {/* ANALYTICS */}
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

      <hr />

      {/* LOGS */}
      <h2>📜 Request Logs</h2>

      <div
        style={{
          background: "#111",
          color: "#0f0",
          padding: "10px",
          height: "200px",
          overflowY: "scroll",
          fontFamily: "monospace",
        }}
      >
        {logs.length === 0 && <p>No requests yet...</p>}

        {logs.map((log, index) => (
          <div key={index}>
            [{log.time}] {log.method} {log.path}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
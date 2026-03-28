import { useEffect, useState } from "react";

function App() {
const [message, setMessage] = useState("Loading...");
const [status, setStatus] = useState("Checking...");
const [error, setError] = useState("");

useEffect(() => {
fetch("http://localhost:8081")
.then((res) => {
if (!res.ok) {
throw new Error("Server not responding");
}
return res.json();
})
.then((data) => {
setMessage(data.message);
setStatus("Healthy");
})
.catch((err) => {
console.error(err);
setStatus("Down");
setError("Cannot connect to backend service");
});
}, []);

return ( <div style={styles.container}> <h1 style={styles.title}>AI API Optimizer Dashboard</h1>

```
  <div style={styles.card}>
    <h2>System Status</h2>
    <p style={{ color: status === "Healthy" ? "green" : "red" }}>
      {status}
    </p>
  </div>

  <div style={styles.card}>
    <h2>User Service</h2>
    <p>{message}</p>
  </div>

  {error && (
    <div style={styles.error}>
      <p>{error}</p>
    </div>
  )}
</div>
```

);
}

const styles = {
container: {
fontFamily: "Arial, sans-serif",
textAlign: "center",
padding: "40px",
backgroundColor: "#0f172a",
minHeight: "100vh",
color: "white",
},
title: {
marginBottom: "30px",
},
card: {
backgroundColor: "#1e293b",
padding: "20px",
margin: "15px auto",
width: "300px",
borderRadius: "10px",
boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
},
error: {
marginTop: "20px",
color: "red",
},
};

export default App;

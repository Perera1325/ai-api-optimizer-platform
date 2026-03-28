import { useEffect, useState } from "react";

function App() {
const [message, setMessage] = useState("Loading...");
const [status, setStatus] = useState("Checking...");
const [error, setError] = useState("");

useEffect(() => {
fetch("/api")
.then((res) => res.json())
.then((data) => {
setMessage(data.message);
setStatus("Healthy");
})
.catch(() => {
setStatus("Down");
setError("Cannot connect to backend service");
});
}, []);

return ( <div> <h1>AI API Optimizer Dashboard</h1> <h2>Status: {status}</h2> <p>{message}</p>
{error && <p>{error}</p>} </div>
);
}

export default App;

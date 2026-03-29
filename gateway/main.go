package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

// In-memory analytics
var totalRequests int
var totalLatency float64

// Request logs
var requestLogs []map[string]string

// Middleware for logging + analytics
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Log request
		logEntry := map[string]string{
			"time":   time.Now().Format("15:04:05"),
			"method": r.Method,
			"path":   r.URL.Path,
		}
		requestLogs = append(requestLogs, logEntry)

		// Serve request
		next.ServeHTTP(w, r)

		// Calculate latency
		duration := time.Since(start).Seconds()
		totalRequests++
		totalLatency += duration

		log.Printf("Completed in %v", duration)
	})
}

func main() {
	// Target backend (user-service)
	target, err := url.Parse("http://localhost:8081")
	if err != nil {
		log.Fatal(err)
	}

	// Reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(target)

	// API route
	http.Handle("/api/", loggingMiddleware(http.StripPrefix("/api", proxy)))

	// Analytics endpoint
	http.HandleFunc("/analytics", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		avgLatency := 0.0
		if totalRequests > 0 {
			avgLatency = totalLatency / float64(totalRequests)
		}

		status := "HEALTHY"
		if avgLatency > 1 {
			status = "OVERLOADED"
		}

		json.NewEncoder(w).Encode(map[string]interface{}{
			"total_requests": totalRequests,
			"avg_latency":    avgLatency,
			"status":         status,
		})
	})

	// Logs endpoint
	http.HandleFunc("/logs", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(requestLogs)
	})

	log.Println("🚀 API Gateway running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
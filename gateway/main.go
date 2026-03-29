package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

// 🔥 Analytics variables
var totalRequests int
var totalDuration float64

// 🔥 Middleware (tracks requests + latency)
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		start := time.Now()

		next.ServeHTTP(w, r)

		duration := time.Since(start).Seconds()

		totalRequests++
		totalDuration += duration

		log.Printf("Request: %s %s | Duration: %.4f sec",
			r.Method, r.URL.Path, duration)
	})
}

func main() {

	// 🔥 Target service (user-service)
	target, err := url.Parse("http://localhost:8081")
	if err != nil {
		log.Fatal(err)
	}

	// 🔥 Reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(target)

	// 🔥 API route → forwards to user-service
	http.Handle("/api/", loggingMiddleware(
		http.StripPrefix("/api", proxy),
	))

	// 🔥 Analytics endpoint
	http.HandleFunc("/analytics", func(w http.ResponseWriter, r *http.Request) {

		avg := 0.0
		if totalRequests > 0 {
			avg = totalDuration / float64(totalRequests)
		}

		response := map[string]interface{}{
			"total_requests": totalRequests,
			"avg_latency":    avg,
			"status":         "HEALTHY",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
	})

	// 🔥 Root test endpoint
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("API Gateway Running"))
	})

	log.Println("🚀 API Gateway running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
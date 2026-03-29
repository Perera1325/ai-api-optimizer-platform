package main

import (
"log"
"net/http"
"net/http/httputil"
"net/url"
"time"


"github.com/prometheus/client_golang/prometheus"
"github.com/prometheus/client_golang/prometheus/promhttp"


)

// Metrics
var requestCount = prometheus.NewCounter(
prometheus.CounterOpts{
Name: "api_requests_total",
Help: "Total number of API requests",
},
)

var requestLatency = prometheus.NewHistogram(
prometheus.HistogramOpts{
Name:    "api_request_duration_seconds",
Help:    "API request latency",
Buckets: prometheus.DefBuckets,
},
)

var requestErrors = prometheus.NewCounter(
prometheus.CounterOpts{
Name: "api_errors_total",
Help: "Total number of failed API requests",
},
)

func main() {
target, _ := url.Parse("http://localhost:8081")
proxy := httputil.NewSingleHostReverseProxy(target)


// Register metrics
prometheus.MustRegister(requestCount)
prometheus.MustRegister(requestLatency)
prometheus.MustRegister(requestErrors)

http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	requestCount.Inc()

	// Forward request
	r.URL.Path = "/"
	r.Host = target.Host

	proxy.ServeHTTP(w, r)

	// Measure latency
	duration := time.Since(start).Seconds()
	requestLatency.Observe(duration)
})

// Metrics endpoint
http.Handle("/metrics", promhttp.Handler())

log.Println("Gateway running on port 8080")
log.Fatal(http.ListenAndServe(":8080", nil))


}

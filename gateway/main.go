package main

import (
"log"
"net/http"
"net/http/httputil"
"net/url"
)

func main() {
target, _ := url.Parse("http://localhost:8081")
proxy := httputil.NewSingleHostReverseProxy(target)


http.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {
	// Rewrite path correctly
	r.URL.Path = "/"
	proxy.ServeHTTP(w, r)
})

log.Println("Gateway running on port 8080")
log.Fatal(http.ListenAndServe(":8080", nil))


}

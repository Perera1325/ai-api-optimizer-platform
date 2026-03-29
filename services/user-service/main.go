package main

import (
"encoding/json"
"log"
"net/http"
)

type Response struct {
Message string `json:"message"`
}

func handler(w http.ResponseWriter, r *http.Request) {
w.Header().Set("Content-Type", "application/json")


response := Response{
	Message: "User Service Running",
}

json.NewEncoder(w).Encode(response)


}

func main() {
http.HandleFunc("/", handler)


log.Println("User Service running on port 8081")
log.Fatal(http.ListenAndServe(":8081", nil))


}

package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{}

func makeWebSocket(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	playerSocket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	defer playerSocket.Close()

	offer := []byte("base64encodedoffer")

	err = playerSocket.WriteMessage(websocket.TextMessage, offer)

	if err != nil {
		log.Print("ERROR", err)
		return
	}

	_, answer, err := playerSocket.ReadMessage()

	fmt.Printf("received answer! %s\n", answer)

	if err != nil {
		log.Print("error when trying to grab answer from client", err)
		return
	}

	// need to create a webrtc data channel here.

	err = playerSocket.WriteMessage(websocket.TextMessage, []byte("DC MADE"))

}

func main() {
	http.HandleFunc("/websocket", makeWebSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

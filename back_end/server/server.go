package main

import (
	"container/heap"
	"example.com/sessionserializer"
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
	"log"
	"net/http"
	// "time"
)

var dcChan chan *webrtc.DataChannel = make(chan *webrtc.DataChannel)

var upgrader = websocket.Upgrader{}

const PLAYERS_PER_MATCH int = 5 // change this if we ever want to lower or increase player count

func matchMaker() {
	fmt.Println("match maker started")
	dc := <-dcChan
	fmt.Println("received channel")
	match := InitializeMatchWithPlayer(&Player{dc})
	for {
		// dc := <-dcChan
		dc := <-dcChan
		match.AddPlayer(&Player{dc})
	}
}

func makeWebSocket(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	playerSocket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	defer playerSocket.Close()

	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	// now that our web socket connection is successful, we
	// start prepping our peer connection and offer.

	peerConnection, err := webrtc.NewPeerConnection(config)
	if err != nil {
		log.Println("Could not establish peer connection: ", err)
		return
	}

	dcConfig := webrtc.DataChannelInit{}
	ordered := false
	transmits := uint16(0)
	dcConfig.Ordered = &ordered
	dcConfig.MaxRetransmits = &transmits

	dataChannel, err := peerConnection.CreateDataChannel("player-connection", &dcConfig)
	if err != nil {
		log.Println("Could not successfuly create a data channel: ", err)
		return
	}

	offer, err := peerConnection.CreateOffer(nil)
	if err != nil {
		log.Println(err)
		return
	}

	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	err = peerConnection.SetLocalDescription(offer)
	if err != nil {
		log.Println(err)
		return
	}

	<-gatherComplete
	encodedOfferInBytes := []byte(sessionSerializer.Encode(*peerConnection.LocalDescription()))
	fmt.Println("about to send: ", encodedOfferInBytes)

	err = playerSocket.WriteMessage(websocket.TextMessage, encodedOfferInBytes)
	if err != nil {
		log.Print("ERROR", err)
		return
	}

	_, encodedAnswer, err := playerSocket.ReadMessage()
	if err != nil {
		log.Print("error when trying to grab answer from client", err)
		return
	}

	fmt.Printf("received answer! %s\n", encodedAnswer)
	decodedAnswer := webrtc.SessionDescription{}
	sessionSerializer.Decode(string(encodedAnswer), &decodedAnswer)
	err = peerConnection.SetRemoteDescription(decodedAnswer)
	if err != nil {
		log.Println("error when trying to create data channel", err)
		return
	}

	err = playerSocket.WriteMessage(websocket.TextMessage, []byte("DC MADE"))

	dataChannel.OnOpen(func() {
		fmt.Printf("Data channel '%s'-'%d' open.\n", dataChannel.Label(), dataChannel.ID())
		dataChannel.Send([]byte("Please wait, finding a match..."))
	})

	dcChan <- dataChannel

}

func main() {
	go matchMaker()
	http.HandleFunc("/websocket", makeWebSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

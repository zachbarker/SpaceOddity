package main

import (
	// "container/heap"
	"fmt"
	"log"
	"net/http"

	sessionSerializer "example.com/sessionserializer"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc/v3"
	// "time"
)

type PlayerSetup struct {
	DC           *webrtc.DataChannel
	PlayerSocket *websocket.Conn
}

var dcChan chan *PlayerSetup = make(chan *PlayerSetup)

var upgrader = websocket.Upgrader{}

const PLAYERS_PER_MATCH int = 5 // change this if we ever want to lower or increase player count

func matchMaker() {
	fmt.Println("match maker started")
	playInfo := <-dcChan
	fmt.Println("received channel")
	match := InitializeMatchWithPlayer(&Player{0, Circle{Vector{400.0, 300.0}, 2.0}, true, make([]Projectile, 0), playInfo.DC}, playInfo.PlayerSocket)
	for {
		// dc := <-dcChan
		playInfo := <-dcChan
		match.AddPlayer(&Player{0, Circle{Vector{400.0, 300.0}, 2.0}, true, make([]Projectile, 0), playInfo.DC}, playInfo.PlayerSocket)
	}
}

func makeWebSocket(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	playerSocket, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		playerSocket.Close()
		return
	}

	// defer playerSocket.Close()

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
		playerSocket.Close()
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
		playerSocket.Close()
		return
	}

	offer, err := peerConnection.CreateOffer(nil)
	if err != nil {
		log.Println(err)
		playerSocket.Close()
		return
	}

	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	err = peerConnection.SetLocalDescription(offer)
	if err != nil {
		log.Println(err)
		playerSocket.Close()
		return
	}

	<-gatherComplete
	encodedOfferInBytes := []byte(sessionSerializer.Encode(*peerConnection.LocalDescription()))
	fmt.Println("about to send: ", encodedOfferInBytes)

	err = playerSocket.WriteMessage(websocket.TextMessage, encodedOfferInBytes)
	if err != nil {
		log.Print("ERROR", err)
		playerSocket.Close()
		return
	}

	_, encodedAnswer, err := playerSocket.ReadMessage()
	if err != nil {
		log.Print("error when trying to grab answer from client", err)
		playerSocket.Close()
		return
	}

	fmt.Printf("received answer! %s\n", encodedAnswer)
	decodedAnswer := webrtc.SessionDescription{}
	sessionSerializer.Decode(string(encodedAnswer), &decodedAnswer)
	err = peerConnection.SetRemoteDescription(decodedAnswer)
	if err != nil {
		log.Println("error when trying to create data channel", err)
		playerSocket.Close()
		return
	}

	// err = playerSocket.WriteMessage(websocket.TextMessage, []byte("DC HANDSHAKE ESTABLISHED"))

	// if err != nil {
	// 	log.Println("error when trying to write to playersocket that the DC handshake has been established.")
	// 	playerSocket.Close()
	// 	return
	// }

	// dataChannel.OnOpen(func() {
	// 	fmt.Printf("Data channel '%s'-'%d' open.\n", dataChannel.Label(), dataChannel.ID())
	// 	dataChannel.SendText("Please wait, finding a match..."))
	// })

	dcChan <- &PlayerSetup{dataChannel, playerSocket}

}

func main() {
	go matchMaker()
	http.HandleFunc("/websocket", makeWebSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

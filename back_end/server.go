package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"github.com/pion/webrtc"
	"log"
	"net/http"
	"sessionserializer"
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

	dataChannel.OnOpen(func() {
		fmt.Printf("Data channel '%s'-'%d' open.\n", dataChannel.Label(), dataChannel.ID())

		for range time.NewTicker(5 * time.Second).C {
			message := "message"
			fmt.Printf("Sending '%s'\n", message)

			// Send the message as text
			sendErr := dataChannel.SendText(message)
			if sendErr != nil {
				log.Println(sendErr)
				return
			}
		}
	})

	offer, err := peerConnection.CreateOffer(nil)
	if err != nil {
		log.Println(err)
		return
	}

	gatherComplete := peerConnection.GatheringCompletePromise(peerConnection)

	err = peerConnection.SetLocalDescription(offer)
	if err != nil {
		log.Println(err)
		return
	}

	<-gatherComplete

	encodedOffer := Encode(*peerConnection.LocalDescription())
	err = playerSocket.WriteMessage(websocket.TextMessage, encodedOffer)
	if err != nil {
		log.Print("ERROR", err)
		return
	}

	_, encodedAnswer, err := playerSocket.ReadMessage()
	if err != nil {
		log.Print("error when trying to grab answer from client", err)
		return
	}

	fmt.Printf("received answer! %s\n", answer)
	decodedAnswer := Decode(answer)

	err = peerConnection.SetRemoteDescription(decodedAnswer)
	if err != nil {
		log.Printf("error when trying to create data channel")
		return
	}
	// need to create a webrtc data channel here.

	err = playerSocket.WriteMessage(websocket.TextMessage, []byte("DC MADE"))

	// TODO: send datachannel to a Go Channel
}

func main() {
	http.HandleFunc("/websocket", makeWebSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

package main

import (
	"bufio"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/pion/webrtc"
	"io"
	"os"
	"strings"
	"time"
)

func Encode(obj interface{}) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}

	return base64.StdEncoding.EncodeToString(b)
}

// MustReadStdin blocks until input is received from stdin
func MustReadStdin() string {
	r := bufio.NewReader(os.Stdin)

	var in string
	for {
		var err error
		in, err = r.ReadString('\n')
		if err != io.EOF {
			if err != nil {
				panic(err)
			}
		}
		in = strings.TrimSpace(in)
		if len(in) > 0 {
			break
		}
	}

	fmt.Println("")

	return in
}

// Decode decodes the input from base64
// It can optionally unzip the input after decoding
func Decode(in string, obj interface{}) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(b, obj)
	if err != nil {
		panic(err)
	}
}

func main() {
	// config for a webrtc connection
	// https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
	config := webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	}

	// creating a peer connection
	peerConnection, err := webrtc.NewPeerConnection(config)
	if err != nil {
		panic(err)
	}

	dcConfig := webrtc.DataChannelInit{}
	ordered := false
	transmits := uint16(0)
	dcConfig.Ordered = &ordered
	dcConfig.MaxRetransmits = &transmits

	dataChannel, err := peerConnection.CreateDataChannel("game-server", &dcConfig)
	if err != nil {
		panic(err)
	}

	peerConnection.OnICEConnectionStateChange(
		func(connectionState webrtc.ICEConnectionState) {
			fmt.Printf("NEW CONNECTION STATE: %s\n", connectionState.String())
		})

	// Register channel opening handling
	dataChannel.OnOpen(func() {
		fmt.Printf("Data channel '%s'-'%d' open. Random messages will now be sent to any connected DataChannels every 5 seconds\n", dataChannel.Label(), dataChannel.ID())

		for range time.NewTicker(5 * time.Second).C {
			message := "message"
			fmt.Printf("Sending '%s'\n", message)

			// Send the message as text
			sendErr := dataChannel.SendText(message)
			if sendErr != nil {
				panic(sendErr)
			}
		}
	})

	// handle messages sent to us from client
	dataChannel.OnMessage(func(msg webrtc.DataChannelMessage) {
		fmt.Printf("received message: ", string(msg.Data))
	})

	// create an offer
	offer, err := peerConnection.CreateOffer(nil)
	if err != nil {
		panic(err)
	}

	gatherComplete := webrtc.GatheringCompletePromise(peerConnection)

	// sets local desc. and starts udp listeners
	err = peerConnection.SetLocalDescription(offer)
	if err != nil {
		panic(err)
	}

	<-gatherComplete

	// base64 answer for browser to connect with
	fmt.Println(Encode(*peerConnection.LocalDescription()))

	answer := webrtc.SessionDescription{}
	Decode(MustReadStdin(), &answer)

	// remote description answer
	err = peerConnection.SetRemoteDescription(answer)
	if err != nil {
		panic(err)
	}

	select {}

}

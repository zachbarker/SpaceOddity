package main

import (
	"encoding/json"
	"fmt"
)

type ClientPayload struct {
	SnapshotNum int
	PlayerIndex int
	Cmd         Cmd
}

type Cmd struct {
	Type      int //0 for move, 1 for shooting
	XVelocity int
	YVelocity int
	X         float64
	Y         float64
}

/**
 * this function is responsible for decoding a received packet
 * right now it is JSON, hopefully protobuf l8r.
**/
func decodePacket(packet []byte) (*ClientPayload, error) {
	decodedPacket := &ClientPayload{}
	err := json.Unmarshal(packet, decodedPacket)
	return decodedPacket, err
}

/**
 * parses the decoded payload and sends it to the relevant channel
 *
**/
func DelegatePackets(sim *Simulator, packetChan chan []byte) {
	for {
		packet := <-packetChan
		payload, err := decodePacket(packet)

		if err != nil {
			fmt.Println("received packet that we couldn't marshalize.")
			continue
		}

		if payload.Cmd.Type == 0 { // player is going to move
			sim.MoveChan <- payload
			continue
		}

		sim.ProjSpawnChan <- payload
	}
}

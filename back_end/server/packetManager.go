package main

import (
	"encoding/json"
)

type ClientPayload struct {
	Snapshot_num int,
	PlayerIndex int,
	Cmd Cmd
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
func decodePacket(packet []byte) *ClientPayload, err {
	decodedPacket := &ClientPayload{}
	err := json.Unmarshal(packet, decodedPacket)
	return decodedPacket, err
}


/**
  * parses the decoded payload and sends it to the relevant channel 
 **/
 
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
		fmt.Println("packet received: ", payload)

		if err != nil {
			fmt.Println("received packet that we couldn't marshalize.")
			continue
		}

		if payload.Cmd.Type == 0 { // player is going to move
			movesSlice := <-sim.MoveChan
			movesSlice = append(movesSlice, payload)
			sim.MoveChan <- movesSlice
			continue
		}

		spawnProjsSlice := <-sim.ProjSpawnChan
		spawnProjsSlice = append(spawnProjsSlice, payload)
		sim.ProjSpawnChan <- spawnProjsSlice
	}
}

func (m *Match) SendGameStateToPlayers() {
	// for {
	ms := <-masterGS
	// state := &ms
	// fmt.Println("data before marshalizing: ", ms)
	data, err := json.Marshal(ms)
	// fmt.Println("hello from data", string(data))

	if err != nil {
		fmt.Println(err)
		return
	}
	m.playerMu.Lock()
	for _, player := range m.Lobby {
		if player != nil {
			player.DC.SendText(string(data))
			// player.DC.SendText("from gamestate check")
			// player.DC.SendText()
		}
	}
	m.playerMu.Unlock()
	masterGS <- ms
	// }
}

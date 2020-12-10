package main

import (
	"fmt"
	"github.com/pion/webrtc/v3"
	"sync"
	"time"
)

// This struct (and its associated functions) house the functionality of running a game server.
// Thread safe.
type Match struct {
	GameTicksElapsed int
	playerMu         sync.Mutex // investigate using a channel for mutexes instead, fukkker on reddit says
	stateMu          sync.Mutex // for small N (go routine no.) mutex is better so i picked mutex 4 now
	Lobby            [PLAYERS_PER_MATCH]*Player
	Priority         int         // updates anytime a player leaves or joins a match
	state            interface{} // temp state variable, ignore for now.
	stateChan        chan []byte
}

// tick rate in milliseconds, TICK_RATE/1000ms = tick rate in hertz e.g. 45/1000 = ~22hz tick rate
// hz is conventional unit of measurement. for e.g. valve public servers have a tickrate of 64,
// which is roughly ~15ms. we will try 45. arbitrary middle ground.
const TICK_RATE = 45

// This function will initialize a new match with a given player (including running its
// gameloop) before returning a reference to the match.
func InitializeMatchWithPlayer(player *Player) *Match {
	var playerList [PLAYERS_PER_MATCH]*Player
	match := &Match{0, sync.Mutex{}, sync.Mutex{}, playerList, 1, make([][]int, 1), make(chan []byte)}
	match.AddPlayer(player)
	go match.Gameloop()
	return match
}

// This is the private function to call when the server loop needs to update the state of the game.
func (m *Match) sendStateToPlayers() {
	m.playerMu.Lock()
	for _, player := range m.Lobby {
		if player != nil { // TODO: find better way to hold collection of players. maybe write dynamic array? REEE use slice?
			sendMsg := fmt.Sprintf("tick no: %d - dummy packet", m.GameTicksElapsed)
			player.DC.SendText(sendMsg) // error thrown is closed DC, OnClose handles this
		}
	}
	m.playerMu.Unlock()
}

// This is a function that accepts messages via a Go Channel and
// handles all relevant updates to server state. Called as a Go
// routine inside of the GameLoop function
func (m *Match) stateHandler() {
	for {
		packet := <-m.stateChan
		fmt.Printf("Message from Player: '%s'\n", string(packet))
		// handle packet and how it updates game state here
		// collision detection here.
	}
}

// This is what sends out game state at a consistent tick rate until
// there are no more players left.
func (m *Match) Gameloop() {
	go m.stateHandler()
	ticker := time.NewTicker(TICK_RATE * time.Millisecond)
	defer ticker.Stop() // IMPORTANT, otherwise ticker will memory leak
	for range ticker.C {
		m.GameTicksElapsed++ // dont need mutex for this, should only change by this function
		// fmt.Println("sending new state to players...")
		m.sendStateToPlayers() // send our state every tickrate
		// fmt.Println("sent.")

		// to maintain efficiency, need to keep below lines run time to < TICK_RATE
		// this is so every tick rate results in new sending of state to players.

		// end game if empty.
		if m.Priority < 1 {
			// remove self from heap
			fmt.Println("terminating match")
			// perform necessary clean up
			return
		}

	}

}

// This is the function that adds a player struct to the match.
// To be used by match-making code.
func (m *Match) AddPlayer(player *Player) {
	m.playerMu.Lock()
	index := m.Priority - 1
	m.Lobby[index] = player
	m.Priority++

	player.DC.OnClose(func() { // closure means this works as intended, right? need to double check
		m.playerMu.Lock()
		m.Lobby[index] = nil
		i := index
		for i < m.Priority-1 {
			m.Lobby[i] = m.Lobby[i+1]
			i++
		}
		m.Priority--
		m.playerMu.Unlock()
	})

	m.playerMu.Unlock()

	player.DC.OnMessage(func(msg webrtc.DataChannelMessage) {
		m.stateChan <- msg.Data
	})
}

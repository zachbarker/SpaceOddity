package main

// import "math"
import (
	"fmt"
	"time"
)

// width and height of front-end canvas in pixels
const WIDTH = 800
const HEIGHT = 600

// player speed in pixels/second, corresponds directly to
// phaser3's front end speed, which is also in pixels/second.
const PLAY_SPD_PER_SEC = 250
const PLAY_SPD_PER_TICK = PLAY_SPD_PER_SEC / (1000 / TICK_RATE) // player speed in pixels/ticks

// asteroid speed in pixels/second, also corresponds 2 phaser3 engine vel
const AST_SPD_PER_SEC = 50
const AST_SPD_PER_TICK = AST_SPD_PER_SEC / (1000 / TICK_RATE) // asteroid speed in pixels/ticks

// bullet speed in pixels/second as above
const BLT_SPD_PER_SEC = 400
const BLT_SPD_PER_TICK = BLT_SPD_PER_SEC / (1000 / TICK_RATE) // bullet speed in pixels/ticks

const REQUEST_TICK_RATE = 15

// the struct holding the channels responsible for each type of cmd
type Simulator struct {
	MoveChan      chan []*ClientPayload
	ProjSpawnChan chan []*ClientPayload
}

// the function responsible for updating the movement on the
// game state of the specific player
func (s *Simulator) movementUpdater() {
	ticker := time.NewTicker(REQUEST_TICK_RATE * time.Millisecond)
	defer ticker.Stop() // IMPORTANT, otherwise ticker will memory leak
	for range ticker.C {
		moveSlice := <-s.MoveChan
		ms := <-masterGS
		fmt.Printf("%+v\n", ms)
		fmt.Println("Movement occured and Players state and location updated")
		fmt.Println(moveSlice)
		ms.StateMatch.playerMu.Lock()
		for _, move := range moveSlice {
			fmt.Println(move)
			playerIndex := move.PlayerIndex
			if ms.StateMatch.Lobby[playerIndex] != nil { // some positions in the lobby can be empty
				fmt.Println("player: ", ms.StateMatch.Lobby[playerIndex])
				location := &ms.StateMatch.Lobby[playerIndex].Position.Center

				new_x := location.X + float64(move.Cmd.XVelocity*PLAY_SPD_PER_TICK)
				new_y := location.Y + float64(move.Cmd.YVelocity*PLAY_SPD_PER_TICK)
				if new_x >= WIDTH {
					new_x = WIDTH - 35.0
				}

				if new_x <= 0.0 {
					new_x = 35.0
				}

				if new_y >= HEIGHT {
					new_y = HEIGHT - 35.0
				}

				if new_y <= 0.0 {
					new_y = 35
				}

				location.X = new_x
				location.Y = new_y
				fmt.Printf("%+v\n", &ms.StateMatch.Lobby[playerIndex].Position.Center)
			}
		}
		ms.StateMatch.playerMu.Unlock()
		masterGS <- ms
		s.MoveChan <- make([]*ClientPayload, 0)
	}
	// *ms.Players[playerIndex].Position.Center.y = move.Cmd.Y
	// grab game state and handle accordingly
}

// // the function responsible for spawning a new projectile
// // for the updated game state
func (s *Simulator) shootingUpdater() {
	shoot := <-s.ProjSpawnChan
	fmt.Println("we figured out this was to shoot")
	fmt.Println(shoot)
	// grab game state, compare with the game state
	// and "compensate" for lag by moving its Position up
	// and seeing if it would've hit anyone on the way there, too
}

func InitializeSimulator() *Simulator {
	sim := &Simulator{make(chan []*ClientPayload), make(chan []*ClientPayload)}
	go sim.movementUpdater()
	go sim.shootingUpdater()
	sim.MoveChan <- make([]*ClientPayload, 0)
	sim.ProjSpawnChan <- make([]*ClientPayload, 0)
	return sim
}

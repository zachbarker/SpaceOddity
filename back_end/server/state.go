package main

// commented out entities projectile

import (
	"fmt"
	"time"
	// "reflect"
)

type State struct {
	ProjChan  chan Projectile // this needs to be a ptr?
	StateChan chan []Projectile
	// Match    *Match

}

type Projectile struct {
	X         int
	Y         int
	XVelocity float64
	YVelocity float64
	Id        int
}

func (s *State) initState() {
	s.ProjChan = make(chan Projectile, 50)
	s.StateChan = make(chan []Projectile)

}

func MakeProjectile(x int, y int, xVel float64, yVel float64, id int) Projectile {
	p := Projectile{x, y, xVel, yVel, id}
	// fmt.Println(p)
	return p
}

// This function grabs all projectiles in the channel and handles
// updating of state. Should be called as a Go Routine.
func (s *State) Updater() {
	fmt.Println("in updater")
	for projectile := range s.ProjChan {
		projSlice := <-s.StateChan
		projectile.X += int(projectile.XVelocity) // pro gamer move
		projectile.Y += int(projectile.YVelocity)

		// check collision here IFF no collision, send back to channel
		projSlice = append(projSlice, projectile)
		s.StateChan <- projSlice

	}
}

func (s *State) StateDisplayer() {
	ticker := time.NewTicker(45 * time.Millisecond)
	defer ticker.Stop() // IMPORTANT, otherwise ticker will memory leak
	for range ticker.C {
		projSlice := <-s.StateChan

		for _, proj := range projSlice {
			fmt.Println("in state chan", proj)
			s.ProjChan <- proj
		}
		s.StateChan <- make([]Projectile, 0)
	}

}

func main() {
	id := 0
	p := MakeProjectile(2, 6, 15.2, 17.6, id)
	id++
	s := &State{}
	s.initState()
	go s.Updater()
	go s.StateDisplayer()

	p2 := MakeProjectile(4, 7, 20.2, 34.6, id)
	id++
	p3 := MakeProjectile(10, 17, 40.2, 24.6, id)
	id++
	s.ProjChan <- p
	s.ProjChan <- p2
	s.ProjChan <- p3
	s.StateChan <- make([]Projectile, 0)
	select {}
	// fmt.Println(reflect.TypeOf(s))
	// ch <- p
	// s.Updater()
	// fmt.Println(s)
	// Updater()
}

// write a function that reads from projchan, as soon as it receives a projectile,
// take projectile velocity, update projectile entity object bound (x,y coords)
// send projectile back to projchan, we will do this if and only if there's no collision  add it to a slice
// process new state change in projchan

// at top of state file projnum := 0
// new func makeProj starting with x, y and send to chan

/**
write a function, loop in range of projchan, as soon as it receives a projectile
- take the projectile's velocity, update the projectile's x and y coords
- and then send that projectile back to the projchan (we will do this IFF there is no collision at updated coords but for now assume no collisions)
projNum := 0
MakeProjectile(x int, y int, xVel float, yVel float) {
      make new projectile struct object, make sure to add ++projNum to struct's id
      then send to projchan
}
*/

// new func makeProj starting with x, y and send to chan

// have 6 projectiles and have it print out state updating forever

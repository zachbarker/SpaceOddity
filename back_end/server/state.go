package main

/* This struct holds the state of every player. */
type StateSnapshot struct {
	TickID int
	// Players *[PLAYERS_PER_MATCH]*Player
	StateMatch *Match
	Projs      []*Projectile
	Astrds     []*Asteroid
}

var masterGS chan *StateSnapshot = make(chan *StateSnapshot, 1)

// make sure to add it back into the channel?

func CompareGS(cs *StateSnapshot) {
	ms := <-masterGS
	ms.StateMatch.playerMu.Lock()
	for i, s := range ms.StateMatch.Lobby {
		*ms.StateMatch.Lobby[i] = PlayerCompare(s, cs.StateMatch.Lobby[i])
	}
	ms.StateMatch.playerMu.Unlock()
	for i, s := range ms.Projs {
		*ms.Projs[i] = ProjectileCompare(s, cs.Projs[i])
	}
	for i, s := range ms.Astrds {
		*ms.Astrds[i] = AsteroidCompare(s, cs.Astrds[i])
	}
	masterGS <- ms
}

// Gets the changes between positions between old and new objects
func PlayerCompare(old, new *Player) Player {
	obj := Player{}
	obj.Position = CircleCompare(old.Position, new.Position)
	return obj
}

func ProjectileCompare(old, new *Projectile) Projectile {
	obj := Projectile{}
	obj.Position = CircleCompare(old.Position, new.Position)
	return obj
}

func AsteroidCompare(old, new *Asteroid) Asteroid {
	obj := Asteroid{}
	obj.Position = CircleCompare(old.Position, new.Position)
	return obj
}

func CircleCompare(old, new Circle) Circle {
	circ := Circle{}
	circ.Center = VectorCompare(old.Center, new.Center)
	return circ
}

func VectorCompare(old, new Vector) Vector {
	vec := Vector{}
	vec.X = new.X - old.X
	vec.Y = new.Y - old.Y
	return vec
}

// commented out entities projectile

// func (s *StateSnapshot) UpdatePlayer (p Player, ) []int {

// }
// import (
// 	"fmt"
// 	"time"
// 	// "reflect"
// )

// type State struct {
// 	ProjChan  chan Projectile // this needs to be a ptr?
// 	StateChan chan []Projectile
// 	CollChan  chan []Projectile
// 	// StateMatch    *StateMatch

// }

// type obj interface {
// }

// func (s *State) initState() {
// 	s.ProjChan = make(chan Projectile, 50)
// 	s.StateChan = make(chan []Projectile, 1)
// 	s.CollChan = make(chan []Projectile, 1)

// }

// func MakeProjectile(x int, y int, xVel float64, yVel float64, id int) Projectile {
// 	p := Projectile{x, y, xVel, yVel, id}
// 	// fmt.Println(p)
// 	return p
// }

// func boundsCheck(p *Projectile) bool {
// 	if p.X >= 2500 || p.Y >= 2500 {
// 		return true
// 	}

// 	return false
// }

// // This function grabs all projectiles in the channel and handles
// // updating of state. Should be called as a Go Routine.
// func (s *State) Updater() {
// 	fmt.Println("in updater")
// 	for projectile := range s.ProjChan {
// 		projSlice := <-s.StateChan
// 		projectile.X += int(projectile.XVelocity) // pro gamer move
// 		projectile.Y += int(projectile.YVelocity)

// 		// check collision here IFF no collision, send back to channel
// 		if boundsCheck(&projectile) { // replace with collision check as well via quadtrees
// 			collSlice := <-s.CollChan
// 			collSlice = append(collSlice, projectile)
// 			s.CollChan <- collSlice
// 		} else {
// 			projSlice = append(projSlice, projectile)
// 		}

// 		s.StateChan <- projSlice
// 	}
// }

// func (s *State) StateDisplayer() {
// 	ticker := time.NewTicker(45 * time.Millisecond)
// 	defer ticker.Stop() // IMPORTANT, otherwise ticker will memory leak
// 	for range ticker.C {
// 		projSlice := <-s.StateChan
// 		collSlice := <-s.CollChan

// 		for _, proj := range projSlice {
// 			fmt.Println("in state chan", proj)
// 			s.ProjChan <- proj
// 		}

// 		for _, coll := range collSlice {
// 			fmt.Println("projectile out of range at ", coll.X, " x ", coll.Y)
// 		}
// 		s.StateChan <- make([]Projectile, 0)
// 		s.CollChan <- make([]Projectile, 0)
// 	}

// }

// func main() {
// 	id := 0
// 	p := MakeProjectile(2, 6, 15.2, 17.6, id)
// 	id++
// 	s := &State{}
// 	s.initState()
// 	go s.Updater()
// 	go s.StateDisplayer()

// 	p2 := MakeProjectile(4, 7, 20.2, 34.6, id)
// 	id++
// 	p3 := MakeProjectile(10, 17, 40.2, 24.6, id)
// 	id++
// 	s.ProjChan <- p
// 	s.ProjChan <- p2
// 	s.ProjChan <- p3
// 	s.StateChan <- make([]Projectile, 0)
// 	s.CollChan <- make([]Projectile, 0)
// 	select {}
// 	// fmt.Println(reflect.TypeOf(s))
// 	// ch <- p
// 	// s.Updater()
// 	// fmt.Println(s)
// 	// Updater()
// }

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

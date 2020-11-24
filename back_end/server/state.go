package main

// A struct that encapsulates the entire state of a given match.
type State struct {
	ProjChan chan *Projectile
	Match    *Match
}

// This function grabs all projectiles in the channel and handles
// updating of state. Should be called as a Go Routine.
func (s *State) Updater() {
	for projectile := range s.ProjChan {

	}
}

package main

import (
	"github.com/Tskken/quadgo"
	"github.com/pion/webrtc/v3"
)

type Player struct {
	// Ping   int
	// Entity quadgo.Entity
	DC *webrtc.DataChannel
}

type Projectile struct {
	Entity quadgo.Entity
}

type Asteroid struct {
	Entity quadgo.Entity
}

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
	Entity *quadgo.Entity
	XVel   int
	YVel   int
}

type Asteroid struct {
	Entity quadgo.Entity
}

func (p *Projectile) MoveProjectile() {
	p.Entity
}

// func main() {
// 	proj := Projectile{quadgo.NewEntity(1.0, 1.0, 1.0, 1.0), 0, 0}
// 	a := unsafe.Sizeof(proj)
// 	b := unsafe.Sizeof(proj.Entity)
// 	fmt.Println(a)
// 	fmt.Println(b)
// 	fmt.Println(unsafe.Sizeof(&proj))
// 	fmt.Println(unsafe.Sizeof(proj))
// }

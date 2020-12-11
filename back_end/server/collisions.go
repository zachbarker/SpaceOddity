package main

import (
	"math"

	"github.com/pion/webrtc/v3"
)

// Vector struct, Position of X, Y
type Vector struct {
	X, Y float64
}

// Circle struct, Center=>Center Position X, Y, Radius=>size
type Circle struct {
	Center Vector
	Radius float64
}

// Projectile struct, Position, Active=>alive or not
type Projectile struct {
	Position Circle
	Active   bool
}

// Player struct, Position, Active=>alive or not,
// slice of Projectiles
type Player struct {
	Id          int
	Position    Circle
	Active      bool
	Projectiles []Projectile
	DC          *webrtc.DataChannel
}

// Asteroid struct, Position, Active=>alive or not
type Asteroid struct {
	Position Circle
	Active   bool
}

// check whether the two circles are intersected or not
// if intersected return true, otherwise false
func collides(c1, c2 Circle) bool {
	dist := math.Sqrt(math.Pow(c2.Center.X-c1.Center.X, 2) +
		math.Pow(c2.Center.Y-c1.Center.Y, 2))

	return dist <= c1.Radius+c2.Radius
}

// check collision between players function,
// if two players are collided return true, otherwise return false
func collisionBwPlayers(players []Player) bool {
	for i := 0; i < len(players)-1; i++ {
		for j := i + 1; j < len(players); j++ {
			if collides(players[i].Position, players[j].Position) &&
				players[i].Active && players[j].Active {
				return true
			}
		}
	}
	return false
}

// collision between asteroids function,
// if two asteroids are collided return true, otherwise return false
func collisionBwAsteroids(asteroids []Asteroid) bool {
	for i := 0; i < len(asteroids)-1; i++ {
		for j := i + 1; j < len(asteroids); j++ {
			if collides(asteroids[i].Position, asteroids[j].Position) &&
				asteroids[i].Active && asteroids[j].Active {
				return true
			}
		}
	}
	return false
}

// check collision between players and asteroids function,
// if one of players and one of asteroids are collided return true, otherwise return false
func collisionBwPlayersAndAsteroids(players []Player, asteroids []Asteroid) bool {
	for _, player := range players {
		for _, asteroid := range asteroids {
			if collides(player.Position, asteroid.Position) &&
				player.Active && asteroid.Active {
				return true
			}
		}
	}
	return false
}

// check collision between Projectiles and asteroids function,
// if one of Projectiles and one of asteroids are collided return true, otherwise return false
func collisionBwProjectilesAndAsteroids(players []Player, asteroids []Asteroid) bool {
	for _, player := range players {
		for _, projectile := range player.Projectiles {
			for _, asteroid := range asteroids {
				if collides(projectile.Position, asteroid.Position) &&
					projectile.Active && asteroid.Active {
					return true
				}
			}
		}
	}
	return false
}

// check collision between players' Projectiles function,
// if player1's one of Projectiles and one of players are collided
// return true, otherwise return false
func collisionBwProjectiles(players []Player) bool {
	for i := 0; i < len(players)-1; i++ {
		for j := i + 1; j < len(players); j++ {
			for _, projectile1 := range players[i].Projectiles {
				for _, projectile2 := range players[j].Projectiles {
					if collides(projectile1.Position, players[i].Position) &&
						projectile1.Active && players[i].Active {
						return true
					} else if collides(projectile2.Position, players[j].Position) &&
						projectile2.Active && players[j].Active {
						return true
					}
				}
			}
		}
	}
	return false
}

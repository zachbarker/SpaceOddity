package main

import "math"

// Vector struct, position of x, y
type Vector struct {
	x float64
	y float64
}

// Circle struct, center=>center position x, y, radius=>size
type Circle struct {
	center Vector
	radius float64
}

// Projectile struct, position, active=>alive or not
type Projectile struct {
	position Circle
	active   bool
}

// Player struct, position, active=>alive or not,
// slice of projectiles
type Player struct {
	position    Circle
	active      bool
	projectiles []Projectile
}

// Asteroid struct, position, active=>alive or not
type Asteroid struct {
	position Circle
	active   bool
}

// check whether the two circles are intersected or not
// if intersected return true, otherwise false
func collides(c1, c2 Circle) bool {
	dist := math.Sqrt(math.Pow(c2.center.x-c1.center.x, 2) +
		math.Pow(c2.center.y-c1.center.y, 2))

	return dist <= c1.radius+c2.radius
}

// check collision between players function,
// if two players are collided return true, otherwise return false
func collisionBwPlayers(players []Player) bool {
	for i := 0; i < len(players)-1; i++ {
		for j := i + 1; j < len(players); j++ {
			if collides(players[i].position, players[j].position) &&
				players[i].active && players[j].active {
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
			if collides(asteroids[i].position, asteroids[j].position) &&
				asteroids[i].active && asteroids[j].active {
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
			if collides(player.position, asteroid.position) &&
				player.active && asteroid.active {
				return true
			}
		}
	}
	return false
}

// check collision between projectiles and asteroids function,
// if one of projectiles and one of asteroids are collided return true, otherwise return false
func collisionBwProjectilesAndAsteroids(players []Player, asteroids []Asteroid) bool {
	for _, player := range players {
		for _, projectile := range player.projectiles {
			for _, asteroid := range asteroids {
				if collides(projectile.position, asteroid.position) &&
					projectile.active && asteroid.active {
					return true
				}
			}
		}
	}
	return false
}

// check collision between players' projectiles function,
// if player1's one of projectiles and one of players are collided
// return true, otherwise return false
func collisionBwProjectiles(players []Player) bool {
	for i := 0; i < len(players)-1; i++ {
		for j := i + 1; j < len(players); j++ {
			for _, projectile1 := range players[i].projectiles {
				for _, projectile2 := range players[j].projectiles {
					if collides(projectile1.position, players[i].position) &&
						projectile1.active && players[i].active {
						return true
					} else if collides(projectile2.position, players[j].position) &&
						projectile2.active && players[j].active {
						return true
					}
				}
			}
		}
	}
	return false
}

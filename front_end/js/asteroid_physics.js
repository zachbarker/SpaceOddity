var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "7D7D7D",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            spawnAsteroids: spawnAsteroids
        }
    }
};


// // var timer = scene.time.addEvent({
//     delay: 500,                // ms
//     callback: callback,
//     //args: [],
//     callbackScope: thisArg,
//     repeat: 4
// });

const game = new Phaser.Game(config)

let current_tick = "none"


function create() {
    //asteroids 
    asteroids = this.physics.add.group()
    // ticks = this.physics.add.group()
    //ship and bullets
    ship = this.physics.add.sprite(0, 0, 'sprites')
   
    bullets = this.physics.add.group()

    //shooting physics
    this.input.on('pointerdown', function (pointer) {
        let angle = Phaser.Math.Angle.Between(ship.x, ship.y, pointer.x, pointer.y)
        let h = Phaser.Math.Distance.Between(ship.x, ship.y, pointer.x, pointer.y)
        fire(angle, h)
    }, this)

    ship.setCollideWorldBounds(true)
    w = this.input.keyboard.addKey('W')
    a = this.input.keyboard.addKey('A')
    s = this.input.keyboard.addKey('S')
    d = this.input.keyboard.addKey('D')

    this.anims.create({
        key: 'kaboom',
        frames: this.anims.generateFrameNumbers('explosion', {
            start: 0,
            end: 15
        }),
        frameRate: 16,
        repeat: 0,
        // hideOnComplete: false
    })
    //explosions 
    explosions = this.add.group({
        defaultKey: 'explosion'
    })

    // ticks = this.add.text(16, 16, 'tickParameter', { fontSize: '32px', fill: '#000' });
    ticks = this.physics.add.group()
    tick = this.add.text(16, 16, 'tickParameter', { fontSize: '32px', fill: '#000' })

    this.physics.add.collider(bullets, asteroids, shootAsteroid)
    this.physics.add.collider(ship, asteroids, hitAsteroid)
    // this.physics.arcade.collide(asteroids, bullets, hit)

    // adds an event every 1000ms to spawn a random asteroid.
    this.time.addEvent({ delay: 1000, callback: spawnAsteroids, callbackScope: this, loop: true });
}

function shootAsteroid(bullet, asteroid) {
    let explosion = explosions.create(asteroid.x, asteroid.y, 'explosion')
    explosion.on("animationcomplete", () => explosion.destroy())
    explosion.play('kaboom')
    bullet.destroy()
    asteroid.destroy()
}

function hitAsteroid(ship, asteroid) {
    // asteroid.body.setBounce(0.1,0.1)
    // let explosion = explosions.create(ship.x, ship.y, 'explosion')
    // explosion.on("animationcomplete", () => explosion.destroy())
    // explosion.play('kaboom')
    // // ship.destroy()
}

function preload() {
    this.load.spritesheet('asteroids', 'assets/images/asteroid_sprite_2.png', {
        frameWidth: 48,
        frameHeight: 48
    })
    this.load.spritesheet('explosion', 'assets/images/explosion.png', {
        frameWidth: 128,
        frameHeight: 128
    })
    this.load.spritesheet('sprites', 'assets/images/Shooter_SpriteSheet.png', {
        frameWidth: 16, frameHeight: 16
    })
    this.load.image('bullet', 'assets/images/bomb.png')
}

function update() {
    shipMovement()
    spawnspawn()
}

function spawnAsteroids() {

    let ind = Phaser.Math.Between(0, 89)
    let asteroid = asteroids.create(800, 300, 'asteroids', ind);
    // asteroid.setBounce(1, 1)
    asteroid.displayWidth = 60;
    asteroid.displayHeight = 60;

    asteroid.setVelocity(-50, 0);
    asteroid.body.setAllowGravity(false)
    asteroid.setCollideWorldBounds(false)
}

function fire(angle, h) {
    b = bullets.create(ship.x, ship.y, 'bullet')
    b.setVelocityX(Math.cos(angle) * 400)
    b.setVelocityY(Math.sin(angle) * 400)
    spawnspawn()
}

function shipMovement() {
    console.log("moving")

    if (w.isDown) {
        if (a.isDown) {
            ship.angle = 315
            ship.setVelocityY(-250)
            ship.setVelocityX(-250)
        } else if (d.isDown) {
            ship.angle = 45
            ship.setVelocityY(-250)
            ship.setVelocityX(250)
        } else {
            ship.angle = 0
            ship.setVelocityY(-250)
            ship.setVelocityX(0)
        }
    } else if (s.isDown) {
        if (a.isDown) {
            ship.angle = 225
            ship.setVelocityY(250)
            ship.setVelocityX(-250)
        } else if (d.isDown) {
            ship.angle = 135
            ship.setVelocityY(250)
            ship.setVelocityX(250)
        } else {
            ship.angle = 180
            ship.setVelocityY(250)
            ship.setVelocityX(0)
        }
    } else if (a.isDown) {
        if (w.isDown) {
            ship.angle = 315
            ship.setVelocityY(-250)
            ship.setVelocityX(-250)
        } else if (s.isDown) {
            ship.angle = 225
            ship.setVelocityY(250)
            ship.setVelocityX(-250)
        } else {
            ship.angle = 270
            ship.setVelocityX(-250)
            ship.setVelocityY(0)
        }
    } else if (d.isDown) {
        if (w.isDown) {
            ship.angle = 45
            ship.setVelocityY(-250)
            ship.setVelocityX(250)
        } else if (s.isDown) {
            ship.angle = 135
            ship.setVelocityY(250)
            ship.setVelocityX(250)
        } else {
            ship.angle = 90
            ship.setVelocityX(250)
            ship.setVelocityY(0)
        }
    } else {
        ship.setVelocityX(0);
        ship.setVelocityY(0);
    }
}

let last_tick = 0

function spawnspawn() {
    let ct_lst = current_tick.split(" ")
    let ct = ct_lst[2]
    if (last_tick != ct) {
        last_tick = ct

        let new_tick = tick

        new_tick.setText(current_tick)
        ticks.add(new_tick)
    } 

}


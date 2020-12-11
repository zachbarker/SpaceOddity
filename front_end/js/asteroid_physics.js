var playerList = [undefined, undefined, undefined, undefined, undefined];

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
            spawnAsteroids: spawnAsteroids,
            randomSpawnSmall: randomSpawnSmall,
            randomSpawnMedium: randomSpawnMedium,
            randomSpawnLarge: randomSpawnLarge
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
let is_hit = false
let last_tick = 0
var asteroids
var num_asts = 89
var current_asteroids = []


function create() {


    this.add.image(400, 300, 'background');

    //asteroids 
    asteroids = this.physics.add.group()

    this.shipMovement = shipMovement;


    // ticks = this.physics.add.group()

    //ship and bullets
    ship = this.physics.add.sprite(400, 300, 'sprites')
    ship.displayWidth = 35;
    ship.displayHeight = 35;

    enemyShips = this.physics.add.group()
    bullets = this.physics.add.group()

    setUpConnection(this);

    //shooting physics
    this.input.on('pointerdown', function(pointer) {
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
            repeat: 0
        })
        //explosions 
    explosions = this.add.group({
        defaultKey: 'explosion'
    })

    // ticks = this.add.text(16, 16, 'tickParameter', { fontSize: '32px', fill: '#000' });
    ticks = this.physics.add.group()
    tick = this.add.text(16, 16, 'tickParameter', { fontSize: '32px', fill: '#000' })

    this.physics.add.collider(bullets, asteroids, shootAsteroid)
    // this.physics.add.collider(ship, asteroids, hitAsteroid)
        // this.physics.arcade.collide(asteroids, bullets, hit)

    // adds an event every 1000ms to spawn a random asteroid.
    this.time.addEvent({ delay: 750, callback: spawnAsteroids, callbackScope: this, loop: true });
    
}

function shootAsteroid(bullet, asteroid) {
    let explosion = explosions.create(asteroid.x, asteroid.y, 'explosion')
    explosion.on("animationcomplete", () => explosion.destroy())
    explosion.play('kaboom')
    bullet.destroy()
    asteroid.destroy()
}

function hitAsteroid(ship, asteroid) {
    is_hit = true
    let diffX = ship.body.velocity.x - (5 * asteroid.body.velocity.x)
    let diffY = ship.body.velocity.y - (5 * asteroid.body.velocity.y)
        // ship.setVelocity(diffX, diffy)
    ship.setVelocityX(diffX / 2)
    ship.setVelocityY(diffY / 2)
    asteroid.setVelocityX(-diffX / 20)
    asteroid.setVelocityY(-diffY / 20)
    stunned()
    let explode_asteroid = explosions.create(asteroid.x, asteroid.y, 'explosion')
    explode_asteroid.on("animationcomplete", () => explode_asteroid.destroy())
    explode_asteroid.play('kaboom')
    let explode_ship = explosions.create(ship.x, ship.y, 'explosion')
    explode_ship.on("animationcomplete", () => explode_ship.destroy())
    explode_ship.play('kaboom')
    ship.destroy()
    asteroid.destroy()
        // let explosion = explosions.create(ship.x, ship.y, 'explosion')
        // explosion.on("animationcomplete", () => explosion.destroy())
        // explosion.play('kaboom')
        // // ship.destroy()
}

function preload() {
    this.load.spritesheet('asteroids', 'assets/images/asteroid_sprite_1.png', {
        frameWidth: 48,
        frameHeight: 48
    })
    this.load.spritesheet('explosion', 'assets/images/explosion.png', {
        frameWidth: 128,
        frameHeight: 128
    })
    this.load.spritesheet('sprites', 'assets/images/Shooter_SpriteSheet.png', {
        frameWidth: 16,
        frameHeight: 16
    })
    this.load.image('bullet', 'assets/images/bomb.png')
    this.load.image('background', 'assets/images/space_background.png')
}

function IfAny1sANobodyBuddy() {
    console.log("... you're life's not worth a looney on the streets.")
}

function update() {
    if (!is_hit)
        shipMovement()
    spawnspawn()
}

// function spawnAsteroids() {

//     let ind = Phaser.Math.Between(0, 89)
//     let asteroid = asteroids.create(800, 300, 'asteroids', ind);
//     // asteroid.setBounce(1, 1)
//     asteroid.displayWidth = 60;
//     asteroid.displayHeight = 60;

//     asteroid.setVelocity(-50, 0);
//     asteroid.body.setAllowGravity(false)
//     asteroid.setCollideWorldBounds(false)
// }

// randomly chooses one of the asteroid sizes and
// spawns the selected asteroid on a random side of the map
function spawnAsteroids() {

    var temp = (Math.floor((Math.random() * 3) + 1));

    if (temp == 1) {
        this.randomSpawnSmall();
    } else if (temp == 2) {
        this.randomSpawnMedium();
    } else {
        this.randomSpawnLarge();
    }
}

// random number generator for randomizing direction of travel
function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

// Medium asteroids
function randomSpawnMedium() {

    // randomizing the side of the screen the medium asteroid spawns
    // and assigns the direction they travel accordingly
    if (Math.floor((Math.random() * 4) + 1) == 1) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else {
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)
    }

}


// Small asteroids
function randomSpawnSmall() {

    // randomizing the side of the screen the small asteroid spawns
    // and assigns the direction they travel accordingly
    if (Math.floor((Math.random() * 4) + 1) == 1) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 30;
        asteroid.displayHeight = 30;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 30;
        asteroid.displayHeight = 30;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 30;
        asteroid.displayHeight = 30;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else {
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 30;
        asteroid.displayHeight = 30;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)
    }
}

// Large Asteroids
function randomSpawnLarge() {

    // randomizing the side of the screen the large asteroid spawns
    // and assigns the direction they travel accordingly
    if (Math.floor((Math.random() * 4) + 1) == 1) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 90;
        asteroid.displayHeight = 90;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 90;
        asteroid.displayHeight = 90;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 90;
        asteroid.displayHeight = 90;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)

    } else {
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 90;
        asteroid.displayHeight = 90;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        current_asteroids.push(asteroid)
        console.log(current_asteroids.length)
    }
}


function fire(angle, h) {
    b = bullets.create(ship.x, ship.y, 'bullet')
    b.setVelocityX(Math.cos(angle) * 400)
    b.setVelocityY(Math.sin(angle) * 400)
    spawnspawn()
}

shipMovement = () => {console.log('loading controls...')}

function movementFun() {
    console.log("Sending packet from index: ", window.ID);
    if (!is_hit) {
        if (w.isDown) {
            if (a.isDown) {
                ship.angle = 315
                ship.setVelocityY(-250)
                ship.setVelocityX(-250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": -1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else if (d.isDown) {
                ship.angle = 45
                ship.setVelocityY(-250)
                ship.setVelocityX(250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 1,
                        "YVelocity": -1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else {
                ship.angle = 0
                ship.setVelocityY(-250)
                ship.setVelocityX(0)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 0,
                        "YVelocity": -1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            }
        } else if (s.isDown) {
            if (a.isDown) {
                ship.angle = 225
                ship.setVelocityY(250)
                ship.setVelocityX(-250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else if (d.isDown) {
                ship.angle = 135
                ship.setVelocityY(250)
                ship.setVelocityX(250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 1,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else {
                ship.angle = 180
                ship.setVelocityY(250)
                ship.setVelocityX(0)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 0,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            }
        } else if (a.isDown) {
            if (w.isDown) {
                ship.angle = 315
                ship.setVelocityY(-250)
                ship.setVelocityX(-250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": -1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else if (s.isDown) {
                ship.angle = 225
                ship.setVelocityY(250)
                ship.setVelocityX(-250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else {
                ship.angle = 270
                ship.setVelocityX(-250)
                ship.setVelocityY(0)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": 0,
                        "X": 25,
                        "Y": 25
                    }
                }))
            }
        } else if (d.isDown) {
            if (w.isDown) {
                ship.angle = 45
                ship.setVelocityY(-250)
                ship.setVelocityX(250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": -1,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else if (s.isDown) {
                ship.angle = 135
                ship.setVelocityY(250)
                ship.setVelocityX(250)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 1,
                        "YVelocity": 1,
                        "X": 25,
                        "Y": 25
                    }
                }))
            } else {
                ship.angle = 90
                ship.setVelocityX(250)
                ship.setVelocityY(0)
                window.dc.send(JSON.stringify({
                    "SnapshotNum": 1,
                    "PlayerIndex": window.ID,
                    "Cmd": {
                        "Type": 0,
                        "XVelocity": 1,
                        "YVelocity": 0,
                        "X": 25,
                        "Y": 25
                    }
                }))
            }
        } else {

            ship.setVelocityX(0)
            ship.setVelocityY(0)
            // window.dc.send(JSON.stringify({
            //     "SnapshotNum": 1,
            //     "PlayerIndex": window.ID,
            //     "Cmd": {
            //         "Type": 0,
            //         "XVelocity": 0,
            //         "YVelocity": 0,
            //         "X": 25,
            //         "Y": 25
            //     }
            // }))
        }
    }
}

async function stunned() {
    await sleep(500)
        // is_hit = false

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


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
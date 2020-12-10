var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        extend: {
            spawnAsteroids: spawnAsteroids,
            randomSpawnSmall: randomSpawnSmall,
            randomSpawnMedium: randomSpawnMedium,
            randomSpawnLarge: randomSpawnLarge
        }
    }
};

var game = new Phaser.Game(config);
var emitter;
var particles;
var switchNum;
var tempNum;
var asteroids
var num_asts = 89

// var timer = scene.time.addEvent({
//     delay: 500,                // ms
//     callback: callback,
//     //args: [],
//     callbackScope: thisArg,
//     repeat: 4
// });

function preload() {

    this.load.spritesheet('asteroids', 'assets/images/asteroid_sprite_2.png', {
        frameWidth: 48,
        frameHeight: 48
    });
    this.load.spritesheet('particle', 'assets/images/explosions.png', {
        
    })
}

function create() {

    this.add.image(400, 300, 'sky');

    asteroids = this.physics.add.group();

    // adds an event every 1000ms to spawn a random asteroid.
    this.time.addEvent({ delay: 1000, callback: spawnAsteroids, callbackScope: this, loop: true });

}

function update() {
    asteroids.forEach(element => this.physics.arcade.collide(asteroid, asteroids))
}

// utilizes three spawn functions to spawn
// a random sized asteroids
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

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

// Medium asteroids
function randomSpawnMedium() {

    // var tempNum = randomNum(0, 3);

    if (Math.floor((Math.random() * 4) + 1) == 1) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 50;
        asteroid.displayHeight = 50;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 40;
        asteroid.displayHeight = 40;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 40;
        asteroid.displayHeight = 40;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 40;
        asteroid.displayHeight = 40;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);
    }

}


// Small asteroids
function randomSpawnSmall() {

    // var tempNum = randomNum(0, 3);

    if (Math.floor((Math.random() * 4) + 1) == 1) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 20;
        asteroid.displayHeight = 20;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 20;
        asteroid.displayHeight = 20;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 20;
        asteroid.displayHeight = 20;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 20;
        asteroid.displayHeight = 20;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);
    }
}

// Large Asteroids
function randomSpawnLarge() {

    // var tempNum = randomNum(0, 3);

    if (Math.floor((Math.random() * 4) + 1) == 1) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 600, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(-100, 0));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 2) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(0, randomY, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(0, 100), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else if (Math.floor((Math.random() * 4) + 1) == 3) {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });

        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(randomX, 0, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 100), randomNum(0, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);

    } else {

        // particles = this.add.particles('red');
        // emitter = particles.createEmitter({
        //     speed: 100,
        //     scale: { start: 1, end: 0 },
        //     blendMode: 'ADD'
        // });
        randomX = randomNum(0, 800);
        randomY = randomNum(0, 600);

        var ind = Phaser.Math.Between(0, num_asts)
        var asteroid = asteroids.create(800, randomY, 'asteroids', ind);

        asteroid.displayWidth = 60;
        asteroid.displayHeight = 60;

        asteroid.setVelocity(randomNum(-100, 0), randomNum(-100, 100));
        asteroid.body.setAllowGravity(false);
        asteroid.setCollideWorldBounds(false);
        emitter.startFollow(asteroid);
    }
}

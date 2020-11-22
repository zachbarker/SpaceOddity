const config = {
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
        preload,
        create,
        update
    }

}

const game = new Phaser.Game(config)

function preload() {
    this.load.spritesheet('sprites', 'assets/Shooter_SpriteSheet.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('bullet', 'assets/bomb.png');
}

function create() {
    ship = this.physics.add.sprite(0, 0, 'sprites');
    bullets = this.physics.add.group();

    this.input.on('pointerdown', function(pointer) {
        let angle = Phaser.Math.Angle.Between(ship.x, ship.y, pointer.x, pointer.y)
        let h = Phaser.Math.Distance.Between(ship.x, ship.y, pointer.x, pointer.y)
        fire(angle, h)
    }, this);



    ship.setCollideWorldBounds(true);
    w = this.input.keyboard.addKey('W')
    a = this.input.keyboard.addKey('A')
    s = this.input.keyboard.addKey('S')
    d = this.input.keyboard.addKey('D')
}

function fire(angle, h) {
    b = bullets.create(ship.x, ship.y, 'bullet');
    b.setVelocityX(Math.cos(angle) * 400)
    b.setVelocityY(Math.sin(angle) * 400)

}

function shipMovement() {

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

function update() {
    shipMovement();
    // shoot();
}
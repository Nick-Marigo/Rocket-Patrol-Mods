class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;

        // Randomize direction -1 = left, 1 = right
        this.direction = Phaser.Math.RND.pick([-1, 1]);
        if (this.direction === 1) {
            this.x = 0 - this.width;
            this.flipX = true;
        }
    }

    update() {
        // move spaceship left
        this.x += this.moveSpeed * this.direction;

        // wrap from left to right edge
        if(this.x <= 0 - this.width && this.direction === -1) {
            this.x = game.config.width;
        } else if (this.x >= game.config.width && this.direction === 1) {
            this.x = 0 - this.width;
        }
    }

    increaseSpeed() {
        this.moveSpeed *= 1.5;
    }

    // reset position
    reset() {
        if(this.direction === -1) {
            this.x = game.config.width;
        } else {
            this.x = 0 - this.width;
        }

    }
}
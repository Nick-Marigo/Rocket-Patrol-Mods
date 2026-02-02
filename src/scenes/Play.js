class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
    
    // place tile sprite
    this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
    this.meteorfield = this.add.tileSprite(0, 0, 640, 480, 'meteorfield').setOrigin(0, 0);
    this.starfieldtop = this.add.tileSprite(0, 0, 640, 480, 'starfieldtop').setOrigin(0, 0);

    // green UI background
    this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

    // white borders
    this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
    this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
    this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1); 
    this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
 
    // add rocket (p1)
    this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

    // add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4 + borderPadding*4, 'spaceship', 0, 30).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize *3, borderUISize*5 + borderPadding*6, 'spaceship', 0, 20).setOrigin(0, 0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*8, 'spaceship', 0, 10).setOrigin(0, 0);

    this.specialShip = new SpecialSpaceship(this, game.config.width + borderUISize*4, borderUISize*4, 'specialSpaceship', 0, 50).setOrigin(0,0);
    this.specialShip.anims.play('specialShip');

    // define keys
    keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    keyPlayer2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.score = 0;

    //display score
    let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 100
    }

    this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.score, scoreConfig);

    // GAME OVER flag
    this.gameOver = false;

    // Increase speed after 30 seconds
    this.clock2 = this.time.delayedCall(30000, () => {
        this.ship01.increaseSpeed();
        this.ship02.increaseSpeed();
        this.ship03.increaseSpeed();
        this.specialShip.increaseSpeed();
        this.p1Rocket.increaseSpeed();
    }, null, this);

    // 60-second play clock
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
        if(currentPlayer === 0) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
        } else if (currentPlayer === 1) {
            this.add.text(game.config.width/2, game.config.height/2, 'PLAYER 2 TURN', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, "Press (E) to start player 2's turn", scoreConfig).setOrigin(0.5);
        } else if (currentPlayer === 2) {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 128, `P1 Score: ${p1Total}  |  P2 Score: ${p2Total}`, scoreConfig).setOrigin(0.5);
            if (p1Total > p2Total) {
                this.add.text(game.config.width/2, game.config.height/2 + 192, 'PLAYER 1 WINS!', scoreConfig).setOrigin(0.5);
            } else if (p2Total > p1Total) {
                this.add.text(game.config.width/2, game.config.height/2 + 192, 'PLAYER 2 WINS!', scoreConfig).setOrigin(0.5);
            } else {
                this.add.text(game.config.width/2, game.config.height/2 + 192, "IT'S A TIE!", scoreConfig).setOrigin(0.5);
            }
        }
        this.gameOver = true;
    }, null, this);

    //display high scorescore
    let scoreHighConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#F3B141',
        color: '#843605',
        align: 'right',
        padding: {
            top: 5,
            bottom: 5,
        },
        fixedWidth: 0
    }

    // display high score text
    this.highScore = this.registry.get('highScore');
    this.highScoreText = this.add.text(borderUISize + borderPadding*30, borderUISize + borderPadding*2, 'High Score: ' + this.registry.get('highScore'), scoreHighConfig);


    // Count down timer
    this.remainingTime = game.settings.gameTimer / 1000;
    this.timeText = this.add.text(borderUISize + borderPadding*12, borderUISize + borderPadding*2, this.remainingTime, scoreHighConfig);
    this.timeEvent = this.time.addEvent({
        delay: 1000,
        callback: this.onEvent,
        callbackScope: this,
        loop: true
    });


    }

    update() {

        // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene');
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyPlayer2) && currentPlayer === 1) {
            currentPlayer = 2;
            this.scene.restart();
        }

        // update high score
        if(this.registry.get('highScore') < this.score) {
            this.registry.set('highScore', this.score);
            this.highScoreText.setText('High Score: ' + this.score);
        }

        this.starfield.tilePositionX -= 2;
        this.meteorfield.tilePositionX -= 1;
        this.starfieldtop.tilePositionX -= 4;

        if(!this.gameOver) {
            if(currentPlayer === 1) {
                p1Total = this.score;
            } else {
                p2Total = this.score;
            }
            this.p1Rocket.update()
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.specialShip.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
           this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.specialShip)) {
            this.p1Rocket.reset();
           this.shipExplode(this.specialShip);
        }

    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        })

        // score add and text update
        this.score += ship.points;
        this.scoreLeft.text = this.score;
        this.sound.play('sfx-explosion');
    }

    onEvent() {
        this.remainingTime -= 1;
        this.timeText.setText(this.remainingTime);
        if (this.remainingTime <= 0) {
            this.timeEvent.remove();
        }
    }

}
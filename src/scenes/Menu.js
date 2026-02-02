class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

        this.load.spritesheet('startButton', './assets/StartButton.png', {
            framewidth: 80,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });

        this.load.image('rocket', './assets/Rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/newStarField.png');
        this.load.image('meteorfield', './assets/starFieldMeteor.png');
        this.load.image('starfieldtop', './assets/newStarFieldTop.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
        this.load.spritesheet('specialSpaceship', './assets/SpecialSpaceship.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 3
        })

        // load audio
        this.load.audio('sfx-select', './assets/sfx-select.wav');
        this.load.audio('sfx-explosion', './assets/sfx-explosion.wav');
        this.load.audio('sfx-shot', './assets/sfx-shot.wav');
    }

    create() {

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}), 
            frameRate: 30
        })

        this.anims.create({
            key: 'specialShip',
            frames: this.anims.generateFrameNumbers('specialSpaceship', {start: 0, end: 3, first: 0}), 
            frameRate: 10,
            repeat: -1
        })

    //display score
    let menuConfig = {
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

    // display menu text
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
    menuConfig.backgroundColor = '#00FF00';
    menuConfig.color = '#000';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

    // New display menu
    this.add.image(game.config.width/2, game.config.height/2 - borderUISize*4, 'startButton').setOrigin(0.5);

    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

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

    if(this.registry.get('highScore') === undefined) {
        this.registry.set('highScore', 0);
    }

    // display high score text
    this.highScoreText = this.add.text(borderUISize + borderPadding*32, borderUISize + borderPadding*2, 'High Score: ' + this.registry.get('highScore'), scoreHighConfig);

    currentPlayer = 1;

    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx-select');
            this.scene.start('playScene');
        }

        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            //hard mode
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx-select');
            this.scene.start('playScene');
        }

    }

}

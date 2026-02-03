class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

        this.load.spritesheet('startButton', './assets/StartButton.png', {
            frameWidth: 80,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('playerButtons', './assets/PlayerButtons.png', {
            frameWidth: 120,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 3
        });
        this.load.spritesheet('noviceButton', './assets/NoviceButton.png', {
            frameWidth: 100,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('expertButton', './assets/ExpertButton.png', {
            frameWidth: 100,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        this.load.image('titleScreen', './assets/MenuTitle.png');

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

    // Set default settings
    currentPlayer = 0;
    game.settings = {
        spaceshipSpeed: 3,
        gameTimer: 60000    
    };

    // New display menu

    this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0, 0);

    this.add.image(game.config.width / 2, game.config.height/2 - 150, 'titleScreen').setOrigin(0.5);

    this.noviceButton = this.add.image(game.config.width/2 - 75, game.config.height/2, 'noviceButton', 1).setOrigin(0.5);
    this.noviceButton.setInteractive({
        useHandCursor: true
    });

    
    this.noviceButton.on('pointerdown', () => {

        this.noviceButton.setFrame(1);
        this.expertButton.setFrame(0);

        // easy mode
        game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000
        }
        this.sound.play('sfx-select');

    });

    this.expertButton = this.add.image(game.config.width/2 + 75, game.config.height/2, 'expertButton', 0).setOrigin(0.5);
    this.expertButton.setInteractive({
        useHandCursor: true
    });
    
    this.expertButton.on('pointerdown', () => {
        
        this.expertButton.setFrame(1);
        this.noviceButton.setFrame(0);

        //hard mode
        game.settings = {
            spaceshipSpeed: 4,
            gameTimer: 45000
        }
        this.sound.play('sfx-select');
    });

    this.onePlayerButton = this.add.image(game.config.width/2 - 75, game.config.height - borderUISize*5, 'playerButtons', 1).setOrigin(0.5);
    this.onePlayerButton.setInteractive({
        useHandCursor: true
    });
    
    this.onePlayerButton.on('pointerdown', () => {
        currentPlayer = 0;
        this.onePlayerButton.setFrame(1);
        this.twoPlayerButton.setFrame(2);
        this.sound.play('sfx-select');
    });

    this.twoPlayerButton = this.add.image(game.config.width/2 + 75, game.config.height - borderUISize*5, 'playerButtons', 2).setOrigin(0.5);
    this.twoPlayerButton.setInteractive({
        useHandCursor: true
    });
    
    this.twoPlayerButton.on('pointerdown', () => {
        currentPlayer = 1;
        this.twoPlayerButton.setFrame(3);
        this.onePlayerButton.setFrame(0);
        this.sound.play('sfx-select');
    });

    this.startButton = this.add.image(game.config.width/2, game.config.height - borderUISize*2, 'startButton').setOrigin(0.5);
    this.startButton.setInteractive({
        useHandCursor: true
    });

    this.startButton.on('pointerover', () => {
        this.startButton.setFrame(1);
    });

    this.startButton.on('pointerout', () => {
        this.startButton.setFrame(0);
    });
    
    this.startButton.on('pointerdown', () => {
        this.sound.play('sfx-select');
        this.scene.start('playScene');
    });



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
    this.highScoreText = this.add.text(10, game.config.height/2 +200, 'High Score: ' + this.registry.get('highScore'), scoreHighConfig);

    }

    update() {

        this.background.tilePositionX -= 0.5;

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

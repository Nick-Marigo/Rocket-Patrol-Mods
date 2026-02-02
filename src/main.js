/*
Nick Marigo
Rocket Patrol Modded
Hours to complete:
Mods:
High Score (1) Done
Speed increase after 30 seconds (1) Done
Randomize each spaceship's movement (1)
New Scrolling tile sprite background (1) Done
Allow control of rocket after fired (1) Done
Display remaining time (3) Done
New title screen (3)
New Spaceship type (5) Done
Alternating two-player mode (5)
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyPlayer2;

let currentPlayer = 0;
let p1Total = 0;
let p2Total = 0;

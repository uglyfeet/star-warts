/* ===================================================
   Star Warts - Game Logic

   This file controls:

   - Player movement
   - Keyboard controls
   - Touch controls
   - Laser creation
   - Game loop

   Author: Tony Welch
=================================================== */



/* =========================================
   Game Objects
========================================= */

/* Get references to the main game elements used throughout the game. */
const player = document.getElementById("player");
const gameBoard = document.getElementById("game-board");
const moveArea = document.getElementById("move-area");
const controlsPanel = document.getElementById("controls-panel");
const keyboardControls = document.getElementById("keyboard-controls");

/* =========================================
   Device Detection
========================================= */

/* Detect if the device supports touch events and hide the appropriate controls panel. If the device supports touch events, the keyboard controls are hidden. 
If the device does not support touch events, the touch controls panel is hidden. */

if ("ontouchstart" in window) {
    keyboardControls.style.display = "none";
} else {
    controlsPanel.style.display = "none";
}

/* =========================================
   Game Variables
========================================= */

/* Player */

let playerPosition = (gameBoard.clientWidth - player.offsetWidth) / 2;
player.style.left = playerPosition + "px";
let movingLeft = false;
let movingRight = false;


/* Game */

let currentLevel = 1;
let alienRows = 2;
let alienColumns = 3;
let alienSpeed = 8;
let alienImageIndex = 0;
let fleetLeft = 0;
let fleetTop = 20;
let fleetDirection = 1;
let fleetCounter = 0;
let fleetStepDelay = 20;
let alienFleet = [];

/* Alien layout - size and spacing */
const alienSpacingX = 50;
const alienSpacingY = 50;
const alienWidth = 35;



/* =========================================
   Player System
========================================= */
/* This function creates a new laser element and animates it moving upwards from the player's position. The laser is represented by a div element with the class "laser". 
The laser's position is updated every 30 milliseconds, moving it upwards by increasing its bottom position. 
If the laser goes beyond the game board's height, it is removed from the DOM, and the interval is cleared to stop further movement. */

function fireLaser() {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = (playerPosition + player.offsetWidth / 2) + "px";
    laser.style.bottom = "60px";
    gameBoard.appendChild(laser);
    let laserPosition = 60;
    const laserInterval = setInterval(function() {
        laserPosition += 10;
        laser.style.bottom = laserPosition + "px";
    
        /* The laser moves upwards by increasing its bottom position.
        If the laser goes beyond the game board's height, it is removed from the DOM,
        and the interval is cleared to stop further movement.*/
        if (laserPosition > gameBoard.clientHeight) {
            clearInterval(laserInterval);
            laser.remove();
        }
    }, 30); 
}

/* this function listens for keyup events and stops the player's movement when the arrow keys are released. 
When the left or right arrow key is released, the corresponding movingLeft or movingRight variable is set to false, 
which will stop the player's movement in that direction. */

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowLeft") {
        movingLeft = false;
    }
    if (event.key === "ArrowRight") {
        movingRight = false;
    }
});

/* this function listens for keydown events and moves the player left or right 
based on the arrow keys pressed. It also ensures that the player does not move outside 
the boundaries of the game board. */

document.addEventListener("keydown", function(event) {     
    if (event.key === "ArrowLeft") {
        movingLeft = true;
    }
    if (event.key === "ArrowRight") {
        movingRight = true;
    }


    /* Creates a new laser when the player presses Space.
    The event.repeat check prevents continuous firing when the
    Space Bar is held down.
    A new div element is created, assigned the laser CSS class,
    and added to the game board so it becomes visible.*/
    
    if (event.key === " " && !event.repeat) {
        fireLaser();
    }
});


/* =========================================
   Touch Controls
========================================= */
const fireButton = document.getElementById("fire-button");
fireButton.addEventListener("click", function() {
    fireLaser();
});

fireButton.addEventListener("touchstart", function(event) {
    event.preventDefault();
    fireLaser();
});

/* this function listens for touchstart events on the moveArea element and determines whether the player should move left or right based on the touch position.
If the touch position is on the left half of the moveArea, the player will move left. If it's on the right half, the player will move right. 
The movingLeft and movingRight variables are set accordingly to control the player's movement. */

moveArea.addEventListener("touchstart", function(event) {
    const touchX = event.touches[0].clientX;
    const moveAreaLeft = moveArea.getBoundingClientRect().left;
    const moveAreaWidth = moveArea.offsetWidth;
    if (touchX < moveAreaLeft + moveAreaWidth / 2) {
        movingLeft = true;
        movingRight = false;
    } else {
        movingRight = true;
        movingLeft = false;
    }
});

/* this function listens for touchend events on the moveArea element and stops the player's movement when the touch ends.
When the touch ends, both movingLeft and movingRight variables are set to false, which will stop the player's movement in either direction. */

moveArea.addEventListener("touchend", function() {
    movingLeft = false;
    movingRight = false;
});


/* =========================================
   Alien System
========================================= */

/* Alien Images */
const alienImages = [
    "assets/images/feet-sunglasses.png",
    "assets/images/feet-annoyed.png",
    "assets/images/feet-sad.png",
    "assets/images/feet-crying.png"
];

/* Alien Functions */
/* this function creates a new alien element at the specified left and top positions. The alien is represented by a div element with the class "alien" and contains an img element displaying one of the alien images. 
The alien is then added to the game board and stored in the alienFleet array for later reference. */

function createAlien(left, top, row, column)  {
    const alien = document.createElement("div");
    const alienImage = document.createElement("img");
    alienImage.src = alienImages[alienImageIndex];
    alien.appendChild(alienImage);
    alien.classList.add("alien");
    alien.style.left = left + "px";
    alien.style.top = top + "px";
    alien.dataset.row = row;
    alien.dataset.column = column;
    gameBoard.appendChild(alien);
    alienFleet.push(alien);
}

/* The fleetDirection variable determines the direction of movement (1 for right, -1 for left). */
function moveFleetStep() {
    fleetLeft += alienSpeed * fleetDirection;
}

/* this function updates the position of each alien in the alienFleet array based on the current fleetLeft and fleetTop values. Each alien's left and top styles are set according to its row and column index, multiplied by the specified spacing values (alienSpacingX and alienSpacingY). 
This ensures that the aliens maintain their grid formation as they move across the game board. */
function updateFleetPosition() {
    alienFleet.forEach(function(alien) {
        const row = Number(alien.dataset.row);
        const column = Number(alien.dataset.column);
        alien.style.left = fleetLeft + (column * alienSpacingX) + "px";
        alien.style.top = fleetTop + (row * alienSpacingY) + "px";
    });
}

/* this function checks if the alien fleet has reached the edges of the game board. If the fleet reaches the right edge, the fleetDirection is set to -1 (moving left), and the fleetTop is increased by alienSpacingY to move the fleet down. */
function checkFleetEdges() {
    const fleetWidth = (alienColumns - 1) * alienSpacingX + alienWidth;
    if (fleetLeft + fleetWidth >= gameBoard.clientWidth) {
        fleetDirection = -1;
        fleetTop += alienSpacingY;
    }
    if (fleetLeft <= 0) {
        fleetDirection = 1;
        fleetTop += alienSpacingY;
    }
}


/* Alien Initialisation */
/* this loop creates a grid of aliens based on the specified number of rows and columns. Each alien is positioned based on its row and column index, with a horizontal spacing of 30 pixels and a vertical spacing of 50 pixels. 
The fleetLeft and fleetTop variables determine the starting position of the alien fleet on the game board. */

for (let row = 0; row < alienRows; row++) {
    for (let column = 0; column < alienColumns; column++) {
        createAlien(
            fleetLeft + (column * alienSpacingX),
            fleetTop + (row * alienSpacingY),
            row,
            column
        );
    }
}


/* =========================================
   Game Loop
========================================= */
/* This setInterval function continuously checks the movement flags (movingLeft and movingRight) and updates the player's position accordingly. 
It ensures that the player does not move outside the boundaries of the game board by checking the player's position against the minimum and maximum allowed values. 
The player's position is updated every 20 milliseconds, creating smooth movement when the arrow keys are held down. */

setInterval(function() {
    fleetCounter++;
    if (fleetCounter >= fleetStepDelay) {
        moveFleetStep();
        updateFleetPosition();
        fleetCounter = 0;
        checkFleetEdges();
    }
    if (movingLeft) {
        playerPosition -= 5;
        if (playerPosition < -10) {
            playerPosition = -10;
        }
        player.style.left = playerPosition + "px";
    }

    if (movingRight) {
        playerPosition += 5;
        const maxPosition = gameBoard.clientWidth - player.offsetWidth + 10;
        if (playerPosition > maxPosition) {
            playerPosition = maxPosition;
        }
        player.style.left = playerPosition + "px";
    }

}, 20);
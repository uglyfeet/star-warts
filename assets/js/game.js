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

if ("ontouchstart" in window) {

    keyboardControls.style.display = "none";

} else {

    controlsPanel.style.display = "none";

}

/* =========================================
   Game Variables
========================================= */

/* Player */

let playerPosition =
    (gameBoard.clientWidth - player.offsetWidth) / 2;

player.style.left = playerPosition + "px";

let movingLeft = false;
let movingRight = false;


/* Game */

let currentLevel = 1;

let alienRows = 2;

let alienColumns = 3;

let alienSpeed = 2;

let alienImageIndex = 0;




/* =========================================
   Game Functions
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

moveArea.addEventListener("touchend", function() {

    movingLeft = false;
    movingRight = false;

});


/* =========================================
   Alien System
========================================= */

const alienImages = [

    "assets/images/feet-sunglasses.png",
    "assets/images/feet-annoyed.png",
    "assets/images/feet-sad.png",
    "assets/images/feet-crying.png"

];

function createAlien(left, top) {
    const alien = document.createElement("div");
    const alienImage = document.createElement("img");
    alienImage.src = alienImages[alienImageIndex];
    alien.appendChild(alienImage);
    alien.classList.add("alien");
    alien.style.left = left + "px";
    alien.style.top = top + "px";
    gameBoard.appendChild(alien);
}

createAlien(0, 20);

/* =========================================
   Game Loop
========================================= */
/* This setInterval function continuously checks the movement flags (movingLeft and movingRight) and updates the player's position accordingly. 
It ensures that the player does not move outside the boundaries of the game board by checking the player's position against the minimum and maximum allowed values. 
The player's position is updated every 20 milliseconds, creating smooth movement when the arrow keys are held down. */

setInterval(function() {

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
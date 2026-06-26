/* This code is responsible for handling the movement of the player character in the game. It listens for keydown events and moves the player left or right based on the arrow keys pressed. 
The player's position is updated accordingly, and it ensures that the player does not move outside the boundaries of the game board. */
const player = document.getElementById("player");
const gameBoard = document.getElementById("game-board");

let playerPosition =
    (gameBoard.clientWidth - player.offsetWidth) / 2;

player.style.left = playerPosition + "px";

let movingLeft = false;   /* These variables are used to track whether the player is currently moving left or right and allow for holding the button down whilst firing */
let movingRight = false;

const fireButton = document.getElementById("fire-button");
fireButton.addEventListener("click", function() {

    fireLaser();

});

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
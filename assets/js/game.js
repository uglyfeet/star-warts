/* This code is responsible for handling the movement of the player character in the game. It listens for keydown events and moves the player left or right based on the arrow keys pressed. 
The player's position is updated accordingly, and it ensures that the player does not move outside the boundaries of the game board. */
const player = document.getElementById("player");
const gameBoard = document.getElementById("game-board");

let playerPosition =
    (gameBoard.clientWidth - player.offsetWidth) / 2;

player.style.left = playerPosition + "px";


/* this function listens for keydown events and moves the player left or right 
based on the arrow keys pressed. It also ensures that the player does not move outside 
the boundaries of the game board. */

document.addEventListener("keydown", function(event) {     

    if (event.key === "ArrowLeft") {
        playerPosition -= 10;
        if (playerPosition < -10) {
            playerPosition = -10;
        }
        player.style.left = playerPosition + "px";
    }

    if (event.key === "ArrowRight") {
        playerPosition += 10;
        const maxPosition =
            gameBoard.clientWidth - player.offsetWidth + 10; 
        if (playerPosition > maxPosition) {
            playerPosition = maxPosition;
        }
        player.style.left = playerPosition + "px";
    }

    /* Creates a new laser when the player presses Space.
    The event.repeat check prevents continuous firing when the
    Space Bar is held down.
    A new div element is created, assigned the laser CSS class,
    and added to the game board so it becomes visible.*/
if (event.key === " " && !event.repeat) {

    const laser = document.createElement("div");

    laser.classList.add("laser");

    laser.style.left =
        (playerPosition + player.offsetWidth / 2) + "px";

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
});
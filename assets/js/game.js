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
});
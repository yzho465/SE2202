let nextPlayer = 'X'; // takes a value of either 'X' or 'O' according to the game turns

//initalize the game by setting the value inside next-lbl to nextPlayer
//hint: you could use innerText for this 


//This call will create the buttons needed for the gameboard.
createGameBoard();

function createGameBoard()
{
    // Programatically add a button with square brackets enclosing an empty space to each cell in the gameboard\
    for (let i = 1; i < 10; i++) {
        let cont = document.querySelector('#c' + i);
        const btn = document.createElement('button');
        cont.appendChild(btn);
    }  

    // Programatically add 'takeCell' as an event listener to all the buttons on the board
    let btns = document.querySelectorAll('button');

    for (let i=0; i<btns.length; i++)
    {
        btns[i].addEventListener('click', takeCell);
        /*
            Assign an event listener to each of the buttons in btns.
            The event to listen for should be 'click'. You will need to pass 
            the event to takeCell. Review the slides for the trick on how to ]
            pass a parameter.
        */
    }
}

// This function will be used to respond to a click event on any of the board buttons.
function takeCell(event)
{
    target = event.target;
    target.innerText = "[" + nextPlayer + "]";
    if (nextPlayer == 'X') {
        nextPlayer = 'O';
    }
    else {
        nextPlayer = 'X';
    }
    /*
        When the button is clicked, the space inside its square brackets is replaced by the value in the nextPlayer before switching it
    */

    // Make sure the button is clickable only once (I didn't mention how to do that, look it up :) )
    target.disabled = true;

    // Check if the game is over
    if (isGameOver())
    {
        let gameOver = document.querySelector('#game-over-lbl');
        gameOver.innerText = "Game Over";
        // let the label with the id 'game-over-lbl' display the words 'Game Over' inside <h1> element
    }

    // I'll leave declaring the winner for your intrinsic motivation, it's not required for this assignment 
}

function isGameOver()
{
    let btns = document.querySelectorAll('button');
    for (let i = 0; i < 9; i++) {
        if (btns[i].disabled == false) {
            return false;
        }
    }
    return true;
    // This function returns true if all the buttons are disabled and false otherwise 
}

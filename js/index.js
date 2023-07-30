//Game constants and variables
let inputDir = { x: 0, y: 0 };
let speed = 2;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }]
let food = { x: 6, y: 7 }
let score = 0;

const foodSound = new Audio('../../music/food.mp3')
const gameOverSound = new Audio('../../music/gameover.mp3')
const moveSound = new Audio('../../music/move.mp3')
const musicSound = new Audio('../../music/music.mp3')

//Game functions 
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If the snake bumps itself
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // If the snake has bumped into wall
    if (snake[0].x <= 0 || snake[0].x >= 18 || snake[0].y <= 0 || snake[0].y >= 18) {
        return true;
    }
    return false;
}

function gameEngine() {
    // Part 1: Updating the snake variable & food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        let inputDir = { x: 0, y: 0 };
        alert("Game over. Press any key to play again");
        snakeArr = [{ x: 13, y: 15 }]
        musicSound.play()
        score = 0;
    }
    // If you have eaten the food, increment the score and regenerate the food

    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play()
        score += 1;
        if (score > highScoreVal) {
            highScoreVal = score;
            localStorage.setItem("highscore", JSON.stringify(highScoreVal));
            highScoreElement = document.getElementById("highScore");
            highScoreElement.innerHTML = "High Score:" + highScoreVal;
        }
        scoreElement = document.getElementById("score");
        scoreElement.innerHTML = "Score:" + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    //Part 2: Display the snake
    let board = document.getElementById('board')
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y
        snakeElement.style.gridColumnStart = e.x
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }

        board.appendChild(snakeElement);
    })

    // Part 3 : Display food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

//Main logic starts here
let highScore = localStorage.getItem("highscore");
let highScoreVal;
if (highScore === null) {
    highScoreVal = 0;
    localStorage.setItem("highscore", JSON.stringify(highScoreVal));
}
else {
    highScoreVal = JSON.parse(highScore);
    highScoreElement = document.getElementById("highScore");
    highScoreElement.innerHTML = "High Score:" + highScore;
}
window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    inputDir = { x: 0, y: 1 } //start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})
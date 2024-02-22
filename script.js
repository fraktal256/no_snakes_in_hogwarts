// Define HTML elements
const BOARD = document.getElementById("game-board");
const INSTRUCTION_TEXT = document.getElementById("instruction-text");
const LOGO = document.getElementById("logo");
const SCORE = document.getElementById("score");
const HIGH_SCORE_TEXT = document.getElementById("highScore");

const GRID_SIZE = 20;
// Define game variables
let snake = [{x:10, y:10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Draw game map, snake, food
function draw()
{
    BOARD.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw snake
function drawSnake()
{
    snake.forEach((segment) => {
        const SNAKE_ELEMENT = createGameElement('div','snake');
        setPosition(SNAKE_ELEMENT, segment);
        BOARD.appendChild(SNAKE_ELEMENT);
    });
}

// Creating snake or food div
function createGameElement(tag, UnitClassName)
{
    const ELEMENT = document.createElement(tag);
    ELEMENT.className = UnitClassName;
    
    return ELEMENT;
}

// Set the position of the snake \ food
function setPosition(element, position)
{
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

 // Drawing food
function drawFood()
{
    if (gameStarted) {
        const FOOD_ELEMENT = createGameElement('div', 'food');
        setPosition(FOOD_ELEMENT, food);
        BOARD.appendChild(FOOD_ELEMENT);
    }
}

function generateFood()
{
    const x = Math.floor(Math.random() * GRID_SIZE) + 1;
    const y = Math.floor(Math.random() * GRID_SIZE) + 1;

    return {x, y};
}

// Movement of the snake
function move()
{
    const HEAD = {...snake[0]};
    switch (direction) {
        case 'up':
            HEAD.y--;
            break;
        case 'down':
            HEAD.y++;
            break;
        case 'right':
            HEAD.x++;
            break;
        case 'left':
            HEAD.x--;
            break;
    }
    snake.unshift(HEAD);

//    snake.pop();
    if (HEAD.x == food.x && HEAD.y == food.y) {
        food = generateFood();
        inreaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}


// test movement
// setInterval(() => {
//     move(); 
//     draw(); //Draw new position
// }, 200);

// Start game function
function startGame() {
    gameStarted = true;
    INSTRUCTION_TEXT.style.display = 'none';
    LOGO.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// KeyPress listener
function handleKeyPress(event) {
    if (
        ( !gameStarted && event.code === "Space") || 
        ( !gameStarted && event.code === ' ')
     ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function inreaseSpeed()
{
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision()
{
    const HEAD = snake[0];

    if (HEAD.x < 1 || HEAD.x > GRID_SIZE || HEAD.y < 1 || HEAD.y > GRID_SIZE) {
        resetGame();
    }

    // collides with itself
    for ( let i = 1; i < snake.length; i++) {
        if (HEAD.x === snake[i].x && HEAD.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame()
{
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() 
{
    const CURRENT_SCORE = snake.length - 1;
    SCORE.textContent = CURRENT_SCORE.toString().padStart(3, '0');
}

function stopGame()
{
    clearInterval(gameInterval);
    gameStarted = false;
    INSTRUCTION_TEXT.style.display = 'block';
    LOGO.style.display = 'block';
}

function updateHighScore()
{
    const LAST_SCORE = snake.length - 1;
    if (LAST_SCORE > highScore) {
        highScore = LAST_SCORE;
        HIGH_SCORE_TEXT.textContent = highScore.toString().padStart(3, '0');
    }
    HIGH_SCORE_TEXT.style.display = 'block';
}
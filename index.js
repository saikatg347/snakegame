const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let speed = 5;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

const gulpSound = new Audio("gulp.mp3");

function drawGame() {
    changeSnakePosition();
    if(isGameOver()) {
        return;
    }

    clearScreen();
    
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    
    speed = score >= 5 ? 6 : speed;
    speed = score >= 10 ? 7 : speed;
    speed = score >= 20 ? 10 : speed;

    setTimeout(drawGame, 1000/speed);
}

function clearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function isGameOver() {
    if(xVelocity === 0 && yVelocity === 0) {
        return false;
    }

    let gameOver = false;
    if(headX < 0 || headX === tileCount || headY < 0 || headY === tileCount) {
        gameOver = true;
    }

    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        ctx.fillStyle = "White";
        ctx.font = "50px Verdana";
        ctx.fillText("Game Over!", canvas.width / 5, canvas.height / 2);
    }
    return gameOver;
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function checkAppleCollision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        gulpSound.play();
    }
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }
    
    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = "18px Verdana";
    ctx.fillText("Score: " + score, canvas.width - 70, 17);
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    switch(event.keyCode) {
        case 38:
            if(yVelocity == 1) return;
            yVelocity = -1;
            xVelocity = 0;
            break;
        case 40: 
            if(yVelocity == -1) return;
            yVelocity = 1;
            xVelocity = 0;
            break;
        case 37:
            if(xVelocity == 1) return;
            yVelocity = 0;
            xVelocity = -1;
            break;
        case 39:
            if(xVelocity == -1) return; 
            yVelocity = 0;
            xVelocity = 1;
            break;
    }
}

drawGame();
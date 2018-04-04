var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// BALL VARIABLES
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

// PADDLE VARIABLES
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

//BRICK VARIABLES
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var color = "#0095DD";

var score;
var lives;

var bricks;


function resetGame() {
  score = 0.0;
  lives = 3.0;
  bricks = [];
  for(c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
  }
}

function keyDownHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if(e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function sendScore(){
  timer.stop();
  time = timer.getClock() / 10000.0;
  totalScore = score*lives/time;
  sendScoreToService(totalScore);
  timer.reset();
  return totalScore;
}

function getGameState(){
  var state = {
    bricks: bricks,
    score: score,
    lives: lives,
    time: timer.getClock()
  };
  return state;
}

function loadGameState(gameState){
  bricks = gameState.bricks;
  score = gameState.score;
  lives = gameState.lives;
  timer.setClock(gameState.time);
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        totalScore = sendScore();
                        alert("Good job! Close this alert to start again. Total score: " + totalScore);
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawRect(x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
    for(c = 0; c < brickColumnCount; c++) {
        for(r = 0; r < brickRowCount; r++) {
          if(bricks[c][r].status == 1) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            drawRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
    }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  drawRect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color;
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function checkBoundaries(){
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  } else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
          totalScore = sendScore();
          alert("GAME OVER! Close this alert to start again. Total score: " + totalScore);
          document.location.reload();
      }
      else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
}

function movePaddle(){
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawBall();
  drawBricks();
  drawPaddle();
  collisionDetection();
  checkBoundaries();
  drawScore();
  drawLives();
  movePaddle();
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

resetGame();
var elem = document.getElementById("stopwatch");
var timer = new Stopwatch(elem);

// start the timer
timer.start();
draw();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

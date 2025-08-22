const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;
let food = { x: 15, y: 15 };
let score = 0;
let bestScore = localStorage.getItem("goldySnakeBest") || 0;
let gameInterval;
let running = false;

// Stars for retro background
let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: Math.random() * 2 + 0.5 });
}

function drawStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, 2, 2);
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
}

function drawSnake() {
  ctx.fillStyle = "lime";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize-2, gridSize-2);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize-2, gridSize-2);
}

function update() {
  drawStars();

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize))
    };
  } else {
    snake.pop();
  }

  // Game over conditions
  if (head.x < 0 || head.y < 0 || head.x >= canvas.width / gridSize || head.y >= canvas.height / gridSize) {
    endGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame();
    }
  }

  drawFood();
  drawSnake();

  ctx.fillStyle = "gold";
  ctx.font = "20px Courier New";
  ctx.fillText("Score: " + score, 20, 30);
  ctx.fillText("Best: " + bestScore, canvas.width - 120, 30);
  ctx.fillText("Created by GoldyPorter", 20, canvas.height - 20);
}

function startGame() {
  document.getElementById("overlay").classList.remove("show");
  running = true;
  snake = [{ x: 10, y: 10 }];
  dx = 1; dy = 0;
  score = 0;
  gameInterval = setInterval(update, 100);
}

function endGame() {
  clearInterval(gameInterval);
  running = false;
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("goldySnakeBest", bestScore);
  }
  document.getElementById("finalScore").innerText = score;
  document.getElementById("bestScore").innerText = bestScore;
  document.getElementById("gameOver").classList.add("show");
}

function restartGame() {
  document.getElementById("gameOver").classList.remove("show");
  startGame();
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -1; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 1; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -1; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = 1; dy = 0; }
});

// Touch swipe for mobile
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});
canvas.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  let dxTouch = t.clientX - touchStartX;
  let dyTouch = t.clientY - touchStartY;
  if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
    if (dxTouch > 0 && dx === 0) { dx = 1; dy = 0; }
    else if (dxTouch < 0 && dx === 0) { dx = -1; dy = 0; }
  } else {
    if (dyTouch > 0 && dy === 0) { dx = 0; dy = 1; }
    else if (dyTouch < 0 && dy === 0) { dx = 0; dy = -1; }
  }
});
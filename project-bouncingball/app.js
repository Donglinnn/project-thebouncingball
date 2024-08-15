const canvas = document.getElementById("playground");
const ctx = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let groundHeight = 5;
let brickArray = [];
let count = 0;

let brick_num = prompt("How many bricks would you want to eliminate?", 10);

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ball_x, ball_y) {
    return (
      ball_x >= this.x - radius &&
      ball_x <= this.x + this.width + radius &&
      ball_y >= this.y - radius &&
      ball_y <= this.y + this.height + radius
    );
  }
}

// Make all bricks
for (let i = 0; i < brick_num; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

function getMousePos(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
canvas.addEventListener("mousemove", (e) => {
  var mousePos = getMousePos(canvas, e);
  ground_x = mousePos.x;
});

function draw() {
  // Check if the ball hits the brick
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      // Touch from y direction
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y)
        ySpeed *= -1;
      // Touch from x direction
      else if (circle_x <= brick.x || circle_x >= brick.x + brick.width)
        xSpeed *= -1;
      // Game Over
      if (count == brick_num) {
        clearInterval(draw);
        alert("Congradurations! The Game Is Over.");
        if (confirm("Would you like to play again?")) {
          location.reload();
        }
      }
    }
  });

  // Check if the circle hits the ground
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    // 施加彈力避免球在橫桿上來回的意外(即反彈後仍在要反彈的範圍內)
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  // Check if the circle reaches the border
  if (circle_x > canvasWidth - radius || circle_x < radius) {
    xSpeed *= -1;
  }
  if (circle_y > canvasHeight - radius || circle_y < radius) {
    ySpeed *= -1;
  }
  // Update the coordinate of circle
  circle_x += xSpeed;
  circle_y += ySpeed;
  // Draw the black background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Draw all bricks
  brickArray.forEach((brick) => {
    if (brick.visible) brick.drawBrick();
  });

  // Draw the ground
  ctx.fillStyle = "#CA7A2C";
  ctx.fillRect(ground_x, ground_y, 200, groundHeight);

  // Draw the ball
  // Parameters of arc: x, y , radius, startAngle, endAngle
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(draw, 25);

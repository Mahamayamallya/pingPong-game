let can = document.getElementById("table");
let draw = can.getContext("2d");

draw.fillStyle = "black";
draw.fillRect(0, 0, can.width, can.height);

//square
draw.fillStyle = "red";
draw.fillRect(100, 100, 30, 30);

//circle
draw.fillStyle = "orange";
draw.beginPath();
draw.arc(200, 200, 10, 0, Math.PI * 2, false);
draw.closePath();
draw.fill();

//ball
const ball = {
  x: can.width / 2,
  y: can.height / 2,
  radius: 10,
  velX: 5,
  velY: 5,
  speed: 5,
  color: "green",
};

//user
const user = {
  x: 0,
  y: (can.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "red",
};

//cpu
const cpu = {
  x: can.width - 10,
  y: (can.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0,
  color: "red",
};

//seperator
const sep = {
  x: (can.width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "orange",
};

function drawRectangle(x, y, w, h, color) {
  draw.fillStyle = color;
  draw.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  draw.fillStyle = color;
  draw.beginPath();
  draw.arc(x, y, r, 0, Math.PI * 2, true);
  draw.closePath();
  draw.fill();
}

function drawScore(text, x, y) {
  draw.fillStyle = "white";
  draw.font = "60px Arial";
  draw.fillText(text, x, y);
}

function drawSeparator() {
  //to create space. + by 20px
  for (let i = 0; i < can.height; i += 20) {
    drawRectangle(sep.x, sep.y + i, sep.width, sep.height, sep.color);
  }
}

function restart() {
  //position changed to center
  ball.x = can.width / 2;
  ball.y = can.height / 2;
  ball.velX = -ball.velX; //change the sides of the player
  ball.speed = 5; //refresh the ballspeed
}

function detect_collision(ball, player) {
  player.top = player.y;
  player.bottom = player.y + player.height;
  player.left = player.x;
  player.right = player.x + player.width;

  //remove radius -move top bottom, left, right
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  return (
    player.left < ball.right &&
    player.top < ball.bottom &&
    player.right > ball.left &&
    player.bottom > ball.top
  );
}

can.addEventListener("mousemove", getMousePos);

function getMousePos(evt) {
  let rect = can.getBoundingClientRect(); //new position of the change
  user.y = evt.clientY - rect.top - user.height / 2;
}

function cpu_movement() {
  if (cpu.y < ball.y) {
    cpu.y += 5;
  } else {
    cpu.y -= 5;
  }
}

function helper() {
  drawRectangle(0, 0, can.width, can.height, "black"); //illusion of movement
  drawScore(user.score, can.width / 4, can.height / 5);
  drawScore(cpu.score, (3 * can.width) / 4, can.height / 5);
  drawSeparator();
  drawRectangle(user.x, user.y, user.width, user.height, user.color);
  drawRectangle(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function updates() {
  if (ball.x - ball.radius < 0) {
    // Ball goes beyond the left edge
    cpu.score++;
    restart();
  } else if (ball.x + ball.radius > can.width) {
    // Ball goes beyond the right edge
    user.score++;
    restart();
  }

  // on the right side
  if (ball.x + ball.radius < 0) {
    restart();
  }

  ball.x += ball.velX;
  ball.y += ball.velY;

  cpu_movement();

  // Reflect off top and bottom edges
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > can.height) {
    ball.velY = -ball.velY;
  }

  // which paddle for collision
  let player = ball.x < can.width / 2 ? user : cpu;

  if (detect_collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angleRad = (Math.PI / 4) * collidePoint;
    let direction = ball.x < can.width / 2 ? 1 : -1; // depends on the player' side
    ball.velX = direction * ball.speed * Math.cos(angleRad);
    ball.velY = ball.speed * Math.sin(angleRad);
    ball.speed += 1;
  }
}

function call_back() {
  updates();
  helper();
}

let fPs = 50;
let looper = setInterval(call_back, 1000 / fPs);

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight - 61; // Quick fix due to the menu taking up 61px from Canvas 

random = (min, max) => num = Math.floor(Math.random() * (max - min + 1)) + min;

function Ball(x, y, velX, velY, color, size) {
  // Constructing the ball
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function () {
  // "Drawing" the ball
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

function Obstacle(x, y, width, height) {
  // Constructing obstacle for balls to bounce off of
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Obstacle.prototype.draw = function () {
  // "Drawing" the obstacles, in this case an image of Rick Astley
  const image = new Image(this.width, this.height);
  image.src = "img/klipptrickard.png";
  ctx.drawImage(image, this.x, this.y, this.width, this.height);
  // Adding a border around the image
  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = "gray";
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.stroke();
}

function playSong() {
  // Song to play as you spawn in obstacles, randomized between 11 different sound bites
  let audio = new Audio('song/rickardsong' + random(1, 11) + '.ogg');
  audio.volume = 0.01;
  audio.play();
}

Ball.prototype.update = function () {

  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}

let balls = [];

while (balls.length < random(1, 5)) { // Creates the actual ball
  let size = random(10, 20);
  let ball = new Ball( 
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(3, 5),
    random(3, 5),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
    size);

  balls.push(ball);
}

let obstacles = [];
let mousex;
let mousey;

canvas.addEventListener("mouseup", (e) => { // Listens for mouse up event in which case spawns an obstacle and plays song
  mousex = e.clientX; // Gets Mouse X-coordinate
  mousey = e.clientY; // Gets Mouse Y-coordinate 
  playSong();
  let obstacle = new Obstacle( // Creates the actual obstacle
    mousex - 25, // Ugly quick fix for placement of obstacle on mouse cursor
    mousey - 111, // Ugly quick fix for placement of obstacle on mouse cursor
    50,
    100);
  obstacles.push(obstacle);
});

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  document.querySelector("#ptag").innerText = "Active balls: " + balls.length; // Displays active balls

  for (let i = 0; i < balls.length; i++) { // Spawns balls
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  for (let i = 0; i < obstacles.length; i++) { // Spawns obstacle
    obstacles[i].draw();
  }

  if (obstacles.length == 0) { // Text on the canvas letting the user know they can add an obstacle
    ctx.font = "30px Arial";
    ctx.fillStyle = "rgb(150, 9, 9)";
    ctx.fillText("Press anywhere to add an obstacle", canvas.width / 2, canvas.height / 2);
    ctx.textAlign = "center";
  }

  requestAnimationFrame(loop);
}

Ball.prototype.collisionDetect = function () {
  for (var i = 0; i < obstacles.length; i++) {
    var b = obstacles[i];
    if (
      (this.x + this.size) > b.x && 
      (this.x - this.size) < b.x + b.width &&
      (this.y + this.size) > b.y && 
      (this.y - this.size) < b.y + b.height) { // If we hit anything at all, check where     

      // Ball hits obstacle from the left
      if (
        (this.x + this.size) > b.x &&
        (this.x + this.size) < b.x + 10 &&
        this.velX > 0) {
        this.velX = -this.velX;
        this.x -= 3;

      }
      
      // Ball hits obstacle from the right
      if (
        (this.x - this.size) < (b.x + b.height) &&
        (this.x - this.size) > (b.x + b.width - 10) &&
        this.velX < 0) {
        this.velX = -this.velX;
        this.x += 3;

      }

      // Ball hits obstacle from below
      if (
        (this.y + this.size) > b.y + b.height &&
        this.velY < 0) {
        this.velY = -this.velY;
        this.y += 3;
      }

      // Ball hits obstacle from above
      if ((this.y - this.size) < b.y &&
        this.velY > 0) {
        this.velY = -this.velY;
        this.y -= 3;
      }
    }
  }
}

function remove(largest) { // Either removes all balls, or just one, depending on user input
  balls.splice(0, largest);
}

function removeObstacles() { // Removes all obstacles on user input
  obstacles.splice(0, obstacles.length);
}

function add(largest) { // Spawns either 1 or 5 balls depending on user input
  for (let i = 0; i < largest; i++) {
    let size = random(10, 20);
    let ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(3, 5),
      random(3, 5),
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
      size);
    balls.push(ball);
  }
}

loop();
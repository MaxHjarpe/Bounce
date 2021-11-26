const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight - 61;

random = (min, max) => num = Math.floor(Math.random() * (max - min + 1)) + min;

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

function Obstacle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Obstacle.prototype.draw = function () {
  const image = new Image(this.width, this.height);
  image.src = "img/klipptrickard.png";
  ctx.drawImage(image, this.x, this.y, this.width, this.height);
  
  ctx.beginPath();
  ctx.lineWidth = "3";
  ctx.strokeStyle = "gray";
  ctx.rect(this.x, this.y, this.width, this.height);
  ctx.stroke();
}

function playSong() {
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
let obstacles = [];

let mousex;
let mousey;

while (balls.length < random(1, 5)) {
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

canvas.addEventListener("mouseup", (e) => {
  mousex = e.clientX; // Gets Mouse X
  mousey = e.clientY; // Gets Mouse Y 
  playSong();
  let obstacle = new Obstacle(
    mousex - 25, // ugly, quick fix for placement of obstacle
    mousey - 111, // ugly, quick fix for placement of obstacle
    50,
    100);
  obstacles.push(obstacle);
});
for (let i = 0; i < obstacles.length; i++) {
  obstacles[i].draw();
}

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  document.querySelector("#ptag").innerText = "Active balls: " + balls.length;

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].draw();
  }

  if (obstacles.length == 0) {
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
      (this.x + this.size) > b.x && //Träff vänster?
      (this.x - this.size) < b.x + b.width &&//Träff höger?
      (this.y + this.size) > b.y && //Träff under?
      (this.y - this.size) < b.y + b.height) { //Träff över?      

      //Boll träffar från vänster

      if (
        (this.x + this.size) > b.x &&
        (this.x + this.size) < b.x + 10 &&
        this.velX > 0) {

        this.velX = -this.velX;
        this.x -= 3;

      }
      //Boll träffar från höger
      if (
        (this.x - this.size) < (b.x + b.height) &&
        (this.x - this.size) > (b.x + b.width - 10) &&
        this.velX < 0) {

        this.velX = -this.velX;
        this.x += 3;

      }

      //Boll träffar underifrån
      if (
        (this.y + this.size) > b.y + b.height &&
        this.velY < 0) {
        this.velY = -this.velY;
        this.y += 3;

      }
      //Boll träffar ovanifrån
      if ((this.y - this.size) < b.y &&
        this.velY > 0) {
        this.velY = -this.velY;
        this.y -= 3;

      }
    }
  }
}

function remove(largest) {
  balls.splice(0, largest);
}

function removeObstacles() {
  obstacles.splice(0, obstacles.length);
}

function add(largest) {
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
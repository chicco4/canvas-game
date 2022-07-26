/* UTILITY FUNCTIONS */
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

/* MAIN STUFF */

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

// Objects
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//implementation
let player;
let projectiles;
let enemies;

function init() {
  player = new Player(canvas.width / 2, canvas.height / 2, 20, "white");
  projectiles = [];
  enemies = [];
}

//shoot projectiles
addEventListener("click", function (event) {
  let angle = Math.atan2(
    event.clientY - canvas.height / 2,
    event.clientX - canvas.width / 2
  );
  let power = 5;
  let velocity = {
    x: Math.cos(angle) * power,
    y: Math.sin(angle) * power,
  };
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 3, "white", velocity)
  );
});

function spawnEnemies() {
  setInterval(() => {
    let radius = Math.random() * (30 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    let angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
    let power = 1.2;
    let velocity = {
      x: Math.cos(angle) * power,
      y: Math.sin(angle) * power,
    };
    let color = `hsl(${Math.random() * 360},50%,50%)`;
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

// Animation Loop
let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  projectiles.forEach((projectile, i) => {
    projectile.update();

    //remove from edges of the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, i) => {
    enemy.update();
    let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      console.log("enemy win");
      cancelAnimationFrame(animationId);
    }

    projectiles.forEach((projectile, j) => {
      let dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      //object touch
      if (dist - enemy.radius - projectile.radius < 1) {
        //rallento di un frame per evitare che provi
        setTimeout(() => {
          enemies.splice(i, 1);
          projectiles.splice(j, 1);
        }, 0);
      }
    });
  });
}

init();
animate();
spawnEnemies();

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 500;
  const gridSize = 50;

  const pathCoordinates = [
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [5, 5],
    [5, 6],
    [5, 7],
    [6, 7],
    [7, 7],
    [8, 7],
    [8, 6],
    [8, 5],
    [8, 4],
    [9, 4],
    [10, 4],
    [11, 4],
    [12, 4],
    [13, 4],
    [14, 4],
    [15, 4],
  ];

  let enemies = [];
  let towers = [];
  let projectiles = [];
  let frame = 0;
  let money = 200;
  let lives = 10;

  const path = pathCoordinates.map(([col, row]) => ({
    x: col * gridSize + gridSize / 2,
    y: row * gridSize + gridSize / 2,
  }));

  class Enemy {
    constructor() {
      this.currentPoint = 0;
      this.x = path[0].x;
      this.y = path[0].y;
      this.size = gridSize * 0.8;
      this.speed = 1.5;
      this.health = 3;
    }
    move() {
      if (this.currentPoint < path.length - 1) {
        let nextPoint = path[this.currentPoint + 1];
        let dx = nextPoint.x - this.x;
        let dy = nextPoint.y - this.y;
        let distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
          this.currentPoint++;
        } else {
          this.x += (dx / distance) * this.speed;
          this.y += (dy / distance) * this.speed;
        }
      } else {
        lives--;
        enemies.splice(enemies.indexOf(this), 1);
      }
    }
    draw() {
      ctx.fillStyle = "darkgreen";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
  }

  class Tower {
    constructor(x, y) {
      this.x = x + gridSize / 2;
      this.y = y + gridSize / 2;
      this.size = gridSize * 0.5;
      this.range = 120;
      this.fireRate = 50;
      this.lastShot = 0;
    }
    draw() {
      ctx.fillStyle = "blue";
      ctx.fillRect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
    }
    shoot() {
      if (frame - this.lastShot > this.fireRate) {
        let target = enemies.find(
          (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
        );
        if (target) {
          projectiles.push(new Projectile(this.x, this.y, target));
          this.lastShot = frame;
        }
      }
    }
  }

  class Projectile {
    constructor(x, y, target) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.speed = 6;
    }
    move() {
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.hypot(dx, dy);

      if (distance < this.speed + this.target.size / 2) {
        projectiles.splice(projectiles.indexOf(this), 1);
        this.target.health--;
        if (this.target.health <= 0) {
          enemies.splice(enemies.indexOf(this.target), 1);
          money += 10;
        }
      } else {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
    }
    draw() {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (frame % 100 === 0) {
      enemies.push(new Enemy());
    }
    enemies.forEach((enemy) => {
      enemy.move();
      enemy.draw();
    });
    towers.forEach((tower) => {
      tower.draw();
      tower.shoot();
    });
    projectiles.forEach((projectile) => {
      projectile.move();
      projectile.draw();
    });
    frame++;
    requestAnimationFrame(gameLoop);
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;
    const isPath = pathCoordinates.some(
      ([px, py]) => px * gridSize === x && py * gridSize === y
    );
    if (!isPath && money >= 50) {
      towers.push(new Tower(x, y));
      money -= 50;
    }
  });

  gameLoop();
});

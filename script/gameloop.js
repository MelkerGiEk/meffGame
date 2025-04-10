document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 500;
  const gridSize = 50;
  const moneyCounter = document.querySelector(".money-counter"); // Select the money counter
  const livesCounter = document.querySelector(".lives-counter"); // Select the lives counter

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

  const grid = document.querySelector(".grid");

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Kolla om denna cell är en del av pathen
      if (pathCoordinates.some(([px, py]) => px === col && py === row)) {
        cell.classList.add("path");
      }

      grid.appendChild(cell);
    }
  }

  let enemies = [];
  let towers = [];
  let projectiles = [];
  let frame = 0;
  let money = 150;
  let lives = 20;

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
      this.speed = 2;
      this.health = 3;
      this.isDead = false;
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
        updateLivesCounter();
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
      this.range = 200;
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
      if (this.target.isDead) {
        // Om målet redan dödats av annan projektil
        projectiles.splice(projectiles.indexOf(this), 1);
        return;
      }

      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.hypot(dx, dy);

      if (distance < this.speed + this.target.size / 2) {
        projectiles.splice(projectiles.indexOf(this), 1);
        this.target.health--;
        if (this.target.health <= 0) {
          this.target.isDead = true;
          enemies.splice(enemies.indexOf(this.target), 1);
          money += 10;
          updateMoneyCounter();
        }
      } else {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
    }

    draw() {
      ctx.fillStyle = "darkblue";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (frame % 100 === 0 || frame % 125 === 0) {
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

  function updateMoneyCounter() {
    moneyCounter.textContent = `Money: $${money}`;
  }
  function updateLivesCounter() {
    livesCounter.textContent = `Lives: ${lives}`;
  }

  // Update money counter initially
  updateMoneyCounter();
  // Update lives counter initially
  updateLivesCounter();

  //Tar hand om torn när man klickar(placerar torn. Detta ska vi fixa senare.)
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
      updateMoneyCounter(); // Update the money counter
    }
  });

  gameLoop();
});

// projektil som percar!

// class Projectile_wizard {
//   constructor(x, y, target) {
//     this.x = x;
//     this.y = y;
//     this.target = target;
//     this.speed = 6;
//     this.dx = 0;
//     this.dy = 0;
//     this.active = true;

//     // Räkna ut riktningen direkt vid skapande
//     let diffX = target.x - x;
//     let diffY = target.y - y;
//     let dist = Math.hypot(diffX, diffY);
//     this.dx = (diffX / dist) * this.speed;
//     this.dy = (diffY / dist) * this.speed;
//   }

//   move() {
//     if (!this.active) return;

//     // Kolla träff om målet fortfarande lever
//     if (this.target && !this.target.isDead) {
//       let distance = Math.hypot(this.target.x - this.x, this.target.y - this.y);
//       if (distance < this.speed + this.target.size / 2) {
//         this.target.health--;
//         if (this.target.health <= 0) {
//           this.target.isDead = true;
//           enemies.splice(enemies.indexOf(this.target), 1);
//           money += 10;
//         }
//         this.target = null; // Ta bort målet, men fortsätt flyga
//       }
//     }

//     // Fortsätt flyga i samma riktning
//     this.x += this.dx;
//     this.y += this.dy;

//     // Ta bort projektil om den är utanför canvas
//     if (
//       this.x < 0 || this.x > canvas.width ||
//       this.y < 0 || this.y > canvas.height
//     ) {
//       projectiles.splice(projectiles.indexOf(this), 1);
//     }
//   }

//   draw() {
//     ctx.fillStyle = "black";
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
//     ctx.fill();
//   }
// }

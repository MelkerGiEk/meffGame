// const gridSize = 50;

// document.addEventListener("DOMContentLoaded", () => {
//   const canvas = document.getElementById("gameCanvas");
//   const ctx = canvas.getContext("2d");
//   canvas.width = 800;
//   canvas.height = 500;

//   const grid = document.querySelector(".grid");

//   const pathCoordinates = [
//     [0, 4],
//     [1, 4],
//     [2, 4],
//     [3, 4],
//     [4, 4],
//     [5, 4],
//     [5, 5],
//     [5, 6],
//     [5, 7],
//     [6, 7],
//     [7, 7],
//     [8, 7],
//     [8, 6],
//     [8, 5],
//     [8, 4],
//     [9, 4],
//     [10, 4],
//     [11, 4],
//     [12, 4],
//     [13, 4],
//     [14, 4],
//     [15, 4],
//   ];

//   for (let row = 0; row < 10; row++) {
//     for (let col = 0; col < 16; col++) {
//       let cell = document.createElement("div");
//       cell.classList.add("cell");

//       if (pathCoordinates.some((p) => p[0] === col && p[1] === row)) {
//         cell.classList.add("path");
//       }

//       grid.appendChild(cell);
//     }
//   }

//   const enemies = [];
//   const towers = [];
//   const projectiles = [];
//   let frame = 0;
//   let money = 100;
//   let lives = 10;

//   // Fiendens väg
//   const path = pathCoordinates.map((coord) => ({
//     x: coord[0] * gridSize,
//     y: coord[1] * gridSize,
//   }));

//   class Enemy {
//     constructor() {
//       this.currentPoint = 0;
//       this.x = path[0].x;
//       this.y = path[0].y;
//       this.width = gridSize;
//       this.height = gridSize;
//       this.speed = 1;
//       this.health = 3;
//     }
//     move() {
//       if (this.currentPoint < path.length - 1) {
//         let nextPoint = path[this.currentPoint + 1];
//         let dx = nextPoint.x - this.x;
//         let dy = nextPoint.y - this.y;
//         let distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance < this.speed) {
//           this.currentPoint++;
//         } else {
//           this.x += (dx / distance) * this.speed;
//           this.y += (dy / distance) * this.speed;
//         }
//       } else {
//         lives--;
//         enemies.splice(enemies.indexOf(this), 1);
//       }
//     }
//     draw() {
//       ctx.fillStyle = "red";
//       ctx.fillRect(this.x, this.y, this.width, this.height);
//     }
//   }

//   class Tower {
//     constructor(x, y) {
//       this.x = x;
//       this.y = y;
//       this.range = 100;
//       this.fireRate = 50;
//       this.lastShot = 0;
//     }
//     draw() {
//       ctx.fillStyle = "blue";
//       ctx.fillRect(this.x, this.y, gridSize, gridSize);
//     }
//     shoot() {
//       if (frame - this.lastShot > this.fireRate) {
//         let target = enemies.find(
//           (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
//         );
//         if (target) {
//           projectiles.push(
//             new Projectile(this.x + gridSize / 2, this.y + gridSize / 2, target)
//           );
//           this.lastShot = frame;
//         }
//       }
//     }
//   }

//   class Projectile {
//     constructor(x, y, target) {
//       this.x = x;
//       this.y = y;
//       this.target = target;
//       this.speed = 5;
//     }
//     move() {
//       let dx = this.target.x - this.x;
//       let dy = this.target.y - this.y;
//       let distance = Math.sqrt(dx * dx + dy * dy);

//       if (distance < this.speed) {
//         projectiles.splice(projectiles.indexOf(this), 1);
//         this.target.health--;
//         if (this.target.health <= 0) {
//           enemies.splice(enemies.indexOf(this.target), 1);
//           money += 10;
//         }
//       } else {
//         this.x += (dx / distance) * this.speed;
//         this.y += (dy / distance) * this.speed;
//       }
//     }
//     draw() {
//       ctx.fillStyle = "black";
//       ctx.beginPath();
//       ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
//       ctx.fill();
//     }
//   }

//   function gameLoop() {
//     console.log("Game loop running...");
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     if (frame % 100 === 0) {
//       enemies.push(new Enemy());
//     }

//     enemies.forEach((enemy) => {
//       enemy.move();
//       enemy.draw();
//     });

//     towers.forEach((tower) => {
//       tower.draw();
//       tower.shoot();
//     });

//     projectiles.forEach((projectile) => {
//       projectile.move();
//       projectile.draw();
//     });

//     frame++;
//     requestAnimationFrame(gameLoop);
//   }

//   canvas.addEventListener("click", (event) => {
//     const x = Math.floor(event.clientX / gridSize) * gridSize;
//     const y = Math.floor(event.clientY / gridSize) * gridSize;
//     if (money >= 50) {
//       towers.push(new Tower(x, y));
//       money -= 50;
//     }
//   });

//   gameLoop();
// });

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 500;
  const gridSize = 50;
  const grid = document.querySelector(".grid");

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

  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");

      if (pathCoordinates.some((p) => p[0] === col && p[1] === row)) {
        cell.classList.add("path");
      }

      grid.appendChild(cell);
    }
  }

  let enemies = [];
  let towers = [];
  let projectiles = [];
  let frame = 0;
  let money = 200;
  let lives = 10;

  const path = pathCoordinates.map((coord) => ({
    x: coord[0] * gridSize,
    y: coord[1] * gridSize,
  }));

  class Enemy {
    constructor() {
      this.currentPoint = 0;
      this.x = path[0].x;
      this.y = path[0].y;
      this.width = gridSize;
      this.height = gridSize;
      this.speed = 1;
      this.health = 3;
    }
    move() {
      if (this.currentPoint < path.length - 1) {
        let nextPoint = path[this.currentPoint + 1];
        let dx = nextPoint.x - this.x;
        let dy = nextPoint.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

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
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Tower {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.range = 100;
      this.fireRate = 50;
      this.lastShot = 0;
    }
    draw() {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, gridSize, gridSize);
    }
    shoot() {
      if (frame - this.lastShot > this.fireRate) {
        let target = enemies.find(
          (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
        );
        if (target) {
          projectiles.push(
            new Projectile(this.x + gridSize / 2, this.y + gridSize / 2, target)
          );
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
      this.speed = 5;
    }
    move() {
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.speed) {
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
    const x = Math.floor((event.clientX - rect.left) / gridSize);
    const y = Math.floor((event.clientY - rect.top) / gridSize);

    // Kontrollera om koordinaten är på pathen
    const isPath = pathCoordinates.some((p) => p[0] === x && p[1] === y);

    if (!isPath && money >= 50) {
      // Placera torn endast om det inte är en path
      const tower1 = new Tower(x * gridSize, y * gridSize);
      gameLoop();
      money -= 50;
    }
  });
  gameLoop();
});

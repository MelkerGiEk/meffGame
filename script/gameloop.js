import {
  Enemy,
  slowEnemy,
  Projectile,
  PiercingProjectile,
  Tower,
  ArcherTower,
  WizardTower,
  KnightTower,
} from "./classes.js";
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  // @type {canvasRenderingContext2D}
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 500;
  const gridSize = 50;
  const moneyCounter = document.querySelector(".money-counter"); // Select the money counter
  const livesCounter = document.querySelector(".lives-counter"); // Select the lives counter

  const cursor = document.getElementById("custom-cursor");
  cursor.style.width = `150px`;
  cursor.style.height = `150px`;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX + 5}px`;
    cursor.style.top = `${e.clientY + 5}px`;
  });

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
  let lives = 10;
  let gameSpeed = 1; // Default game speed
  let selectedTowerType = "none"; // Exempel: ändra detta baserat på användarens val

  const path = pathCoordinates.map(([col, row]) => ({
    x: col * gridSize + gridSize / 2,
    y: row * gridSize + gridSize / 2,
  }));

  // class Enemy {
  //   constructor() {
  //     this.currentPoint = 0;
  //     this.x = path[0].x;
  //     this.y = path[0].y;
  //     this.size = gridSize * 0.75;
  //     this.speed = 2 * gameSpeed; // Hastighet för fienden som skapas
  //     this.health = 3;
  //     this.isDead = false;
  //   }

  //   move() {
  //     if (this.currentPoint < path.length - 1) {
  //       let nextPoint = path[this.currentPoint + 1];
  //       let dx = nextPoint.x - this.x;
  //       let dy = nextPoint.y - this.y;
  //       let distance = Math.hypot(dx, dy);

  //       if (distance < this.speed) {
  //         this.currentPoint++;
  //       } else {
  //         this.x += (dx / distance) * this.speed;
  //         this.y += (dy / distance) * this.speed;
  //       }
  //     } else {
  //       lives -= 1;
  //       money += 10;
  //       enemies.splice(enemies.indexOf(this), 1);
  //       updateMoneyCounter();
  //       updateLivesCounter();
  //     }
  //   }

  //   draw() {
  //     ctx.fillStyle = "green";
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }
  // }

  // class slowEnemy extends Enemy {
  //   constructor() {
  //     super(); // Anropa basklassens konstruktor
  //     this.size = gridSize * 0.85; // Ändra storleken för den lilla fienden
  //     this.speed = 1.2 * gameSpeed; // Snabbare hastighet för den lilla fienden
  //     this.health = 8; // Lägre hälsa för den lilla fienden
  //   }
  //   move() {
  //     if (this.currentPoint < path.length - 1) {
  //       let nextPoint = path[this.currentPoint + 1];
  //       let dx = nextPoint.x - this.x;
  //       let dy = nextPoint.y - this.y;
  //       let distance = Math.hypot(dx, dy);

  //       if (distance < this.speed) {
  //         this.currentPoint++;
  //       } else {
  //         this.x += (dx / distance) * this.speed;
  //         this.y += (dy / distance) * this.speed;
  //       }
  //     } else {
  //       lives -= 3;
  //       money += 10;
  //       enemies.splice(enemies.indexOf(this), 1);
  //       updateMoneyCounter();
  //       updateLivesCounter();
  //     }
  //   }

  //   draw() {
  //     ctx.fillStyle = "darkgreen"; // Ändra färgen för den lilla fienden
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }
  // }

  // class Projectile {
  //   constructor(x, y, target) {
  //     this.x = x;
  //     this.y = y;
  //     this.target = target;
  //     this.speed = 6 * gameSpeed;
  //   }

  //   move() {
  //     if (this.target.isDead) {
  //       // Om målet redan dödats av annan projektil
  //       projectiles.splice(projectiles.indexOf(this), 1);
  //       return;
  //     }

  //     let dx = this.target.x - this.x;
  //     let dy = this.target.y - this.y;
  //     let distance = Math.hypot(dx, dy);

  //     if (distance < this.speed + this.target.size / 2) {
  //       projectiles.splice(projectiles.indexOf(this), 1);
  //       this.target.health--;
  //       if (this.target.health <= 0) {
  //         this.target.isDead = true;
  //         enemies.splice(enemies.indexOf(this.target), 1);
  //         money += 10;
  //         updateMoneyCounter();
  //       }
  //     } else {
  //       this.x += (dx / distance) * this.speed;
  //       this.y += (dy / distance) * this.speed;
  //     }
  //   }

  //   draw() {
  //     ctx.fillStyle = "darkgrey";
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
  //     ctx.fill();
  //   }
  // }

  // // Projektilklass
  // class PiercingProjectile extends Projectile {
  //   constructor(x, y, target) {
  //     super(x, y, target);
  //     this.x = x;
  //     this.y = y;
  //     this.target = target;
  //     this.speed = 5 * gameSpeed; // Hastighet för projektilen
  //   }
  //   move() {
  //     if (this.target.isDead) {
  //       projectiles.splice(projectiles.indexOf(this), 1);
  //       return;
  //     }

  //     let dx = this.target.x - this.x;
  //     let dy = this.target.y - this.y;
  //     let distance = Math.sqrt(dx * dx + dy * dy);

  //     if (distance < this.speed + this.target.size / 2) {
  //       let index = projectiles.indexOf(this);
  //       projectiles.splice(index, 1);
  //       this.target.health--;
  //       if (this.target.health <= 0) {
  //         this.target.isDead = true;
  //         enemies.splice(enemies.indexOf(this.target), 1);
  //         money += 10;
  //         updateMoneyCounter();
  //       }
  //     } else {
  //       this.x += (dx / distance) * this.speed;
  //       this.y += (dy / distance) * this.speed;
  //     }
  //   }
  //   draw() {
  //     ctx.fillStyle = "red";
  //     ctx.beginPath();
  //     ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
  //     ctx.fill();
  //   }
  // }

  // class Tower {
  //   constructor(x, y) {
  //     this.x = x + gridSize / 2;
  //     this.y = y + gridSize / 2;
  //     this.size = gridSize * 0.5;
  //     this.range = 200;
  //     this.fireRate = 50 / gameSpeed;
  //     this.lastShot = 0;
  //   }
  //   draw() {
  //     ctx.fillStyle = "blue";
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }
  //   shoot() {
  //     if (frame - this.lastShot > this.fireRate) {
  //       let target = enemies.find(
  //         (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
  //       );
  //       if (target) {
  //         projectiles.push(new Projectile(this.x, this.y, target));
  //         this.lastShot = frame;
  //       }
  //     }
  //   }
  // }

  // class ArcherTower extends Tower {
  //   static cost = 50;
  //   constructor(x, y) {
  //     super(x, y); // Anropa basklassens konstruktor
  //     this.range = 200;
  //     this.fireRate = 30 / gameSpeed; // Snabbare skott
  //     this.color = "red"; // Specifik färg för Archer Tower
  //     this.name = "Archer Tower"; // Namn på tornet
  //   }

  //   draw() {
  //     ctx.fillStyle = this.color;
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }

  //   shoot() {
  //     if (frame - this.lastShot > this.fireRate) {
  //       let target = enemies.find(
  //         (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
  //       );
  //       if (target) {
  //         projectiles.push(new Projectile(this.x, this.y, target));
  //         this.lastShot = frame;
  //       }
  //     }
  //   }
  // }

  // class WizardTower extends Tower {
  //   static cost = 100;
  //   constructor(x, y) {
  //     super(x, y); // Anropa basklassens konstruktor
  //     this.range = 120;
  //     this.fireRate = 18 / gameSpeed; // Långsammare skott
  //     this.color = "purple"; // Specifik färg för Wizard Tower
  //     this.name = "Wizard Tower"; // Namn på tornet
  //   }

  //   draw() {
  //     ctx.fillStyle = this.color;
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }

  //   shoot() {
  //     if (frame - this.lastShot > this.fireRate) {
  //       let target = enemies.find(
  //         (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
  //       );
  //       if (target) {
  //         projectiles.push(new PiercingProjectile(this.x, this.y, target));
  //         this.lastShot = frame;
  //       }
  //     }
  //   }
  // }

  // class KnightTower extends Tower {
  //   static cost = 75;
  //   constructor(x, y) {
  //     super(x, y);
  //     this.range = 100;
  //     this.fireRate = 10 / gameSpeed;
  //     this.color = "black";
  //     this.name = "Knight Tower";
  //   }

  //   draw() {
  //     ctx.fillStyle = this.color;
  //     ctx.fillRect(
  //       this.x - this.size / 2,
  //       this.y - this.size / 2,
  //       this.size,
  //       this.size
  //     );
  //   }

  //   shoot() {
  //     if (frame - this.lastShot > this.fireRate) {
  //       let target = enemies.find(
  //         (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
  //       );
  //       if (target) {
  //         projectiles.push(new Projectile(this.x, this.y, target));
  //         this.lastShot = frame;
  //       }
  //     }
  //   }
  // }

  let isGameRunning = false; // Flagga för att kontrollera spelets status
  // Starta spelet när sidan laddas

  let enemySpawnTimer = 100; // Tid mellan spawn i frames
  let enemySpawnInterval = 100; // Standard spawn-intervall

  let slowEnemySpawnTimer = 100; // Tid mellan spawn i frames
  let slowEnemySpawnInterval = 100; // Standard spawn-intervall

  function gameLoop() {
    // Stoppar spelloppen vid lives <= 0
    if (!isGameRunning) return;
    if (lives <= 0) {
      console.log("Game Over! You lost all your lives.");
      isGameRunning = false;
      alert("Game Over! You lost all your lives.");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hantera fiendespawn
    enemySpawnTimer -= gameSpeed; // Minska spawn-tiden baserat på gameSpeed
    if (enemySpawnTimer <= 0) {
      enemies.push(
        new Enemy(
          path,
          gridSize,
          gameSpeed,
          updateMoneyCounter,
          updateLivesCounter,
          enemies
        )
      ); // Skapa en ny fiende
      enemySpawnTimer = enemySpawnInterval; // Återställ spawn-timern
    }

    slowEnemySpawnTimer -= gameSpeed; // Minska spawn-tiden baserat på gameSpeed
    if ((slowEnemySpawnTimer = 100 && frame % 300 === 0)) {
      enemies.push(
        new slowEnemy(
          path,
          gridSize,
          gameSpeed,
          updateMoneyCounter,
          updateLivesCounter,
          enemies
        )
      );
      slowEnemySpawnTimer = slowEnemySpawnInterval;
    }

    enemies.forEach((enemy) => {
      enemy.move();
      enemy.draw(ctx);
    });

    towers.forEach((tower) => {
      tower.draw(ctx);
      tower.shoot(frame);
    });

    projectiles.forEach((projectile) => {
      projectile.move(money);
      projectile.draw(ctx);
    });

    frame++;
    requestAnimationFrame(gameLoop);
  }

  function updateMoneyCounter(amount) {
    if (amount < 0) {
      money = -amount; // Subtrahera pengar om beloppet är negativt
      if (money < 0) {
        money = 0; // Se till att pengar inte blir negativa
      }
    } else if (amount > 0) {
      money += amount; // Lägg till pengar om beloppet är positivt
      if (money < 0) {
        money = 0; // Se till att pengar inte blir negativa
      }
    }
    moneyCounter.textContent = `Money: $${money}`;
  }
  function updateLivesCounter(amount) {
    if (isNaN(amount) === false) {
      lives = lives - amount;
    } // Subtrahera liv om beloppet är negativt
    if (lives <= 0) {
      lives = 0;
    }
    livesCounter.textContent = `Lives: ${lives}`;
  }

  // Update money counter on page load
  updateMoneyCounter();
  // Update lives counter on page load
  updateLivesCounter();

  //Tar hand om torn när man klickar(placerar torn. Detta ska vi fixa senare.)
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;
    const isPath = pathCoordinates.some(
      ([px, py]) => px * gridSize === x && py * gridSize === y
    );
    if (!isPath) {
      // Välj torn baserat på användarens val
      if (selectedTowerType === "Archer Tower" && money >= ArcherTower.cost) {
        towers.push(
          new ArcherTower(
            x,
            y,
            gridSize,
            gameSpeed,
            enemies,
            projectiles,
            updateMoneyCounter
          )
        );
        money -= ArcherTower.cost;
        updateMoneyCounter(); // Update the money counter
      } else if (
        selectedTowerType === "Wizard Tower" &&
        money >= WizardTower.cost
      ) {
        towers.push(
          new WizardTower(
            x,
            y,
            gridSize,
            gameSpeed,
            enemies,
            projectiles,
            updateMoneyCounter
          )
        );
        money -= WizardTower.cost;
        updateMoneyCounter(); // Update the money counter
      } else if (
        selectedTowerType === "Knight Tower" &&
        money >= KnightTower.cost
      ) {
        towers.push(
          new KnightTower(
            x,
            y,
            gridSize,
            gameSpeed,
            enemies,
            projectiles,
            updateMoneyCounter
          )
        );
        money -= KnightTower.cost;
        updateMoneyCounter(); // Update the money counter
      }
    }
  });

  function headMenu() {
    const startButton = document.getElementById("start-button");
    const speedButton = document.getElementById("speed-button");
    const archerButton = document.getElementById("archer-button");
    const wizardButton = document.getElementById("wizard-button");
    const knightButton = document.getElementById("knight-button");
    console.log("Wizard Button:", wizardButton);
    console.log("Archer Button:", archerButton);
    console.log("Knight Button:", knightButton);

    startButton.addEventListener("click", () => {
      if (isGameRunning === false) {
        isGameRunning = true; // Starta spelet
        gameLoop();
        startButton.textContent = "Pause"; // Ändra texten på knappen
      } else if (isGameRunning === true) {
        isGameRunning = false; // Stoppa spelet
        startButton.textContent = "Start"; // Ändra texten på knappen
      }
    });

    speedButton.addEventListener("click", () => {
      if (isGameRunning === true) {
        if (gameSpeed === 1) {
          gameSpeed = 2; // Öka hastigheten
          speedButton.textContent = "Speed: 2x";
          // Öka hastigheten för fienderna som redan finns
          enemies.forEach((enemy) => {
            enemy.speed = enemy.speed * 2;
          });
          towers.forEach((tower) => {
            tower.fireRate = tower.fireRate / 2; // Justera tornens skottfrekvens
          });
          return gameSpeed;
        } else if (gameSpeed === 2) {
          gameSpeed = 1; // Återställ hastigheten
          speedButton.textContent = "Speed: 1x";
          enemies.forEach((enemy) => {
            enemy.speed = enemy.speed / 2;
          });
          towers.forEach((tower) => {
            tower.fireRate = tower.fireRate * 2; // Justera tornens skottfrekvens
          });
          return gameSpeed;
        }
      } else if (isGameRunning === false) {
        gameSpeed = 1; // Återställ hastigheten
        return frame;
      }
    });
    if (!archerButton) {
      console.error("Archer button not found!");
    } else {
      archerButton.addEventListener("click", () => {
        if (isGameRunning === true) {
          console.log("Archer Tower selected");
          selectedTowerType = "Archer Tower";
        }
      });
      if (!wizardButton) {
        console.error("Wizard button not found!");
      } else {
        wizardButton.addEventListener("click", () => {
          if (isGameRunning === true) {
            console.log("Wizard Tower selected");
            selectedTowerType = "Wizard Tower";
          }
        });
        if (!knightButton) {
          console.error("Knight button not found!");
        } else {
          knightButton.addEventListener("click", () => {
            if (isGameRunning === true) {
              console.log("Knight Tower selected");
              selectedTowerType = "Knight Tower";
            }
          });
        }
      }
    }
  }
  headMenu(); // Starta menyn när sidan laddas
});

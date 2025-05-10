import {
  Enemy,
  slowEnemy,
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
    cursor.style.top = `${e.clientY + 6}px`;
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
  let killCount = { value: 0 };
  let gameSpeed = 1; // Default game speed
  let selectedTowerType = "none"; // Exempel: ändra detta baserat på användarens val

  const path = pathCoordinates.map(([col, row]) => ({
    x: col * gridSize + gridSize / 2,
    y: row * gridSize + gridSize / 2,
  }));

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
          updateLivesCounter,
          updateMoneyCounter,
          enemies,
          killCount
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
          updateLivesCounter,
          updateMoneyCounter,
          enemies,
          killCount
        )
      );
      slowEnemySpawnTimer = slowEnemySpawnInterval;
    }

    enemies.forEach((enemy) => {
      enemy.move();
      enemy.draw(ctx);
      enemy.isAtEnd();
      enemy.checkIfDead();
    });

    towers.forEach((tower) => {
      tower.draw(ctx);
      tower.shoot(frame);
    });

    projectiles.forEach((projectile) => {
      projectile.move();
      projectile.draw(ctx);
      projectile.checkCollision(enemies, projectiles, updateMoneyCounter);
    });

    frame++;
    requestAnimationFrame(gameLoop);
  }

  function updateLivesCounter(amount) {
    console.log("amountoflives:", amount);
    console.trace();
    console.log("Lives before update:", lives);
    if (isNaN(amount) === false) {
      lives -= amount;
    } // Subtrahera liv om beloppet är negativt
    if (lives <= 0) {
      lives = 0;
    }
    livesCounter.textContent = `Lives: ${lives}`;
  }

  function updateMoneyCounter(amount) {
    console.log("amountofmoney:", amount);
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
        updateMoneyCounter(-ArcherTower.cost); // Update the money counter
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
        updateMoneyCounter(-WizardTower.cost); // Update the money counter
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
        updateMoneyCounter(-KnightTower.cost); // Update the money counter
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
    // Funktion för att dölja muspekaren

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

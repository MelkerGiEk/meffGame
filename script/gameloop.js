// Importerar klasser för fiender och torn från en separat fil
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
  const waveCounter = document.querySelector("#wave-counter"); // Select the wave counter

  const cursor = document.getElementById("custom-cursor");
  cursor.style.width = `150px`;
  cursor.style.height = `150px`;

  // Uppdaterar muspekarens position baserat på musens rörelse
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX + 5}px`;
    cursor.style.top = `${e.clientY + 6}px`;
  });

  // Definierar koordinaterna för en förutbestämd väg på spelplanen
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
    [8, 3],
    [9, 3],
    [10, 3],
    [11, 3],
    [11, 4],
    [11, 5],
    [11, 6],
    [12, 6],
    [13, 6],
    [14, 6],
    [15, 6],
  ];

  // Hämtar grid-elementet från DOM
  const grid = document.querySelector(".grid");

  // Skapar grid-celler och markerar celler som är en del av vägen
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      const cell = document.createElement("div"); // Skapar en ny div för varje cell
      cell.classList.add("cell"); // Lägger till klassen "cell"

      // Kontrollerar om cellen är en del av vägen
      if (pathCoordinates.some(([px, py]) => px === col && py === row)) {
        cell.classList.add("path"); // Lägger till klassen "path" om cellen är en del av vägen
      }

      grid.appendChild(cell); // Lägger till cellen i grid-elementet
    }
  }

  // Initierar olika spelvariabler
  let enemies = [];
  let towers = [];
  let projectiles = [];
  let frame = 0;
  let money = 100;
  let lives = 10;
  let killCount = { value: 0 };
  let gameSpeed = 1;
  let selectedTowerType = "none"; // Ändra detta baserat på användarens val
  let isRoundActive = false; // Flagga för att kontrollera om rundan är aktiv
  let currentWave = 1; // Håller reda på nuvarande våg
  let occupiedCells = []; // Håller reda på upptagna celler

  // Konverterar vägens koordinater till pixelvärden
  const path = pathCoordinates.map(([col, row]) => ({
    x: col * gridSize + gridSize / 2,
    y: row * gridSize + gridSize / 2,
  }));

  let isGameRunning = false; // Kontrollerarar spelets status (pause eller inte)

  // Initierar spawn-timers för fiender
  let enemySpawnTimer = 100; // Tid mellan spawn i frames
  let enemySpawnInterval = 100; // Standard spawn-intervall
  let slowEnemySpawnTimer = 100;
  let slowEnemySpawnInterval = 100;

  // Gameloop
  function gameLoop() {
    // Stoppar spelloppen vid lives <= 0 eller om spelet inte är aktivt
    if (!isGameRunning) return;
    if (lives <= 0) {
      console.log("Game Over! You lost all your lives.");
      isGameRunning = false;
      alert("Game Over! You lost all your lives.");
      return;
    }

    // Ritar bakgrunden
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Hantera fiendespawn
    enemySpawnTimer -= gameSpeed; // Minska spawn-tiden baserat på gameSpeed
    if (isRoundActive) {
      // Skapar en ny fiende baserat på tiden och lägger till den i listan
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
    } else if (!isRoundActive && isGameRunning) {
      // Om rundan är slut, uppdatera startknappens text
      startButton.textContent = "Continue";
      console.log(`Wave ${currentWave} completed!`);
    }

    //Uppdaterar och "ritar" dom för varje frame
    enemies.forEach((enemy) => {
      enemy.move();
      enemy.draw(ctx);
      enemy.isAtEnd();
      enemy.checkIfDead();
    });

    //Samma för tornen
    towers.forEach((tower) => {
      tower.draw(ctx);
      tower.shoot(frame);
    });

    //Samma för projectilerna
    projectiles.forEach((projectile) => {
      projectile.move();
      projectile.draw(ctx);
      projectile.checkCollision(enemies, projectiles, updateMoneyCounter);
    });
    if (isRoundActive) {
      updateWaveCounter();
    }
    frame++; //Ökar frame och köra gamloop igen
    requestAnimationFrame(gameLoop);
  }

  //Uppdaterar liv räknaren vid olika fiende nårr slut
  function updateLivesCounter(amount) {
    console.log("amountoflives:", amount);
    console.trace();
    if (isNaN(amount) === false) {
      lives -= amount;
    } // Subtrahera liv om beloppet är negativt
    if (lives <= 0) {
      lives = 0;
    }
    livesCounter.textContent = `Lives: ${lives}`;
  }

  function updateMoneyCounter(amount) {
    if (amount < 0) {
      money = money + amount; // Subtrahera pengar om beloppet är negativt
      if (money <= 0) {
        money = 0; // Se till att pengar inte blir negativa
      }
    } else if (amount > 0) {
      money = money + amount; // Lägg till pengar om beloppet är positivt
      if (money < 0) {
        money = 0; // Se till att pengar inte blir negativa
      }
    }
    moneyCounter.textContent = `Money: $${money}`;
  }

  function updateWaveCounter() {
    //Sätter ett intervall där det kollar hur mycket fiender som behöver dödas
    // och hur många vågor som ska klaras av
    let intervall = 20;
    console.log("Current Wave:", currentWave);
    if (currentWave % 5 === 0 && currentWave > 1) {
      intervall += 20;
      if (currentWave >= 10) {
        intervall += 20;
      }
    }
    if (killCount.value % intervall === 0 && killCount.value > 1) {
      currentWave++;
      if (currentWave <= 5) {
        enemySpawnInterval -= 10; // Minska spawn-tiden för nästa våg
      } else {
        enemySpawnInterval -= 5;
      }
      isRoundActive = false;
      waveCounter.textContent = `Wave: ${currentWave}`;
    }
  }

  // Update money counter on page load
  updateMoneyCounter();
  // Update lives counter on page load
  updateLivesCounter();

  //Tar hand om torn när man klickar på canvasen
  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect(); // Hämtar canvasens position
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize; // Beräknar x-positionen
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize; // Beräknar y-positionen
    const isOccupied = occupiedCells.some((pos) => pos.x === x && pos.y === y); // Kontrollerar om "cellen" är upptagen
    const isPath = pathCoordinates.some(
      ([px, py]) => px * gridSize === x && py * gridSize === y
    ); // Kontrollerar om platsen är en del av vägen (alltså där man inte får sätta torn)
    if (!isPath && !isOccupied) {
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
        updateMoneyCounter(-ArcherTower.cost); // Uppdaterar pengar efter vad som sattes ned
        occupiedCells.push({ x, y }); // Lägg till den upptagna cellen
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
        updateMoneyCounter(-WizardTower.cost);
        occupiedCells.push({ x, y });
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
        updateMoneyCounter(-KnightTower.cost);
        occupiedCells.push({ x, y });
      }
    }
  });

  // Ger alla knapparna i menyn en funktion (en ID)
  const startButton = document.getElementById("start-button");
  const speedButton = document.getElementById("speed-button");
  const archerButton = document.getElementById("archer-button");
  const wizardButton = document.getElementById("wizard-button");
  const knightButton = document.getElementById("knight-button");

  function headMenu() {
    //Debugging från förr
    console.log("Wizard Button:", wizardButton);
    console.log("Archer Button:", archerButton);
    console.log("Knight Button:", knightButton);

    //Startbutton, den startar spelet och kan pausa det
    startButton.addEventListener("click", () => {
      if (isGameRunning === false && isRoundActive === false) {
        isGameRunning = true; // Starta spelet
        isRoundActive = true; // Starta spelet
        console.log("Start"); // Debugging
        startButton.textContent = "Pause";
        gameLoop();
      } else if (isGameRunning === true && isRoundActive === false) {
        console.log("continue"); // Mer debugging
        isRoundActive = true; // Starta rundan
        startButton.textContent = "Pause"; // Ändra texten på knappen
      } else if (isGameRunning === true && isRoundActive === true) {
        console.log("Pause"); // Ännu mer debugging
        isGameRunning = false; // Stoppar spelet
        isRoundActive = false; // Stoppar rundan
        startButton.textContent = "Start"; // Ändra texten på knappen
      }
    });

    //Nästan detsamma som startknappen med hur dem fungerar, men gör andra saker (speed up, speed ner igen)
    speedButton.addEventListener("click", () => {
      if (isGameRunning === true && isRoundActive === true) {
        console.log("Speed button clicked");
        if (gameSpeed === 1) {
          gameSpeed = 2; // Öka hastigheten
          speedButton.textContent = "Speed: 2x";
          // Öka hastigheten för fienderna som redan finns
          enemies.forEach((enemy) => {
            enemy.speed = enemy.speed * 2;
          });
          towers.forEach((tower) => {
            tower.fireRate = tower.fireRate / 2; // Justera tornens skottfrekvens
            tower.gameSpeed = 2;
          });
        } else if (gameSpeed === 2) {
          gameSpeed = 1; // Återställ hastigheten
          speedButton.textContent = "Speed: 1x";
          enemies.forEach((enemy) => {
            enemy.speed = enemy.speed / 2;
          });
          towers.forEach((tower) => {
            tower.fireRate = tower.fireRate * 2; // Justera tornens skottfrekvens
            tower.gameSpeed = 1;
          });
          return gameSpeed;
        }
      } else if (isGameRunning === false && isRoundActive === false) {
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

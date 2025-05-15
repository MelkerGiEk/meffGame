export class Enemy {
  // Konstruktor för fienden (med egenskaper)
  // path är en array av punkter
  constructor(
    path,
    gridSize,
    gameSpeed,
    updateLivesCounter,
    updateMoneyCounter,
    enemies,
    killCountRef
  ) {
    this.path = path; // Path är en array av punkter som fienden ska följa
    this.gridSize = gridSize; // Rutstorlek för spelet
    this.gameSpeed = gameSpeed; // Hastighet för spelet
    this.updateLivesCounter = updateLivesCounter; // Funktion för att uppdatera livräknaren
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
    this.currentPoint = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.size = gridSize * 0.75;
    this.speed = 2 * gameSpeed; // Hastighet för fienden som skapas
    this.health = 3;
    this.isDead = false;
    this.enemies = enemies; // Array för fiender
    this.worth = 4; // Belöning för att döda fienden
    this.damage = 1; // Skada som fienden orsakar
    this.killCountRef = killCountRef; // Referens till kill count
  }
  // ger fienden sin position
  move() {
    let nextPoint = this.path[this.currentPoint + 1];
    let dx = nextPoint.x - this.x;
    let dy = nextPoint.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance < this.speed) {
      this.currentPoint++;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }
  // hanterar fiender som passerar stigen
  isAtEnd() {
    if (this.currentPoint >= this.path.length - 1) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateLivesCounter(this.damage); // Ta bort liv när fienden når slutet
      this.increaseKillCount();
    }
  }
  // hanterar fiender som dör
  checkIfDead() {
    if (this.isDead === true) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateMoneyCounter(this.worth); // Belöning för att döda fienden
      this.increaseKillCount();
    }
  }
  // ökar kill count för att kunna öka rundor
  increaseKillCount() {
    this.killCountRef.value++;
    console.log("Kill count: " + this.killCountRef.value);
  }
  // ritar fienden
  draw(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export class slowEnemy extends Enemy {
  constructor(
    path,
    gridSize,
    gameSpeed,
    updateLivesCounter,
    updateMoneyCounter,
    enemies,
    worth,
    damage,
    killCountRef
  ) {
    super(
      path,
      gridSize,
      gameSpeed,
      updateLivesCounter,
      updateMoneyCounter,
      enemies,
      worth,
      damage,
      killCountRef
    ); // Anropa basklassens konstruktor
    this.size = gridSize * 0.85; // Ändra storleken för den lilla fienden
    this.speed = 1.25 * gameSpeed; // Snabbare hastighet för den lilla fienden
    this.health = 8; // Lägre hälsa för den lilla fienden
    this.enemies = enemies; // Array för fiender
    this.updateLivesCounter = updateLivesCounter; // Funktion för att uppdatera livräknaren
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
    this.worth = 10; // Belöning för att döda fienden
    this.damage = 3; // Skada som fienden orsakar
  }

  move() {
    let nextPoint = this.path[this.currentPoint + 1];
    let dx = nextPoint.x - this.x;
    let dy = nextPoint.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance < this.speed) {
      this.currentPoint++;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  isAtEnd() {
    if (this.currentPoint >= this.path.length - 1) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateLivesCounter(this.damage); // Ta bort liv när fienden når slutet
      this.increaseKillCount();
    }
  }

  checkIfDead() {
    if (this.isDead === true) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateMoneyCounter(this.worth); // Belöning för att döda fienden
      this.increaseKillCount();
    }
  }

  increaseKillCount() {
    this.killCountRef.value++;
    console.log("Kill count: " + this.killCountRef.value);
  }

  draw(ctx) {
    ctx.fillStyle = "darkgreen"; // Ändra färgen för den lilla fienden
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export class bossEnemy extends Enemy {
  constructor(
    path,
    gridSize,
    gameSpeed,
    updateLivesCounter,
    updateMoneyCounter,
    enemies,
    worth,
    damage,
    killCountRef
  ) {
    super(
      path,
      gridSize,
      gameSpeed,
      updateLivesCounter,
      updateMoneyCounter,
      enemies,
      worth,
      damage,
      killCountRef
    ); // Anropa basklassens konstruktor
    this.size = gridSize;
    this.speed = 0.75 * gameSpeed;
    this.health = 75;
    this.enemies = enemies; // Array för fiender
    this.updateLivesCounter = updateLivesCounter; // Funktion för att uppdatera livräknaren
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
    this.worth = 100; // Belöning för att döda fienden
    this.damage = 10; // Skada som fienden orsakar
  }

  move() {
    let nextPoint = this.path[this.currentPoint + 1];
    let dx = nextPoint.x - this.x;
    let dy = nextPoint.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance < this.speed) {
      this.currentPoint++;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  isAtEnd() {
    if (this.currentPoint >= this.path.length - 1) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateLivesCounter(this.damage); // Ta bort liv när fienden når slutet
      this.increaseKillCount();
    }
  }

  checkIfDead() {
    if (this.isDead === true) {
      this.enemies.splice(this.enemies.indexOf(this), 1); // Ta bort fienden från arrayen
      this.updateMoneyCounter(this.worth); // Belöning för att döda fienden
      this.increaseKillCount();
    }
  }

  increaseKillCount() {
    this.killCountRef.value += 3;
    console.log("Kill count: " + this.killCountRef.value);
  }

  draw(ctx) {
    ctx.fillStyle = "darkred"; // Ändra färgen för den lilla fienden
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export class Projectile {
  constructor(
    x,
    y,
    target,
    gameSpeed,
    projectiles,
    enemies,
    updateMoneyCounter
  ) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 6 * gameSpeed;
    this.projectiles = projectiles; // Array för projektiler
    this.enemies = enemies; // Array för fiender
    this.updateMoneyCounter = updateMoneyCounter;
  }

  // Flytta projektilen mot target
  move() {
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let distance = Math.hypot(dx, dy);
    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;
  }

  // Kontrollera om projektilen träffar fienden
  checkCollision() {
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance < this.speed + this.target.size / 2) {
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
      this.target.health--;
      if (this.target.health <= 0) {
        this.target.isDead = true;
      }
    }
  }

  //ctx är kontexten för canvas
  draw(ctx) {
    ctx.fillStyle = "darkgrey";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Projektilklass
export class PiercingProjectile extends Projectile {
  constructor(
    x,
    y,
    target,
    gameSpeed,
    projectiles,
    enemies,
    updateMoneyCounter
  ) {
    super(x, y, target, gameSpeed, projectiles, enemies, updateMoneyCounter); // Anropa basklassens konstruktor
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 6 * gameSpeed; // Hastighet för projektilen
    this.projectiles = projectiles;
    this.enemies = enemies; // Array för fiender
    this.updateMoneyCounter = updateMoneyCounter;
    this.remainingPenetrations = 3; // Antal fiender som projektilen kan penetrera
    this.range = 350; // Räckvidd för projektilen
    this.distanceTraveled = 0; // Avstånd som projektilen har färdats
  }

  move() {
    try {
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.hypot(dx, dy);

      // Uppdatera position och räknare för färdad sträcka
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      this.distanceTraveled += this.speed;

      // Ta bort projektilen om den har färdats längre än sin räckvidd
      if (this.distanceTraveled >= this.range) {
        this.projectiles.splice(this.projectiles.indexOf(this), 1);
      }
      this.checkTargetState();
    } catch (error) {
      console.error("No worries:", error);
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
      return;
    }
  }

  checkCollision() {
    this.enemies.forEach((enemy) => {
      let dx = enemy.x - this.x;
      let dy = enemy.y - this.y;
      let distance = Math.hypot(dx, dy);

      // Kontrollera om projektilen träffar en fiende
      if (distance < this.speed + enemy.size / 2) {
        if (this.target.isDead) {
          enemy = this.enemies.find(
            (enemy) =>
              Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
          );
        }
        this.target.health = this.target.health - 0.5; // Minska fiendens hälsa
        this.target = this.enemies.find(
          (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
        );
        if (this.target.health <= 0) {
          this.target.isDead = true;
        }

        // Minska antalet penetrationer och ta bort projektilen om den inte kan penetrera fler fiender
        this.remainingPenetrations--;
        if (this.remainingPenetrations <= 0) {
          this.projectiles.splice(this.projectiles.indexOf(this), 1);
        }
      }
    });
  }

  // Kontrollera om projektilen fortfarande har en giltig måltavla
  checkTargetState() {
    if (this.target.isDead || !this.target) {
      this.target = this.enemies.find(
        (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
      );
    } else if (!this.target) {
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
    }
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Tower {
  constructor(
    x,
    y,
    gridSize,
    gameSpeed,
    enemies,
    projectiles,
    updateMoneyCounter
  ) {
    this.x = x + gridSize / 2;
    this.y = y + gridSize / 2;
    this.size = gridSize * 0.5;
    this.range = 200;
    this.fireRate = 50 / gameSpeed;
    this.lastShot = 0;
    this.enemies = enemies; // Store the enemies array
    this.projectiles = projectiles; // Store the projectiles array
    this.gameSpeed = gameSpeed;
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
  }

  // Skottfrekvens
  shoot(frame) {
    if (frame - this.lastShot > this.fireRate) {
      let target = this.enemies.find(
        (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
      );
      if (target) {
        this.projectiles.push(
          new Projectile(
            this.x,
            this.y,
            target,
            this.gameSpeed,
            this.projectiles,
            this.enemies,
            this.updateMoneyCounter
          )
        );
        this.lastShot = frame;
      }
    }
  }

  // Rita tornet
  draw(ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export class ArcherTower extends Tower {
  static cost = 35;
  constructor(
    x,
    y,
    gridSize,
    gameSpeed,
    enemies,
    projectiles,
    updateMoneyCounter
  ) {
    super(x, y, gridSize, gameSpeed, enemies, projectiles, updateMoneyCounter); // Anropa basklassens konstruktor
    this.range = 170;
    this.fireRate = 34 / gameSpeed; // Snabbare skott
    this.color = "red"; // Specifik färg för Archer Tower
    this.name = "Archer Tower"; // Namn på tornet
    this.enemies = enemies; // Store the enemies array
    this.projectiles = projectiles; // Store the projectiles array
    this.gameSpeed = gameSpeed;
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  shoot(frame) {
    if (frame - this.lastShot > this.fireRate) {
      let target = this.enemies.find(
        (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
      );
      if (target) {
        this.projectiles.push(
          new Projectile(
            this.x,
            this.y,
            target,
            this.gameSpeed,
            this.projectiles,
            this.enemies,
            this.updateMoneyCounter,
            this.money // Passera in pengar till projektilen
          )
        );
        this.lastShot = frame;
      }
    }
  }
}

export class WizardTower extends Tower {
  static cost = 100;
  constructor(
    x,
    y,
    gridSize,
    gameSpeed,
    enemies,
    projectiles,
    updateMoneyCounter
  ) {
    super(x, y, gridSize, gameSpeed, enemies, projectiles, updateMoneyCounter); // Anropa basklassens konstruktor
    this.range = 125;
    this.fireRate = 25 / gameSpeed; // Långsammare skott
    this.color = "purple"; // Specifik färg för Wizard Tower
    this.name = "Wizard Tower"; // Namn på tornet
    this.enemies = enemies; // Store the enemies array
    this.projectiles = projectiles; // Store the projectiles array
    this.gameSpeed = gameSpeed;
    this.updateMoneyCounter = updateMoneyCounter;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  shoot(frame) {
    if (frame - this.lastShot > this.fireRate) {
      let target = this.enemies.find(
        (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
      );
      if (target) {
        this.projectiles.push(
          new PiercingProjectile(
            this.x,
            this.y,
            target,
            this.gameSpeed,
            this.projectiles,
            this.enemies,
            this.updateMoneyCounter,
            this.money // Passera in pengar till projektilen
          )
        );
        this.lastShot = frame;
      }
    }
  }
}

export class KnightTower extends Tower {
  static cost = 75;
  constructor(
    x,
    y,
    gridSize,
    gameSpeed,
    enemies,
    projectiles,
    updateMoneyCounter
  ) {
    super(x, y, gridSize, gameSpeed, enemies, projectiles, updateMoneyCounter); // Anropa basklassens konstruktor
    this.range = 100;
    this.fireRate = 10 / gameSpeed;
    this.color = "black";
    this.name = "Knight Tower";
    this.enemies = enemies; // Store the enemies array
    this.projectiles = projectiles; // Store the projectiles array
    this.gameSpeed = gameSpeed;
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }

  shoot(frame) {
    if (frame - this.lastShot > this.fireRate) {
      let target = this.enemies.find(
        (enemy) => Math.hypot(enemy.x - this.x, enemy.y - this.y) < this.range
      );
      if (target) {
        this.projectiles.push(
          new Projectile(
            this.x,
            this.y,
            target,
            this.gameSpeed,
            this.projectiles,
            this.enemies,
            this.updateMoneyCounter,
            this.money // Passera in pengar till projektilen
          )
        );
        this.lastShot = frame;
      }
    }
  }
}

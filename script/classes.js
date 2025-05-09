export class Enemy {
  constructor(
    path,
    gridSize,
    gameSpeed,
    updateLivesCounter,
    updateMoneyCounter,
    enemies
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
      this.updateMoneyCounter(5); // Belöning för att döda fienden
      this.updateLivesCounter(1); // Ta bort liv när fienden når slutet
    }
  }

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
    enemies
  ) {
    super(
      path,
      gridSize,
      gameSpeed,
      updateLivesCounter,
      updateMoneyCounter,
      enemies
    ); // Anropa basklassens konstruktor
    this.size = gridSize * 0.85; // Ändra storleken för den lilla fienden
    this.speed = 1.25 * gameSpeed; // Snabbare hastighet för den lilla fienden
    this.health = 8; // Lägre hälsa för den lilla fienden
    this.enemies = enemies; // Array för fiender
    this.updateLivesCounter = updateLivesCounter; // Funktion för att uppdatera livräknaren
    this.updateMoneyCounter = updateMoneyCounter; // Funktion för att uppdatera pengarna
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
      this.updateMoneyCounter(10); // Belöning för att döda fienden
      this.updateLivesCounter(3); // Ta bort liv när fienden når slutet
    }
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

  move() {
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (this.target.isDead) {
      // Om målet redan dödats av annan projektil
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
      return;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  checkCollision() {
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let distance = Math.hypot(dx, dy);

    if (distance < this.speed + this.target.size / 2) {
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
      this.target.health--;
      if (this.target.health <= 0) {
        this.target.isDead = true;
        this.enemies.splice(this.enemies.indexOf(this.target), 1);
        this.updateMoneyCounter(10);
      }
    }
  }

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
    this.speed = 5 * gameSpeed; // Hastighet för projektilen
    this.projectiles = projectiles;
    this.enemies = enemies; // Array för fiender
    this.updateMoneyCounter = updateMoneyCounter;
  }
  move() {
    if (this.target.isDead) {
      this.projectiles.splice(this.projectiles.indexOf(this), 1);
      return;
    }

    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed + this.target.size / 2) {
      let index = this.projectiles.indexOf(this);
      this.projectiles.splice(index, 1);
      this.target.health--;
      if (this.target.health <= 0) {
        this.target.isDead = true;
        this.enemies.splice(this.enemies.indexOf(this.target), 1);
        this.updateMoneyCounter(10);
      }
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
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
  draw(ctx) {
    ctx.fillStyle = "blue";
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
            this.updateMoneyCounter
          )
        );
        this.lastShot = frame;
      }
    }
  }
}

export class ArcherTower extends Tower {
  static cost = 50;
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
    this.range = 200;
    this.fireRate = 30 / gameSpeed; // Snabbare skott
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
    this.range = 120;
    this.fireRate = 18 / gameSpeed; // Långsammare skott
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

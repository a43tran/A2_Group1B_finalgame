const tileSize = 50;
const COLS = 16;
const ROWS = 12;

let gameStarted = false;
let gameOver = false;
let firstLevelComplete = false;
let secondLevelComplete = false;
let thirdLevelComplete = false;
let socialBattery = 100;

// 0 = path
// 1 = wall
// 2 = start
// 3 = end

let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 3, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1],
  [1, 2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];


let player;

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2.5;
    this.vx = 0;
    this.vy = 0;
  }

  update(offX, offY) {
    // Read WASD input
    let inputX = 0;
    let inputY = 0;
    if (keyIsDown(65)) inputX = -1; // A
    if (keyIsDown(68)) inputX =  1; // D
    if (keyIsDown(87)) inputY = -1; // W
    if (keyIsDown(83)) inputY =  1; // S

    // Prefer one axis at a time (no diagonal)
    if (inputX !== 0) { this.vx = inputX; this.vy = 0; }
    else if (inputY !== 0) { this.vx = 0; this.vy = inputY; }
    else { this.vx = 0; this.vy = 0; }

    // Try to move, check the leading edge for wall collision
    let radius = tileSize * 0.3;
    let nextX = this.x + this.vx * this.speed;
    let nextY = this.y + this.vy * this.speed;

    let checkX = nextX + this.vx * radius;
    let checkY = nextY + this.vy * radius;
    let col = floor((checkX - offX) / tileSize);
    let row = floor((checkY - offY) / tileSize);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      let tile = maze[row][col];
      if (tile === 0 || tile === 2 || tile === 3) {
        this.x = nextX;
        this.y = nextY;
      }
    }
  }

  draw() {
    fill(255, 100, 80);   // pick any colour you like
    noStroke();
    ellipse(this.x, this.y, tileSize * 0.7);
  }
}

class Mover {
  constructor(x, y, speed = 1.5) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.vx = random([-1, 1, 0, 0]);
    this.vy = this.vx === 0 ? random([-1, 1]) : 0;
  }

  update(offX, offY) {
    let nextX = this.x + this.vx * this.speed;
    let nextY = this.y + this.vy * this.speed;

    let radius = tileSize * 0.25;
    
    let checkX = nextX + this.vx * radius;
    let checkY = nextY + this.vy * radius;

    let col = floor((checkX - offX) / tileSize);
    let row = floor((checkY - offY) / tileSize);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      this.pickNewDirection();
      return;
    }

    let tile = maze[row][col];
    if (tile === 0 || tile === 2 || tile === 3) {
      // Move normally
      this.x = nextX;
      this.y = nextY;
    } else {
      this.pickNewDirection();
    }
  }

  pickNewDirection() {
    let dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    let d = random(dirs);
    this.vx = d[0];
    this.vy = d[1];
  }

  draw() {
    fill(1, 19, 33);
    ellipse(this.x, this.y, tileSize * 0.8);
  }
}

let movers = [];

let wallExpansion = [];

function initWallExpansion() {
  for (let r = 0; r < ROWS; r++) {
    wallExpansion[r] = [];
    for (let c = 0; c < COLS; c++) {
      wallExpansion[r][c] = 0;
    }
  }
}

function tileCenter(col, row, offX, offY) {
  return {
    x: offX + col * tileSize + tileSize / 2,
    y: offY + row * tileSize + tileSize / 2
  };
}

const WALL_TRIGGER_DIST = 2.5; // tiles away to start expanding
const WALL_MAX_EXPAND = 12;    // max pixels to expand inward (tune this)
const WALL_EXPAND_SPEED = 0.04;
const WALL_SHRINK_SPEED = 0.02;

function updateWallExpansion(offX, offY) {
  let playerCol = (player.x - offX) / tileSize;
  let playerRow = (player.y - offY) / tileSize;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1) continue; // only walls

      let d = dist(playerCol, playerRow, c + 0.5, r + 0.5);
      let target = d < WALL_TRIGGER_DIST ? 1 : 0;

      // Lerp toward target
      if (wallExpansion[r][c] < target) {
        wallExpansion[r][c] = min(wallExpansion[r][c] + WALL_EXPAND_SPEED, 1);
      } else {
        wallExpansion[r][c] = max(wallExpansion[r][c] - WALL_SHRINK_SPEED, 0);
      }
    }
  }
}

function setup() {
  createCanvas(800, 600);

  const offX = (width - COLS * tileSize) / 2;
  const offY = (height - ROWS * tileSize) / 2;

  outer:
  for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (maze[r][c] === 2) {
      let pos = tileCenter(c, r, offX, offY);
      player = new Player(pos.x, pos.y);
      break outer;
    }
  }
}

  initWallExpansion();

  let c1 = tileCenter(1, 1, offX, offY);
  movers.push(new Mover(c1.x, c1.y));

  let c2 = tileCenter(6, 2, offX, offY);
  movers.push(new Mover(c1.x, c1.y));

  let c3 = tileCenter(10, 3, offX, offY);
  movers.push(new Mover(c2.x, c2.y));
}

function draw() {
  background(220);

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  if (gameOver) {
    drawLoseScreen();
    return;
  }

  if (firstLevelComplete) {
  drawFirstLevelCompleteScreen();
  return;
  }

  const offX = (width - COLS * tileSize) / 2;
  const offY = (height - ROWS * tileSize) / 2;

  updateWallExpansion(offX, offY);
  drawMaze();
  player.update(offX, offY);
  player.draw();
  // Check if player reached the end tile
  let playerCol = floor((player.x - offX) / tileSize);
  let playerRow = floor((player.y - offY) / tileSize);

  if (maze[playerRow][playerCol] === 3) {
  firstLevelComplete = true;
  }
  drawSocialBar();
  // Check collision with enemies
  for (let m of movers) {
  let d = dist(player.x, player.y, m.x, m.y);
  if (d < tileSize * 0.6) {
    socialBattery -= 0.5;  // drain battery
  }
}

}

function keyPressed() {
  if (key === " " && !gameStarted) {
    gameStarted = true;
  }

  if (key === "r" || key === "R") {
    if (gameOver) restartGame();
  }
  if (key === "n" || key === "N") {
  if (levelFirstComplete) loadSecondLevel();
  }
}

function drawStartScreen() {
  fill(121, 164, 166);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textFont("Monospace");
  textSize(90);
  text("A2 - GAME", width / 2, 300);
  textSize(16);
  text("Press SPACE to start", width / 2, 390);
  text("Move by pressing WASD", width / 2, 420);
}

function drawMaze() {
  const offSetX = (width - COLS * tileSize) / 2;
  const offSetY = (height - ROWS * tileSize) / 2;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let tile = maze[row][col];

      noStroke();

      if (tile === 1) {
        fill(23, 53, 71); // wall
        let expand = wallExpansion[row][col] * WALL_MAX_EXPAND;
        rect(
          col * tileSize + offSetX - expand,
          row * tileSize + offSetY - expand,
          tileSize + expand * 2,
          tileSize + expand * 2
        );
      } else {
        if (tile === 0) fill(121, 164, 166);
        else if (tile === 2) fill(215, 240, 201);
        else if (tile === 3) fill(35, 107, 112);
        rect(col * tileSize + offSetX, row * tileSize + offSetY, tileSize, tileSize);
      }
    }
  }

  fill(255);
  textAlign(LEFT, TOP);
  textFont("Monospace");
  textSize(12);
  text("LVL 1: Make your way to school!", 50, 20);
  drawSocialBar();

  const offX = offSetX;
  const offY = offSetY;

  for (let m of movers) {
    m.update(offX, offY);
    m.draw();
  }

  if (socialBattery <= 0) {
    socialBattery = 0;
    gameOver = true;
  }
}

function drawSocialBar() {
  textAlign(RIGHT, TOP);
  fill(255);
  text("Social Battery", 550, 20);

  fill(80);
  rect(560, 15, 190, 20);

  fill(100, 220, 120);
  rect(560, 15, socialBattery * 1.9, 20);
}

function drawLoseScreen() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textFont("Monospace");
  textSize(60);
  text("You Burned Out", width / 2, height / 2 - 40);

  textSize(20);
  text("Your social battery hit 0", width / 2, height / 2 + 10);
  text("Press R to restart", width / 2, height / 2 + 50);
}

function restartGame() {
  socialBattery = 100;
  gameOver = false;

  const offX = (width - COLS * tileSize) / 2;
  const offY = (height - ROWS * tileSize) / 2;

  // Reset player to start tile
  outer:
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 2) {
        let pos = tileCenter(c, r, offX, offY);
        player.x = pos.x;
        player.y = pos.y;
        break outer;
      }
    }
  }
}

function drawFirstLevelCompleteScreen() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textFont("Monospace");
  textSize(60);
  text("Level 1 Complete!", width / 2, height / 2 - 40);

  textSize(20);
  text("Press N to continue", width / 2, height / 2 + 20);
}
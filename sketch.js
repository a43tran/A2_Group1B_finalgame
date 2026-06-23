const tileSize = 50;
const COLS = 16;
const ROWS = 12;

let gameStarted = false;
let firstLevelComplete = false;
let secondLevelComplete = false;
let thirdLevelComplete = false;
let socialBattery = 100;
let blobX = 400;
let blobY = 300;
let currentThought = "";
let thoughtVisible = false;
let lastThoughtTime = 0;

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

class Mover {
  constructor(x, y, speed = 1.5) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    // Start with a random direction
    this.vx = random([-1, 1, 0, 0]);
    this.vy = this.vx === 0 ? random([-1, 1]) : 0;
  }

  update(offX, offY) {
    // Predict next position
    let nextX = this.x + this.vx * this.speed;
    let nextY = this.y + this.vy * this.speed;

    let radius = tileSize * 0.25;
    
    let checkX = nextX + this.vx * radius;
    let checkY = nextY + this.vy * radius;

    // Convert pixel → tile index
    let col = floor((checkX - offX) / tileSize);
    let row = floor((checkY - offY) / tileSize);

    // Check bounds
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) {
      this.pickNewDirection();
      return;
    }

    // Check if next tile is walkable
    let tile = maze[row][col];
    if (tile === 0 || tile === 2 || tile === 3) {
      // Move normally
      this.x = nextX;
      this.y = nextY;
    } else {
      // Hit a wall → choose new direction
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
    fill(255, 80, 80);
    ellipse(this.x, this.y, tileSize * 0.5);
  }
}

let movers = [];

function tileCenter(col, row, offX, offY) {
  return {
    x: offX + col * tileSize + tileSize / 2,
    y: offY + row * tileSize + tileSize / 2
  };
}

function setup() {
  createCanvas(800, 600);

  const offX = (width - COLS * tileSize) / 2;
  const offY = (height - ROWS * tileSize) / 2;

  let c1 = tileCenter(1, 1, offX, offY);
  movers.push(new Mover(c1.x, c1.y));

  let c2 = tileCenter(6, 2, offX, offY);
  movers.push(new Mover(c1.x, c1.y));

  let c3 = tileCenter(10, 3, offX, offY);
  movers.push(new Mover(c2.x, c2.y));
}


function draw() {
  background(220);
  if (gameStarted) {
    drawMaze();
  } else {
    drawStartScreen();
  }
}

function keyPressed() {
  if (key === " ") {
    gameStarted = true;
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
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let tile = maze[row][col];

      noStroke();

      if (tile === 1) {
        fill(23, 53, 71); // wall
      } else if (tile === 0) {
        fill(121, 164, 166); // path
      } else if (tile === 2) {
        fill(215, 240, 201); // start
      } else if (tile === 3) {
        fill(35, 107, 112); // end
      }

      const offSetX = (width - COLS * tileSize) / 2;
      const offSetY = (height - ROWS * tileSize) / 2;

      rect(
        col * tileSize + offSetX,
        row * tileSize + offSetY,
        tileSize,
        tileSize,
      );
    }

    fill(255);
    textAlign(LEFT, TOP);
    textFont("Monospace");
    textSize(12);
    text("LVL 1: Make your way to school!", 50, 20);
    drawSocialBar();
  }

  const offX = (width - COLS * tileSize) / 2;
  const offY = (height - ROWS * tileSize) / 2;

  for (let m of movers) {
    m.update(offX, offY);
    m.draw();
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





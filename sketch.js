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
let negativeThoughts = [
  "Everyone is judging me.",
  "I don't belong here.",
  "What if I embarrass myself?",
  "They're staring at me.",
  "I can't do this."
];


function tileCenter(col, row, offX, offY) {
  return {
    x: offX + col * tileSize + tileSize / 2,
    y: offY + row * tileSize + tileSize / 2
  };
}

function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);
  if (gameStarted) {
    drawMaze();
  } else {
    drawStartScreen();
  }
  if (gameStarted) {
  drawMaze();
  drawBlurryBlackBall(300, 250);
  if (!thoughtVisible && millis() - lastThoughtTime > 2000) {
    spawnNegativeThought();
  }

  drawNegativeThought();
  drawSocialBar();
}
checkNegativeThoughtCollision();
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


function drawBlob() {

  fill(0);
  ellipse(blobX, blobY, 40, 40);

  fill(255);
  textSize(10);
  textAlign(CENTER);
  text("Everyone is\njudging me", blobX, blobY + 4);
}

function spawnNegativeThought() {
  thoughtX = random(100, width - 100);
  thoughtY = random(100, height - 100);
  currentThought = random(negativeThoughts);
  thoughtVisible = true;
  lastThoughtTime = millis();
}

function drawNegativeThought() {
  if (thoughtVisible) {
    fill(0);
    ellipse(thoughtX, thoughtY, 45, 45);

    fill(0);
    textSize(12);
    textAlign(CENTER);
    text(currentThought, thoughtX, thoughtY - 35);

    if (millis() - lastThoughtTime > 3000) {
      thoughtVisible = false;
    }
  }
}

function checkNegativeThoughtCollision() {
  if (thoughtVisible) {
    let d = dist(playerX, playerY, thoughtX, thoughtY);

    if (d < 35) {
      socialBattery -= 10;
      thoughtVisible = false;
    }
  }
}

function drawBlurryBlackBall(x, y) {
  noStroke();

  fill(0, 10);
  ellipse(x, y, 150, 150);

  fill(0, 20);
  ellipse(x, y, 120, 120);

  fill(0, 35);
  ellipse(x, y, 95, 95);

  fill(0, 55);
  ellipse(x, y, 70, 70);

  fill(0);
  ellipse(x, y, 45, 45);
}
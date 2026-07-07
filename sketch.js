const tileSize = 40;
const COLS = 25;
const ROWS = 14;

let gameStarted = false;
let gameOver = false;
let firstLevelComplete = false;
let secondLevelComplete = false;
let thirdLevelComplete = false;
let socialBattery = 100;

let camX = 0;
let camY = 0;
const CAM_SMOOTHING = 0.1;

// initializing laser
let playerHitSound;

// initializng frame to buffer damage rate
const INVINCIBLE_FRAMES = 60;

// set current player "invincibility" to false
let playerInvincible = false;

// initialize invincible timer
let invincibleTimer = 0;

// initilize the laser damage
const LASER_DAMAGE = 10;

let lasers = [
  { row: 1, col: 6, facing: "down", blinkRate: 45, on: true, timer: 0 },
  { row: 5, col: 14, facing: "left", blinkRate: 60, on: true, timer: 0 },
  { row: 9, col: 9, facing: "up", blinkRate: 30, on: true, timer: 0 }
];
  
  




// 0 = path
// 1 = wall
// 2 = start
// 3 = end

// Maze map 
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 3, 1],
  [1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 2, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//Player model constructor
let player;
let collectibles = [];
let collectedCount = 0;
const totalCollectibles = 1;


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 2.5;
    this.vx = 0;
    this.vy = 0;
    this.facing = "down";
    this.frame = 0; 
  }

  update() {
    let inputX = 0;
    let inputY = 0;
    if (keyIsDown(65)) inputX = -1;
    if (keyIsDown(68)) inputX = 1;
    if (keyIsDown(87)) inputY = -1;
    if (keyIsDown(83)) inputY = 1;

    if (inputX !== 0) {
      this.vx = inputX;
      this.vy = 0;
    } else if (inputY !== 0) {
      this.vx = 0;
      this.vy = inputY;
    } else {
      this.vx = 0;
      this.vy = 0;
    }

    if (this.vx === 1) this.facing = "right";
    if (this.vx === -1) this.facing = "left";
    if (this.vy === -1) this.facing = "up";
    if (this.vy === 1) this.facing = "down";

    let radius = tileSize * 0.3;
    let nextX = this.x + this.vx * this.speed;
    let nextY = this.y + this.vy * this.speed;

    let checkX = nextX + this.vx * radius;
    let checkY = nextY + this.vy * radius;
    let col = floor(checkX / tileSize);
    let row = floor(checkY / tileSize);

    if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
      let tile = maze[row][col];
      if (tile === 0 || tile === 2 || tile === 3) {
        this.x = nextX;
        this.y = nextY;
      }
    }
  }

  draw() {

    //This will flicker the character sprite when they get hit by laser
    //  if (playerInvincible && floor(invincibleTimer / 6) % 2 === 0) return;

    let row = SPRITE.rows[this.facing];
    let frameW = SPRITE.frameWidth;
    let frameH = SPRITE.frameHeight;

    if (this.vx !== 0 || this.vy !== 0) {
      this.frame = (this.frame + 1) % (SPRITE.numFrames * SPRITE.animSpeed);
    }
    let col = floor(this.frame / SPRITE.animSpeed);

    let srcX = col * frameW;
    let srcY = row * frameH;
    let drawW = frameW * SPRITE.scale;
    let drawH = frameH * SPRITE.scale;

    imageMode(CENTER);
    image(character, this.x, this.y, drawW, drawH, srcX, srcY, frameW, frameH);
  }
}

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
    y: offY + row * tileSize + tileSize / 2,
  };
}

const WALL_MAX_EXPAND = 12; 
const WALL_EXPAND_SPEED = 0.04;
const WALL_SHRINK_SPEED = 0.02;

function updateWallExpansion() {
  // How "closed in" the walls should be, driven by social battery instead of player position.
  // Full battery (100) -> target 0 (walls fully open)
  // Empty battery (0)  -> target 1 (walls fully expanded/closed in)
  let target = map(socialBattery, 100, 0, 0, 1);
  target = constrain(target, 0, 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1) continue; // only walls

      if (wallExpansion[r][c] < target) {
        wallExpansion[r][c] = min(wallExpansion[r][c] + WALL_EXPAND_SPEED, target);
      } else if (wallExpansion[r][c] > target) {
        wallExpansion[r][c] = max(wallExpansion[r][c] - WALL_SHRINK_SPEED, target);
      }
    }
  }
}

const SPRITE = {
  frameWidth: 75,
  frameHeight: 150,
  numFrames: 4,
  animSpeed: 20,
  scale: 0.5,
  rows: {
    down: 0,
    up: 1,
    right: 2,
    left: 3,
  },
  offsets: {
    down: { x: 0, y: 0 },
    up: { x: 0, y: 0 },
    right: { x: 0.1, y: 10 },
    left: { x: 2.2, y: 20 },
  },
};

let showTutorial = false;

const tutorialButton = {
  x: 290,
  y: 420,
  w: 220,
  h: 50
};

function preload() {
  character = loadImage("assets/images/character.png");
  startScreen = loadImage("assets/images/homescreen.png");
  restartScreen = loadImage("assets/images/restartscreen.png");
  levelOneComplete = loadImage("assets/images/level1complete.png");

  laserOn = loadImage("assets/images/laserOn.png");
  laserOff = loadImage("assets/images/laserOff.png");

  //playerHitSound = loadSound("assets/sounds/xxxxxxxx.mp3")
  
}

function setup() {
  createCanvas(1280, 720);


  outer: for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 2) {
        let x = c * tileSize + tileSize / 2;
        let y = r * tileSize + tileSize / 2;
        player = new Player(x, y);
        break outer;
      }
    }
  }

 initWallExpansion();
 setupCollectibles(); 
}

function updateCamera() {
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  camX = lerp(camX, targetX, CAM_SMOOTHING);
  camY = lerp(camY, targetY, CAM_SMOOTHING);
}

/*
function checkLaserPlayerCollision() {

  //Returns if player is still "invisible"
  if (playerInvincible) return;

  //If laser is NOT on/true, return
  if (!laser) return;



  if (hit) {
    socialBattery -= LASER_DAMAGE;
    
    if (socialBattery < 0)
      socialBattery = 0;

    // INSERT GAME OVER SCREEN

    playerInvincible = true;
    invincibleTimer = INVINCIBLE_FRAMES;

    //playerHitSound.play()
  }

function updateInvincibility() {
  if (playerInvincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0)
      playerInvincible = false;
  }
}


}
*/

function draw() {
  background(3, 4, 33);
  if (!gameStarted && !showTutorial) {
    drawStartScreen();
    return;
}

  if (showTutorial) {
    drawTutorialOverlay();
    return;
}

  if (firstLevelComplete) {
    drawFirstLevelCompleteScreen();
    return;
  }
  updateCamera();
  
  if (gameOver) {
  drawLoseScreen();
  return;
  }

push();

let zoom = 1;

translate(width / 2, height / 2);
scale(zoom);
translate(-player.x, -player.y);

updateWallExpansion();
drawMaze();

updateLasers();
drawLasers();

player.update();
resolveWallPush();

drawCollectibles();        
checkCollectibles();   
player.draw();

/*
//  This is in charge of checking whether the character is colliding with the laser, damaging their SB
checkLaserPlayerCollision();

// updateinvincibility checks if the character is invisible, if it is, then the character takesno damage 
//    1 second, otherwise they take damage and the counter is reset to 60 FRAMES (aka 1 second)
updateInvincibility();
*/

pop();

  if (socialBattery > 70) {
    player.speed = 2.5;
  } else if (socialBattery > 30) {
    player.speed = 2; 
  } else {
    player.speed = 1.5; 
  }
  
  // Check if player reached the end tile
  let playerCol = floor(player.x / tileSize);
  let playerRow = floor(player.y / tileSize);

  if (maze[playerRow][playerCol] === 3) {
    firstLevelComplete = true;
  }
  drawSocialBar();
}

function keyPressed() {
  if (key === " " && !gameStarted) {
    showTutorial = true;
  }

  if (key === "r" || key === "R") {
    if (gameOver) restartGame();
  }

  if (key === "n" || key === "N") {
    if (firstLevelComplete) loadSecondLevel();
  }
}

function mousePressed() {

  // Help button on the HUD
  if (
    mouseX >= 1210 &&
    mouseX <= 1240 &&
    mouseY >= 15 &&
    mouseY <= 45
  ) {
    showTutorial = true;
    return;
  }

  // Continue button
  if (showTutorial) {
    if (
      mouseX >= tutorialButton.x &&
      mouseX <= tutorialButton.x + tutorialButton.w &&
      mouseY >= tutorialButton.y &&
      mouseY <= tutorialButton.y + tutorialButton.h
    ) {
      showTutorial = false;

      // Only start the game the very first time
      if (!gameStarted) {
        gameStarted = true;
      }
    }
  }
}

function resolveWallPush() {
  let radius = tileSize * 0.3;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1) continue;

      let expand = wallExpansion[r][c] * WALL_MAX_EXPAND;

      let wallLeft   = c * tileSize - expand;
      let wallRight  = c * tileSize + tileSize + expand;
      let wallTop    = r * tileSize - expand;
      let wallBottom = r * tileSize + tileSize + expand;

      let closestX = constrain(player.x, wallLeft, wallRight);
      let closestY = constrain(player.y, wallTop, wallBottom);

      let dx = player.x - closestX;
      let dy = player.y - closestY;
      let d  = sqrt(dx * dx + dy * dy);

      if (d < radius && d > 0) {
        let overlap = radius - d;
        player.x += (dx / d) * overlap;
        player.y += (dy / d) * overlap;
      }
    }
  }
}
function setupCollectibles() {
  collectibles = [
    // Top section
    { col: 2, row: 1, collected: false },
    { col: 9, row: 2, collected: false },
    { col: 16, row: 2, collected: false },
    { col: 22, row: 3, collected: false },

    // Middle section
    { col: 4, row: 6, collected: false },
    { col: 10, row: 8, collected: false },
    { col: 19, row: 7, collected: false },

    // Bottom section
    { col: 3, row: 11, collected: false },
    { col: 13, row: 12, collected: false }
  ];
}
function drawCollectibles() {
  for (let item of collectibles) {
    if (!item.collected) {
      let x = item.col * tileSize + tileSize / 2;
      let y = item.row * tileSize + tileSize / 2;

      fill(255, 220, 120);
      ellipse(x, y, 12, 12);
    }
  }
}

function checkCollectibles() {
  for (let item of collectibles) {
    if (!item.collected) {
      let x = item.col * tileSize + tileSize / 2;
      let y = item.row * tileSize + tileSize / 2;

      let d = dist(player.x, player.y, x, y);

      if (d < 20) {
        item.collected = true;
        collectedCount++;
      }
    }
  }
}

function drawMaze() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let tile = maze[row][col];

      noStroke();

      if (tile === 1) {
        fill(36, 39, 97); // wall
        let expand = wallExpansion[row][col] * WALL_MAX_EXPAND;
        rect(
          col * tileSize - expand,
          row * tileSize - expand,
          tileSize + expand * 2,
          tileSize + expand * 2,
        );
      } else {
        if (tile === 0) fill(116, 119, 181);
        else if (tile === 2) fill(247, 176, 204);
        else if (tile === 3) fill(179, 80, 119);
        rect(
          col * tileSize,
          row * tileSize,
          tileSize,
          tileSize,
        );
      }
    }
  }

  if (socialBattery <= 0) {
    socialBattery = 0;
    gameOver = true;
  }
}

function drawSocialBar() {
  fill(5, 8, 65);
  rect(0, 0, width, 60);

  fill(255);
  textAlign(LEFT, TOP);
  textFont("Monospace");
  textSize(12);
  text("LVL 1: Make your way to school!", 50, 20);

  textAlign(RIGHT, TOP);
  fill(255);
  textSize(12);
  text("Social Battery", 990, 25);

  fill(80);
  rect(1000, 20, 190, 20);

  fill(100, 220, 120);
  rect(1000, 20, socialBattery * 1.9, 20);

  // Help button at the end of social battery bar
  fill(40);
  rect(1210, 15, 30, 30, 5);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("?", 1225, 30);
}

function updateLasers() {
  for (let l of lasers) {
    l.timer++;
    if (l.timer >= l.blinkRate) {
      l.timer = 0;
      l.on = !l.on;
    }
  }
}

function drawLasers() {
  imageMode(CENTER);

  for (let l of lasers) {
    let cx = l.col * tileSize + tileSize / 2;
    let cy = l.row * tileSize + tileSize / 2;

    // Rotation + offset so the sprite sits flush on the wall face
    // pointing into the corridor, assuming the source image faces "down" by default.
    let angle = 0;
    let offX = 0, offY = 0;
    let edgeOffset = tileSize / 2 - 4; // pushes sprite to the wall's edge

    if (l.facing === "down") {
      angle = 0;
      offY = edgeOffset;
    } else if (l.facing === "up") {
      angle = PI;
      offY = -edgeOffset;
    } else if (l.facing === "right") {
      angle = HALF_PI;
      offX = edgeOffset;
    } else if (l.facing === "left") {
      angle = -HALF_PI;
      offX = -edgeOffset;
    }

    push();
    translate(cx + offX, cy + offY);
    rotate(angle);
    let img = l.on ? laserOn : laserOff;
    image(img, 0, 0, tileSize * 0.8, tileSize * 0.5);
    pop();
  }
}


function drawTutorialOverlay() {
  // Dark transparent background
  fill(0, 180);
  rect(0, 0, width, height);

  // Main box
  fill(245);
  rect(120, 80, 560, 440, 15);

  fill(30);
  textAlign(CENTER);
  textSize(28);
  text("Tutorial", width / 2, 115);

  textSize(16);
  text(
    "Use WASD to move.\n\n" +
    "Reach the end of the maze.\n\n" +
    "Your Social Battery decreases throughout the game.\n" +
    "If it reaches 0, it's game over.\n\n" +
    "Watch out for changing walls!",
    width / 2,
    175
  );

  // Close Button
  fill(55, 85, 180);
  rect(
    tutorialButton.x,
    tutorialButton.y,
    tutorialButton.w,
    tutorialButton.h,
    10
  );

  fill(255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text(
    "Continue",
    tutorialButton.x + tutorialButton.w / 2,
    tutorialButton.y + tutorialButton.h / 2
  );
}

function drawStartScreen() {
  image(startScreen, 0, 0, width, height);
}

function drawLoseScreen() {
  image(restartScreen, 0, 0, width, height);
}

function restartGame() {
  socialBattery = 100;
  gameOver = false;

  // Reset collectible progress
  collectedCount = 0;
  setupCollectibles();

  outer: for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] === 2) {
        
        player.x = c * tileSize + tileSize / 2;
        player.y = r * tileSize + tileSize / 2;

        break outer;

      }
    }
  }
}

function drawFirstLevelCompleteScreen() {
  image(levelOneComplete, 0, 0, width, height);
}
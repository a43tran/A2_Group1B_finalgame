// MAZE GRID
const tileSize = 40;
const COLS = 25;
const ROWS = 14;

// 0 = path
// 1 = wall
// 2 = start
// 3 = end

// MAZE MAP
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

// GAME STATE & LEVELS
let gameStarted = false;
let gameOver = false;
let firstLevelComplete = false;
let secondLevelComplete = false;
let thirdLevelComplete = false;

// IMAGES
let character;
let startScreen;
let restartScreen;
let levelOneComplete;
let fireflySprite;
let fireflyBadge;
let forest;
let wall;
let ground;
let home;
let school;
let banner;
let laserOn;
let laserOff;

// SOUNDS
let playerHitSound;
let fail;
let win;
let collect;
let walking;

// SOCIAL BATTERY
let socialBattery = 100;

// FIREFLY BADGE
let badgeUnlocked = false;
let badgeX = 0;
let badgeY = 0;
let badgeScale = 1;
let badgeMessageTimer = 0;

// FIREFLY SPRITE SHEET
const FIREFLY = {
  frameWidth: 276.125,
  frameHeight: 268,
  numFrames: 8,
  animSpeed: 11,
  scale: 0.09,
};

// WALL EXPANSION/SHRINK
const WALL_MAX_EXPAND = 23;
const WALL_EXPAND_SPEED = 0.06;
const WALL_SHRINK_SPEED = 0.02;
const PROXIMITY_RADIUS = 7;
let wallExpansion = [];
let wallVariation = [];

// WALL MECHANIC (LOSE STATE)
let trappedTimer = 0;
const TRAPPED_DELAY = 30;

// PLAYER PERSPECTIVE
let camX = 0;
let camY = 0;
const CAM_SMOOTHING = 0.1;

// DIALOGUE (INTRO)
let introDialogueActive = false;
let introDialogueIndex = 0;
const introDialogue = [
  "... School's starting soon, I should get going.",
  "I don't want to be late for class!",
  "Oh, and the fireflies! Don't forget the fireflies.",
];

// LASER DAMAGE
const INVINCIBLE_FRAMES = 60;
let playerInvincible = false;
let invincibleTimer = 0;

const LASER_DAMAGE = 10;

// FOR BORDERS | i.e. for when player gets hit by the laser beams
let hitFlashAlpha = 0;
const HIT_FLASH_MAX = 150;
const HIT_FLASH_DECAY = 8;

// PLAYER HITBOX
const HITBOX_RADIUS = 6;
const HITBOX_OFFSET_Y = 9;

let lasers = [
  //top most laser
  { row: 2.3, col: 6.3, facing: "up", blinkRate: 80, on: true, timer: 0 },
  //right most laser
  { row: 5.3, col: 13.8, facing: "down", blinkRate: 100, on: true, timer: 0 },

  //laser covering longest hallway
  { row: 9.3, col: 18.2, facing: "up", blinkRate: 150, on: true, timer: 0 },

  //LASER BLOCKING THE EXIT
  { row: 7.3, col: 23.2, facing: "up", blinkRate: 60, on: true, timer: 0 },
];

let laserBeams = [
  //top most laser
  {
    x1: 85,
    y1: 96, // beam start (pixel coordinates)
    x2: 260,
    y2: 96, // beam end (pixel coordinates)
    blinkRate: 80, // HAS TO MATCH WITH LASERS ABOVE
    on: true,
    timer: 0,
  },
  {
    x1: 580,
    y1: 248,
    x2: 680,
    y2: 248,
    blinkRate: 100,
    on: true,
    timer: 0,
  },
  {
    x1: 320,
    y1: 380,
    x2: 750,
    y2: 380,
    blinkRate: 150,
    on: true,
    timer: 0,
  },
  {
    x1: 844,
    y1: 300,
    x2: 940,
    y2: 300,
    blinkRate: 60,
    on: true,
    timer: 0,
  },
];

// PLAYER MODEL CONSTRUCTOR
let player;
let collectibles = [];
let collectedCount = 0;

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

    if (socialBattery <= 0) {
      this.vx = 0;
      this.vy = 0;
      if (walking.isPlaying()) walking.stop();
      return;
    }

    let nextX = this.x + this.vx * this.speed;
    let nextY = this.y + this.vy * this.speed;

    const isMoving = this.vx !== 0 || this.vy !== 0;

    if (isMoving && !walking.isPlaying()) {
      walking.play();
    }

    if (!isMoving && walking.isPlaying()) {
      walking.stop();
    }

    if (this.vx !== 0 && canMoveTo(nextX, this.y)) {
      this.x = nextX;
    }
    if (this.vy !== 0 && canMoveTo(this.x, nextY)) {
      this.y = nextY;
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

    let offset = SPRITE.offsets[this.facing];

    image(
      character,
      this.x + offset.x,
      this.y + HITBOX_OFFSET_Y + offset.y,
      drawW,
      drawH,
      srcX,
      srcY,
      frameW,
      frameH,
    );
  }
}

// PLAYER SPRITE SHEET
const SPRITE = {
  frameWidth: 150,
  frameHeight: 300,
  numFrames: 4,
  animSpeed: 20,
  scale: 0.2,
  rows: {
    down: 0,
    up: 1,
    right: 2,
    left: 3,
  },
  offsets: {
    down: { x: 0, y: 0 },
    up: { x: 0, y: 0 },
    right: { x: 0.1, y: -10 },
    left: { x: 2.2, y: -10 },
  },
};

// TUTORIAL PAGE
let showTutorial = false;

const tutorialButton = {
  x: 290,
  y: 420,
  w: 220,
  h: 50,
};

function tileCenter(col, row, offX, offY) {
  return {
    x: offX + col * tileSize + tileSize / 2,
    y: offY + row * tileSize + tileSize / 2,
  };
}

function preload() {
  character = loadImage("assets/images/character.png");
  startScreen = loadImage("assets/images/homescreen.png");
  restartScreen = loadImage("assets/images/restartscreen.png");
  levelOneComplete = loadImage("assets/images/level1complete.png");
  fireflySprite = loadImage("assets/images/firefly.png");
  fireflyBadge = loadImage("assets/images/fireflybadge.png");

  forest = loadImage("assets/images/forest.png");
  wall = loadImage("assets/images/trees.png");
  ground = loadImage("assets/images/dirt.png");
  home = loadImage("assets/images/house.png");
  school = loadImage("assets/images/school.png");
  banner = loadImage("assets/images/HUD.png");

  laserOn = loadImage("assets/images/laserOn.png");
  laserOff = loadImage("assets/images/laserOff.png");

  playerHitSound = loadSound("assets/sounds/hit.mp3");

  fail = loadSound("assets/sounds/fail.mp3");
  win = loadSound("assets/sounds/win.mp3");
  collect = loadSound("assets/sounds/collect.mp3");
  walking = loadSound("assets/sounds/walking.mp3");
  bgMusic = loadSound("assets/sounds/bgmusic.mp3");
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

function draw() {
  imageMode(CORNER);
  rectMode(CORNER);

  background(forest);
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

  if (introDialogueActive) {
    updateCamera();
    push();
    let zoom = 3.5;
    translate(width / 2, height / 2);
    scale(zoom);
    translate(-player.x, -player.y);

    drawMaze();
    player.draw();

    pop();

    drawSocialBar();
    drawIntroDialogueBox();
    return; // skip player movement, lasers, collectibles until she's done talking
  }

  updateCamera();

  if (gameOver) {
    drawLoseScreen();
    return;
  }

  push();

  let zoom = 3.5;

  translate(width / 2, height / 2);
  scale(zoom);
  translate(-player.x, -player.y);

  updateWallExpansion();
  drawMaze();

  updateLasers();
  drawLasers();

  player.update();
  resolveWallPush();

  updateLaserBeams();
  drawLaserBeams();

  updateFireflies();
  drawCollectibles();
  checkCollectibles();
  player.draw();

  //  This is in charge of checking whether the character is colliding with the laser, damaging their SB
  checkLaserPlayerCollision();

  // updateinvincibility checks if the character is invisible, if it is, then the character takesno damage
  //    1 second, otherwise they take damage and the counter is reset to 60 FRAMES (aka 1 second)
  updateInvincibility();

  pop();

  if (hitFlashAlpha > 0) {
    hitFlashAlpha = max(0, hitFlashAlpha - HIT_FLASH_DECAY);
    drawRedFlash(hitFlashAlpha);
  }

  drawVignette();

  updateBadge();
  drawBadge();


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
  if (introDialogueActive && (key === " " || keyCode === ENTER)) {
    introDialogueIndex++;
    if (introDialogueIndex >= introDialogue.length) {
      introDialogueActive = false;
    }
    return;
  }

  if (key === " " && !gameStarted) {
    showTutorial = true;

    // start background music once
    if (!bgMusic.isPlaying()) {
      bgMusic.loop(); // loop keeps it playing continuously
    }
  }

  if (key === "r" || key === "R") {
    if (gameOver) restartGame();
  }

  if (key === "n" || key === "N") {
    if (firstLevelComplete) loadSecondLevel();
  }
}

function mousePressed() {
  if (introDialogueActive) {
    introDialogueIndex++;
    if (introDialogueIndex >= introDialogue.length) {
      introDialogueActive = false;
    }
    return; // don't let this click fall through to help button etc.
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
        introDialogueActive = true;
        introDialogueIndex = 0;
      }
    }
  }

  // Help button on the HUD
  if (mouseX >= 1210 && mouseX <= 1240 && mouseY >= 15 && mouseY <= 45) {
    showTutorial = true;
    return;
  }
}

// COLLISION CHECK
function canMoveTo(x, y) {
  let feetY = y + HITBOX_OFFSET_Y;

  let points = [
    [x - HITBOX_RADIUS, feetY],
    [x + HITBOX_RADIUS, feetY],
    [x, feetY - HITBOX_RADIUS],
    [x, feetY + HITBOX_RADIUS],
  ];

  for (let [px, py] of points) {
    let col = floor(px / tileSize);
    let row = floor(py / tileSize);

    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return false;

    let tile = maze[row][col];
    if (tile !== 0 && tile !== 2 && tile !== 3) return false;

    // NEW: also block if this point falls inside a nearby wall's expanded footprint
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let nr = row + dr,
          nc = col + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (maze[nr][nc] !== 1) continue;

        let expand = getFlowingExpand(nr, nc);
        let left = nc * tileSize - expand;
        let right = nc * tileSize + tileSize + expand;
        let top = nr * tileSize - expand;
        let bottom = nr * tileSize + tileSize + expand;

        if (px > left && px < right && py > top && py < bottom) return false;
      }
    }
  }

  return true;
}

// WALL EXPANSION
function resolveWallPush() {
  let radius = HITBOX_RADIUS;
  let feetX = player.x;
  let feetY = player.y + HITBOX_OFFSET_Y;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1) continue;

      let expand = getFlowingExpand(r, c);

      let wallLeft = c * tileSize - expand;
      let wallRight = c * tileSize + tileSize + expand;
      let wallTop = r * tileSize - expand;
      let wallBottom = r * tileSize + tileSize + expand;

      let closestX = constrain(feetX, wallLeft, wallRight);
      let closestY = constrain(feetY, wallTop, wallBottom);

      let dx = feetX - closestX;
      let dy = feetY - closestY;
      let d = sqrt(dx * dx + dy * dy);

      if (d < radius && d > 0) {
        let overlap = radius - d;
        player.x += (dx / d) * overlap;
        player.y += (dy / d) * overlap;
      }
    }
  }
}

function initWallExpansion() {
  for (let r = 0; r < ROWS; r++) {
    wallExpansion[r] = [];
    wallVariation[r] = [];
    for (let c = 0; c < COLS; c++) {
      wallExpansion[r][c] = 0;
      wallVariation[r][c] = random(0.6, 1.3);
    }
  }
}

function updateWallExpansion() {
  let batteryTarget = map(socialBattery, 100, 0, 0, 1);
  batteryTarget = constrain(batteryTarget, 0, 1);
  batteryTarget = pow(batteryTarget, 3);

  let playerCol = player.x / tileSize;
  let playerRow = player.y / tileSize;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (maze[r][c] !== 1) continue;

      let d = dist(c, r, playerCol, playerRow);
      let proximity = constrain(map(d, 0, PROXIMITY_RADIUS, 1, 0), 0, 1);

      let target;
      if (socialBattery <= 0) {
        target = 1; // still fully locks at zero, variation doesn't apply here
      } else {
        target = batteryTarget * proximity * wallVariation[r][c];
        target = constrain(target, 0, 1); // in case variation pushes it over 1
      }

      if (wallExpansion[r][c] < target) {
        wallExpansion[r][c] = min(
          wallExpansion[r][c] + WALL_EXPAND_SPEED,
          target,
        );
      } else if (wallExpansion[r][c] > target) {
        wallExpansion[r][c] = max(
          wallExpansion[r][c] - WALL_SHRINK_SPEED,
          target,
        );
      }
    }
  }
}

function getFlowingExpand(r, c) {
  let base = wallExpansion[r][c] * WALL_MAX_EXPAND;

  // Each tile gets its own noise "channel" via offset seeds (r, c),
  // animated over time via frameCount. This makes every wall wobble
  // independently and smoothly, rather than in lockstep.
  let n = noise(c * 0.3, r * 0.3, frameCount * 0.01);

  // Map noise (0–1) to a wobble range, e.g. ±3px
  let wobble = map(n, 0, 1, -3, 3);

  // Only wobble once the wall has started expanding —
  // fully-open walls (expansion 0) shouldn't wiggle at all
  wobble *= wallExpansion[r][c];

  return base + wobble;
}

// COLLECTIBLES
function setupCollectibles() {
  collectibles = [
    // Top section
    {
      col: 2,
      row: 1,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 10,
      row: 2,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 16,
      row: 3,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 20,
      row: 5,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },

    // Middle section
    {
      col: 3,
      row: 8,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 8,
      row: 9,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 16,
      row: 9,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },

    // Bottom section
    {
      col: 5,
      row: 10,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 12,
      row: 11,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 17,
      row: 11,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
    {
      col: 22,
      row: 12,
      collected: false,
      frame: floor(random(FIREFLY.numFrames)),
      frameTimer: 0,
    },
  ];
}

function updateFireflies() {
  for (let item of collectibles) {
    if (item.collected) continue;

    item.frameTimer++;

    if (item.frameTimer >= FIREFLY.animSpeed) {
      item.frameTimer = 0;

      item.frame = (item.frame + 1) % FIREFLY.numFrames;
    }
  }
}

function drawCollectibles() {
  imageMode(CENTER);

  for (let item of collectibles) {
    if (item.collected) continue;

    let x = item.col * tileSize + tileSize / 2;
    let y = item.row * tileSize + tileSize / 2;

    let sx = item.frame * FIREFLY.frameWidth;
    let sy = 0;

    let dw = FIREFLY.frameWidth * FIREFLY.scale;
    let dh = FIREFLY.frameHeight * FIREFLY.scale;

    image(
      fireflySprite,
      x,
      y,
      dw,
      dh,
      sx,
      sy,
      FIREFLY.frameWidth,
      FIREFLY.frameHeight,
    );
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
        collect.play();

        if (collectedCount === collectibles.length && !badgeUnlocked) {
          badgeUnlocked = true;

          badgeX = width / 2;
          badgeY = height / 2 - 80;

          badgeScale = 1.3;

          badgeMessageTimer = 180;
        }
      }
    }
  }
}

// DIALOGUE BOX (INTRO)
function drawIntroDialogueBox() {
  const boxW = 900;
  const boxH = 140;
  const boxX = (width - boxW) / 2;
  const boxY = height - boxH - 40;

  fill(20, 20, 30, 230);
  stroke(255);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 12);

  noStroke();
  fill(255, 220, 120);
  textAlign(LEFT, TOP);
  textFont("Monospace");
  textStyle(BOLD);
  textSize(18);
  text("Faith", boxX + 30, boxY + 18);

  fill(255);
  textStyle(NORMAL);
  textSize(16);
  text(
    introDialogue[introDialogueIndex],
    boxX + 30,
    boxY + 55,
    boxW - 60,
    boxH - 80,
  );

  fill(200);
  textAlign(RIGHT, BOTTOM);
  textSize(13);
  text("click or press SPACE to continue", boxX + boxW - 20, boxY + boxH - 12);
}

// BADGE
function drawBadge() {
  if (!badgeUnlocked) return;

  imageMode(CENTER);

  let badgeSize = 300 * badgeScale;

  image(fireflyBadge, badgeX, badgeY, badgeSize, badgeSize);

  if (badgeMessageTimer > 0) {
    fill(255);
    stroke(0);
    strokeWeight(4);

    textAlign(CENTER);

    textSize(26);
    text("Firefly Collector Badge Earned!", width / 2, height / 2 + 130);

    textSize(18);

    text("You collected all 11 fireflies!", width / 2, height / 2 + 165);

    text(
      "Don't forget to make your way to school.",
      width / 2,
      height / 2 + 195,
    );

    noStroke();
  }
}

function updateBadge() {
  if (!badgeUnlocked) return;

  if (badgeMessageTimer > 0) {
    badgeMessageTimer--;
  } else {
    badgeX = lerp(badgeX, width - 120, 0.08);

    badgeY = lerp(badgeY, 100, 0.08);

    badgeScale = lerp(badgeScale, 0.25, 0.08);
  }
}

// BLACK VIGNETTE ON SCREEN
function drawVignette() {
  let ctx = drawingContext;

  let gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    height / 4,
    width / 2,
    height / 2,
    height / 1.1,
  );

  gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 2)");

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// MAZE
function drawMaze() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      let tile = maze[row][col];

      noStroke();

      if (tile === 1) {
        let expand = wallExpansion[row][col] * WALL_MAX_EXPAND;
        image(
          wall,
          col * tileSize - expand,
          row * tileSize - expand,
          tileSize + expand * 2,
          tileSize + expand * 2,
        );
      } else {
        // Floor blocks
        if (tile === 0) {
          image(ground, col * tileSize, row * tileSize, tileSize, tileSize);
        }
        // Start from home block
        else if (tile === 2) {
          image(home, col * tileSize, row * tileSize, tileSize, tileSize);
        }
        // Exit to school block
        else if (tile === 3) {
          image(school, col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }
    }
  }

  // Trapped Wall if Social Battery = 0
  if (socialBattery <= 0) {
    socialBattery = 0;
    trappedTimer++;
    if (trappedTimer >= TRAPPED_DELAY) {
      gameOver = true;
      fail.play();
    }
  }
}

// HEADS-UP DISPLAY (HUD)
function drawSocialBar() {
  fill(5, 8, 65);
  image(banner, 0, 0, width, 60);

  // Objective
  fill(255);
  textAlign(LEFT, TOP);
  textFont("Monospace");
  textSize(15);
  text("LVL 1: Make your way to school!", 50, 24);

  // Firefly Count
  textSize(15);
  text(
    "Fireflies: " + collectedCount + " / " + collectibles.length,
    50,
    height - 34,
  );

  // Controls
  text("W A S D to move", 50, height - 14);

  // Social Battery Bar
  textAlign(RIGHT, TOP);
  fill(255);
  textSize(15);
  text("Social Battery", 980, 25);
  fill(80);
  rect(1000, 20, 190, 20);
  fill(100, 220, 120);
  rect(1000, 20, socialBattery * 1.9, 20);

  // Help button at the end of social battery bar
  fill(255, 220, 120);
  circle(1225, 30, 30);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("?", 1225, 30);
}

// LASERS
function checkLaserPlayerCollision() {
  if (playerInvincible) return;

  let feetY = player.y + HITBOX_OFFSET_Y;

  for (let l of laserBeams) {
    if (!l.on) continue;

    let minX = min(l.x1, l.x2) - HITBOX_RADIUS;
    let maxX = max(l.x1, l.x2) + HITBOX_RADIUS;
    let minY = min(l.y1, l.y2) - HITBOX_RADIUS;
    let maxY = max(l.y1, l.y2) + HITBOX_RADIUS;

    let hit =
      player.x > minX && player.x < maxX && feetY > minY && feetY < maxY;

    if (hit) {
      socialBattery -= LASER_DAMAGE;

      if (socialBattery < 0) socialBattery = 0;

      // INSERT GAME OVER SCREEN

      playerInvincible = true;
      invincibleTimer = INVINCIBLE_FRAMES;

      playerHitSound.play();

      hitFlashAlpha = HIT_FLASH_MAX;
    }
  }
}

function drawRedFlash(alpha) {
  let borderSize = 30;
  noStroke();
  fill(255, 0, 0, alpha);
  rect(0, 0, width, height);
}

function updateInvincibility() {
  if (playerInvincible) {
    invincibleTimer--;
    if (invincibleTimer <= 0) playerInvincible = false;
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
    let offX = 0,
      offY = 0;
    let edgeOffset = tileSize / 2 - 4; // pushes sprite to the wall's edge

    // "facing" parameter is set in the initilization of the lasers above
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

function updateLaserBeams() {
  for (let l of laserBeams) {
    l.timer++;
    if (l.timer >= l.blinkRate) {
      l.timer = 0;
      l.on = !l.on;
    }
  }
}

function drawLaserBeams() {
  for (let l of laserBeams) {
    if (!l.on) continue; // don't draw when blinking off

    stroke(255, 30, 30, 200);
    strokeWeight(4);
    line(l.x1, l.y1, l.x2, l.y2);
    noStroke();
  }
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

// START SCREEN
function drawStartScreen() {
  image(startScreen, 0, 0, width, height);
}

// LOSE SCREEN
function drawLoseScreen() {
  image(restartScreen, 0, 0, width, height);
}

// RESTART SCREEN
function restartGame() {
  socialBattery = 100;
  gameOver = false;
  trappedTimer = 0;

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


// LEVEL 1 COMPLETE SCREEN
function drawFirstLevelCompleteScreen() {
  image(levelOneComplete, 0, 0, width, height);
}

// TUTORIAL OVERLAY
function drawTutorialOverlay() {
  fill(0, 180);
  rect(0, 0, width, height);

  // Main panel
  const panelW = 780;
  const panelH = 520;
  const panelX = (width - panelW) / 2;
  const panelY = (height - panelH) / 2;

  fill(245);
  rect(panelX, panelY, panelW, panelH, 15);

  // Title
  fill(30);
  textAlign(CENTER, TOP);
  textSize(28);
  textStyle(BOLD);
  textFont("Monospace");
  text("How to Play", width / 2, panelY + 40);

  // WASD Instructions
  textStyle(NORMAL);
  textSize(15);
  text(
    " Help Faith find and collect every firefly as she makes her way through the maze!\n Use WASD to move Faith.",
    width / 2,
    panelY + 80,
  );

  // Three Boxes
  const boxW = 170;
  const boxH = 170;
  const gap = 55;

  const startX = width / 2 - (boxW * 3 + gap * 2) / 2;
  const boxY = panelY + 135;

  // Draw forest background in each box
  imageMode(CORNER);

  for (let i = 0; i < 3; i++) {
    let x = startX + i * (boxW + gap);

    image(forest, x, boxY, boxW, boxH);

    noFill();
    stroke(40);
    strokeWeight(2);
    rect(x, boxY, boxW, boxH, 10);
  }

  noStroke();

  // Images in each box
  imageMode(CENTER);

  // Box 1: Laser
  let laserX = startX + boxW / 2;
  let laserY = boxY + boxH / 2;
  image(laserOn, laserX, laserY, boxW * 0.75, boxH * 0.75);

  // Box 2: Firefly
  let fireflyX = startX + (boxW + gap) + boxW / 2 - 5;
  let fireflyY = boxY + boxH / 2;
  image(
    fireflySprite,
    fireflyX,
    fireflyY,
    120, 
    120,
    0,
    0,
    FIREFLY.frameWidth,
    FIREFLY.frameHeight,
  );

  // Box 3: Player (Faith
  let faithX = startX + 2 * (boxW + gap) + boxW / 2;
  let faithY = boxY + boxH / 2 - 10;

  // Animate walking
  let frame = floor(frameCount / 12) % SPRITE.numFrames;

  image(
    character,
    faithX,
    faithY,
    95, // wider
    190, // taller
    frame * SPRITE.frameWidth,
    SPRITE.rows.right * SPRITE.frameHeight,
    SPRITE.frameWidth,
    SPRITE.frameHeight,
  );

  // Instruction Text
  fill(30);
  textSize(16);
  textAlign(CENTER, TOP);

  text(
    "Watch out for\nlasers on the walls!",
    startX + boxW / 2,
    boxY + boxH + 18,
  );

  text(
    "Collect fireflies\nalong the way!",
    startX + boxW + gap + boxW / 2,
    boxY + boxH + 18,
  );

  text(
    "Guide Faith\nto the end!",
    startX + 2 * (boxW + gap) + boxW / 2,
    boxY + boxH + 18,
  );

  // Continue Button
  tutorialButton.w = 180;
  tutorialButton.h = 45;
  tutorialButton.x = width / 2 - tutorialButton.w / 2;
  tutorialButton.y = panelY + panelH - 100;

  fill(55, 85, 180);
  rect(
    tutorialButton.x,
    tutorialButton.y,
    tutorialButton.w,
    tutorialButton.h,
    10,
  );

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("Continue", width / 2, tutorialButton.y + tutorialButton.h / 2);
}

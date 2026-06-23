
const tileSize = 50;
const COLS = 16;
const ROWS = 12;


let gameStarted = false;
let firstLevelComplete = false;
let secondLevelComplete = false;
let thirdLevelComplete = false;
let socialBattery= 100;




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
 fill (255);
 text ("Social Battery", 550, 20);


 fill(80);
 rect(560, 15, 190, 20);


 fill(100, 220, 120);
 rect(560, 15, socialBattery * 1.9, 20);
}



// Settings! //
const PLAYER_SPEED = 5; // The number of pixels the player moves along its path per frame
const X_AXIS_DIFF = 100; // Higher values = x axis stretched more (this is in pixels wide)
const Y_AXIS_SCALE = 5; // Higher values = y axis stretched more (this is a multiple of the canvas height, that is used to map the points between)
const SCORE_RATE = 10; // Lower values = gain score faster
const BG_SCROLL_RATE = 3; // Higher values = bg scrolls more per point (e.g by default move 5 pixels for every point)
///////////////

let levelData; let levelPoints = []; let player; let score = 0; let newScore = 0; let loaded = false; let failed = false; let soundPlayed = false; let bgPos = 0;
let pImg, gImg, potImg, dingSound, angryImg, angryHeartImg, backgroundImg, fireworkImg, focusedImg, happyHeartImg, skullImg, cloudImg, poopImg;

function loadSoundFile() {
  loadSound("assets/ding.ogg", soundFileLoaded, loadImages);
}

function soundFileLoaded(s) {
  dingSound = s;

  loadImages(0);
}

function loadImages(i) {
  switch (i) {
    case 0:
      loadImage("assets/cat.png", (p) => {
        pImg = p;
        loadImages(1);
      }, failedToLoad);

      break;
    case 1:
      loadImage("assets/gold.png", (p) => {
        gImg = p;
        loadImages(2);
      }, failedToLoad);

      break;
    case 2:
      loadImage("assets/goldPot.png", (p) => {
        potImg = p;
        loadImages(3);

      }, failedToLoad);

      break;

    case 3:
      loadImage("assets/angry_cat.png", (p) => {
        angryImg = p;
        loadImages(4);

      }, failedToLoad);

      break;

    case 4:
      loadImage("assets/angry_hearts.png", (p) => {
        angryHeartImg = p;
        loadImages(5);

      }, failedToLoad);

      break;

    case 5:
      loadImage("assets/stonk.png", (p) => {
        backgroundImg = p;
        loadImages(6);

      }, failedToLoad);

      break;

    case 6:
      loadImage("assets/fireworks.png", (p) => {
        fireworkImg = p;
        loadImages(7);

      }, failedToLoad);

      break;

    case 7:
      loadImage("assets/focus_cat.png", (p) => {
        focusedImg = p;
        loadImages(8);

      }, failedToLoad);

      break;

    case 8:
      loadImage("assets/happy_hearts.png", (p) => {
        happyHeartImg = p;
        loadImages(9);

      }, failedToLoad);

      break;

    case 9:
      loadImage("assets/skull.png", (p) => {
        skullImg = p;
        loadImages(10);

      }, failedToLoad);

      break;

    case 10:
      loadImage("assets/poop.png", (p) => {
        poopImg = p;
        loadImages(11);

      }, failedToLoad);

      break;

    case 11:
      loadImage("assets/cloud.png", (p) => {
        cloudImg = p;
        loadImages(12);

      }, failedToLoad);

      break;

    default:
      loadDataFile();
      break;
  }
}

function imageFilesLoaded(p) {
  pImg = p;

  loadDataFile();
}

function loadDataFile() {
  loadTable("numbers.csv", "csv", dataFileLoaded, failedToLoad);
}

function dataFileLoaded(d) {
  levelData = d;

  levelData = levelData.getColumn(1);
  levelPoints = generatePointsFromData(levelData, X_AXIS_DIFF, Y_AXIS_SCALE);
  player = new Player(levelPoints[0].pos.x, levelPoints[0].pos.y, 50);

  loaded = true;
}

function failedToLoad() {
  failed = true;
}

function setup() {
  createCanvas(800, 600);

  loadSoundFile();

  frameRate(60);
  textSize(20);
  angleMode(DEGREES);
}

function generatePointsFromData(data, xInc, heightScale) {
  let points = [];
  let minData = min(data);
  let maxData = max(data);
  let x = 0;

  for (let i = 0; i < data.length; i++) {
    let y = map(data[i], minData, maxData, height * heightScale, 0);

    points.push({
      pos: createVector(x, y),
      correct: null,
      scored: false,
      soundPlayed: false,
    });

    x += xInc;
  }

  return points
}

function draw() {
  if (loaded == true) {
    // image(backgroundImg, -(player.pos.x % 12000) / 10, 0, 12000, 600); // Move with player
    bgPos = lerp(bgPos, score * BG_SCROLL_RATE, 0.1);
    image(backgroundImg, -bgPos - 100, 0, 3000, 600); // Move with score

    push();
    translate(-player.pos.x + width / 2, -player.pos.y + height / 2); // Centralise on player's position

    // Drawing the points.
    fill(50);
    imageMode(CENTER);
    ellipseMode(CENTER);
    for (let i = player.curTarget - 40; i < player.curTarget; i++) { // Only draw a max of 40 points
      if (i >= 0) {
        if (levelPoints[i].correct == true) {
          image(gImg, levelPoints[i].pos.x, levelPoints[i].pos.y, 30, 30);

          if(levelPoints[i].soundPlayed === false){
            dingSound.play();
            levelPoints[i].soundPlayed = true;
          }
        }
        else if (levelPoints[i].correct == false) {
          image(poopImg, levelPoints[i].pos.x, levelPoints[i].pos.y, 30, 30);
        }
        else {
          image(cloudImg, levelPoints[i].pos.x, levelPoints[i].pos.y, 50, 40);
        }
      }
    }

    // Player
    player.update(levelPoints[player.curTarget - 1].pos, levelPoints[player.curTarget].pos, levelPoints.length);
    player.draw();

    if (player.curTarget >= levelPoints.length - 1 && player.progress >= 1) {
      noLoop();
    }

    pop();

    // Score
    if (frameCount % SCORE_RATE == 0) {
      if (keyIsDown(32) || touchesOnCanvas() == true) { // 32 === spacebar
        player.setImg(focusedImg);

        if (player.dir == "up") {
          levelPoints[player.curTarget].correct = true;

          if (levelPoints[player.curTarget].scored == false) {
            newScore++;
            levelPoints[player.curTarget].scored = true;
          }
        }
        else if (player.dir == "down") {
          levelPoints[player.curTarget].correct = false;

          if (levelPoints[player.curTarget].scored == false) {
            newScore--;
            levelPoints[player.curTarget].scored = true;
          }
        }
        else {
          levelPoints[player.curTarget].correct = null;
        }
      }
      else {
        if (player.state == "neutral") {
          player.setImg(pImg);
        }
      }
    }

    image(potImg, 15, 15, 80, 80);
    fill('#fff');
    textSize(25);
    textAlign(CENTER, CENTER);
    text(score, 15, 15, 80, 80);
  }
  if (failed == true) {
    text("Failed to load Image or Data", 20, 20);
  }
}

function keyPressed() {
  if (key == " ") {
    player.startScoring();
  }
}

function keyReleased() {
  if (key == " ") {
    let s = player.endScoring();

    player.startShowScore();

    if (s > 0) {
      player.setHappy();
    }
    else if (s < 0) {
      player.setAngry();
    }
  }
}

function touchesOnCanvas() {
  if (touches.length > 0) {
    if (touches[0].x >= 0 && touches[0].x <= width && touches[0].y >= 0 && touches[0].y <= height) {
      return true;
    }
    return false;
  }
}

class Player {
  constructor(x, y, size) {
    this.pos = createVector(x, y);
    this.speed = PLAYER_SPEED;
    this.progress = 0; // Percentage progress to next point
    this.size = size;
    this.curTarget = 1;
    this.dir = "up";
    this.state = "neutral";
    this.img = pImg;
    this.pressedPos = 0;
    this.animEnd = 0;
    this.showScore = false;
    this.scoreEnd = 0;
  }

  update(prev, next, max) {
    if (this.curTarget < max) {
      if (this.progress > 1) {
        this.progress = 0;
        this.curTarget++;
      } else {
        // Check if the player is moving up or down.
        if (prev.y < next.y) { // Down / neutral
          this.dir = "down";
        }
        else if (prev.y == next.y) {
          this.dir = "none";
        }
        else {
          this.dir = "up";
        }

        let inc = this.speed / dist(prev.x, prev.y, next.x, next.y); // Calculate distance to increment between the points so player moves at a constant speed.
        this.progress += inc;
        this.pos = p5.Vector.lerp(prev, next, this.progress);
      }

      if (Date.now() >= this.animEnd && this.state != "neutral") {
        this.setNeutral();
      }

      if (Date.now() >= this.scoreEnd && this.showScore == true) {
        this.endShowScore();
      }
    }
  }

  draw() {
    imageMode(CENTER);
    noStroke();
    image(this.img, this.pos.x, this.pos.y, this.size * 2 + 10, this.size);

    if (this.state == "happy") {
      //image(happyHeartImg, this.pos.x + 30, this.pos.y - 30, this.size + 30, this.size + 40);
      image(fireworkImg, this.pos.x + 40, this.pos.y - 50, this.size, this.size);
    }
    else if (this.state == "angry") {
      //image(angryHeartImg, this.pos.x, this.pos.y - 50, this.size/2, this.size/2);
      image(skullImg, this.pos.x + 40, this.pos.y - 50, this.size, this.size);
    }

    fill(255);
    stroke(0);
    strokeWeight(2);
    if (this.showScore == true) {

      if (newScore >= 0) {
        text("+ " + newScore, this.pos.x, this.pos.y + this.size + 5);
      }
      else {
        text(newScore, this.pos.x, this.pos.y + this.size + 5);
      }
    }
  }

  startShowScore() {
    this.scoreEnd = Date.now() + 500;
    this.showScore = true;
  }

  endShowScore() {
    this.scoreEnd = 0;
    this.showScore = false;
    score += newScore;
    newScore = 0;
  }

  startScoring() {
    this.pressedPos = this.pos.y;
  }

  endScoring() {
    let releasedPos = this.pos.y;

    return floor((this.pressedPos - releasedPos) / 10);
  }

  setImg(i) {
    this.img = i;
  }

  setAngry() {
    this.state = "angry";
    this.setImg(angryImg);

    this.animEnd = Date.now() + 2000; // Remain in state for 2 seconds
  }

  setHappy() {
    this.state = "happy";
    this.setImg(pImg);

    this.animEnd = Date.now() + 2000;
  }

  setNeutral() {
    this.state = "neutral";
  }
}
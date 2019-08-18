"use-strict";

const audioFilePath = '';
// const canvasCenter = sqrCanvasSide / 2;
var CANVAS_SIZE;
var CANVAS_CENTER;
var CANVAS_HALF_DIAG;

const LOG_FRAME_DELTA = 1;
const MAX_LOG_FRAMES = 200;
let FRAME_COUNTER = 0;
let LOG_FRAME_COUNTER = 0;
const V = p5.Vector;

function setup() {
  CANVAS_SIZE =  640;
  CANVAS_CENTER = CANVAS_SIZE / 2;
  CANVAS_HALF_DIAG = sqrt(2) * CANVAS_SIZE / 2;
  
  // FRAME_COUNTER = 0;
  // LOG_FRAME_DELTA = 60;

  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
}

function draw() {
  FRAME_COUNTER++;
  background(120);

  const startRadius = 40;

  ellipseMode(CENTER)
  const steps = 100;

  fill(255);
  noStroke();

  let mousePos = createVector(mouseX, mouseY);

  [
    createVector(0, 0)
    // , createVector(width, 0),
    // , createVector(0, height)
    // , createVector(width, height)
  ].forEach(v => {
    drawTentacle(startRadius, v, mousePos, steps);
  });
}

const minRadius = 1;
let per = 0;

function drawTentacle(startRadius, startPos, endPos, steps){
  const distVector = V.sub(endPos, startPos);
  const totalDist = distVector.mag();
  
  function getPercent(currPos){
    let currVec = V.sub(currPos, startPos);
    return (totalDist - currVec.mag()) / totalDist;
  }

  let offset = startPos;
  let radius = startRadius;
  let v = distVector.copy().normalize();
  for (let i = 0; i < steps; i++){
    push();
    translate(offset.x, offset.y);
    // clog(`offset: (${offset.x},${offset.y}) radius: ${radius}`)
    ellipse(0, 0, radius);

    fill(0);
    if (per > 75)
      text(parseInt(per) ,0, 0);
    pop();

    // update offset
    offset = V.add(offset, v.copy().mult(radius));

    // update radius
    let percent =  getPercent(offset);
    if (percent > 1.0) break;
    per = percent * 100;

    // linear falloff
    // let scaleFactor = percent;
    let scaleFactor = 0.5 * percent;
    radius = clamp(scaleFactor * startRadius, minRadius, startRadius);
  }
}

// returns 1 if rot == 0, sqrt(2) if rot == 1
function sideScaler(rot){
  const sqrt2 = sqrt(2);
  return rot * sqrt2 + (1 - rot);
}

var l = 0;
function distance(x1, y1, x2, y2){
  let res = sqrt(pow(x1-x2, 2) + Math.pow(y1-y2, 2));
  if (++l % 12 === 0){
    // clog(`Distance(${x1},${y1},${x2},${y2}) = ${res}`);
  }
  return res
}

function clamp(n, min, max) {
   return Math.min(Math.max(n, min), max);
}

function clog(str){
  if (LOG_FRAME_COUNTER > MAX_LOG_FRAMES-1) 
    return;

  if (FRAME_COUNTER % LOG_FRAME_DELTA === 0){
    LOG_FRAME_COUNTER++;
    console.log(LOG_FRAME_COUNTER); 
    console.log(str);
  }
}


function getAudio(){
  fs.readFile(audioFilePath, (err, data) => {
    if (err) {
      throw err;
    }

    
  });
}
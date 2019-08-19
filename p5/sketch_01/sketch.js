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
  noStroke();
  ellipseMode(CENTER);
}

function draw() {
  FRAME_COUNTER++;
  
  // clear the screen
  background(120);

  const startRadius = 40;
  const maxSpread = 20;
  const mousePos = createVector(mouseX, mouseY);
  
  [
    createVector(0, 0)
    // , createVector(width, 0),
    // , createVector(0, height)
    // , createVector(width, height)
  ].forEach(startPos => {
    drawTentacle(startRadius, startPos, mousePos, maxSpread);
  });
}

const minRadius = 1;
let per = 0;

function drawTentacle(startRadius, startPos, endPos, maxSpread){
  const maxSteps = 100;
  const distVector = V.sub(endPos, startPos);
  const totalDist = distVector.mag();
  const getPercent = (currPos) => {
    let currVec = V.sub(currPos, startPos);
    let currDist = currVec.mag();
    return currDist / totalDist;
  }

  let offset = startPos;
  let radius = startRadius;
  let v = distVector.copy().normalize();
  for (let i = 0; i < maxSteps; i++){
    
    push();
    
    /* Draw logic */
    translate(offset.x, offset.y);
    ellipse(0, 0, radius);
 

    pop();

    /* Update state */
    const oldRadius = radius;

    const percent =  getPercent(offset);
    if (percent > 1.0) break;
    
    const scaleFactor = (1 - percent);
    radius = clamp(scaleFactor * startRadius, minRadius, startRadius);
    
    const newRadius = radius;
    const spreadCurve = getSpreadCurve(startPos, endPos, maxSpread); // Gets the function that will calculate spread
    
    let delta = (oldRadius + newRadius)/2;
    delta += spreadCurve(offset);

    offset = V.add(offset, v.copy().mult(delta));

    /* Update debug vars */
    per = scaleFactor * 100;
  }
}

function getSpreadCurve(startPos, endPos, maxSpread){
  const canvasSize = createVector(CANVAS_SIZE, CANVAS_SIZE).mag();
  const totalDist = V.sub(endPos, startPos).mag();

  if (totalDist === 0) return (currPos) => 0; // Edge case where distance is zero
  
  const totalPercent = totalDist / canvasSize;
  const adjustedMaxSpread = totalPercent * maxSpread;

  return function(currPos){
    const currDist = V.sub(currPos, startPos).mag();
    const percent = currDist / totalDist;
    return sqrt(1 - percent) * adjustedMaxSpread;
  }
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
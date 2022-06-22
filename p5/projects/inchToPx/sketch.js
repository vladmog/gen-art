


inchDimensions = {
  x: 3,
  y: 3
}

pxDimensions = {
  x: 391,
  y: 391
}



function setup() {


  createCanvas(pxDimensions.x, pxDimensions.y, SVG);
  strokeWeight(1);
  stroke(0);
  noFill();
  angleMode(DEGREES);
  frameRate(30);
}

let iterator = 90;

function draw() {

  const penLineWidth = mmToInch(20)
  strokeWeight(inchToPx(penLineWidth))
 
  // background(200);
  line(0,0,width,height)

  // save("mySVG.svg"); // give file name
  // noLoop(); // we just want to export once
  noLoop(); 
}




/*
On 3K screen, 1 inch = 130.3 px
aka 3 inches = 391 px

Line width reference:

Paper: Brown Sketchbook paper stack
Pen              Line width (inches)
Pilot G2 0.38    
Pilot G2 0.7
Sharpie

Paper: Printer paper on hardwood
Pen              Line width (inches)
Pilot G2 0.38    
Pilot G2 0.7
Sharpie

Paper: Post-It Sticky Note
Pen              Line width (inches)
Pilot G2 0.38    
Pilot G2 0.7
Sharpie

Paper: Rel MoleSkine
Pen              Line width (inches)
Pilot G2 0.38    
Pilot G2 0.7
Sharpie

Paper: Rhodia Webnotebook
Pen              Line width (inches)
Pilot G2 0.38    
Pilot G2 0.7
Sharpie


*/

const inchDimensions = {
    x: 3,
    y: 3
}

const pxDimensions = {
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

  const inchToPx = (inches) => {
      const px = (pxDimensions.x * inches)/inchDimensions.x
      return px
  }

  const mmToPx = (mm) => {
    const px = (pxDimensions.x * mm)/(inchDimensions.x * 25.4)
    return px
  }

  const pxToInch = (px) => {
    const inches = (inchDimensions.x * px)/pxDimensions.x
    return inches
  }

  const pxToMM = (px) => {
    const inches = (inchDimensions.x * px)/pxDimensions.x
    const mm = inches * 24.4
    return mm
  }

  const mmToInch = (mm) => {
      const inches = mm/25.4;
      return inches
  }

  const inchToMM = (inches) => {
      const mm = inches * 25.4
      return mm
  }

  const penLineWidth = mmToInch(20)
  strokeWeight(inchToPx(penLineWidth))
 
  // background(200);
  line(30,30,300,300)

  save("mySVG.svg"); // give file name
  // noLoop(); // we just want to export once
  noLoop(); 
}




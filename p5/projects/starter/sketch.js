
function setup() {
  createCanvas(500,500, SVG);
  strokeWeight(1);
  stroke(0);
  noFill();
  angleMode(DEGREES);
  frameRate(30);
}



function draw() {
 

  line(30,30,300,300)

  noLoop(); 
  save("mySVG.svg")
}




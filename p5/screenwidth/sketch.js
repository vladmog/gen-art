let w = 0
let h = 0

function setup() {
  w = windowWidth
  h = windowHeight
  createCanvas(w,h);
  strokeWeight(1);
  stroke(0);
  noFill();
  angleMode(DEGREES);
  frameRate(30);
}



function draw() {
 
  background(200);
  line(0,0,w,h)
  ellipse(w/2, h/2, 60)

  noLoop(); 
}




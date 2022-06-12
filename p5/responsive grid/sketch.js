/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
 function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

let img1;
let img2;
let cnv;
// let luminance;
let grayscale;
let hsl;
let res = 55;
let count = 7;
let strokeRange = [1, 2];
let maxAmp = 3;
let period = 1;
let alternator = true;
function preload() {
  img2 = loadImage("./assets/jesus.jpg");
  img1 = loadImage("./assets/satan.jpg")
}

function setup() {
  angleMode(DEGREES);
  let canvasWidth = 600;
  let canvasHeight = 600;
  const imgToCanvas = (imgCoord, img) => {
    // Use when referencing enlarged coordinates via image coordinates
    
    let coords = {
      x: map(imgCoord.x, 0, img.width, 0, canvasWidth),
      y: map(imgCoord.y, 0, img.height, 0, canvasHeight)
    }
    return coords
  };
  const canvasToImg = (grandCoord, img) => {
    // Use when referencing image coordinates via enlarged coordinates
    
    let coords = {
      x: map(grandCoord.x, 0, canvasWidth, 0, img.width),
      y: map(grandCoord.y, 0, canvasHeight, 0, img.height)
    }
    return coords
  };

  cnv = createCanvas(canvasWidth, canvasHeight);
  noFill(); 
  strokeWeight(0.5)
  stroke(0)

  
  background(255)
  
  const drawBlock = (origin, minWidth, maxWidth,img1,img2) => {
    let img1Coords = canvasToImg(origin,img1)
    let img2Coords = canvasToImg(origin, img2)
    let {x,y} = origin;
    let c1 = img1.get(img1Coords.x,img1Coords.y);
    let hsl1 = rgbToHsl(c1[0], c1[1], c1[2]);
    let luminance1 = hsl1[2];
    
    let c2 = img2.get(img2Coords.x,img2Coords.y);
    let hsl2 = rgbToHsl(c2[0], c2[1], c2[2]);
    let luminance2 = hsl2[2];
        

    
    let balance = 0.65;
    let luminance = map(balance, 0, 1, luminance1, luminance2)
    
    
    let width = map(luminance, 1, 0, minWidth, maxWidth)
    let x1 = x4 = x - width/2;
    let x2 = x3 = x + width/2;
    let y1 = y2 = y - width/2;
    let y3 = y4 = y + width/2;
    
    // quad(x1,y1,x2,y2,x3,y3,x4,y4)
    line(x1, y1, x2, y2)
    line(x2, y2, x3, y3)
    line(x3, y3, x4, y4)
    line(x4, y4, x1, y1)
    
    let maxAmp = .2;
    let period = .2;
    
  }

  let rows = 200;
  let cols = 200;
  let margin = 0;
  let reducer = .5;
  let blockMaxWidth = ((width - margin*2)/rows)*0.8;
  let blockMinWidth = blockMaxWidth * reducer;
  for (let row = 0; row <= rows; row++) {
    for (let col = 0; col <= cols; col++) {
      let x = map(col, 0, cols, 0 + margin, width-margin);
      let y = map(row, 0, rows, 0+margin, height-margin);
      
      
      drawBlock({x,y}, blockMinWidth, blockMaxWidth, img1, img2)
      
    }
  }
  

  noLoop();
  
}

function draw() {
  // save("mySVG.svg"); // give file name
  // print("saved svg");
  // noLoop(); // we just want to export once
}

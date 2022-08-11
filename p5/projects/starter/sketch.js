// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 4;
const plotH = 4;
const scale = 1;
dim.updateDims(plotW, plotH, scale);

// Derive stroke weight
const defPen = "Pilot G2 0.7";
const defStrokeWeight = dim.inchToPx(lineWidth(defPen));

// ======== E N D   S E T U P ============

let font;
function preload() {
	font = loadFont("assets/ReliefSingleLine-Regular_svg.otf");
}

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	// noFill();
	angleMode(DEGREES);
	frameRate(6);
}

function draw() {
	line(0, 0, width, height);
	textSize(100);
	textFont(font);
	text("FUCK", width / 2, height / 2);
	noLoop();
	save("mySVG.svg");
}

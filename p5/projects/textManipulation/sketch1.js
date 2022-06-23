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
	font = loadFont("assets/Montauk-8MBd2.otf");
}

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	frameRate(30);
}

function draw() {
	line(0, 0, width, height);

	textFont(font);
	textSize(200);

	points = font.textToPoints("hello", width / 2, height / 2, 200, {
		sampleFactor: 5,
		simplifyThreshold: 0,
	});
	bounds = font.textBounds("hello", width / 2, height / 2, 200);
	console.log(bounds);

	strokeWeight(10);
	point(bounds.x, bounds.y);
	strokeWeight(defStrokeWeight);
	quad(
		bounds.x,
		bounds.y,
		bounds.x + bounds.w,
		bounds.y,
		bounds.x + bounds.w,
		bounds.y + bounds.h,
		bounds.x,
		bounds.y + bounds.h
	);

	beginShape();
	for (let i = 0; i < points.length; i++) {
		const x = points[i].x;
		const y = points[i].y;
		vertex(x, y);
	}
	endShape();
	noLoop();
}

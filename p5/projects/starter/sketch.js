// =========== S E T U P ================
// Enter desired plot size in inches
const wInches = 4;
const hInches = 4;

// Enter pen
const defaultPen = "Pilot G2 0.7";

// Derive canvas size equivalent to plot size
dim.inchDimensions = {
	x: (dim.inchDimensions.x *= wInches),
	y: (dim.inchDimensions.y *= hInches),
};
dim.pxDimensions = {
	x: (dim.pxDimensions.x *= wInches),
	y: (dim.pxDimensions.y *= hInches),
};

// Scale canvas (optional. useful if plot is bigger than screen)
const scaleFactor = 1; // 1 = no scaling applied.
dim.pxDimensions = {
	x: (dim.pxDimensions.x *= scaleFactor),
	y: (dim.pxDimensions.y *= scaleFactor),
};

// Derive stroke weight
const defStrokeWeight = dim.inchToPx(lineWidth(defaultPen));

// ======== E N D   S E T U P ============

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

	noLoop();
	// save("mySVG.svg")
}

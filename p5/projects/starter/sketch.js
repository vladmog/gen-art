// =========== S E T U P ================
// Enter desired plot size in inches
const wInches = 4;
const hInches = 4;

// Enter pen
const defaultPen = "Pilot G2 0.7";

// Derive canvas size equivalent to plot size
inchDimensions = {
	x: (inchDimensions.x *= wInches),
	y: (inchDimensions.y *= hInches),
};
pxDimensions = {
	x: (pxDimensions.x *= wInches),
	y: (pxDimensions.y *= hInches),
};

// Scale canvas (optional. useful if plot is bigger than screen)
const scaleFactor = 1; // 1 = no scaling applied.
pxDimensions = {
	x: (pxDimensions.x *= scaleFactor),
	y: (pxDimensions.y *= scaleFactor),
};

// Derive stroke weight
const defStrokeWeight = inchToPx(lineWidth(defaultPen));

// ======== E N D   S E T U P ============

function setup() {
	createCanvas(pxDimensions.x, pxDimensions.y, SVG);
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

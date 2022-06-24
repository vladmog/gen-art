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

	const writeText = (msg, x, y, fSize) => {
		let points = font.textToPoints(msg, x, y, fSize, {
			sampleFactor: 5,
			simplifyThreshold: 0,
		});
		let bounds = font.textBounds(msg, x, y, fSize);

		beginShape();
		let prev = { x: 0, y: 0 };
		for (let i = 0; i < points.length; i++) {
			const x = points[i].x;
			const y = points[i].y;

			// Handle line breaks
			const distPrev = dim.distOf(x, y, prev.x, prev.y);
			const distThreshold = 5;
			if (i && distPrev > distThreshold) {
				console.log(distPrev);
				endShape();
				beginShape();
			}

			// Draw vertex
			vertex(x, y);
			prev = { x, y };
		}
		endShape();
	};

	writeText("test", width / 2, height / 2, 100);

	noLoop();
}

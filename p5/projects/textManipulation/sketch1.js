// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 8;
const plotH = 8;
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

	let word = new TextPoints("test", width / 2, height / 2, font, 300);
	let letters = word.letterPoints;
	console.log(letters);
	for (let i = 0; i < letters.length; i++) {
		let letter = letters[i];
		for (let shape = 0; shape < letter.shapeCount; shape++) {
			beginShape();
			for (
				let point = 0;
				point < letter.shapes[shape].points.length;
				point++
			) {
				let coords = letter.shapes[shape].points[point];
				let { x, y } = coords;
				let yOffset = sin(x * 20) * 2;
				y += yOffset;
				vertex(x, y);
			}
			endShape();
		}
	}

	noLoop();
}

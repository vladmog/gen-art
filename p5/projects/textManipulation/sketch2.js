// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 4;
const plotH = 4;
const scaleFactor = 1;
dim.updateDims(plotW, plotH, scaleFactor);

// Derive stroke weight
const defPen = "Pilot G2 0.7";
const defStrokeWeight = dim.inchToPx(lineWidth(defPen));

// ======== E N D   S E T U P ============

let font; // opentype.js font object
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let path;

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	frameRate(30);
}

function draw() {
	// It seems the following function is async
	opentype.load("assets/Montauk-8MBd2.otf", function (err, f) {
		if (err) {
			alert("Font could not be loaded: " + err);
		} else {
			font = f;
			console.log("font ready");

			fSize = 200;
			msg = "hello";

			let x = dim.pxDimensions.x / 2;
			let y = dim.pxDimensions.y / 2;
			path = font.getPath(msg, x, y, fSize);
			console.log(path.commands);
		}
	});

	if (!font) return;
	line(0, 0, width, height);

	for (let cmd of path.commands) {
		if (cmd.type === "M") {
			beginShape();
			vertex(cmd.x, cmd.y);
		} else if (cmd.type === "L") {
			vertex(cmd.x, cmd.y);
		} else if (cmd.type === "C") {
			bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
		} else if (cmd.type === "Q") {
			quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
		} else if (cmd.type === "Z") {
			endShape(CLOSE);
		}
	}

	// Therefore adding drawing logic into the function itself prevents race condition troubles
	opentype.load("assets/Montauk-8MBd2.otf", function (err, f) {
		if (err) {
			alert("Font could not be loaded: " + err);
		} else {
			font = f;

			fSize = 200;
			msg = "goodbye";

			let x = dim.pxDimensions.x / 2;
			let y = dim.pxDimensions.y / 2;
			path = font.getPath(msg, x, y, fSize);
			console.log(path.commands);

			if (!font) return;
			line(0, 0, width, height);

			for (let cmd of path.commands) {
				if (cmd.type === "M") {
					beginShape();
					vertex(cmd.x, cmd.y);
				} else if (cmd.type === "L") {
					vertex(cmd.x, cmd.y);
				} else if (cmd.type === "C") {
					bezierVertex(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
				} else if (cmd.type === "Q") {
					quadraticVertex(cmd.x1, cmd.y1, cmd.x, cmd.y);
				} else if (cmd.type === "Z") {
					endShape(CLOSE);
				}
			}
		}
	});

	noLoop();
}

// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 4;
const plotH = 8;
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
	// strokeWeight(defStrokeWeight);
	strokeWeight(1);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	frameRate(30);
}

function draw() {
	// line(0, 0, width, height);
	// textFont(font);
	if (true) {
		let word = new TextPoints(
			"test",
			width * 0.05,
			height * 0.2,
			font,
			200
		);
		textSize(200);
		text("test", width * 0.05, height * 0.2);
		let letters = word.letterPoints;
		console.log(letters);
		for (let i = 0; i < letters.length; i++) {
			let letter = letters[i];
			quad(
				letter.x,
				letter.y,
				letter.x + letter.w,
				letter.y,
				letter.x + letter.w,
				letter.y - letter.h,
				letter.x,
				letter.y - letter.h
			);
			console.log(letter);
			continue;
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
					// y += yOffset;
					vertex(x, y);
				}
				endShape();
			}
		}
	}

	if (true) {
		let word = new TextPoints(
			"test",
			width * 0.05,
			height * 0.31,
			font,
			150
		);
		textSize(150);
		text("test", width * 0.05, height * 0.31);
		let letters = word.letterPoints;
		console.log(letters);
		for (let i = 0; i < letters.length; i++) {
			let letter = letters[i];
			quad(
				letter.x,
				letter.y,
				letter.x + letter.w,
				letter.y,
				letter.x + letter.w,
				letter.y - letter.h,
				letter.x,
				letter.y - letter.h
			);
			continue;
			console.log(letter);
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
					// y += yOffset;
					vertex(x, y);
				}
				endShape();
			}
		}
	}

	if (true) {
		let word = new TextPoints(
			"test",
			width * 0.05,
			height * 0.39,
			font,
			100
		);
		textSize(100);
		text("test", width * 0.05, height * 0.39);
		let letters = word.letterPoints;
		console.log(letters);
		for (let i = 0; i < letters.length; i++) {
			let letter = letters[i];
			quad(
				letter.x,
				letter.y,
				letter.x + letter.w,
				letter.y,
				letter.x + letter.w,
				letter.y - letter.h,
				letter.x,
				letter.y - letter.h
			);
			continue;
			console.log(letter);
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
					// y += yOffset;
					vertex(x, y);
				}
				endShape();
			}
		}
	}

	noLoop();
	save("mySVG.svg");
}

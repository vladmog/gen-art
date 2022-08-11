// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 2.5;
const plotH = 4.5;
const scale = 1;
dim.updateDims(plotW, plotH, scale);

// Derive stroke weight
const defPen = "Pilot G2 0.7";
// const defStrokeWeight = dim.inchToPx(lineWidth(defPen));
const defStrokeWeight = dim.mmToPx(0.3);

// ======== E N D   S E T U P ============

let font;
function preload() {
	font = loadFont("assets/ReliefSingleLine-Regular_svg.otf");
}

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	frameRate(6);
}

function draw() {
	// background(200);

	const rectFill = (x, y, w, h, lineWidth, density = 1, isBordered) => {
		/* 
		Generates rectangle filled via square wave pattern
		x: Num : x coordinate of top left corner in px
		y: Num : y coordinate of top left corner in px
		w: Num : width of rectangle in px
		h: Num : height of rectangle in px
		lineWidth: Num: strokeWeight value. Used to determine base density
		density: Num: modulates density of fill
		       :   1 default. minimum density for max fill based on lineWidth
		       : < 1 denser fill
			   : > 1 less dense fill
		isBordered: Bool : if true, draw border. else don't draw border
		*/

		// Draw border if isBordered
		if (isBordered) {
			quad(x, y, x + w, y, x + w, y + h, x, y + h);
		}

		// start at top left corner
		beginShape();

		let currX = x;
		let currY = y;

		vertex(currX, currY);
		let prevX = Infinity;
		let prevY = Infinity;
		let isGoing = true;
		let limiter = 0;
		// if ((currY === y + h) && (currY === prevY)) isGoing = false
		while (isGoing) {
			// Plot next coordinate for fill
			if (prevY !== currY) {
				// traverse
				let newX;
				if (currX < x + w / 2) {
					// if on left of rect, go right
					newX = currX + w;
				} else {
					// else if on right of rect, go left
					newX = currX - w;
				}
				prevX = currX;
				currX = newX;
				prevY = currY;

				vertex(currX, currY);
			} else {
				// advance
				let newY;
				newY = currY + lineWidth * density;
				prevY = currY;
				currY = newY;

				vertex(currX, currY);
			}

			// Stop fill at end
			if (currY >= y + h && currY === prevY) {
				isGoing = false;
			}

			console.log("prevX:", prevX);
			console.log("prevY:", prevY);
			console.log("currX:", currX);
			console.log("currY:", currY);
		}

		endShape();
	};

	const drawKeyboard = (x, y, w, h, octaves) => {
		quad(x, y, x + w, y, x + w, y + h, x, y + h);

		const white = {
			width: w / octaves / 7,
			height: h,
		};
		const black = {
			width: white.width * 0.6,
			height: h * 0.6,
		};

		const drawKey = (keyType, x, y) => {
			/* 
			keyType: Str: wl || wr || wb || b
			coord: top left corner of key
			*/
			console.log("run");
			// Define key outer boundaries
			let shape;
			if (keyType[0] === "w") {
				// handle white key boundaries
				shape = white;
			} else {
				// handle black key boundaries
				shape = black;
			}
			let x1, y1, x2, y2, x3, y3, x4, y4;
			x1 = x;
			y1 = y;
			y2 = y;
			x4 = x;
			x2 = x + shape.width;
			x3 = x + shape.width;
			y3 = y + shape.height;
			y4 = y + shape.height;

			switch (keyType) {
				case "wl":
					// handle white key with cutout on right
					/* 
					1-----6 
                    |     |
					|     5------4
					|            |
					2------------3

					repeat 1 at end to close out
					*/
					beginShape();
					vertex(x1, y1);
					vertex(x4, y4);
					vertex(x3, y3);
					vertex(x2, y2 + black.height);
					vertex(x2 - black.width / 2, y2 + black.height);
					vertex(x2 - black.width / 2, y2);
					vertex(x1, y1);
					endShape();
					break;
				case "wr":
					// handle white key with cutout on left
					/* 
					       1-----6 
                           |     |
					3------2     |
					|            |
					4------------5

					repeat 1 at end to close out
					*/
					beginShape();
					vertex(x1 + black.width / 2, y1);
					vertex(x1 + black.width / 2, y1 + black.height);
					vertex(x1, y1 + black.height);
					vertex(x4, y4);
					vertex(x3, y3);
					vertex(x2, y2);
					vertex(x1, y1);
					endShape();
					break;
				case "wb":
					// handle white key with two cutouts
					/*
						1----8 
                        |    |
					3---2    7-- -6
					|             |
					4-------------5

					repeat 1 at end to close out
					*/
					beginShape();
					vertex(x1 + black.width / 2, y1);
					vertex(x1 + black.width / 2, y1 + black.height);
					vertex(x1, y1 + black.height);
					vertex(x4, y4);
					vertex(x3, y3);
					vertex(x2, y2 + black.height);
					vertex(x2 - black.width / 2, y2 + black.height);
					vertex(x2 - black.width / 2, y2);
					vertex(x1 + black.width / 2, y1);
					endShape();
					break;

				case "b":
					// handle black key
					/* 
					1-----2 
                    |     |
					|     |
					|     |
					4-----3

					repeat 1 at end to close out

					UPDATE:
					- turns out this one is redundant.
		              Will leave here but commented out incase I want to 
					  make use of it in someway later. Will leave the contrast
					  mark.
					*/

					// beginShape();
					// vertex(x1, y1);
					// vertex(x2, y2);
					// vertex(x3, y3);
					// vertex(x4, y4);
					// vertex(x1, y1);

					// endShape();

					// draw a mark to add visual contrast to the black key
					let widthMarginPrcnt = 0.32;
					let fillX = x1 + (x2 - x1) * widthMarginPrcnt;
					let fillY = y1 + (y4 - y1) * 0.5;
					let fillW = (x2 - x1) * (1 - widthMarginPrcnt * 2);
					let fillH = (y4 - y1) * (1 - 0.6); // lol sorry
					let density = 1;
					let isBordered = false;
					rectFill(
						fillX,
						fillY,
						fillW,
						fillH,
						defStrokeWeight,
						density,
						isBordered
					);
					break;
				default:
					throw `drawKey says WTF is a "${keyType}"?`;
					break;
			}
		};

		const drawOctave = (x, y) => {
			const keys = [
				"wl",
				"b",
				"wb",
				"b",
				"wr",
				"wl",
				"b",
				"wb",
				"b",
				"wb",
				"b",
				"wr",
			];
			let currX = x;
			for (let key = 0; key < keys.length; key++) {
				let keyType = keys[key];
				drawKey(keyType, currX, y);
				switch (keyType) {
					case "wl":
						currX += white.width - black.width / 2;
						break;
					case "wr":
						currX += white.width;
						break;
					case "wb":
						currX += white.width - black.width / 2;
						break;
					case "b":
						currX += black.width / 2;
						break;
					default:
						break;
				}
			}
		};

		const octaveWidth = w / octaves;
		console.log(
			`w: ${w}, octaves: ${octaves}, octaveWidth: ${octaveWidth}`
		);
		for (let octave = 1; octave <= octaves; octave++) {
			drawOctave((octave - 1) * octaveWidth + x, y);
		}
	};

	const writeText = textPoints => {
		// Iterate through letters of string
		let letters = textPoints.letterPoints;
		for (let letter = 0; letter < letters.length; letter++) {
			// Iterate through shapes of letter
			let shapes = letters[letter].shapes;
			for (let shape = 0; shape < shapes.length; shape++) {
				let shapeCoords = shapes[shape].points;
				// Iterate through points of a shape
				beginShape();
				for (let point = 0; point < shapeCoords.length; point++) {
					let x = shapeCoords[point].x;
					let y = shapeCoords[point].y;
					vertex(x, y);
				}
				endShape();
			}
		}
	};

	noLoop();
	let eightSplit = height / 8;
	let margin = 0;
	for (let i = 0; i < 8; i++) {
		let x1 = 0 + margin;
		let y1 = i * eightSplit;
		let x2 = width - margin;
		let y2 = y1;
		let x3 = x2;
		let y3 = y2 + eightSplit;
		let x4 = x1;
		let y4 = y3;
		// quad(x1, y1, x2, y2, x3, y3, x4, y4);
		let sixthWidth = (x2 - x1) / 6;
		let sixthMargin = dim.inchToPx(0.05);

		if (i) {
			// draw note line
			line(
				x1 + sixthMargin,
				y4 - sixthMargin,
				x1 + sixthWidth - sixthMargin,
				y4 - sixthMargin
			);
			// draw keyboard
			let keyboardX = x1 + sixthWidth * 3 + sixthMargin;
			let keyboardY = y1 + sixthMargin;
			let keyboardW = sixthWidth * 3 - sixthMargin * 2;
			let keyboardH = y4 - y1 - sixthMargin * 2;
			let keyboardO = 2;
			drawKeyboard(keyboardX, keyboardY, keyboardW, keyboardH, keyboardO);
			// draw chord line
			// line(
			// 	x1 + sixthWidth * 4 + sixthMargin,
			// 	(y4 + y1) / 2,
			// 	x1 + sixthWidth * 5,
			// 	(y4 + y1) / 2
			// );
			// draw chord notes line
			line(
				x1 + sixthWidth + sixthMargin,
				y4 - sixthMargin,
				x1 + sixthWidth * 3 - sixthMargin,
				y4 - sixthMargin
			);
		} else {
			let str = "C maj";
			x = x1 + sixthMargin;
			y = y4 - sixthMargin * 3;
			fontSize = 30;
			let musicScale = new TextPoints(str, x, y, font, fontSize);
			console.log(musicScale);
			// writeText(msusicScale);
			let keyboardX = x1 + sixthWidth * 3 + sixthMargin;
			let keyboardY = y1 + sixthMargin;
			let keyboardW = sixthWidth * 3 - sixthMargin * 2;
			let keyboardH = y4 - y1 - sixthMargin * 2;
			let keyboardO = 2;
			drawKeyboard(keyboardX, keyboardY, keyboardW, keyboardH, keyboardO);
		}
	}
	save("keebs.svg");
}

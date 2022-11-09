// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 7;
const plotH = 5;
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
	noFill();
	angleMode(DEGREES);
	frameRate(10);
}

let iterator = 0;
function draw() {
	// background(255);
	/* 
		1: Make a function that draws a squircle given
		   - length
		   - origin
		   - corner radius
		2: Make a function that creates a data structure
		   representing all squircle layers of a squircle
		   cube, along with cue ball cutouts given
		   - cue ball diameter
		   - master squircle length
		   - master squircle corner radius
		   - layer height
		3: Make a function that validates that this would
		   be a squircle cube
		4: Make a function that prints the squircles of
		   a master squircle on cardboard

		Notes:
		- 3D coordinate system assumes that furthest back,
		bottom, right corner of squircle is the origin point
	*/

	// Make a function that draws a squircle
	const drawSquircle = (length, origin, cornerRadius) => {
		/*
			length : Num : length in px of squircle length
			               border radius inclusive
			origin : Obj : {x: Num, y: Num}
			               center point of squircle
			cornerRadius : Num : radius of circles that
			                define corner curvature

			Notes:
			- a squircle with cornerRadius of 0 is a square
			  known as "baseSquare"
		*/

		const baseSquareLength = length - cornerRadius * 2;
		const baseSquare = {
			x1: origin.x - baseSquareLength / 2,
			y1: origin.y - baseSquareLength / 2,
			x2: origin.x + baseSquareLength / 2,
			y2: origin.y - baseSquareLength / 2,
			x3: origin.x + baseSquareLength / 2,
			y3: origin.y + baseSquareLength / 2,
			x4: origin.x - baseSquareLength / 2,
			y4: origin.y + baseSquareLength / 2,
		};
		const { x1, y1, x2, y2, x3, y3, x4, y4 } = baseSquare;
		const corners = [
			{ x: x1, y: y1 },
			{ x: x2, y: y2 },
			{ x: x3, y: y3 },
			{ x: x4, y: y4 },
		];

		// quad(x1, y1, x2, y2, x3, y3, x4, y4);

		const genCornerVertices = (
			origin,
			radius,
			startTheta,
			endTheta,
			ptsCt
		) => {
			const vertices = [];
			for (let pt = 0; pt < ptsCt; pt++) {
				const theta = map(pt, 0, ptsCt - 1, startTheta, endTheta);
				const v = {
					x: radius * cos(theta) + origin.x,
					y: radius * sin(theta) + origin.y,
				};
				vertices.push(v);
				vertex(v.x, v.y);
			}
			return vertices;
		};

		beginShape();

		// TR corner
		genCornerVertices(
			{ x: corners[0].x, y: corners[0].y },
			cornerRadius,
			180,
			270,
			10
		);

		// Top edge
		vertex(corners[0].x, corners[0].y - cornerRadius);
		vertex(corners[1].x, corners[1].y - cornerRadius);

		// TR corner
		genCornerVertices(
			{ x: corners[1].x, y: corners[1].y },
			cornerRadius,
			270,
			360,
			10
		);

		// Right edge
		vertex(corners[1].x + cornerRadius, corners[1].y);
		vertex(corners[2].x + cornerRadius, corners[2].y);

		// BR corner
		genCornerVertices(
			{ x: corners[2].x, y: corners[2].y },
			cornerRadius,
			0,
			90,
			10
		);

		// Bottom edge
		vertex(corners[2].x, corners[2].y + cornerRadius);
		vertex(corners[3].x, corners[3].y + cornerRadius);

		// BL corner
		genCornerVertices(
			{ x: corners[3].x, y: corners[3].y },
			cornerRadius,
			90,
			180,
			10
		);

		// Left edge
		vertex(corners[3].x - cornerRadius, corners[3].y);
		vertex(corners[0].x - cornerRadius, corners[0].y);

		endShape();
	};

	// drawSquircle(
	// 	dim.inchToPx(3),
	// 	{ x: width / 2, y: height / 2 },
	// 	dim.inchToPx(0.6)
	// );
	// ellipse(width / 2, width / 2, dim.inchToPx(2.25));

	/*
		Make a function that creates a data structure
		representing all squircle layers of a squircle
		cube, along with cue ball cutouts given

		layers = [
			{
				length: Num,
				cornerRadius: Num,
				cueHoleDiam: Num
			}
		]
	*/
	const genSquircleCube = (
		cueBallDiam,
		length,
		cornerRadius,
		layerHeight
	) => {
		/* 
		cueBallDiam : Num : Diameter of cue ball (px)
		length : Num : length of squircle cube (px)
		cornerRadius : Num : radius of spheres that define\
		              corner curvature (px)
		layerHeight: Num : thickness of each layer to be generated (px)
		*/
		const layerCt = Math.ceil(length / layerHeight);
		const baseSquareLength = length - cornerRadius * 2;
		const layers = [];

		for (layer = 0; layer < layerCt; layer++) {
			const zHeight = layer * layerHeight;

			/* Define layer's squircle cornerRadius */
			let referenceHeight; // used for cornerRadius calculations
			let isBottom;
			let layerCornerRadius;
			const refHeightToCornerRadius = (refHeight, isBottom) => {
				/* 
				- Find intersection between refHeight and cornerRadius
				- Derive theta of the intersection within the cornerRadius
				  atan(y/x)=theta (double check)
				- layerCornerRadius = cornerRadius * cos(theta)
				*/
				// Find intersection between refHeight and cornerRadius
				let cornerCoords = { x: 0 };
				if (isBottom) {
					cornerCoords.y = cornerRadius;
				} else {
					cornerCoords.y = cornerRadius + baseSquareLength;
				}
				const r = cornerRadius;
				const h = cornerCoords.x; // x value of circle center
				const k = cornerCoords.y; // y value of circle center
				const m = 0; // line slope
				const n = refHeight; // line y intercept
				const intersections = dim.findCircleLineIntersections(
					r,
					h,
					k,
					m,
					n
				);

				// Derive theta of the intersection within the cornerRadius circle
				// and then derive layer corner radius
				let layerCornerRadius;
				let theta;
				if (intersections[0] === 0) {
					// If no intersections returned by intersection function,
					// the line is tangent to the circle I think and is on the bottom
					theta = 90;
					layerCornerRadius = 0;
				} else if (intersections.length === 0) {
					// If no intersections returned, reference height is
					// out of bounds of corner radius and is therefore the top (I think)
					theta = 270;
					layerCornerRadius = 0;
				} else {
					const x = intersections[0];
					const y = refHeight - cornerCoords.y;
					theta = 180 + atan(y / x);
					layerCornerRadius = cornerRadius * Math.abs(cos(theta));
				}

				return layerCornerRadius;
			};
			if (
				zHeight > cornerRadius &&
				zHeight <= length - cornerRadius - layerHeight
			) {
				// Handle middle layer
				layerCornerRadius = cornerRadius;
			} else if (zHeight < cornerRadius) {
				// Handle bottom layer
				referenceHeight = zHeight;
				isBottom = true;
				layerCornerRadius = refHeightToCornerRadius(
					referenceHeight,
					isBottom
				);
			} else if (zHeight > length - cornerRadius - layerHeight) {
				// Handle top layer
				referenceHeight = zHeight + layerHeight;
				isBottom = false;
				layerCornerRadius = refHeightToCornerRadius(
					referenceHeight,
					isBottom
				);
			} else {
				console.log("N/A");
			}

			/* Define layer's squircle length */
			const layerLength = baseSquareLength + layerCornerRadius * 2;

			/* Define layer cueBall hole diameter */
			let cueBallCoords = {
				x: 0,
				y: (length - cueBallDiam) / 2 + cueBallDiam / 2,
			};
			let cueBallReferenceHeight;
			let cueBallHoleDiam;
			const cueBallRefHeightToHoleDiam = refHeight => {
				// find intersection between layer ref height and cueball
				// layer represented as line, cue ball represented as circle
				const r = cueBallDiam / 2;
				const h = cueBallCoords.x; // x value of circle center
				const k = cueBallCoords.y; // y value of circle center
				const m = 0; // line slope
				const n = refHeight; // line y intercept
				const intersections = dim.findCircleLineIntersections(
					r,
					h,
					k,
					m,
					n
				);

				let theta;
				let holeDiam;
				if (intersections[0] === 0) {
					// If no intersections returned by intersection function,
					// the line is tangent to the circle I think and is on the bottom
					theta = 90;
					layerCornerRadius = 0;
				} else if (intersections.length === 0) {
					// If no intersections returned, reference height is
					// out of bounds of corner radius and is therefore the top (I think)
					theta = 270;
					layerCornerRadius = 0;
				} else {
					const x = intersections[0];
					const y = refHeight - cueBallCoords.y;
					theta = 180 + atan(y / x);
					holeDiam = cueBallDiam * Math.abs(cos(theta));
				}

				return holeDiam;
			};
			if (
				zHeight < cueBallCoords.y &&
				zHeight + layerHeight >= cueBallCoords.y
			) {
				// If zHeight is at cueBall center, make the whole equal to the diameter
				cueBallHoleDiam = cueBallDiam;
			} else if (
				zHeight > cueBallCoords.y + cueBallDiam / 2 ||
				zHeight + layerHeight < cueBallCoords.y - cueBallDiam / 2
			) {
				// If zHeight is out of bounds of cue ball, make no hole
				cueBallHoleDiam = 0;
			} else if (zHeight < cueBallCoords.y) {
				// If zHeight is less than cueBall center, ref point is the zHeight
				cueBallReferenceHeight = zHeight + layerHeight;
				cueBallHoleDiam = cueBallRefHeightToHoleDiam(
					cueBallReferenceHeight
				);
			} else if (zHeight >= cueBallCoords.y) {
				cueBallReferenceHeight = zHeight;
				cueBallHoleDiam = cueBallRefHeightToHoleDiam(
					cueBallReferenceHeight
				);
			}
			layers.push({
				length: layerLength,
				cornerRadius: layerCornerRadius,
				cueHoleDiam: cueBallHoleDiam,
			});
		}
		// console.log(layers);
		return layers;
	};

	const cueBallDiam = dim.inchToPx(2.25);
	const length = dim.inchToPx(3);
	const cornerRadius = dim.inchToPx(0.5);
	const layerHeight = dim.inchToPx(0.0805);
	const layers = genSquircleCube(
		cueBallDiam,
		length,
		cornerRadius,
		layerHeight
	);
	console.log(layers);
	for (let layer = 0; layer < layers.length; layer++) {
		const layerFile = layers[layer];
		console.log(
			`Layer ${layer}, Length: ${dim.pxToInch(layerFile.length)}"`
		);
	}

	// Validate data visually
	// const squircle = layers[iterator % layers.length];
	// drawSquircle(
	// 	squircle.length,
	// 	{ x: width / 2, y: height / 2 },
	// 	squircle.cornerRadius
	// );
	// ellipse(width / 2, height / 2, squircle.cueHoleDiam);
	// iterator++;

	// Make a function that prints the squircles of
	// a master squircle on cardboard

	const printCard = (layersToPrint, cardSize) => {
		/* 
		layers : Arr : [indexes of layers to print]
		cardSize : Obj : {width: Num, height: Num} inches
		*/
		const corners = [
			{ x: 0, y: 0 },
			{ x: width, y: 0 },
			{ x: width, y: height },
			{ x: 0, y: height },
		];
		corners.forEach(corner => {
			// strokeWeight(100);
			point(corner.x, corner.y);
			// strokeWeight(defStrokeWeight);
		});

		const squircle1 = layers[layersToPrint[0]];
		const squircle2 = layers[layersToPrint[1]];
		const center1 = {
			x: width * 0.25,
			y: height / 2,
		};
		const center2 = {
			x: width * 0.75,
			y: height / 2,
		};

		textSize(40);

		drawSquircle(squircle1.length, center1, squircle1.cornerRadius);
		if (squircle1.cueHoleDiam)
			ellipse(center1.x, center1.y, squircle1.cueHoleDiam);
		// text(layersToPrint[0], center1.x, 50);
		console.log("YOU WANT THIS", layersToPrint[0]);
		const numWords = {
			0: "zero",
			1: "one",
			2: "two",
			3: "three",
			4: "four",
			5: "five",
			6: "six",
			7: "seven",
			8: "eight",
			9: "nine",
			10: "ten",
			11: "eleven",
			12: "twelve",
			13: "thirteen",
			14: "fourteen",
			15: "fifteen",
			16: "sixteen",
			17: "seventeen",
			18: "eighteen",
			19: "nineteen",
			20: "twenty",
			21: "twentyone",
			22: "twentytwo",
			23: "twentythree",
			24: "twentyfour",
			25: "twentyfive",
			26: "twentysix",
			27: "twentyseven",
			28: "twentyeight",
			29: "twentynine",
			30: "thirty",
			31: "thirtyone",
			32: "thirtytwo",
			33: "thirtythree",
			34: "thirtyfour",
			35: "thirtyfive",
			36: "thirtysix",
			37: "thirtyseven",
			38: "thirtyeight",
			39: "thirtynine",
			40: "fourty",
		};
		const layerNumber1 = new TextPoints(
			intToRoman(layersToPrint[0]),
			center1.x,
			50,
			font,
			20
		);
		const textPoints1 = layerNumber1.letterPoints;
		for (let letter = 0; letter < textPoints1.length; letter++) {
			const letterFile = textPoints1[letter];
			for (let shape = 0; shape < letterFile.shapes.length; shape++) {
				const shapeFile = letterFile.shapes[shape];
				beginShape();
				for (let point = 0; point < shapeFile.points.length; point++) {
					const pointFile = shapeFile.points[point];
					vertex(pointFile.x, pointFile.y);
				}
				endShape();
			}
		}

		drawSquircle(squircle2.length, center2, squircle2.cornerRadius);
		if (squircle2.cueHoleDiam)
			ellipse(center2.x, center2.y, squircle2.cueHoleDiam);
		// text(layersToPrint[1], center2.x, 50);

		const layerNumber2 = new TextPoints(
			intToRoman(layersToPrint[1]),
			center2.x,
			50,
			font,
			20
		);
		const textPoints2 = layerNumber2.letterPoints;
		console.log(textPoints2);
		for (let letter = 0; letter < textPoints2.length; letter++) {
			const letterFile = textPoints2[letter];
			for (let shape = 0; shape < letterFile.shapes.length; shape++) {
				const shapeFile = letterFile.shapes[shape];
				beginShape();
				for (let point = 0; point < shapeFile.points.length; point++) {
					const pointFile = shapeFile.points[point];
					vertex(pointFile.x, pointFile.y);
				}
				endShape();
			}
		}

		for (let i = 0; i < 2; i++) {
			let theta = i ? 45 : 225;
			let r = 162;
			let x1 = r * cos(theta) + center1.x;
			let y1 = r * sin(theta) + center1.y;
			let x2 = r * cos(theta) + center2.x;
			let y2 = r * sin(theta) + center2.y;
			point(x1, y1);
			point(x2, y2);
		}
	};
	let iterator = 18;
	iterator *= 2;
	printCard([iterator, iterator + 1]);

	noLoop();
	iterator++;

	save("mySVG.svg");
}

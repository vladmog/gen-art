// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 3;
const plotH = 3;
const scale = 1.5;
dim.updateDims(plotW, plotH, scale);

// Derive stroke weight
const defPen = "Pilot G2 0.7";
let defStrokeWeight = dim.inchToPx(lineWidth(defPen));
defStrokeWeight = 1;

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
	noLoop();
}
const generateQuads = (corners, rows, cols) => {
	/*
		Divides a quadrilateral into a grid of quadrilaterals

		Input:
			corners: Obj : {x1,y1,x2,y2,x3,y3,x4,y4} 
			             : Nums (px)
			rows  :  Num : number of rows
			cols  :  Num : number of columns

		Output:
			[
				[
					{x1,y1,x2,y2,x3,y3,x4,y4},
					{x1,y1,x2,y2,x3,y3,x4,y4},
				],
				[
					{x1,y1,x2,y2,x3,y3,x4,y4},
					{x1,y1,x2,y2,x3,y3,x4,y4},
				],

			]

			Array of row arrays.
			Each row array is an array of objects.
			Each object represents a cell of the grid.

		Steps:
			: Divide sides into line vertices
			: Generate cells from intersections of lines generated
			  from line vertices
	*/

	// Convert line x1,y1,x2,y2 into t vertices (top)
	const tVertices = {};
	for (let t = 0; t <= cols; t++) {
		const x = map(t, 0, cols, corners.x1, corners.x2);
		const y = map(t, 0, cols, corners.y1, corners.y2);
		tVertices[t] = { x, y };
	}

	// Convert line x4,y4,x3,y3 into b vertices (bottom)
	const bVertices = {};
	for (let b = 0; b <= cols; b++) {
		const x = map(b, 0, cols, corners.x4, corners.x3);
		const y = map(b, 0, cols, corners.y4, corners.y3);
		bVertices[b] = { x, y };
	}

	// Convert line x1,y1,x4,y4 into l vertices (left)
	const lVertices = {};
	for (let l = 0; l <= rows; l++) {
		const x = map(l, 0, rows, corners.x1, corners.x4);
		const y = map(l, 0, rows, corners.y1, corners.y4);
		lVertices[l] = { x, y };
	}

	// Convert line x2,y2,x3,y3 into l vertices (right)
	const rVertices = {};
	for (let r = 0; r <= rows; r++) {
		const x = map(r, 0, rows, corners.x2, corners.x3);
		const y = map(r, 0, rows, corners.y2, corners.y3);
		rVertices[r] = { x, y };
	}

	//  Generate cells from intersections of lines generated
	//  from line vertices
	const quadsGrid = [];
	for (row = 0; row < rows; row++) {
		quadsGrid.push([]);
		for (col = 0; col < cols; col++) {
			// Derive sub vertices from parent quadrilateral sides
			const l1 = lVertices[row];
			const l2 = lVertices[row + 1];
			const r1 = rVertices[row];
			const r2 = rVertices[row + 1];
			const t1 = tVertices[col];
			const t2 = tVertices[col + 1];
			const b1 = bVertices[col];
			const b2 = bVertices[col + 1];

			// From parent quadrilateral side sub vertices, derive lines for intersection
			const leftLine = {
				x1: t1.x,
				y1: t1.y,
				x2: b1.x,
				y2: b1.y,
			};
			const rightLine = {
				x1: t2.x,
				y1: t2.y,
				x2: b2.x,
				y2: b2.y,
			};
			const topLine = {
				x1: l1.x,
				y1: l1.y,
				x2: r1.x,
				y2: r1.y,
			};
			const bottomLine = {
				x1: l2.x,
				y1: l2.y,
				x2: r2.x,
				y2: r2.y,
			};

			const corner1 = dim.intersectOf(
				topLine.x1,
				topLine.y1,
				topLine.x2,
				topLine.y2,
				leftLine.x1,
				leftLine.y1,
				leftLine.x2,
				leftLine.y2
			);
			if (!corner1) {
				stroke(255, 0, 0);
				line(topLine.x1, topLine.y1, topLine.x2, topLine.y2);
				line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
				stroke(0);
			}
			const corner2 = dim.intersectOf(
				topLine.x1,
				topLine.y1,
				topLine.x2,
				topLine.y2,
				rightLine.x1,
				rightLine.y1,
				rightLine.x2,
				rightLine.y2
			);
			if (!corner2) {
				stroke(0, 255, 0);
				line(topLine.x1, topLine.y1, topLine.x2, topLine.y2);
				line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);
				stroke(0);
			}
			const corner3 = dim.intersectOf(
				bottomLine.x1,
				bottomLine.y1,
				bottomLine.x2,
				bottomLine.y2,
				rightLine.x1,
				rightLine.y1,
				rightLine.x2,
				rightLine.y2
			);
			if (!corner3) {
				stroke(0, 0, 255);
				line(
					bottomLine.x1,
					bottomLine.y1,
					bottomLine.x2,
					bottomLine.y2
				);
				line(rightLine.x1, rightLine.y1, rightLine.x2, rightLine.y2);
				stroke(0);
			}
			const corner4 = dim.intersectOf(
				bottomLine.x1,
				bottomLine.y1,
				bottomLine.x2,
				bottomLine.y2,
				leftLine.x1,
				leftLine.y1,
				leftLine.x2,
				leftLine.y2
			);
			if (!corner4) {
				stroke(255, 0, 255);
				line(
					bottomLine.x1,
					bottomLine.y1,
					bottomLine.x2,
					bottomLine.y2
				);
				line(leftLine.x1, leftLine.y1, leftLine.x2, leftLine.y2);
				stroke(0);
			}

			const quadCell = {
				x1: corner1.x,
				y1: corner1.y,
				x2: corner2.x,
				y2: corner2.y,
				x3: corner3.x,
				y3: corner3.y,
				x4: corner4.x,
				y4: corner4.y,
			};

			quadsGrid[row].push(quadCell);
		}
	}
	return quadsGrid;
};

function draw() {}

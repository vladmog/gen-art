/* 
On 3K screen, 1 inch = 130.3 px
aka 3 inches = 391 px
*/

const dim = {};

// ::::::: D I M E N S I O N A L   S T A T E :::::::::::

// These will be modified in every instance of a sketch
// Default represents mapping of 1 inch to 130.3 px

// Dimensions of plot in inches
dim.inchDimensions = {
	x: 1,
	y: 1,
};

// Dimensions of sketch in pixels
dim.pxDimensions = {
	x: 130.3,
	y: 130.3,
};

dim.updateDims = (w, h, scaleFactor = 1) => {
	/* 

	Updates inchDimensions and pxDimensions to represent 
	dimensions specific to sketch calling the function

	w : Num 
	width of plot in inches

	h : Num 
	height of plot in inches

	scaleFactor : Num 
	Scales canvas.
	By default scaleFactor is 1, for a 1:1 scale canvas:plot

	*/

	// Derive canvas size equivalent to plot size
	dim.inchDimensions = {
		x: (dim.inchDimensions.x *= w),
		y: (dim.inchDimensions.y *= h),
	};
	dim.pxDimensions = {
		x: (dim.pxDimensions.x *= w),
		y: (dim.pxDimensions.y *= h),
	};

	dim.pxDimensions = {
		x: (dim.pxDimensions.x *= scaleFactor),
		y: (dim.pxDimensions.y *= scaleFactor),
	};
};

// ::::   C O N V E R S I O N   H E L P E R   F U N C T I O N S  :::::

dim.inchToPx = inches => {
	const px = (dim.pxDimensions.x * inches) / dim.inchDimensions.x;
	return px;
};

dim.mmToPx = mm => {
	const px = (dim.pxDimensions.x * mm) / (dim.inchDimensions.x * 25.4);
	return px;
};

dim.pxToInch = px => {
	const inches = (dim.inchDimensions.x * px) / dim.pxDimensions.x;
	return inches;
};

dim.pxToMM = px => {
	const inches = (dim.inchDimensions.x * px) / dim.pxDimensions.x;
	const mm = inches * 24.4;
	return mm;
};

dim.mmToInch = mm => {
	const inches = mm / 25.4;
	return inches;
};

dim.inchToMM = inches => {
	const mm = inches * 25.4;
	return mm;
};

// ::::::: D I M E N S I O N A L   F U N C T I O N S   :::::::::::::

dim.distOf = (x1, y1, x2, y2) => {
	const dist = Math.sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
	return dist;
};
//
//
//
//
//
//
//
//
//
//
//
// W R I T I N G   U T E N S I L   F U N C T I O N S

const utensils = {
	"Pilot G2 0.7": {
		defaultWidth: dim.mmToInch(0.7), // reasonable data
		papers: {
			"Rhodia Web Note Book": {
				Speeds: {
					60: 0.7, // dummy data
					61: 0.5, // dummy data
				},
			},
		},
	},
};

const lineWidth = (utensil, paper, drawSpeed) => {
	return utensils[utensil].defaultWidth;
};

//
//
//
//
//
//
//
//
//
//
//
// T E X T   M A N I P U L A T I O N

class TextPoints {
	constructor(str, x, y, font, fontSize, instructions = []) {
		this.str = str;
		this.x = x;
		this.y = y;
		this.font = font;
		this.fontSize = fontSize;
		this.instructions = instructions;
		this.points = font.textToPoints(str, x, y, fontSize, {
			sampleFactor: 5,
			simplifyThreshold: 0,
		});
		this.bounds = font.textBounds(str, x, y, fontSize);
		this.shapeCounts = {
			" ": 0,
			a: 2,
			b: 2,
			c: 1,
			d: 2,
			e: 2,
			f: 1,
			g: 2,
			h: 1,
			j: 2,
			k: 1,
			l: 1,
			m: 1,
			n: 1,
			o: 2,
			p: 2,
			q: 2,
			r: 1,
			s: 1,
			t: 1,
			u: 1,
			v: 1,
			w: 1,
			x: 1,
			y: 1,
			z: 1,
			A: 2,
			B: 3,
			C: 1,
			D: 2,
			E: 1,
			F: 1,
			G: 1,
			H: 1,
			I: 1,
			J: 1,
			K: 1,
			L: 1,
			M: 1,
			N: 1,
			O: 2,
			P: 2,
			Q: 2,
			R: 2,
			S: 1,
			T: 1,
			U: 1,
			V: 1,
			W: 1,
			X: 1,
			Y: 1,
			Z: 1,
		};
	}

	splitByBreaks() {
		// Accumulator
		let shapes = [];

		// Iteration state

		let currShape = [];
		let currLeastX = Infinity;
		let currGreatestX = -Infinity;
		let currLeastY = Infinity;
		let currGreatestY = -Infinity;

		// Iterate through points and divide shapes into
		let prev = { x: 0, y: 0 };

		// Iteration
		for (let i = 0; i < this.points.length; i++) {
			const x = this.points[i].x;
			const y = this.points[i].y;

			// Handle line breaks
			const distPrev = dim.distOf(x, y, prev.x, prev.y);
			const distThreshold = 1;

			// If line break detected
			if (i && distPrev > distThreshold) {
				// consolidate shape data
				const shape = {
					points: currShape,
					leastX: currLeastX,
					greatestX: currGreatestX,
					leastY: currLeastY,
					greatestY: currGreatestY,
				};

				// log shape
				shapes.push(shape);

				// reset iteration state
				currShape = [];
				currLeastX = Infinity;
				currGreatestX = -Infinity;
				currLeastY = Infinity;
				currGreatestY = -Infinity;
			}

			// Save vertex as part of curr shape
			currShape.push({ x, y });
			// update iteration state

			prev = { x, y };
			if (x < currLeastX) currLeastX = x;
			if (x > currGreatestX) currGreatestX = x;
			if (y < currLeastY) currLeastY = y;
			if (y > currGreatestY) currGreatestY = y;
		}
		const shape = {
			points: currShape,
			leastX: currLeastX,
			greatestX: currGreatestX,
			leastY: currLeastY,
			greatestY: currGreatestY,
		};

		// log shape
		shapes.push(shape);

		// return Accumulator arr of arr where final arr is vector vertices
		return shapes;
	}

	mapShapesToLetter(instructions, shapes) {
		/* 

		Function that, provided instructions, allocates shapes in a series of shapes 
		to their corresponding string characters

		instructions: Arr[Num, Num...]

		instructions.length should match input string character count.
		Total of values of all elements in instructions should equal shape count.

		example:
		test => [1,2,1,1]


		shapes: 
		Arr [
			{ x,y,w,h,[points]}
		]
		*/
		if (instructions.length != this.str.length) {
			console.log("instructions length mismatch");
			console.log(instructions.length, this.str.length);
		}
		if (instructions.reduce((acc, el) => acc + el) != shapes.length) {
			console.log("instruction shape counts mismatch");
			console.log(
				instructions.reduce((acc, el) => acc + el),
				shapes.length
			);
		}

		const letters = [];
		let mainShapeIterator = 0;
		for (let i = 0; i < instructions.length; i++) {
			const letter = {
				letter: this.str[i],
				shapeCount: instructions[i],
				shapes: [],
			};
			let leastX = Infinity;
			let greatestX = -Infinity;
			let leastY = Infinity;
			let greatestY = -Infinity;
			for (
				let letterShapeI = 0;
				letterShapeI < letter.shapeCount;
				letterShapeI++
			) {
				const shape = shapes[mainShapeIterator];
				letter.shapes.push(shape);
				mainShapeIterator++;
				if (leastX > shape.leastX) leastX = shape.leastX;
				if (greatestX < shape.greatestX) greatestX = shape.greatestX;
				if (leastY > shape.leastY) leastY = shape.leastY;
				if (greatestY < shape.greatestY) greatestY = shape.greatestY;
			}
			letter.x = leastX;
			letter.y = greatestY;
			letter.h = greatestY - leastY;
			letter.w = greatestX - leastX;
			letters.push(letter);
		}
		return letters;
	}

	get letterPoints() {
		const shapes = this.splitByBreaks();

		let instructions;
		if (this.instructions.length) {
			// If instructions provided, use them
			instructions = this.instructions;
		} else {
			// Otherwise derive a prediction
			instructions = [];
			for (let i = 0; i < this.str.length; i++) {
				const letter = this.str[i];
				const letterShapeCount = this.shapeCounts[letter];
				instructions.push(letterShapeCount);
			}
		}

		return this.mapShapesToLetter(instructions, shapes);
	}
}

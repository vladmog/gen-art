/* 
On 3K screen, 1 inch = 130.3 px
aka 3 inches = 391 px
*/

const dim = {};

// ::::::: D I M E N S I O N A L   S T A T E :::::::::::

// These will be modified in every instance of a sketch
// Default represents mapping of 1 inch to 130.3 px

// Dimensions of plot in inches
//test
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

// ::::   D I M E N S I O N A L  C O N V E R S I O N   H E L P E R   F U N C T I O N S  :::::

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

//  : : : : :  NOT MY CODE : : : : : : : :
// from: https://cscheng.info/2016/06/09/calculate-circle-line-intersection-with-javascript-and-p5js.html
dim.findCircleLineIntersections = (r, h, k, m, n) => {
	// circle: (x - h)^2 + (y - k)^2 = r^2
	// line: y = m * x + n
	// r: circle radius
	// h: x value of circle centre
	// k: y value of circle centre
	// m: slope
	// n: y-intercept

	// get a, b, c values
	var a = 1 + sq(m);
	var b = -h * 2 + m * (n - k) * 2;
	var c = sq(h) + sq(n - k) - sq(r);

	// get discriminant
	var d = sq(b) - 4 * a * c;
	if (d >= 0) {
		// insert into quadratic formula
		var intersections = [
			(-b + sqrt(sq(b) - 4 * a * c)) / (2 * a),
			(-b - sqrt(sq(b) - 4 * a * c)) / (2 * a),
		];
		if (d == 0) {
			// only 1 intersection
			return [intersections[0]];
		}
		return intersections;
	}
	// no intersection
	return [];
};

// ::::::: D I M E N S I O N A L   F U N C T I O N S   :::::::::::::

dim.distOf = (x1, y1, x2, y2) => {
	const dist = Math.sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
	return dist;
};

// intersectOf is not my function
dim.intersectOf = (x1, y1, x2, y2, x3, y3, x4, y4) => {
	// Check if none of the lines are of length 0
	if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		console.log("Line length 0");
		return false;
	}

	denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

	// Lines are parallel
	if (denominator === 0) {
		console.log("Denominator is 0");
		return false;
	}

	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

	// is the intersection along the segments
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		console.log("cancelled error lol");
		// return false;
	}

	// Return a object with the x and y coordinates of the intersection
	let x = x1 + ua * (x2 - x1);
	let y = y1 + ua * (y2 - y1);

	return { x, y };
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
			i: 2,
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

const intToRoman = num => {
	if (num === 0) return "O";
	let roman = "";
	while (num != 0) {
		if (num >= 1000) {
			roman += "M";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 1000;
		} else if (num <= 999 && num >= 900) {
			roman += "CM";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 900;
		} else if (num >= 500) {
			roman += "D";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 500;
		} else if (num <= 499 && num >= 400) {
			roman += "CD";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 400;
		} else if (num >= 100) {
			roman += "C";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 100;
		} else if (num <= 99 && num >= 90) {
			roman += "XC";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 90;
		} else if (num >= 50) {
			roman += "L";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 50;
		} else if (num <= 49 && num >= 40) {
			roman += "XL";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 40;
		} else if (num >= 10) {
			roman += "X";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 10;
		} else if (num === 9) {
			roman += "IX";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 9;
		} else if (num >= 5) {
			roman += "V";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 5;
		} else if (num === 4) {
			roman += "IV";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 4;
		} else if (num >= 1) {
			roman += "I";
			console.log(roman[roman.length - 1], ": ", num);
			num -= 1;
		}
	}
	return roman;
};

//  M U S I C A L   U T I L I T I E S

let inited = false;
const notes = {};
const activeNotes = [];
const midiCC = {};
let isGlitchDetected = false;

const cleanNotes = () => {
	/* 
		Goes through active notes and erases instances
		whose note-off timestamps are more than a ribbon-
		length in time old.
	*/

	const notesIndexesToBeDeactivated = [];

	// Cull instances
	// Iterate through array of activeNotes (notes that are being displayed)
	for (
		let activeNoteIndex = 0;
		activeNoteIndex < activeNotes.length;
		activeNoteIndex++
	) {
		const activeNote = activeNotes[activeNoteIndex];
		let activeNoteInstances = notes[activeNote].instances;
		// Iterate through instances of active note
		for (
			let instanceIndex = 0;
			instanceIndex < activeNoteInstances.length;
			instanceIndex++
		) {
			const instance = activeNoteInstances[instanceIndex];

			// If noteOffTime is blank, it's still being held and shouldn't be culled
			if (instance.noteOffTime === "") {
				// console.log("No note off");
				continue;
			}

			// If elapsed time since note off is greater than ribbon length,
			// note instance has ran off the ribbon. Cull the note instance
			const elapsedTime = currTime - instance.noteOffTime;
			const ribbonLength = msPerBeat * 4;
			if (elapsedTime > ribbonLength) {
				// Erase instance
				notes[activeNote].instances.splice(instanceIndex, 1);

				// If not more instances, log index of note in activeNotes arr to be deleted later
				// doing later so as not to interfere with iteration of for loop
				if (notes[activeNote].instances.length === 0) {
					notesIndexesToBeDeactivated.push(activeNoteIndex);
					// console.log(notesIndexesToBeDeactivated);
				}
			}
		}
	}

	// Erase inactive notes in active notes array
	for (let i = notesIndexesToBeDeactivated.length - 1; i >= 0; i--) {
		const activeNoteIndexToDeactivate = notesIndexesToBeDeactivated[i];

		activeNotes.splice(activeNoteIndexToDeactivate, 1);
	}
};
// TODO: Create inharmonic equivalency checker

// MIDI numbers mapped to their corresponding notes (confirmed only with Elektron Syntakt)
let midiToNoteRef = {
	0: "C-1",
	1: "C#-1",
	2: "D-1",
	3: "D#-1",
	4: "E-1",
	5: "F-1",
	6: "F#-1",
	7: "G-1",
	8: "G#-1",
	9: "A-1",
	10: "A#-1",
	11: "B-1",
	12: "C0",
	13: "C#0",
	14: "D0",
	15: "D#0",
	16: "E0",
	17: "F0",
	18: "F#0",
	19: "G0",
	20: "G#0",
	21: "A0",
	22: "A#0",
	23: "B0",
	24: "C1",
	25: "C#1",
	26: "D1",
	27: "D#1",
	28: "E1",
	29: "F1",
	30: "F#1",
	31: "G1",
	32: "G#1",
	33: "A1",
	34: "A#1",
	35: "B1",
	36: "C2",
	37: "C#2",
	38: "D2",
	39: "D#2",
	40: "E2",
	41: "F2",
	42: "F#2",
	43: "G2",
	44: "G#2",
	45: "A2",
	46: "A#2",
	47: "B2",
	48: "C3",
	49: "C#3",
	50: "D3",
	51: "D#3",
	52: "E3",
	53: "F3",
	54: "F#3",
	55: "G3",
	56: "G#3",
	57: "A3",
	58: "A#3",
	59: "B3",
	60: "C4",
	61: "C#4",
	62: "D4",
	63: "D#4",
	64: "E4",
	65: "F4",
	66: "F#4",
	67: "G4",
	68: "G#4",
	69: "A4",
	70: "A#4",
	71: "B4",
	72: "C5",
	73: "C#5",
	74: "D5",
	75: "D#5",
	76: "E5",
	77: "F5",
	78: "F#5",
	79: "G5",
	80: "G#5",
	81: "A5",
	82: "A#5",
	83: "B5",
	84: "C6",
	85: "C#6",
	86: "D6",
	87: "D#6",
	88: "E6",
	89: "F6",
	90: "F#6",
	91: "G6",
	92: "G#6",
	93: "A6",
	94: "A#6",
	95: "B6",
	96: "C7",
	97: "C#7",
	98: "D7",
	99: "D#7",
	100: "E7",
	101: "F7",
	102: "F#7",
	103: "G7",
	104: "G#7",
	105: "A7",
	106: "A#7",
	107: "B7",
	108: "C8",
	109: "C#8",
	110: "D8",
	111: "D#8",
	112: "E8",
	113: "F8",
	114: "F#8",
	115: "G8",
	116: "G#8",
	117: "A8",
	118: "A#8",
	119: "B8",
};
let noteToMidiRef = {
	"C-1": 0,
	"C#-1": 1,
	"D-1": 2,
	"D#-1": 3,
	"E-1": 4,
	"F-1": 5,
	"F#-1": 6,
	"G-1": 7,
	"G#-1": 8,
	"A-1": 9,
	"A#-1": 10,
	"B-1": 11,
	C0: 12,
	"C#0": 13,
	D0: 14,
	"D#0": 15,
	E0: 16,
	F0: 17,
	"F#0": 18,
	G0: 19,
	"G#0": 20,
	A0: 21,
	"A#0": 22,
	B0: 23,
	C1: 24,
	"C#1": 25,
	D1: 26,
	"D#1": 27,
	E1: 28,
	F1: 29,
	"F#1": 30,
	G1: 31,
	"G#1": 32,
	A1: 33,
	"A#1": 34,
	B1: 35,
	C2: 36,
	"C#2": 37,
	D2: 38,
	"D#2": 39,
	E2: 40,
	F2: 41,
	"F#2": 42,
	G2: 43,
	"G#2": 44,
	A2: 45,
	"A#2": 46,
	B2: 47,
	C3: 48,
	"C#3": 49,
	D3: 50,
	"D#3": 51,
	E3: 52,
	F3: 53,
	"F#3": 54,
	G3: 55,
	"G#3": 56,
	A3: 57,
	"A#3": 58,
	B3: 59,
	C4: 60,
	"C#4": 61,
	D4: 62,
	"D#4": 63,
	E4: 64,
	F4: 65,
	"F#4": 66,
	G4: 67,
	"G#4": 68,
	A4: 69,
	"A#4": 70,
	B4: 71,
	C5: 72,
	"C#5": 73,
	D5: 74,
	"D#5": 75,
	E5: 76,
	F5: 77,
	"F#5": 78,
	G5: 79,
	"G#5": 80,
	A5: 81,
	"A#5": 82,
	B5: 83,
	C6: 84,
	"C#6": 85,
	D6: 86,
	"D#6": 87,
	E6: 88,
	F6: 89,
	"F#6": 90,
	G6: 91,
	"G#6": 92,
	A6: 93,
	"A#6": 94,
	B6: 95,
	C7: 96,
	"C#7": 97,
	D7: 98,
	"D#7": 99,
	E7: 100,
	F7: 101,
	"F#7": 102,
	G7: 103,
	"G#7": 104,
	A7: 105,
	"A#7": 106,
	B7: 107,
	C8: 108,
	"C#8": 109,
	D8: 110,
	"D#8": 111,
	E8: 112,
	F8: 113,
	"F#8": 114,
	G8: 115,
	"G#8": 116,
	A8: 117,
	"A#8": 118,
	B8: 119,
};
const noteToFreq = {
	C0: "16.35Hz",
	"C#0/Db0": "17.32Hz",
	D0: "18.35Hz",
	"D#0/Eb0": "19.45Hz",
	E0: "20.60Hz",
	F0: "21.83Hz",
	"F#0/Gb0": "23.12Hz",
	G0: "24.50Hz",
	"G#0/Ab0": "25.96Hz",
	A0: "27.50Hz",
	"A#0/Bb0": "29.14Hz",
	B0: "30.87Hz",
	C1: "32.70Hz",
	"C#1/Db1": "34.65Hz",
	D1: "36.71Hz",
	"D#1/Eb1": "38.89Hz",
	E1: "41.20Hz",
	F1: "43.65Hz",
	"F#1/Gb1": "46.25Hz",
	G1: "49.00Hz",
	"G#1/Ab1": "51.91Hz",
	A1: "55.00Hz",
	"A#1/Bb1": "58.27Hz",
	B1: "61.74Hz",
	C2: "65.41Hz",
	"C#2/Db2": "69.30Hz",
	D2: "73.42Hz",
	"D#2/Eb2": "77.78Hz",
	E2: "82.41Hz",
	F2: "87.31Hz",
	"F#2/Gb2": "92.50Hz",
	G2: "98.00Hz",
	"G#2/Ab2": "103.83Hz",
	A2: "110.00Hz",
	"A#2/Bb2": "116.54Hz",
	B2: "123.47Hz",
	C3: "130.81Hz",
	"C#3/Db3": "138.59Hz",
	D3: "146.83Hz",
	"D#3/Eb3": "155.56Hz",
	E3: "164.81Hz",
	F3: "174.61Hz",
	"F#3/Gb3": "185.00Hz",
	G3: "196.00Hz",
	"G#3/Ab3": "207.65Hz",
	A3: "220.00Hz",
	"A#3/Bb3": "233.08Hz",
	B3: "246.94Hz",
	C4: "261.63Hz",
	"C#4/Db4": "277.18Hz",
	D4: "293.66Hz",
	"D#4/Eb4": "311.13Hz",
	E4: "329.63Hz",
	F4: "349.23Hz",
	"F#4/Gb4": "369.99Hz",
	G4: "392.00Hz",
	"G#4/Ab4": "415.30Hz",
	A4: "440.00Hz",
	"A#4/Bb4": "466.16Hz",
	B4: "493.88Hz",
	C5: "523.25Hz",
	"C#5/Db5": "554.37Hz",
	D5: "587.33Hz",
	"D#5/Eb5": "622.25Hz",
	E5: "659.25Hz",
	F5: "698.46Hz",
	"F#5/Gb5": "739.99Hz",
	G5: "783.99Hz",
	"G#5/Ab5": "830.61Hz",
	A5: "880.00Hz",
	"A#5/Bb5": "932.33Hz",
	B5: "987.77Hz",
	C6: "1046.50Hz",
	"C#6/Db6": "1108.73Hz",
	D6: "1174.66Hz",
	"D#6/Eb6": "1244.51Hz",
	E6: "1318.51Hz",
	F6: "1396.91Hz",
	"F#6/Gb6": "1479.98Hz",
	G6: "1567.98Hz",
	"G#6/Ab6": "1661.22Hz",
	A6: "1760.00Hz",
	"A#6/Bb6": "1864.66Hz",
	B6: "1975.53Hz",
	C7: "2093.00Hz",
	"C#7/Db7": "2217.46Hz",
	D7: "2349.32Hz",
	"D#7/Eb7": "2489.02Hz",
	E7: "2637.02Hz",
	F7: "2793.83Hz",
	"F#7/Gb7": "2959.96Hz",
	G7: "3135.96Hz",
	"G#7/Ab7": "3322.44Hz",
	A7: "3520.00Hz",
	"A#7/Bb7": "3729.31Hz",
	B7: "3951.07Hz",
	C8: "4186.01Hz",
	"C#8/Db8": "4434.92Hz",
	D8: "4698.63Hz",
	"D#8/Eb8": "4978.03Hz",
	E8: "5274.04Hz",
	F8: "5587.65Hz",
	"F#8/Gb8": "5919.91Hz",
	G8: "6271.93Hz",
	"G#8/Ab8": "6644.88Hz",
	A8: "7040.00Hz",
	"A#8/Bb8": "7458.62Hz",
	B8: "7902.13Hz",
};
const midiToNote = midi => {
	return midiToNoteRef[midi];
};
const noteToMidi = note => {
	return noteToMidiRef[note];
};
let intervals = {
	// intervalsfrom https://github.com/danigb/music-scale/blob/master/dict/scales.json
	lydian: "1 2 3 4# 5 6 7",
	major: "1 2 3 4 5 6 7",
	mixolydian: "1 2 3 4 5 6 7b",
	dorian: "1 2 3b 4 5 6 7b",
	aeolian: "1 2 3b 4 5 6b 7b",
	phrygian: "1 2b 3b 4 5 6b 7b",
	locrian: "1 2b 3b 4 5b 6b 7b",
	"melodic minor": "1 2 3b 4 5 6 7",
	"melodic minor second mode": "1 2b 3b 4 5 6 7b",
	"lydian augmented": "1 2 3 4# 5A 6 7",
	"lydian dominant": "1 2 3 4# 5 6 7b",
	"melodic minor fifth mode": "1 2 3 4 5 6b 7b",
	"locrian #2": "1 2 3b 4 5b 6b 7b",
	"locrian major": "1 2 3 4 5b 6b 7b",
	altered: "1 2b 3b 3 5b 6b 7b",
	"major pentatonic": "1 2 3 5 6",
	"lydian pentatonic": "1 3 4# 5 7",
	"mixolydian pentatonic": "1 3 4 5 7b",
	"locrian pentatonic": "1 3b 4 5b 7b",
	"minor pentatonic": "1 3b 4 5 7b",
	"minor six pentatonic": "1 3b 4 5 6",
	"minor hexatonic": "1 2 3b 4 5 7",
	"flat three pentatonic": "1 2 3b 5 6",
	"flat six pentatonic": "1 2 3 5 6b",
	"major flat two pentatonic": "1 2b 3 5 6",
	"whole tone pentatonic": "1 3 5b 6b 7b",
	"ionian pentatonic": "1 3 4 5 7",
	"lydian #5 pentatonic": "1 3 4# 5A 7",
	"lydian dominant pentatonic": "1 3 4# 5 7b",
	"minor #7 pentatonic": "1 3b 4 5 7",
	"super locrian pentatonic": "1 3b 4d 5b 7b",
	"in-sen": "1 2b 4 5 7b",
	iwato: "1 2b 4 5b 7b",
	hirajoshi: "1 2 3b 5 6b",
	kumoijoshi: "1 2b 4 5 6b",
	pelog: "1 2b 3b 5 6b",
	"vietnamese 1": "1 3b 4 5 6b",
	"vietnamese 2": "1 3b 4 5 7b",
	prometheus: "1 2 3 4# 6 7b",
	"prometheus neopolitan": "1 2b 3 4# 6 7b",
	ritusen: "1 2 4 5 6",
	scriabin: "1 2b 3 5 6",
	piongio: "1 2 4 5 6 7b",
	"major blues": "1 2 3b 3 5 6",
	"minor blues": "1 3b 4 5b 5 7b",
	"composite blues": "1 2 3b 3 4 5b 5 6 7b",
	augmented: "1 2A 3 5 5A 7",
	"augmented heptatonic": "1 2A 3 4 5 5A 7",
	"dorian #4": "1 2 3b 4# 5 6 7b",
	"lydian diminished": "1 2 3b 4# 5 6 7",
	"whole tone": "1 2 3 4# 5A 7b",
	"leading whole tone": "1 2 3 4# 5A 7b 7",
	"harmonic minor": "1 2 3b 4 5 6b 7",
	"lydian minor": "1 2 3 4# 5 6b 7b",
	neopolitan: "1 2b 3b 4 5 6b 7",
	"neopolitan minor": "1 2b 3b 4 5 6b 7b",
	"neopolitan major": "1 2b 3b 4 5 6 7",
	"neopolitan major pentatonic": "1 3 4 5b 7b",
	"romanian minor": "1 2 3b 5b 5 6 7b",
	"double harmonic lydian": "1 2b 3 4# 5 6b 7",
	diminished: "1 2 3b 4 5b 6b 6 7",
	"harmonic major": "1 2 3 4 5 6b 7",
	"double harmonic major": "1 2b 3 4 5 6b 7",
	egyptian: "1 2 4 5 7b",
	"hungarian minor": "1 2 3b 4# 5 6b 7",
	"hungarian major": "1 2A 3 4# 5 6 7b",
	oriental: "1 2b 3 4 5b 6 7b",
	spanish: "1 2b 3 4 5 6b 7b",
	"spanish heptatonic": "1 2b 3b 3 4 5 6b 7b",
	flamenco: "1 2b 3b 3 4# 5 7b",
	balinese: "1 2b 3b 4 5 6b 7",
	"todi raga": "1 2b 3b 4# 5 6b 7",
	"malkos raga": "1 3b 4 6b 7b",
	"kafi raga": "1 3b 3 4 5 6 7b 7",
	"purvi raga": "1 2b 3 4 4# 5 6b 7",
	persian: "1 2b 3 4 5b 6b 7",
	bebop: "1 2 3 4 5 6 7b 7",
	"bebop dominant": "1 2 3 4 5 6 7b 7",
	"bebop minor": "1 2 3b 3 4 5 6 7b",
	"bebop major": "1 2 3 4 5 5A 6 7",
	"bebop locrian": "1 2b 3b 4 5b 5 6b 7b",
	"minor bebop": "1 2 3b 4 5 6b 7b 7",
	"mystery #1": "1 2b 3 5b 6b 7b",
	enigmatic: "1 2b 3 5b 6b 7b 7",
	"minor six diminished": "1 2 3b 4 5 6b 6 7",
	"ionian augmented": "1 2 3 4 5A 6 7",
	"lydian #9": "1 2b 3 4# 5 6 7",
	ichikosucho: "1 2 3 4 5b 5 6 7",
	"six tone symmetric": "1 2b 3 4 5A 6",
};
const deriveScale = (root, intervals) => {
	/*

	root : Num || Str
		 : MIDI note # (ex: 22), or Note identifier (ex: "A#0")
	
	interval: str
			: str denoting interval from root to create scale from
			: modification of root major scale used to derive given scale

	Steps:
	Given root and scaleName:
	1: Derive major scale of root note
	2: Alter major scale given interval
	 : Remove unused interval numbers
	 : Apply sharps and/or flats
	3: Return notes as MIDI
	*/

	// 1: Derive major scale of root note
	const deriveMajorScale = root => {
		if (typeof root != "number") root = noteToMidi(root);
		const rootMajor = [
			root,
			root + 2, // W
			root + 4, // W
			root + 5, // h
			root + 7, // W
			root + 9, // W
			root + 11, // W
			// root + 12, // h
		];
		return rootMajor;
	};
	const rootMajor = deriveMajorScale(root);

	// 2: Alter major scale  given interval
	const majorToScale = (major, intervals) => {
		/* 
			Returns an altered copy of a major scale based on intervals of another scale
			
			major: Arr : array of seven Nums correspoding to MIDI notes of a major scale to be modified
			intervals: Str : String of intervals. ex: "1 2b 3b 4 5b 5 6b 7b"
		*/

		// Remove unused interval numbers
		// Apply sharps and/or flats
		const intervalsParsed = intervals.split(" ");
		const newScale = [];
		intervalsParsed.forEach(intervalStep => {
			// Define index of note in major scale arr for processing
			let intervalIndex = parseInt(intervalStep[0]) - 1;
			if (intervalStep.length === 1) {
				// If no sharps of flats in interval, use note from major scale corresponding to inteval number
				newScale.push(rootMajor[intervalIndex]);
			} else {
				// Handle sharps and flats
				// Derive MIDI number of unaltered major scale note
				const majorNoteMidi = major[intervalIndex];
				const modifier = intervalStep[1];
				if (modifier === "#") {
					// If sharp, use a half step above note from major scale corresponding to interval number
					newScale.push(majorNoteMidi + 1);
				} else if (modifier === "b") {
					// If flat, use a half step below note from major scale corresponding to interval number
					newScale.push(majorNoteMidi - 1);
				} else {
					console.log("unidentified interval suffix: ", modifier);
				}
			}
		});
		return newScale;
	};
	const newScale = majorToScale(rootMajor, intervals);

	//3: Return notes as MIDI
	return newScale;
};

// deriveScale("A6", intervals["ritusen"]).forEach(midi => {
// 	console.log(midiToNote(midi));
// });

const playNote = (
	outputDevice,
	midiChannel,
	note,
	octave,
	duration,
	delay,
	identifier
) => {
	midiChannel = outputDevice.channels[midiChannel];
	delay = "+" + delay.toString();

	const noteIdentifier = identifier ? identifier : note + octave.toString();
	midiChannel.playNote(noteIdentifier, {
		duration: duration,
		time: delay,
	});
};

const playScale = (
	outputDevice,
	midiChannel,
	root,
	scale,
	octave,
	noteDur,
	spacing,
	delay
) => {
	midiChannel = outputDevice.channels[midiChannel];
	delay = "+" + delay.toString();
	const rootIdentifier = root + octave.toString();
	console.log(rootIdentifier);
	scale = deriveScale(rootIdentifier, intervals[scale]);
	const delayNote = (i, timeout) => {
		setTimeout(() => {
			midiChannel.playNote(scale[i], {
				duration: noteDur,
				time: "+0",
			});
		}, timeout);
	};
	for (let i = 0; i < scale.length; i++) {
		console.log(scale[i], i * spacing);
		delayNote(i, i * spacing); // only way I found to iterate through notes and apply delays to each
	}
};

const playDiatonicTriad = (
	outputDevice,
	midiChannel,
	noteDur,
	strum,
	root,
	scale,
	chordNum,
	octave,
	delay
) => {
	midiChannel = outputDevice.channels[midiChannel];
	delay = "+" + delay.toString();
	const rootIdentifier = root + octave.toString();
	scale = deriveScale(rootIdentifier, intervals[scale]);
	const chordRoot = scale[chordNum - 1]; // MIDI note of chord root
	const chordNotes = [];

	// Derive notes of chord
	for (let i = 0; i < 3; i++) {
		let isOctaveHigher = false;

		// Derive index in scale array of chord root
		let chordRootIndex = chordNum - 1 + i * 2;

		// Handle if root is in a higher octave
		if (chordRootIndex > scale.length) {
			chordRootIndex = chordRootIndex % scale.length;
			isOctaveHigher = true;
		}
		let midiNote = scale[chordRootIndex];
		if (isOctaveHigher) midiNote += 12;
		chordNotes.push(midiNote);
	}

	midiChannel.playNote(chordNotes, {
		duration: noteDur,
		time: delay,
	});
};

// TODO

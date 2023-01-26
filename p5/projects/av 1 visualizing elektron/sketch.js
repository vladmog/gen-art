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

// let inited = false;
let notesRef = {
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
// let notes = {};

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	// noFill();
	angleMode(DEGREES);
	frameRate(60);
	WebMidi.enable()
		.then(() => {
			if (!inited) console.log("WebMidi enabled!");
		})
		.then(onEnabled)
		.catch(err => alert(err));

	function onEnabled() {
		// Inputs
		WebMidi.inputs.forEach(input => {
			if (!inited)
				console.log(
					`Input manufacturer: ${
						input.manufacturer ? input.manufacturer : "None"
					}\nInput name: ${input.name ? input.name : "None"}\n\n`
				);
		});

		// Outputs
		WebMidi.outputs.forEach(output => {
			if (!inited)
				console.log(
					`Output manufacturer: ${
						output.manufacturer ? output.manufacturer : "None"
					}\nOutput name: ${output.name ? output.name : "None"}`
				);
		});

		inited = true;
	}

	for (let i = 0; i <= 119; i++) {
		notes[i] = {
			identifier: notesRef[i],
			isNoteOn: false,
		};
	}
}

let iterator = 0;
let lastNoteOnTimeStamp = 0;
let lastNoteOn = "";

let lastNoteOffTimeStamp = 0;
let lastNoteOff = "";

function draw() {
	background(255);
	strokeWeight(defStrokeWeight / 3);
	line(width * 0.2, height / 2, width * 0.8, height / 2);

	const myInput = WebMidi.getInputByName("USB Midi");
	const mySynth = myInput.channels[1]; // <-- the MIDI channel (1)

	mySynth.addListener("noteon", e => {
		let currNoteOnTimeStamp = e.timestamp;
		let currNoteOn = e.note.identifier;
		// If not a duplicate MIDI trigger, do something
		if (
			currNoteOnTimeStamp != lastNoteOnTimeStamp ||
			(currNoteOnTimeStamp == lastNoteOnTimeStamp &&
				currNoteOn != lastNoteOn)
		) {
			// Do something here
			console.log(currNoteOn, e.note.number);
			notes[e.note.number].isNoteOn = true;
		}
		lastNoteOnTimeStamp = currNoteOnTimeStamp;
		lastNoteOn = currNoteOn;
	});

	mySynth.addListener("noteoff", e => {
		let currNoteOffTimeStamp = e.timestamp;
		let currNoteOff = e.note.identifier;
		// If not a duplicate MIDI trigger, do something
		if (
			currNoteOffTimeStamp != lastNoteOffTimeStamp ||
			(currNoteOffTimeStamp == lastNoteOffTimeStamp &&
				currNoteOff != lastNoteOff)
		) {
			// Do something here
			console.log(currNoteOff, e.note.number);
			notes[e.note.number].isNoteOn = false;
		}
		lastNoteOffTimeStamp = currNoteOffTimeStamp;
		lastNoteOff = currNoteOff;
	});

	const drawNotes = () => {
		strokeWeight(defStrokeWeight);
		for (let i = 0; i <= 119; i++) {
			if (notes[i].isNoteOn) {
				let x = map(i, 0, 119, width * 0.2, width * 0.8);
				let y = height / 2;
				point(x, y);
			}
		}
		strokeWeight(defStrokeWeight);
	};

	drawNotes();

	iterator += 0.5;
}

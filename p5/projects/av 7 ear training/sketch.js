// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 5;
const plotH = 5;
const scale = 1;
dim.updateDims(plotW, plotH, scale);

// Enter desired FPS, BPM
const fps = 24;
const bpm = 80;
const msPerBeat = 60000 / bpm;
const msPerFrame = 1000 / fps;

// Derive stroke weight
const defPen = "Pilot G2 0.7";
let defStrokeWeight = dim.inchToPx(lineWidth(defPen));
defStrokeWeight /= 3;

// TIME
let isPlaying = false;
let stopTime = 0;
let continueTime = 0;
let pauseOffset = 0;
let currFrame = 0;
let startTime = 0;
let currTime = 0;
let elapsedTime = 0;
let currBeat = 0;

let lastNoteOnTimeStamp = 0;
let lastNoteOn = "";

let lastNoteOffTimeStamp = 0;
let lastNoteOff = "";

let notesPlayed = [];

// MIDI

let myOutput;
let myInput;
let mySynth;

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	frameRate(fps);
	textAlign(CENTER, CENTER);
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

		myInput = WebMidi.getInputByName("USB Midi");
		mySynth = myInput.channels[1]; // <-- the MIDI channel (1)
		myOutput = WebMidi.getOutputByName("USB Midi");

		// ADD INCOMING NOTES
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
				if (isPendingAnswer) notesPlayed.push(e.note.number);
				if (!activeNotes.includes(e.note.number)) {
					activeNotes.push(e.note.number);
				}
				console.log(e.note.identifier);
				notes[e.note.number].isNoteOn = true;
				notes[e.note.number].instances.push({
					// noteOnTime: e.timestamp,
					noteOnTime: currTime,
					noteOffTime: "",
					velocity: e.rawVelocity,
				});
			}
			lastNoteOnTimeStamp = currNoteOnTimeStamp;
			lastNoteOn = currNoteOn;
			if (isPendingAnswer) checkNoteHearing();
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
				// console.log(currNoteOff, e.note.number, e);
				const note = notes[e.note.number];
				note.isNoteOn = false;
				const lastInstanceOfNote =
					note.instances[note.instances.length - 1];
				// lastInstanceOfNote.noteOffTime = e.timestamp;
				lastInstanceOfNote.noteOffTime = currTime;
				// console.log(activeNotes, notes[e.note.number]);

				// test
				if (e.note.number === 87) {
					const timeError = currTime - e.timestamp;
				}
			}
			lastNoteOffTimeStamp = currNoteOffTimeStamp;
			lastNoteOff = currNoteOff;
		});

		mySynth.addListener("controlchange", e => {
			if (e.controller.number === 120) {
				// console.log("all sounds stop");
				return;
			} // all sound stop cc ignore
			midiCC[e.message.data[1]].value = e.rawValue;
		});

		myInput.addListener("clock", e => {
			/*
			Clock events are sent at a rate of 
			24 pulses per quarter note.
			*/
			// console.log("clock", elapsedTime);
			if (isPlaying) {
				currTime = e.timestamp - pauseOffset;
				elapsedTime = currTime - startTime;
			}
		});
		myInput.addListener("start", e => {
			console.log("start", e.timestamp);
			isPlaying = true;
			startTime = e.timestamp;
			currTime = startTime;
		});
		myInput.addListener("stop", e => {
			console.log("stop");
			stopTime = e.timestamp;
			isPlaying = false;
		});
		myInput.addListener("continue", e => {
			// console.log("continue");
			continueTime = e.timestamp;
			pauseOffset = continueTime - stopTime;
			startTime = continueTime = pauseOffset;

			isPlaying = true;
		});

		inited = true;
	}

	// Populate notes data structure
	for (let i = 0; i <= 119; i++) {
		notes[i] = {
			identifier: midiToNoteRef[i],
			isNoteOn: false,
			instances: [], // Arr of instances of note, each with note on and note off timestamp
		};
	}

	// Populate MIDI CC data structure
	for (let i = 1; i <= 119; i++) {
		midiCC[i] = {
			midiCC: i,
			value: 0,
		};
	}
}

function mouseClicked(event) {
	console.log(mouseX, mouseY);
	// playNote(myOutput, 12, "D", 3, 1000, 0);
	// playScale(myOutput, 11, "C", "aeolian", 4, 100, 200, 0);

	const outputDevice = myOutput;
	const midiChannel = 11;
	const noteDur = 1000;
	const strum = 0;
	const root = "C";
	const scale = "aeolian";
	const chordNum = 5;
	const octave = 3;
	const delay = 0;

	if (isAnsweredCorrectly) {
		setPageNoteHearing();
	} else {
		isPendingAnswer = false;
		playNote(myOutput, 7, null, null, 1000, 0, midiToNote(answer - 12));
		setTimeout(() => (isPendingAnswer = true), 1000);
	}
	// playDiatonicTriad(
	// 	outputDevice,
	// 	midiChannel,
	// 	noteDur,
	// 	strum,
	// 	root,
	// 	scale,
	// 	chordNum,
	// 	octave,
	// 	delay
	// );
}

const setPageMenu = () => {};

let answer;
let isPendingAnswer = false;
let isAnsweredCorrectly = false;
let correctAttempts = 0;
let totalAttempts = 0;
let notesTested = -1;
let tally = {
	/* A2: {
		correctAttempts: 0,
		totalAttempts: 
	},
	...
	*/
};
const notePoolIdentifier = [
	// Major
	"C4",
	// "C#4",
	"D4",
	// "D#4",
	"E4",
	"F4",
	// "F#4",
	"G4",
	// "G#4",
	"A4",
	// "A#4",
	"B4",
	"C5",

	// "C5",
	// // "C#4",
	// "D5",
	// // "D#4",
	// "E5",
	// "F5",
	// // "F#4",
	// "G5",
	// // "G#4",
	// "A5",
	// // "A#4",
	// "B5",
	// "C6",

	// Minor
	// "C4",
	// // "C#4",
	// "D4",
	// "D#4",
	// // "E4",
	// "F4",
	// // "F#4",
	// "G4",
	// "G#4",
	// // "A4",
	// "A#4",
	// // "B4",
	// // "C5",
];
notePoolIdentifier.forEach(note => {
	tally[note] = {
		correctAttempts: 0,
		totalAttempts: 0,
	};
});

const setPageNoteHearing = () => {
	/* 
	Steps:
		1. Pick note from notes pool
		2. Load UI
		3. Play note
		4. On new note input, compare input note to pre selected note.
			-> same: positive feedback, then new page.
			-> diff: negative feedback, try again
		4. 
	*/
	/* 
	What notes and octaves should be in the notes pool?
	Notes: all of them.
	Octaves: only one octave for now. middle range. octave 4 seems pretty good (MIDI notes [60-71])
	*/

	isPendingAnswer = false;
	isAnsweredCorrectly = false;
	notesPlayed = [];
	notesTested++;

	if (notesTested >= 100) {
		background(3, 252, 227);
	} else {
		background(200);
	}

	// Define potential notes for the test
	const notePool = [];
	for (let i = 0; i < notePoolIdentifier.length; i++) {
		notePool.push(noteToMidi(notePoolIdentifier[i]));
	}

	// Pick a random note from the note pool
	let randomNote = notePool[Math.floor(Math.random() * notePool.length)];
	while (randomNote === answer) {
		randomNote = notePool[Math.floor(Math.random() * notePool.length)];
	}
	console.log("Random note: ", midiToNote(randomNote));
	answer = randomNote;

	playNote(myOutput, 7, null, null, 1000, 0, midiToNote(randomNote - 12));

	text(
		`${notesTested}, ${Math.round(
			(correctAttempts / totalAttempts
				? correctAttempts / totalAttempts
				: 0) * 100
		)}%`,
		width / 2,
		height * 0.5
	);
	text("Play the note you hear", width / 2, height * 0.75);
	setTimeout(() => (isPendingAnswer = true), 1000);
};
const checkNoteHearing = () => {
	if (!isAnsweredCorrectly) {
		totalAttempts++;
		tally[midiToNote(answer)].totalAttempts += 1;
	}
	const lastNotePlayed = notesPlayed[notesPlayed.length - 1];
	if (
		lastNotePlayed === answer ||
		lastNotePlayed + 12 === answer ||
		lastNotePlayed - 12 === answer
	) {
		if (!isAnsweredCorrectly) {
			correctAttempts++;
			tally[midiToNote(answer)].correctAttempts += 1;
		}
		console.log("correct");
		isAnsweredCorrectly = true;
		background(0, 255, 0);
		text(
			`${notesTested}, ${Math.round(
				(correctAttempts / totalAttempts) * 100
			)}%`,
			width / 2,
			height * 0.5
		);
		text(midiToNote(answer), width / 2, height * 0.6);
		// Draw tally:
		const margin = 100;
		const notesCt = notePoolIdentifier.length;
		const cellWidth = (width - margin * 2) / notesCt;
		const cellHeight = cellWidth;

		notePoolIdentifier.forEach((note, i) => {
			const x1 = margin + cellWidth * i;
			const y1 = margin;
			const x2 = x1 + cellWidth;
			const y2 = margin;
			const x3 = x2;
			const y3 = margin + cellHeight;
			const x4 = x1;
			const y4 = y3;

			// text;

			let x = (x1 + x2) / 2;
			let y = (y1 + y3) / 2;
			const hitRate =
				tally[note].correctAttempts / tally[note].totalAttempts;
			if (!hitRate) {
				return;
			}
			const heightOffset = map(hitRate, 0, 1, 50, 0);

			quad(
				x1,
				y1 + heightOffset,
				x2,
				y2 + heightOffset,
				x3,
				y3 + heightOffset,
				x4,
				y4 + heightOffset
			);
			text(`${note}: ${Math.floor(hitRate * 100)}%`, x, y + heightOffset);
		});
	} else {
		console.log("Test 4e");
		console.log("Test 5");
		background(255, 0, 0);
		text(
			`${notesTested}, ${Math.round(
				(correctAttempts / totalAttempts) * 100
			)}%`,
			width / 2,
			height * 0.5
		);
		// console.log("try again");
	}
};
const replayNoteHearing = () => {};

const setPageScaleHearing = () => {};

const setPageChordHearing = () => {};

function draw() {
	// CLEAR FRAME
	background(200);

	// REMOVE OFF-TIMEFRAME NOTES
	cleanNotes();

	setPageNoteHearing();

	// Iterate time
	currFrame += 1;
	currBeat = Math.floor(currTime / msPerBeat);
	noLoop();
}

/* 
Notes

Planning:

On note input, need to add to a list of notes in order of them being played, even if theyre duplicates.
This is only for the sake of this particular project.

Planning end



notes being sent should probably be compartmentalized in this descending order
  channel > note > instance

sketch is synced from start. pausing and continuing is still rough

Can all this MIDI functionality be turned into a class with own custom functionality?

*/

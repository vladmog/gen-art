// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 4;
const plotH = 4;
const scale = 1;
dim.updateDims(plotW, plotH, scale);

// Enter desired FPS, BPM
const fps = 24;
const bpm = 80;
const msPerBeat = 60000 / bpm;

const msPerFrame = 1000 / fps;

// Derive stroke weight
const defPen = "Pilot G2 0.7";
const defStrokeWeight = dim.inchToPx(lineWidth(defPen));

// ======== E N D   S E T U P ============

let inited = false;
let notes = {};
let activeNotes = [];
let isGlitchDetected = false;

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	// noFill();
	angleMode(DEGREES);
	frameRate(fps);
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
			identifier: midiToNoteRef[i],
			isNoteOn: false,
			instances: [], // Arr of instances of note, each with note on and note off timestamp
		};
	}
}

let currFrame = 0;
let startTime = 0;
let currTime = 0;
let currBeat = 0;

let lastNoteOnTimeStamp = 0;
let lastNoteOn = "";

let lastNoteOffTimeStamp = 0;
let lastNoteOff = "";

function draw() {
	background(255);
	strokeWeight(defStrokeWeight / 3);

	const myInput = WebMidi.getInputByName("USB Midi");
	const mySynth = myInput.channels[1]; // <-- the MIDI channel (1)

	// Remove stale notes
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
						console.log(notesIndexesToBeDeactivated);
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
	cleanNotes();

	/*
		Add new active notes
	*/
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
			if (!activeNotes.includes(e.note.number)) {
				activeNotes.push(e.note.number);
			}
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

	// Draw notes
	const drawNotes = () => {
		const x1 = (x4 = width * 0.1);
		const x2 = (x3 = width * 0.9);
		const y1 = (y2 = height * 0.3);
		const y3 = (y4 = height * 0.7);
		const length = x2 - x1;

		line(x1, y1, x2, y2);
		line(x4, y4, x3, y3);
		line(x1, y1, x4, y4);
		line(x2, y2, x3, y3);

		line(x1 + length * 0.25, y1, x4 + length * 0.25, y4);
		line(x1 + length * 0.5, y1, x4 + length * 0.5, y4);
		line(x1 + length * 0.75, y1, x4 + length * 0.75, y4);
		strokeWeight(defStrokeWeight);
		for (let noteIndex = 0; noteIndex <= 119; noteIndex++) {
			let note = notes[noteIndex];
			let instances = note.instances;
			for (
				let instanceIndex = 0;
				instanceIndex < instances.length;
				instanceIndex++
			) {
				const instance = instances[instanceIndex];
				let elapsedSinceNoteOn = currTime - instance.noteOnTime;
				let elapsedSinceNoteOff;
				if (instance.noteOffTime === "") {
					elapsedSinceNoteOff = 0;
				} else {
					elapsedSinceNoteOff = currTime - instance.noteOffTime;
				}
				if (elapsedSinceNoteOn < 0) {
					// console.log("Looks like our ms tracking is off");
				}
				let y1 = (y2 = map(
					noteIndex,
					0,
					119,
					height * 0.3,
					height * 0.7
				));
				let x1 = map(
					elapsedSinceNoteOff,
					0,
					msPerBeat * 4,
					width * 0.1,
					width * 0.9
				);
				let x2 = map(
					elapsedSinceNoteOn,
					0,
					msPerBeat * 4,
					width * 0.1,
					width * 0.9
				);
				if (elapsedSinceNoteOn > msPerBeat * 4) {
					x2 = width * 0.9;
				}
				beginShape();
				vertex(x1, y1);
				vertex(x2, y2);
				endShape();
				if (x1 > width) {
					isGlitchDetected = true;
				}
			}
		}
		strokeWeight(defStrokeWeight);
	};
	drawNotes();

	// Iterate time
	currFrame += 1;
	currBeat = currTime / msPerBeat;
	currTime += msPerFrame;

	// noLoop();
}

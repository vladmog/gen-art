// =========== S E T U P ================

// Enter desired plot size in inches
const plotW = 5;
const plotH = 5;
const scale = 1;
dim.updateDims(plotW, plotH, scale);

// Enter desired FPS, BPM
const fps = 24;
const bpm = 100;
const msPerBeat = 60000 / bpm;
const msPerFrame = 1000 / fps;

// Derive stroke weight
const defPen = "Pilot G2 0.7";
let defStrokeWeight = dim.inchToPx(lineWidth(defPen));
defStrokeWeight /= 3;

// MIDI

let myInput;
let mySynth;
let myOutput;
let channel;

let inited = false;
const notes = {};
const activeNotes = [];
const midiCC = {};
let isGlitchDetected = false;

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	noFill();
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

		myInput = WebMidi.getInputByName("USB Midi");
		mySynth = myInput.channels[1]; // <-- the MIDI channel (1)

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
				if (!activeNotes.includes(e.note.number)) {
					activeNotes.push(e.note.number);
				}
				// console.log(e);
				// console.log(e.note.identifier);
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

		mySynth.addListener("controlchange", e => {
			midiCC[e.message.data[1]].value = e.rawValue;
			// console.log(e);
		});

		// Setup MIDI output
		myOutput = WebMidi.getOutputByName("USB Midi");
		channel = myOutput.channels[2];

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
			controller: i,
			value: 0,
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

const drawPolyrythm = (center, minRadius, maxRadius, ringNotes, oscSpeed) => {
	/*
		Represents notes as concentric rings.
		Radius scales with pitch of note.
		Instances placed at angular positions.
		Playing of notes is determined by an 
		  oscillating radial line.

		- center: Obj : {x: Num, y: Num}
		- minRadius: Num : radius in px of smallest circle
		- maxRadius: Num : radius in px of largest circle
		- ringNotes: Arr : [
			{
				noteNumber: Num,
				noteIdentifier: Str,
				instances: [
					{
						velocity: Num,         : need to figure out the possible range here...
						barLoc: Num [0,1]      : normalized position in bar (0: beginning, 1: end)
						duration: Num          : ms
					}
				]
			},
			...
		  ]

		- oscSpeed: Num : quantity of beats for radial line to rotate 360 degrees.
	*/

	// Generate playhead
	const msPerOsc = msPerBeat * oscSpeed;
	const repeatingPlayhead = currTime % msPerOsc;
	const barPos = map(repeatingPlayhead, 0, msPerOsc, 0, 1);
	const oscAngle = map(repeatingPlayhead, 0, msPerOsc, 0, 360);
	const radialLine = {
		x: maxRadius * cos(oscAngle) + center.x,
		y: maxRadius * sin(oscAngle) + center.y,
	};
	line(center.x, center.y, radialLine.x, radialLine.y);

	// Generate notes and play them if on playhead
	for (
		let ringNoteIndex = 0;
		ringNoteIndex < ringNotes.length;
		ringNoteIndex++
	) {
		const { noteNumber, noteIdentifier, instances } =
			ringNotes[ringNoteIndex];
		const noteRadius = map(noteNumber, 0, 119, minRadius, maxRadius);
		ellipse(center.x, center.y, noteRadius * 2);
		for (
			let instanceIndex = 0;
			instanceIndex < instances.length;
			instanceIndex++
		) {
			const { velocity, barLoc, duration } = instances[instanceIndex];
			const angle = map(barLoc, 0, 1, 0, 360);
			const x = noteRadius * cos(angle) + center.x;
			const y = noteRadius * sin(angle) + center.y;
			strokeWeight(10);
			point(x, y);
			strokeWeight(defStrokeWeight);

			// If note within distance of playhead, play the note
			if (
				Math.abs(barLoc - barPos) < 0.01 ||
				1 - Math.abs(barLoc - barPos) < 0.01
			) {
				channel.playNote(noteIdentifier, {
					duration: duration,
					time: "+0",
				});
			}
		}
	}
};

function draw() {
	// INIT TIME
	if (!startTime) startTime = Date.now();
	currTime = Date.now() - startTime;

	// CLEAR FRAME
	background(255);
	strokeWeight(defStrokeWeight);

	// REMOVE OFF-TIMEFRAME NOTES
	cleanNotes();

	// DRAW NOTES AND SEND TO SYNTAKT
	const center = {
		x: width / 2,
		y: height / 2,
	};
	const minRadius = width * 0.1;
	const maxRadius = width * 0.4;
	const ringNotes = [
		{
			noteNumber: 98,
			noteIdentifier: "D7",
			instances: [
				{
					velocity: 70,
					barLoc: 0.25,
					duration: 1000,
				},
				{
					velocity: 70,
					barLoc: 0.75,
					duration: 1000,
				},
			],
		},
		{
			noteNumber: 87,
			noteIdentifier: "D#6",
			instances: [
				{
					velocity: 70,
					barLoc: 0.5,
					duration: 1000,
				},
				{
					velocity: 70,
					barLoc: 0.0001,
					duration: 1000,
				},
			],
		},
	];
	const oscSpeed = 4;
	drawPolyrythm(center, minRadius, maxRadius, ringNotes, oscSpeed);

	// RECEIVE MIDI CC FROM SYNTAKT AND DRAW

	const msPerOsc = msPerBeat * oscSpeed;
	const repeatingPlayhead = currTime % msPerOsc;
	const barPos = map(repeatingPlayhead, 0, msPerOsc, 0, 1);
	const oscAngle = map(repeatingPlayhead, 0, msPerOsc, 0, 360);

	const ccCircleDiameter = map(sin(oscAngle), -1, 1, 2, width);
	ellipse(center.x, center.y, ccCircleDiameter);
	const controller = 24; // determines knob being turnt
	const ccValue = Math.floor(map(ccCircleDiameter, 2, width, 40, 88)); // for some reason 44 and 88 are the limits for
	const options = { channels: [11] }; // channel determines track
	myOutput.sendControlChange(controller, ccValue, options);
	console.log(ccValue);

	// Iterate time
	currFrame += 1;
	currBeat = Math.floor(currTime / msPerBeat);
	// noLoop();
}

/* 
Notes

notes being sent should probably be compartmentalized in this descending order
  channel > note > instance

can MIDI listeners be setup in setup instead of draw function to save CPU?
: A : yep. done. you're welcome CPU

Can all this MIDI functionality be turned into a class with own custom functionality?

*/

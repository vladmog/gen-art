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

let font;
let inited = false;
function preload() {
	font = loadFont("assets/ReliefSingleLine-Regular_svg.otf");
}

function setup() {
	createCanvas(dim.pxDimensions.x, dim.pxDimensions.y, SVG);
	strokeWeight(defStrokeWeight);
	stroke(0);
	// noFill();
	angleMode(DEGREES);
	frameRate(2.6);
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
}

let iterator = 0;

function draw() {
	console.log(iterator);
	// noLoop();
	const myInput = WebMidi.getInputByName("USB Midi");
	const mySynth = myInput.channels[1]; // <-- the MIDI channel (1)
	mySynth.addListener("noteon", e => {
		console.log(e.note.identifier, e.message.channel);
	});

	const myOutput = WebMidi.getOutputByName("USB Midi");
	let channel = myOutput.channels[2];
	if (iterator % 3 === 0) {
		channel.playNote("C5", { duration: 10, time: "+400" });
	}

	if (iterator % 4 === 0) {
		channel.playNote("D5", { duration: 10, time: "+200" });
	}

	if (iterator % 1 === 0) {
		channel.playNote("F5", { duration: 100 });
	}

	// channel.playNote("F2", { duration: 20, time: "+600" });
	iterator += 0.5;
}

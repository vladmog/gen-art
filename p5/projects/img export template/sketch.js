/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b) {
	(r /= 255), (g /= 255), (b /= 255);
	var max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	var h,
		s,
		l = (max + min) / 2;

	if (max == min) {
		h = s = 0; // achromatic
	} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return [h, s, l];
}

let img;
let cnv;
let grayscale;
let hsl;
let res = 200;
function preload() {
	img = loadImage("./assets/surf.jpg");
}

function setup() {
	angleMode(DEGREES);
	let canvasWidth = 600;
	let canvasHeight = 600;
	const imgToCanvas = (imgCoord, img) => {
		// Use when referencing enlarged coordinates via image coordinates

		let coords = {
			x: map(imgCoord.x, 0, img.width, 0, canvasWidth),
			y: map(imgCoord.y, 0, img.height, 0, canvasHeight),
		};
		return coords;
	};
	const canvasToImg = (grandCoord, img) => {
		// Use when referencing image coordinates via enlarged coordinates

		let coords = {
			x: map(grandCoord.x, 0, canvasWidth, 0, img.width),
			y: map(grandCoord.y, 0, canvasHeight, 0, img.height),
		};
		return coords;
	};

	cnv = createCanvas(canvasWidth, canvasHeight);
	noFill();
	strokeWeight(0.5);
	stroke(0);

	background(255);

	let rows = res;
	let cols = res;
	let margin = 5;

	for (let row = 0; row <= rows; row++) {
		for (let col = 0; col <= cols; col++) {
			let x = map(col, 0, cols, 0 + margin, width - margin);
			let y = map(row, 0, rows, 0 + margin, height - margin);
			let imgCoords = canvasToImg({ x, y }, img);
			let c = img.get(imgCoords.x, imgCoords.y);
			let hsl = rgbToHsl(c[0], c[1], c[2]);
			let luminance = hsl[2];
			let strokeVal = map(luminance, 0, 1, 0, 255);
			strokeWeight(5);
			stroke(strokeVal);
			point(x, y);
			strokeWeight(1);
		}
	}

	noLoop();
}

function draw() {
	// save("mySVG.svg"); // give file name
	// print("saved svg");
	// noLoop(); // we just want to export once
}

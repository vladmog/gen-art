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
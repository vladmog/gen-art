/* 
On 3K screen, 1 inch = 130.3 px
aka 3 inches = 391 px
*/

const dim = {};

dim.inchDimensions = {
	x: 1,
	y: 1,
};

dim.pxDimensions = {
	x: 130.3,
	y: 130.3,
};

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

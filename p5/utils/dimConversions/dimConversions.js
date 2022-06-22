/* 
On 3K screen, 1 inch = 130.3 px
aka 3 inches = 391 px
*/

let inchDimensions = {
	x: 1,
	y: 1,
};

let pxDimensions = {
	x: 130.3,
	y: 130.3,
};

const inchToPx = inches => {
	const px = (pxDimensions.x * inches) / inchDimensions.x;
	return px;
};

const mmToPx = mm => {
	const px = (pxDimensions.x * mm) / (inchDimensions.x * 25.4);
	return px;
};

const pxToInch = px => {
	const inches = (inchDimensions.x * px) / pxDimensions.x;
	return inches;
};

const pxToMM = px => {
	const inches = (inchDimensions.x * px) / pxDimensions.x;
	const mm = inches * 24.4;
	return mm;
};

const mmToInch = mm => {
	const inches = mm / 25.4;
	return inches;
};

const inchToMM = inches => {
	const mm = inches * 25.4;
	return mm;
};

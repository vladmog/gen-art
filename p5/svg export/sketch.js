/* export SVG
DDF 2019
need to have p5.svg.js in project and in index.html
see -https://github.com/zenozeng/p5.js-svg
this will save an SVG file in your download folder
*/

function setup() {
  createCanvas(500, 500, SVG); // Create SVG Canvas
  strokeWeight(1); // do 0.1 for laser
  stroke(0); // red is good for laser
  noFill(); // better not to have a fill for laser
  angleMode(DEGREES);
  // background(255);
}

let iterator = 0;

function draw() {
  const bigPoint = (x, y, size) => {
    strokeWeight(size);
    point(x, y);
    strokeWeight(1);
  };

  function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false;
    }

    denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false;
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return { x, y };
  }

  const margin = 10;
  const xAxis = {
    x1: margin,
    y1: height - margin,
    x2: width - margin,
    y2: height - margin,
  };
  const yAxis = {
    x1: margin,
    y1: height - margin,
    x2: margin,
    y2: margin,
  };
  const gridSize = 30;
  const vanishingPoint = { x: width / 2, y: margin };

  // generate xAxis points
  beginShape();
  for (let col = 0; col <= gridSize; col++) {
    let x = map(col, 0, gridSize, xAxis.x1, xAxis.x2);
    let y = map(col, 0, gridSize, xAxis.y1, xAxis.y2);
    vertex(x, y);
    bigPoint(x, y, 5);
  }
  endShape();

  // generate yAxis points
  beginShape();
  for (let col = 0; col <= gridSize; col++) {
    let x = map(col, 0, gridSize, yAxis.x1, yAxis.x2);
    let y = map(col, 0, gridSize, yAxis.y1, yAxis.y2);
    vertex(x, y);
    bigPoint(x, y, 5);
  }
  endShape();

  // show vanishing point
  bigPoint(vanishingPoint.x, vanishingPoint.y, 5);

  // draw lines from x-axis to vanishing point
  for (let col = 0; col <= gridSize; col++) {
    let x = map(col, 0, gridSize, xAxis.x1, xAxis.x2);
    let y = map(col, 0, gridSize, xAxis.y1, xAxis.y2);
    line(x, y, vanishingPoint.x, vanishingPoint.y);
  }

  // draw diagonal from [0,0] to some point (give "some point" a name)
  let diagonalLine = {
    x1: xAxis.x1,
    y1: xAxis.y1,
    x2: xAxis.x2,
    y2: height / 2,
  };
  line(diagonalLine.x1, diagonalLine.y1, diagonalLine.y1, diagonalLine.y2);

  // draw horizontal lines at the intersections
  for (let col = 0; col <= gridSize; col++) {
    let x = map(col, 0, gridSize, xAxis.x1, xAxis.x2);
    let y = map(col, 0, gridSize, xAxis.y1, xAxis.y2);

    let convergingLine = {
      x1: x,
      y1: y,
      x2: vanishingPoint.x,
      y2: vanishingPoint.y,
    };

    const intersection = intersect(
      convergingLine.x1,
      convergingLine.y1,
      convergingLine.x2,
      convergingLine.y2,
      diagonalLine.x1,
      diagonalLine.y1,
      diagonalLine.x2,
      diagonalLine.y2
    );

    // create horizontal line from left edge to right edge, level with intersection point
    const leftPoint = intersect(
      map(0, 0, gridSize, xAxis.x1, xAxis.x2),
      map(0, 0, gridSize, xAxis.y1, xAxis.y2),
      vanishingPoint.x,
      vanishingPoint.y,
      xAxis.x1,
      intersection.y,
      xAxis.x2,
      intersection.y
    );
    const rightPoint = intersect(
      map(gridSize, 0, gridSize, xAxis.x1, xAxis.x2),
      map(gridSize, 0, gridSize, xAxis.y1, xAxis.y2),
      vanishingPoint.x,
      vanishingPoint.y,
      xAxis.x1,
      intersection.y,
      xAxis.x2,
      intersection.y
    );
    const horizontalLine = {
      x1: leftPoint.x,
      y1: leftPoint.y,
      x2: rightPoint.x,
      y2: rightPoint.y,
    };
    line(
      horizontalLine.x1,
      horizontalLine.y1,
      horizontalLine.x2,
      horizontalLine.y2
    );
  }

  save("mySVG.svg"); // give file name
  noLoop(); // we just want to export once
}

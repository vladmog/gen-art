/*
  drawTwoCircs = fully customizable function to draw two circles that 
                 are linked by concentric points along each circle
  drawWeb      = utilizing drawTwoCircs, circles on the vertices of a polygon.
                 circles are interconnected via drawTwoCircles
               : linkCircles: helper function that pre-selects some settings
                 for easier use of drawTwoCircs
*/

const defaultStrokeWeight = 0.5;

function setup() {
	createCanvas(700, 700);
	strokeWeight(defaultStrokeWeight);
	stroke(0);
	noFill();
	angleMode(DEGREES);
	// background(255);
	frameRate(3);
}

let iterator = 90;

function draw() {
	background(255);

	const bigPoint = (coords, size) => {
		const { x, y } = coords;
		strokeWeight(size);
		point(x, y);
		strokeWeight(defaultStrokeWeight);
	};

	const distanceOf = (x1, y1, x2, y2) => {
		const distance = sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
		return distance;
	};

	const angleBetween = (x1, y1, x2, y2) => {
		const x = x2 - x1;
		const y = y2 - y1;

		const angleATan2 = atan2(y, x);

		if (angleATan2 < 0) {
			angle = 360 + angleATan2;
		} else {
			angle = angleATan2;
		}

		return angle;
	};

	const drawTwoCircs = (
		c1Coords,
		c2Coords,
		c1Rad,
		c2Rad,
		linksCt,
		c1AngleOffset,
		c2AngleOffset,
		isC1CW,
		isC2CW,
		isCirc1Vis,
		isCirc2Vis,
		visVerticesCirc1,
		visVerticesCirc2
	) => {
		// LEGEND
		/* 
    
      Draws two circles, each with equally spaced points along 
      their circumferences. 
      Points of each circle are connected to points of the other circle.
      
      By default, draws first vertex of each circle between 
      center point of both circles, and generates remainder in a 
      counter clock wise direction.
      
      c1Coords          : Obj: {x: Num, y: Num} 
                        : origin coordinates of circle 1
      c2Coords          : Obj: {x: Num, y: Num} 
                        : origin coordinates of circle 2
      c1Rad             : Num 
                        : radius of circle 1 
      c2Rad:            : Num
                        : radius of circle 2
      linksCt            : Num
                        : amount of vertices around circles' circumferences
      angleOffsetCirc1  : Num
                        : For circle 1
                        : Vertices will be offset angleOffset degrees CW
                        : Default is having a vertex pointing down
      angleOffsetCirc2  : Num
                        : For cirlce 2
                        : Vertices will be offset angleOffset degrees CW
                        : Default is having a vertex pointing down
      isC1CW            : Bool
                        : true: generates circle 1 vertices in clockwise direction
      isC2CW            : Bool
                        : true: generates circle 2 vertices in clockwise direction
      isCirc1Vis        : Bool
                        : true: circle 1 visible 
                        : false: circle 1 invisible
      isCirc2Vis        : Bool
                        : true: circle 2 visible 
                        : false: circle 2 invisible
      visVerticesCirc1  : Arr [Nums]
                        : array of numbers indicating which vertice indexes to
                          display of circ1
                        : must match amount in visVerticesCirc2
      visVerticesCirc2  : Arr [Nums]
                        : array of numbers indicating which vertice indexes to
                          display of circ2
                        : must match amount in visVerticesCirc1
                        
    */

		// CONSIDERATIONS
		/* 
      CONSIDERATIONS:
        - Flips must come before rotations.
        - Need to come up with a way to specify which vertices are visible.
        - Angle logic may be confusing because it will be written to 
          make theta++ a counter-clockwise rotation (like cartesian) on a non-    
          cartesian matrix where theta++ is clockwise by default 
          (you'll see multiplication by -1)
    */

		//     bigPoint(c1Coords, 10)
		//     bigPoint(c2Coords, 10)
		if (isCirc1Vis) ellipse(c1Coords.x, c1Coords.y, c1Rad * 2);
		if (isCirc2Vis) ellipse(c2Coords.x, c2Coords.y, c2Rad * 2);

		const defineLinksOf = (
			mainCircCoords,
			refCircCoords,
			mainCircRad,
			angleOffset,
			linksCt,
			isCW
		) => {
			const links = {};

			// Find starting angle (angle between circ1Coords and circ2Coords)
			const startingAngle =
				(angleOffset -
					angleBetween(
						mainCircCoords.x,
						mainCircCoords.y,
						refCircCoords.x,
						refCircCoords.y
					)) *
				-1;

			let angleInterval = (360 / linksCt) * -1;
			if (isCW) angleInterval *= -1;
			for (link = 0; link < linksCt; link++) {
				const angle = startingAngle + link * angleInterval;
				const x = mainCircRad * cos(angle) + mainCircCoords.x;
				const y = mainCircRad * sin(angle) + mainCircCoords.y;
				links[`${link}`] = { x, y };
			}
			return links;
		};

		// Define Circle 1 links
		const circ1Links = defineLinksOf(
			c1Coords,
			c2Coords,
			c1Rad,
			c1AngleOffset,
			linksCt,
			isC1CW
		);
		// Define Circle 2 links
		const circ2Links = defineLinksOf(
			c2Coords,
			c1Coords,
			c2Rad,
			c2AngleOffset,
			linksCt,
			isC2CW
		);

		// Connect links specified to be seen
		for (let vertex = 0; vertex < visVerticesCirc1.length; vertex++) {
			circ1Vertex = circ1Links[`${visVerticesCirc1[vertex]}`];
			circ2Vertex = circ2Links[`${visVerticesCirc2[vertex]}`];
			line(circ1Vertex.x, circ1Vertex.y, circ2Vertex.x, circ2Vertex.y);
		}

		return { circ1Links, circ2Links };
	};

	// Testing drawTwoCircs
	// /*
	const r = width / 3;
	const c1Coords = { x: width / 3, y: height / 2 };
	let c2Coords = { x: 0, y: 0 };
	c2Coords.x = r * cos(iterator) + c1Coords.x;
	c2Coords.y = r * sin(iterator) + c1Coords.y;
	const c1Rad = (width / 3) * 0.3;
	const c2Rad = c1Rad;
	const linksCt = 30;
	const c1AngleOffset = 0;
	const c2AngleOffset = 0;
	const isC1CW = true;
	const isC2CW = true;
	const isCirc1Vis = true;
	const isCirc2Vis = true;
	const visVerticesCirc1 = [];
	const visVerticesCirc2 = [];

	for (let i = 0; i < linksCt; i++) {
		visVerticesCirc1.push(i);
		visVerticesCirc2.push(i);
	}

	const drawWeb = (
		polygonOrigin,
		polygonPts,
		polygonAngleOffset,
		linksCt,
		polygonR,
		circSize,
		isCircVis,
		isPolygonVis
	) => {
		/*
    
    Draws circles at regular polygon's corners that are connected by links.
    Polygon has vertex pointing up by default. 
    Generates starting at top vertex.
    By default, generates vertexes in CCW direction starting at top most vertex.
    
    
    polygonOrigin      : Obj {x: Num, y: Num}
                       : center point of polygon
    polygonPts         : Num
                       : How many corners/circles to draw
    polygonAngleOffset : Num
                       : Angle offset in CCW direction 
    linksCt            : Num
                       : amount of links between each circle
    polygonR           : Num
                       : distance from polygon center to vertices
    circSize           : Num normalized to 1
                       : ratio of circle radius 
                         : 1 is circles tangent to one another
                         : 0.5 is half the radius of 1
                         : 2 is double the radius of 1
                         : 1.1 is 10% larger than 1
    isCircVis          : Bool
                       : true: makes circles visible
    isPolygonVis       : Bool
                       : true: makes polygon outline visible               
    */

		/*
      Circles relative to other circles are better defined in terms
      of n, rather than angles away from one another.
    */

		// Link two circles helper function
		const linkCircles = (c1, c2, r, linksCt) => {
			/*
        c1      : Obj {x, y, angle}
                : x: Num: x-coord of origin of circle 1
                : y: Num: y-coord of origin of circle 1
                : angle: Num: theta of circle origin from polygonOrigin
                : angleCorrection: Num: rotation applied to vertices within 
                                        circle 1
        c2      : Obj {x, y, angle}
                : x: Num: x-coord of origin of circle 2
                : y: Num: y-coord of origin of circle 2
                : angle: Num: theta of circle origin from polygonOrigin
                : angleCorrection: Num: rotation applied to vertices within 
                                        circle 2
        r       : Num
                : radius of circles
        linksCt : Num
                : Amount of links to be generated between circles
      */

			const c1Coords = { x: c1.x, y: c1.y };
			let c2Coords = { x: c2.x, y: c2.y };
			let c1Rad = r;
			let c2Rad = r;

			/* 
      By default, circles first vertices will be pointing at each other.
      When there are an odd amount of circles, this means the first
      vertex will not be pointing at the center of the polygon.
      It is, at the time of this writing that I would prefer that the
      first vertex of each circle be pointing at the center of the polygon.
      As such, the following block derives an angle offset for each circle
      in order to achieve this.
      */
			let c1AngleOffset =
				angleBetween(c1Coords.x, c1Coords.y, c2Coords.x, c2Coords.y) -
				angleBetween(
					c1Coords.x,
					c1Coords.y,
					polygonOrigin.x,
					polygonOrigin.y
				);
			let c2AngleOffset =
				angleBetween(c2Coords.x, c2Coords.y, c1Coords.x, c1Coords.y) -
				angleBetween(
					c2Coords.x,
					c2Coords.y,
					polygonOrigin.x,
					polygonOrigin.y
				);

			// fun with angle modulation begins

			//       c1AngleOffset += map(sin(c1.angle * 137.5/300), -1, 1, -180, 180)
			//       c2AngleOffset += map(sin(c2.angle * 137.5/300), -1, 1, -180, 180)

			//       c1AngleOffset += iterator
			//       c2AngleOffset -= iterator

			// fun with angle modulation ends

			// fun with radius modulation begins

			// c1Rad *= map(sin(c1.angle * 137.5/1000), -1, 1, 1, 2)
			// c2Rad *= map(sin(c2.angle * 137.5/1000), -1, 1, 1, 2)

			// fun with radius modulation ends

			const isC1CW = false;
			const isC2CW = false;
			const isCirc1Vis = isCircVis;
			const isCirc2Vis = isCircVis;
			const visVerticesCirc1 = [];
			const visVerticesCirc2 = [];

			for (let i = 0; i < linksCt; i++) {
				visVerticesCirc1.push(i);
				visVerticesCirc2.push(i);
			}

			drawTwoCircs(
				c1Coords,
				c2Coords,
				c1Rad,
				c2Rad,
				linksCt,
				c1AngleOffset,
				c2AngleOffset,
				isC1CW,
				isC2CW,
				isCirc1Vis,
				isCirc2Vis,
				visVerticesCirc1,
				visVerticesCirc2
			);
		};

		// Define polygon points
		const angleInterval = 360 / polygonPts;

		const vertices = {};
		beginShape();
		for (let v = 0; v < polygonPts; v++) {
			const angleDelta = angleInterval * v;
			const angle = -90 - angleDelta - polygonAngleOffset;
			let x = polygonR * cos(angle) + polygonOrigin.x;
			let y = polygonR * sin(angle) + polygonOrigin.y;
			vertices[`${v}`] = { x, y, angle };

			// Draw polygon points if specified to
			if (isPolygonVis) {
				vertex(x, y);
				if (v + 1 === polygonPts) {
					let firstVertex = vertices["0"];
					vertex(firstVertex.x, firstVertex.y);
				}
			}
		}
		endShape();

		// Define circle nominal radius
		const r =
			distanceOf(
				vertices[0].x,
				vertices[0].y,
				vertices[1].x,
				vertices[1].y
			) / 2;

		let isEven = Boolean(!(polygonPts % 2));

		if (isEven) {
			/*
        If polygon has even # of pts, each circle connects with one other
        circle 180 degrees away from itself 
        AKA +polygonPts/2 away
        
        You will need to iterate through 
        polygonPts/2 contiguous circles 
        in order to complete the polygon
      */
			console.log("it's even");
			for (let i = 0; i < polygonPts / 2; i++) {
				const refVertex = vertices[i];

				// Define connecting circle
				const conCirc = {}; //{x,y}
				conCirc.angle = refVertex.angle + 180;
				conCirc.x = polygonR * cos(conCirc.angle) + polygonOrigin.x;
				conCirc.y = polygonR * sin(conCirc.angle) + polygonOrigin.y;

				// Test link
				/*
        let x1 = refVertex.x;
        let y1 = refVertex.y;
        let x2 = conCirc.x
        let y2 = conCirc.y
        
        line(x1,y1,x2,y2)
        */

				// link refVertex and conCirc

				linkCircles(refVertex, conCirc, r, linksCt);
			}
		} else {
			/*
        If polygon has odd # of pts, each circle connects
        with two other circles.
           : +(360/n) * ((n+1)/2) degrees away from itself
           : -(360/n) * ((n+1)/2) degrees away from itself
        AKA
           : refCircI + ((n+1)/2)
           : refCircI - ((n+1)/2)
           
        You will need to iterate through
        [(n-1)/2] + 1 contiguous circles
        in order to complete the polygon
      */
			for (let i = 0; i < (polygonPts + 1) / 2; i++) {
				const refVertex = vertices[i];
				const angleInterval = 360 / polygonPts;

				// Define the first of two connecting circles
				const conCirc1 = {}; //{x,y}
				const conCirc1AngleOffset =
					angleInterval * ((polygonPts + 1) / 2);
				conCirc1.angle = refVertex.angle + conCirc1AngleOffset;

				// Define the second of two connecting circles
				const conCirc2 = {}; //{x,y}
				const conCirc2AngleOffset =
					-angleInterval * ((polygonPts + 1) / 2);
				conCirc2.angle = refVertex.angle + conCirc2AngleOffset;

				conCirc1.x = polygonR * cos(conCirc1.angle) + polygonOrigin.x;
				conCirc1.y = polygonR * sin(conCirc1.angle) + polygonOrigin.y;
				conCirc2.x = polygonR * cos(conCirc2.angle) + polygonOrigin.x;
				conCirc2.y = polygonR * sin(conCirc2.angle) + polygonOrigin.y;

				conCirc1.angleCorrection = 0;

				conCirc2.angleCorrection = 0;

				// Test link
				/*
        let x1 = refVertex.x;
        let y1 = refVertex.y;
        let x2 = conCirc1.x
        let y2 = conCirc1.y
        let x3 = conCirc2.x
        let y3 = conCirc2.y
        
        line(x1,y1,x2,y2)
        if (i+1 !== (polygonPts + 1)/2) line(x1,y1,x3,y3)
        */

				// Link refVertex with
				// conCirc1 and if (i+1 !== (polygonPts + 1)/2), conCirc2
				linkCircles(refVertex, conCirc1, r, linksCt);
				if (i + 1 !== (polygonPts + 1) / 2) {
					linkCircles(refVertex, conCirc2, r, linksCt);
				}
			}
		}
	};

	const polygonOrigin = { x: width / 2, y: height / 2 };
	const polygonPts = 300;
	const polygonAngleOffset = 0;
	const linksCtx = 2;
	const polygonR = width * 0.48;
	const circSize = 1;
	const isCircVis = true;
	const isPolygonVis = true;

	// drawWeb(
	//   polygonOrigin,
	//   polygonPts,
	//   polygonAngleOffset,
	//   linksCtx,
	//   polygonR,
	//   circSize,
	//   isCircVis,
	//   isPolygonVis
	// )

	let gridSize = 3;
	let rows = gridSize;
	let columns = gridSize;
	let rowHeight = height / rows;
	let columnWidth = width / columns;
	let polyIterator = 1;

	for (let row = 0; row < rows; row++) {
		const y = map(row, 0, rows, 0, height) + rowHeight / 2;
		for (let column = 0; column < columns; column++) {
			const x = map(column, 0, columns, 0, width) + columnWidth / 2;

			const polygonOrigin = { x, y };
			const polygonPts = polyIterator + 1;
			const polygonAngleOffset = 0;
			const linksCtx = polyIterator * 10;
			const polygonR = (columnWidth / 2) * 0.5;
			const circSize = 1;
			const isCircVis = false;
			const isPolygonVis = false;
			drawWeb(
				polygonOrigin,
				polygonPts,
				polygonAngleOffset,
				map(sin(iterator), -1, 1, 100, 1),
				polygonR,
				circSize,
				isCircVis,
				isPolygonVis
			);
			polyIterator += 1;
		}
	}

	iterator += 10;

	// noLoop();
}

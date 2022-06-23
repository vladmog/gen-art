Trying to break fonts down into their fundamental points.


sketch1.js
p5's textToPoints works but there is not separation in the data between line breaks.

sketch2.js
opentype.js solves the seperation in data between line breaks issue, but introduces bezier curves which I don't understand.


Between learning the mathematics behind bezier curves in sketch2.js, and defining new logic to identify line breaks in a list of vertices in sketch1.js, the latter seems it would require less effort. Will proceed this way.

and then will use the text bounds functionality to use as a test outline for use in Hershey text conversions in InkScape
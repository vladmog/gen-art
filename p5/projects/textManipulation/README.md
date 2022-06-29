Current work in progress...

Trying to break fonts down into their fundamental points.

sketch1.js
p5's textToPoints works but there is no separation in the data between line breaks.

sketch2.js
opentype.js solves the seperation in data between line breaks issue, but introduces bezier curves which I don't understand.


Between learning the mathematics behind bezier curves in sketch2.js, and defining new logic to identify line breaks in a list of vertices in sketch1.js, the latter seems would to require less effort of me. Will proceed this way.

...

This was successful and rather easy. Achieved by inserting a break between vertices that are greater than a certain threshold apart. Now the goal will be to allow for input that allows user to choose which vectors to combine into letters, or words.
I feel like outlined letters would have consistent line counts per letter across fonts. There may be outliers. For those allow for user override. Past that, create a dictionary that details vector counts per letter for (hopefully) quick processing of input strings.

PS
Found a nice single-line font otf at https://github.com/isdat-type/Relief-SingleLine
Will use this if Hershey text testing proves unsuccessful.

Having now learned that util js files still have access to p5 functions so long as the util file is invoked after p5 but before sketch in index.js, the next goal is to abstract pointsToText to a function. Also (unrelated), would like to combine all util files into a single file with different objects. 

and then will use the text bounds functionality to use as a test outline for use in Hershey text conversions in InkScape



I don't think text size is scaling to canvas
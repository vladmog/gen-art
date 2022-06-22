# dimensional conversions

This tool serves as a translator between p5js px values, and real-life inch/mm values used for plotting.

## To setup

Set inchDimensions and pxDimensions in each sketch to match the pxDimensions of the sketch canvas and the inchDimesions of the desired plot size.

## To use

Use helper functions to translate inch values into equivalent px values for use in sketch.

If sketch pxDimensions are setup so that the canvas takes up as much space on the display screen as a plot would take on a sheet of paper, strokeWidths and shape sizes on screen will be identical as how they will be displayed on paper.

This tool can be used in conjunction with lineWidth to derive strokeWidths that match equivalent line widths of writing utensils

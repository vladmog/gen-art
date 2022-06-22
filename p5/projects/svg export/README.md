https://htmlpreview.github.io/?https://github.com/vladmog/gen-art/blob/master/p5/projects/svg%20export/index.html

To use svg export offline, uncomment line 17 in index.html to use cached svg export code.

To convert a p5 drawing to an SVG exportable drawing:

-   Add either of the following lines to your index.html head
    <script src="https://unpkg.com/p5.js-svg@1.3.1"></script>    <- For latest opensource version
    <script src="../../p5/svgExport/p5.js-svg@1.3.1.js"></script>   <- Cached copy of above
-   Add SVG as third argument of createCanvas
    createCanvas(500, 500, SVG);
-   Ensure
    -   noFill() is set
    -   no background is created unless you want a border
    -   a stroke and a strokeWeight are set
-   Create the SVG and prevent re-looping
    -   save("mySVG.svg");
    -   noLoop();

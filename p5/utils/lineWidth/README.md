Line width is a function of

1. utensil drawing the line
2. the paper being drawn on
3. travel speed of the line

lineWidth is both a tool that returns a line width based on these three values, as well as a record of line widths across various utensil/paper/speed combinations.

## Planning

The tool will be able to handle input as simple as the utensil type only, and as complex as the utensil type, paper type, and travel speed.

#### Input

utensil - Str - name of writing utensil  
paper - Str - name of paper  
speed - Num - Axidraw drawing speed [1,100]

#### Output

lineWidth - Num - width of line in inches

#### Structure

```
    utensils = {
        utensil: {
            defaultWidth: Num,
            papers: {
                paper: {
                    Speeds: {
                        Speed: Num
                    }
                }
            }
        }
    }
```

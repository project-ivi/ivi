import { VAR_WIDTH, VAR_HEIGHT, FONT_SIZE } from './variable';

const STROKE_WEIGHT = 2;
const EDGE_RADIUS = 10;
const PADDING = 12;

class Scope {

    constructor(canvas, sketch) {
        
        this.canvas = canvas;
        this.sketch = sketch;
        this.child = null;
        this.variables = []

        this.setBounds = this.setBounds.bind(this);
    }

    setBounds(bounds) {
        this.x = bounds.x;
        this.y = bounds.y;
        this.width = bounds.width;
        this.height = bounds.height;
    }

    draw() {
        const p = this.canvas;
        p.push();

        p.stroke('#000000');
        p.strokeWeight(STROKE_WEIGHT);
        p.noFill(); // for now

        p.rect(
            this.x, 
            this.y, 
            this.width, 
            this.height,
            EDGE_RADIUS
        );

        let row = 0;
        let column = 0;

        // total number of variables we can fit in a row
        const paddedHeight = this.height - PADDING * 2
        const numVars = Math.floor(paddedHeight / (VAR_HEIGHT + FONT_SIZE + PADDING - 1))
        const varsHeight = (numVars * (VAR_HEIGHT + FONT_SIZE + PADDING)) - PADDING
        const extra = (paddedHeight - varsHeight) / numVars
        
        this.variables.forEach(elem => {

            if (row === numVars) {
                row = 0;
                column += 1;
            }

            let x = this.x + PADDING + column * (VAR_WIDTH + PADDING)
            let y = this.y + FONT_SIZE + PADDING + row * (VAR_HEIGHT + FONT_SIZE + PADDING + extra)

            elem.x = x
            elem.y = y;

            elem.draw()

            row += 1
        });

        // should probably enforce that this is also a scope...
        if (this.child) {
            let bounds = {}
            const xOffset = ((column + 1) * (VAR_WIDTH + PADDING)) - PADDING + PADDING * 2
            bounds.x = this.x + xOffset
            bounds.y = this.y + PADDING
            bounds.width = this.width - xOffset - PADDING
            bounds.height = this.height - PADDING * 2

            this.child.setBounds(bounds);
            this.child.draw();
        }

        p.pop()
    }
}

export default Scope;
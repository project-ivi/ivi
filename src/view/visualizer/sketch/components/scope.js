import { VAR_WIDTH, VAR_HEIGHT, FONT_SIZE } from './variable';

const STROKE_WEIGHT = 2;
const EDGE_RADIUS = 10;
const PADDING = 12;
const BACKGROUND_COLORS = [
    '#89C4F4',
    '#BE90D4',
    '#86E2D5'
]

class Scope {

    constructor(canvas) {
        
        this.canvas = canvas;
        this.child = null;
        this.depth = null;
        this.variables = [];

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

        p.stroke('#000000');
        p.strokeWeight(STROKE_WEIGHT);
        p.fill(BACKGROUND_COLORS[this.depth % BACKGROUND_COLORS.length]);

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

            elem.draw();

            row += 1
        });

        // should probably enforce that this is also a scope...
        if (this.child) {
            let bounds = {}
            const xOffset = ((column + 1) * (VAR_WIDTH + PADDING)) - PADDING + PADDING * 2

            if (this.variables.length === 0) {
                bounds.x = this.x + PADDING
                bounds.width = this.width - PADDING * 2
            } else {
                bounds.x = this.x + xOffset
                bounds.width = this.width - xOffset - PADDING
            }
            
            bounds.y = this.y + PADDING
            bounds.height = this.height - PADDING * 2

            this.child.setBounds(bounds);
            this.child.depth = this.depth + 1
            this.child.draw();
        }
    }
    // Go through all varables, redraw the desired one with larger one
    // with modified settings
    mouseHover(x,y) {
        this.variables.forEach(elem =>{
            if ((x > elem.x && x < elem.x + VAR_WIDTH)
                && (y > elem.y && y < elem.y + VAR_HEIGHT)) {
                elem.name = ''
                elem.width = 150;
                elem.font = 15
                elem.draw();
                }
        })
    }
    
    
}

export default Scope;
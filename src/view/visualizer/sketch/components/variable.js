const STROKE_WEIGHT = 2;
const EDGE_RADIUS = 5;

export const VAR_WIDTH = 50;
export const VAR_HEIGHT = 40;
export const FONT_SIZE = 12;

export class Variable {

    constructor(canvas) {
        this.canvas = canvas;
        this.value = null
    }

    draw() {
        const p = this.canvas;
        p.push();

        p.noStroke()
        p.fill('#000000')
        p.textStyle(p.NORMAL)
        p.textSize(12)
        p.textAlign(p.LEFT)
        p.text(
            "variable", 
            this.x, 
            this.y - FONT_SIZE - 4, 
            this.x + this.width, 
            this.y
        );

        p.stroke('#000000');
        p.strokeWeight(STROKE_WEIGHT);
        p.noFill();
        p.rect(
            this.x,
            this.y,
            VAR_WIDTH,
            VAR_HEIGHT,
            EDGE_RADIUS
        )

        p.pop()
    }

}
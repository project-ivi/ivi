const STROKE_WEIGHT = 3;
const EDGE_RADIUS = 5;

const VAR_SMALL = 0;
const VAR_LARGE = 1;

class Variable {

    constructor(canvas) {

        this.canvas = canvas;
        this.value = null

        // temporary
        this.x = 10
        this.y = 10
        this.size = VAR_LARGE;
        this.width = null;

        this.setLocation = this.setLocation.bind(this);
    }

    setLocation(point) {
        this.x = point.x;
        this.y = point.y;
    }

    draw() {
        const p = this.canvas;
        p.push();

        p.stroke('#000000');
        p.strokeWeight(1);
        p.noFill();

        let edge;
        switch (this.size) {
            case VAR_SMALL:
                edge = 30;
                break;
            case VAR_LARGE:
                edge = 50;
                break;
            default:
                edge = 30;
                break;
             
        }
        this.width = edge;
        p.rect(
            this.x,
            this.y,
            edge,
            30,
            EDGE_RADIUS
        )

        p.pop()
    }

}

export default Variable;
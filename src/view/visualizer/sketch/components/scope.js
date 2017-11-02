const STROKE_WEIGHT = 3;
const EDGE_RADIUS = 10; 

class Scope {

    constructor(canvas) {
        
        this.canvas = canvas;
        this.child = null;
        this.variables = []

        // temporary
        this.x = 10
        this.y = 10
        this.width = 400
        this.height = 400

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
        p.strokeWeight(2);
        p.noFill(); // for now

        p.rect(
            this.x, 
            this.y, 
            this.width, 
            this.height,
            EDGE_RADIUS
        );

        // should probably enforce that this is also a scope...
        if (this.child) {
            let bounds = {}
            bounds.x = this.x + 20
            bounds.y = this.y + 20
            bounds.width = this.width - 40
            bounds.height = this.height - 40

            this.child.setBounds(bounds);
            this.child.draw();
        }

        p.pop()
    }
}

export default Scope;
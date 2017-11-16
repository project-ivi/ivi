/* The conditional doesn't need to be a different kind of scope, it can simply
contain scopes */

import { STROKE_WEIGHT, EDGE_RADIUS } from './scope';

// TODO: Conditional and Scope probably need to inherit from the same interface or something
class Conditional {
    constructor(canvas) {
        this.canvas = canvas;
        this.possibilties = [0, 0]  // just dummy values for now

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
        p.fill('#ffffff')

        p.rect(
            this.x,
            this.y,
            this.width,
            this.height,
            EDGE_RADIUS
        );

        // draw dividing lines
        const numPoss = this.possibilties.length;
        const interval = this.height / numPoss;
        let curLongitude = interval + this.y;
        for (let i = 0; i < numPoss - 1; i++) {
            p.line(
                this.x + 7, 
                curLongitude,
                this.x + this.width - 7,
                curLongitude
            );
        }
    }
}

export default Conditional;
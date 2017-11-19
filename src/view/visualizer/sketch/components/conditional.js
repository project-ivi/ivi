/* The conditional doesn't need to be a different kind of scope, it can simply
contain scopes */

import { STROKE_WEIGHT, EDGE_RADIUS } from './scope';
import Bezier from 'bezier-js';

// TODO: Conditional and Scope probably need to inherit from the same interface or something
class Conditional {
    constructor(canvas) {
        this.canvas = canvas;
        this.possibilties = ["a < 3", "!(a < 3)"]  // just dummy values for now
        this.chosen = 1// index of the possibility that gets executed
        
        this.isAnimating = true  // currently executing the scope swiping animation
        this.curFrame = 0

        // create animation keyframes
        this.numFrames = 50
        const curve = new Bezier(3,0 , 0,0 , 3,1 , 0,1)
        
        console.log("Computing animation path...")

        // this computes points that are equidistant on the curve based on arc length
        const curveLength = curve.length()
        const lengthStep = curveLength / this.numFrames
        let oldTime = tstep
        let minDistance = curveLength  // MAX_LENGTH, basically
        const tstep = 1/1000
        const steps = []
        for (let t = tstep * 2; t <= 1; t += tstep) {
            const subCurve = curve.split(oldTime, t)
            const subLength = subCurve.length()

            const delta = lengthStep - subLength
            if (Math.abs(delta) < minDistance) {
                minDistance = delta  // still approaching
            } else { // once distance starts growing again, we've overshot the point. this is it.
                oldTime = t
                minDistance = curveLength 
                steps.push(t - tstep) // found our point, on to the next one
            }
        }

        console.log("Complete!")

        this.points = []
        steps.forEach(elem => {
            this.points.push(curve.get(elem))
        })

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
        const TEXT_SIZE = 15
        const PADDING = 8;

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

        const text = (msg, x, y) => {
            p.push()
            p.noStroke();
            p.fill('#000000');
            p.textStyle(p.NORMAL);
            p.textSize(TEXT_SIZE);
            p.textFont('Courier');
            p.textAlign(p.LEFT);
            const textWidth = p.textWidth(msg);
            p.text(msg, x - textWidth / 2, y, x + textWidth / 2, y + TEXT_SIZE);
            p.pop()
        }

        const numPoss = this.possibilties.length;
        let longitude = this.height / 2 + this.y;
        let y0 = this.y + PADDING
        let y1 = longitude + PADDING

        text(this.possibilties[0], this.x + this.width / 2, y0)
        text(this.possibilties[1], this.x + this.width / 2, y1)

        const step = this.points[this.curFrame].y * (longitude - this.y)
        if (this.isAnimating) {
            if (this.chosen === 0) {
                longitude += step

                p.fill('#ffffff')
                p.noStroke()
                p.rect(this.x + PADDING, y0, this.width - PADDING * 2, longitude - this.y - PADDING)
                text(this.possibilties[0], this.x + this.width / 2, y0)
            } else if (this.chosen === this.possibilties.length - 1) {
                longitude -= step
                y1 -= step

                p.fill('#ffffff')
                p.noStroke()
                p.rect(this.x + PADDING, y1, this.width - PADDING * 2, this.height / 2 - PADDING * 2 + step)
                text(this.possibilties[1], this.x + this.width / 2, y1)
            }
        }

        p.stroke('#000000')
        p.line(
            this.x + 7, 
            longitude,
            this.x + this.width - 7,
            longitude
        );

        // reset based on points.length, bc it might not have found every point in the computation
        this.curFrame += 1;
        if (this.curFrame > this.points.length - 1) {
            this.curFrame = 0
        }

        // // draw the animation curve, for reference
        // this.points.forEach(elem => {
        //     p.point(elem.x * 100 + 200, elem.y * 100 + 200)
        // })
    }
}

export default Conditional;
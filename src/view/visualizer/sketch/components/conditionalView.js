/* The conditional doesn't need to be a different kind of scope, it can simply
contain scopes */

import { resetConditional } from '../sketch';
import { STROKE_WEIGHT, EDGE_RADIUS } from './scope';
import Bezier from 'bezier-js';

// TODO: Conditional and Scope probably need to inherit from the same interface or something
class ConditionalView {
  constructor(canvas, conditional) {
    this.canvas = canvas;
    this.possibilities = conditional.possibilities;
    this.chosen = conditional.chosen; // index of the possibility that gets executed
    this.isAnimating = false;  // currently executing the scope swiping animation
    this.curFrame = 0;

    // create animation keyframes
    this.numFrames = 100;
    const curve = new Bezier(3, 0, 0, 0, 3, 1, 0, 1);

    // this computes points that are equidistant on the curve based on arc length
    const curveLength = curve.length();
    const lengthStep = curveLength / this.numFrames;
    let oldTime = tstep;
    let minDistance = curveLength;  // MAX_LENGTH, basically
    const tstep = 1 / 1000;
    const steps = [];
    for (let t = tstep * 2; t <= 1; t += tstep) {
      const subCurve = curve.split(oldTime, t);
      const subLength = subCurve.length();

      const delta = lengthStep - subLength;
      if (Math.abs(delta) < minDistance) {
        minDistance = delta;  // still approaching
      } else { // once distance starts growing again, we've overshot the point. this is it.
        oldTime = t;
        minDistance = curveLength;
        steps.push(t - tstep); // found our point, on to the next one
      }
    }

    this.points = [];
    steps.forEach(elem => {
      this.points.push(curve.get(elem));
    });

    this.setBounds = this.setBounds.bind(this);
    this.startAnimation = this.startAnimation.bind(this);
  }

  startAnimation() {
    this.curFrame = 0;
    this.isAnimating = true;
  }

  setBounds(bounds) {
    this.x = bounds.x;
    this.y = bounds.y;
    this.width = bounds.width;
    this.height = bounds.height;
  }

  draw() {
    const p = this.canvas;
    const TEXT_SIZE = 15;
    const PADDING = 8;
    const LINE_OFFSET = 10;

    p.stroke('#000000');
    p.strokeWeight(STROKE_WEIGHT);
    p.fill('#ffffff');

    p.rect(
      this.x,
      this.y,
      this.width,
      this.height,
      EDGE_RADIUS
    );

    const text = (msg, x, y) => {
      p.push();
      p.noStroke();
      p.fill('#000000');
      p.textStyle(p.NORMAL);
      p.textSize(TEXT_SIZE);
      p.textFont('Courier');
      p.textAlign(p.LEFT);
      const textWidth = p.textWidth(msg);
      p.text(msg, x - textWidth / 2, y, x + textWidth / 2, y + TEXT_SIZE);
      p.pop();
    };

    const numPoss = this.possibilities.length;
    const interval = this.height / numPoss;
    let longitude = interval + this.y;

    // draw conditional labels
    let pos = [longitude - interval + PADDING];
    for (let x = 0; x < this.possibilities.length; x++) {
      text(this.possibilities[x], this.x + this.width / 2, pos[x]);
      pos[x + 1] = pos[x] + interval;
    }

    let fixedLongitude = longitude;
    for (let x = 0; x < this.possibilities.length - 1 ; x++) {
      p.stroke('#000000');
      p.line(
        this.x + LINE_OFFSET,
        fixedLongitude,
        this.x + this.width - LINE_OFFSET,
        fixedLongitude
      );
      fixedLongitude += interval;
    }

    let step = this.points[this.curFrame].y * (this.height - (longitude - this.y));
    if (this.isAnimating) {
      if (this.chosen === 0) {
        longitude += step;

        p.fill('#ffffff');
        p.noStroke();
        p.rect(this.x + PADDING, pos[0], this.width - PADDING * 2, longitude - this.y - PADDING);

        p.stroke('#000000');
        p.line(
          this.x + LINE_OFFSET,
          longitude,
          this.x + this.width - LINE_OFFSET,
          longitude
        );

        text(this.possibilities[0], this.x + this.width / 2, pos[0]);
      } else if (this.chosen === this.possibilities.length - 1) {
        // longitude -= step
        const yPos = pos[this.possibilities.length - 1] - step - PADDING;

        p.fill('#ffffff');
        p.noStroke();
        p.rect(this.x + PADDING, yPos, this.width - PADDING * 2, interval - PADDING * 2 + step);

        p.stroke('#000000');
        p.line(
          this.x + LINE_OFFSET,
          yPos,
          this.x + this.width - LINE_OFFSET,
          yPos
        );

        text(this.possibilities[this.possibilities.length - 1], this.x + this.width / 2, yPos + PADDING);
      } else {
        const upStep = this.points[this.curFrame].y * (this.height - (interval * (numPoss - this.chosen)));
        const upPos = pos[this.chosen] - upStep - PADDING;

        const downStep = this.points[this.curFrame].y * (interval * (numPoss - this.chosen - 1));
        const downPos = pos[this.chosen] + interval + downStep - PADDING;

        p.fill('#ffffff');
        p.noStroke();
        p.rect(this.x + LINE_OFFSET - 1, upPos, this.width - (LINE_OFFSET) * 2 + 3, interval + upStep + downStep);

        p.stroke('#000000');
        p.line(this.x + 7, upPos, this.x + this.width - LINE_OFFSET, upPos); // upward line
        p.line(this.x + 7, downPos, this.x + this.width - LINE_OFFSET, downPos); // upward line


        text(this.possibilities[this.chosen], this.x + this.width / 2, upPos + PADDING);
      }
    }

    // reset based on points.length, bc it might not have found every point in the computation
    this.curFrame += 1;
    if (this.curFrame > this.points.length - 1) {
      this.isAnimating = false;
      resetConditional();
    }

    // // draw the animation curve, for reference
    // this.points.forEach(elem => {
    //     p.point(elem.x * 100 + 200, elem.y * 100 + 200)
    // })
  }
}

export default ConditionalView;

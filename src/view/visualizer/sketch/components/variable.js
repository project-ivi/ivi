const STROKE_WEIGHT = 2;
const EDGE_RADIUS = 5;

export const VAR_WIDTH = 60;
export const VAR_HEIGHT = 35;
export const FONT_SIZE = 12;

export class Variable {

  constructor(canvas) {
    this.canvas = canvas;
    this.name = '';
    this.value = null;
    this.color = '';
    this.width = VAR_WIDTH;
    this.height = VAR_HEIGHT;
    this.size = 14;
    this.hovering = false;
  }

  draw() {
    const p = this.canvas;
    p.push();

    console.log(this.name)

    // conditional formatting based on length and hover
    let printValue = this.value;
    if (!this.hovering) {
      if (this.value.length > 6) {
        let temp = '';

        for (let i = 0; i < 3; i++) {
          temp += this.value[i];
        }

        temp += '...';
        printValue = temp;
      }

    } else {

      // Each variable extends a custom amount depending on string length
      if (this.value.length > 6) {
        this.width = VAR_WIDTH + (this.value.length - 6) * 8.5;
      } else {
        this.width = VAR_WIDTH;
      }
    }

    // Variable name
    p.noStroke();
    p.fill('#000000');
    p.textStyle(p.NORMAL);
    p.textSize(12);
    p.textFont('Courier');
    p.textAlign(p.LEFT);
    p.text(
      this.name,
      this.x,
      this.y - FONT_SIZE - 4,
      this.x + this.width,
      this.y
    );

    // Variable box
    p.stroke('#000000');
    p.strokeWeight(STROKE_WEIGHT);
    p.fill('orange');
    p.rect(
      this.x,
      this.y,
      this.width,
      this.height,
      EDGE_RADIUS
    );

    // Variable value
    p.fill('white');
    p.textSize(this.size);
    p.noStroke();
    p.textStyle(p.BOLD);

    p.text(
      printValue,
      this.x + 5,
      this.y + FONT_SIZE - 1,
      this.x + this.width,
      this.y
    );

    p.pop();
  }
}

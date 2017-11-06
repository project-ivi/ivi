const STROKE_WEIGHT = 2;
const EDGE_RADIUS = 5;

export const VAR_WIDTH = 60;
export const VAR_HEIGHT = 35;
export const FONT_SIZE = 12;

export class Variable {

    constructor(canvas) {
        this.canvas = canvas;
        this.name = "Variable";
        this.value = "Long string";
        this.color = "";
        this.width = VAR_WIDTH;
        this.height = VAR_HEIGHT
        this.size = 14;
        this.first = true
    }

    draw() {
        const p = this.canvas;
        p.push();
        // Variable name
        p.noStroke()
        p.fill('#000000')
        p.textStyle(p.NORMAL)
        p.textSize(12)
        p.textFont("Courier")
        p.textAlign(p.LEFT)
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
        p.fill(this.color);
        p.rect(
            this.x,
            this.y,
            this.width,
            this.height,
            EDGE_RADIUS
        );
        // Variable value
        p.fill('black')
        p.textSize(this.size)
        p.noStroke()
        p.textStyle(p.BOLD)
        if (this.first === true && this.value.length > 4) {
            this.first = false
            let temp = ""
            for(let i = 0; i < 3; i++) {
                temp += this.value[i]
            }
            temp += "..."
            p.text(
            temp,
            this.x + 5,
            this.y + FONT_SIZE - 1,
            this.x + this.width,
            this.y
        );
        }
        else{
            p.text(
                this.value,
                this.x + 5,
                this.y + FONT_SIZE - 1,
                this.x + this.width,
                this.y
            );
        }

        p.pop()
    }
}
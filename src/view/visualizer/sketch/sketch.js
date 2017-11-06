import Scope from './components/scope';
import { Variable } from './components/variable';

import { VAR_WIDTH, VAR_HEIGHT } from './components/variable';

const VARIABLES = [];

export default p => {

  p.setup = () => {
    p.createCanvas(0, 0);
    p.background('white');
    p.noStroke();
    resizeCanvasToVisualizer();
  };

  function resizeCanvasToVisualizer() {
    const elem = document.getElementById('visualizer');
    p.resizeCanvas(elem.offsetWidth, elem.offsetHeight);
  }

  p.draw = () => {
    p.background('white');

    if (VARIABLES.length > 0) {

      for (let i = 0; i < 15; i++) {
        s.variables.push(VARIABLES[i]);
      }

      s.draw();

      VARIABLES.forEach(elem => {

        let w;
        if (p.mouseX > elem.x && p.mouseX < elem.x + VAR_WIDTH && p.mouseY > elem.y && p.mouseY < elem.y + VAR_HEIGHT) {
          // Each variable extends a custom amount depending on string length
          if (elem.value.length < 4) {
            w = VAR_WIDTH;
          } else {
            w = VAR_WIDTH + (elem.value.length - 6) * 8.5;
          }

          elem.font = 15;
          elem.width = w;
          elem.hovering = true;

          elem.draw();

        } else {
          elem.width = VAR_WIDTH;
          elem.hovering = false;
        }
      });
    }
  };

  p.windowResized = () => {
    resizeCanvasToVisualizer();
    // overflow = false
    p.background('white');
  };


};
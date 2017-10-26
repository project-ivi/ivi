const state = {};

export function getSketchState() {
  return state;
}

export function putInterpreterStep(step) {
  const actions = step.dataArray;
  for (const action of actions) {
    if (action.value === 'null') {
      delete state[action.name];
    } else {
      state[action.name] = action.value;
    }
  }
}

export function clearSketchState() {
  Object.keys(state).forEach(val => {
    delete state[val];
  });
}

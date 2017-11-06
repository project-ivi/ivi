export let state = {};
export let log = [];

export function resetState() {
  log = [];

  for (const key in state) {
    if (state.hasOwnProperty(key)){
      delete state[key];
    }
  }
}

const state = {}

export function getSketchState() {
    return state
}

export function putInterpreterStep(step) {
    if (step.value === 'null') {
        delete state[step.name]
    } else {
        state[step.name] = step.value
    }
}

export function clearSketchState() {
    Object.keys(state).forEach(val => {
        delete state[val]
    })
}

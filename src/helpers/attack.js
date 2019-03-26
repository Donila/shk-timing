const defaultArmy = () => ({
  speed: 1,
  delay: 0,
  name: 'basic army',
  time: 0
})

const defaultAttack = () => {
  let army = { ...defaultArmy() }
  return {
    armies: [army],
    time: '0000',
    name: ''
  }
}

const emptyAttack = () => {
  return {
    armies: [],
    time: '0000',
    name: ''
  }
}

const convertTimeInput = (input) => {
  let hours = Math.floor(input / 100)
  let minutes = input - hours * 100

  return { hours, minutes }
}

export {
  defaultArmy,
  defaultAttack,
  emptyAttack,
  convertTimeInput
}
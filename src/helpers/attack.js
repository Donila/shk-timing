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

export {
  defaultArmy,
  defaultAttack,
  emptyAttack
}
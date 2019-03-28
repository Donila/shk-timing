import * as timeHelper from '@/helpers/time'

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

const getSlowestArmy = (armies) => {
  if (armies.length === 0) {
    return null
  }

  let slowestArmy = armies.reduce((accumulatedArmy, army) => {
    return timeHelper.fullTime(army) > timeHelper.fullTime(accumulatedArmy) ? army : accumulatedArmy
  }, armies[0]);

  return slowestArmy;
}

export {
  defaultArmy,
  defaultAttack,
  emptyAttack,
  convertTimeInput,
  getSlowestArmy
}
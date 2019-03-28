import * as moment from 'moment'

const secondsInMinute = 60
const secondsInHour = secondsInMinute * 60

const SPEEDS = [
  { value: 1, text: '1x' },
  { value: 2, text: '2x' },
  { value: 3, text: '3x' },
  { value: 4, text: '4x' },
  { value: 5, text: '5x' },
  { value: 6, text: '6x' }
]

const toEditableModel = (army) => {
  let time = moment.duration(army.time, 'seconds')
  return {
    h: time.hours() + time.days() * 24,
    m: time.minutes(),
    s: time.seconds(),
    name: army.name,
    delay: army.delay,
    time: army.time,
    speed: army.speed
  }
}

const fromEditableModel = (model) => {
  let time = +(model.h * secondsInHour + model.m * secondsInMinute + model.s) * model.speed

  return {
    time: time,
    name: model.name,
    delay: parseInt(model.delay),
    speed: parseInt(model.speed)
  }
}

const stringifyArmyTime = (time) => {
  const duration = moment.duration(time, 'seconds')

  return humanizeArmyTime(duration.hours() + duration.days() * 24, duration.minutes(), duration.seconds())
}

const humanizeArmyTime = (hours, minutes, seconds) => {
  let str = hours

  str += ':'
  if (minutes < 10) {
    str += `0${minutes}`
  } else {
    str += minutes
  }
  str += ':'
  if (seconds < 10) {
    str += `0${seconds}`
  } else {
    str += seconds
  }

  return str
}

const buildXTable = (army) => {
  return SPEEDS.map(speed => army.time / speed.value)
}

const whenToGo = (army, time) => {
  let hours = parseInt(time.substr(0, 2)) || 0
  let minutes = parseInt(time.substr(2, 2)) || 0
  let utc = moment.utc()
  let timeX = utc.hours(hours).minutes(minutes).seconds(army.delay)

  let armyDuration = moment.duration(Math.floor(army.time / army.speed), 'seconds')
  return timeX.subtract(armyDuration)
}

const whenToGoCounter = (army, time) => {
  let now = moment.utc()
  let whenTo = whenToGo(army, time)
  let diff = whenTo.diff(now, 'seconds')
  if (diff <= 0) {
    whenTo.days(whenTo.days() + 1)
  }
  return whenTo.diff(now, 'seconds')
}

export {
  toEditableModel,
  fromEditableModel,
  stringifyArmyTime,
  humanizeArmyTime,
  SPEEDS,
  buildXTable,
  whenToGo,
  whenToGoCounter
}
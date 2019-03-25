import * as moment from 'moment'

const secondsInMinute = 60
const secondsInHour = secondsInMinute * 60

const toEditableModel = (army) => {
  let time = moment.duration(army.time, 'seconds')
  return {
    speed: army.speed,
    delay: army.delay,
    name: army.name,
    time: army.time,
    h: time.hours() + time.days() * 24,
    m: time.minutes(),
    s: time.seconds()
  }
}

const fromEditableModel = (model) => {
  let time = +(model.h * secondsInHour + model.m * secondsInMinute + model.s)

  return {
    speed: model.speed,
    delay: model.delay,
    name: model.name,
    time: time
  }
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

export {
  toEditableModel,
  fromEditableModel,
  humanizeArmyTime
}
const secondsToDuration = (inputSeconds) => {
  if (!inputSeconds) {
    return '00:00:00'
  }

  const h = Math.floor(inputSeconds / (60 * 60));
  const m = Math.floor((inputSeconds - h * 60 * 60) / 60);
  const s = inputSeconds - h * 60 * 60 - m * 60;
  const hours = h < 10 ? `0${h}` : h
  const minutes = m < 10 ? `0${m}` : m
  const seconds = s < 10 ? `0${s}` : s

  return `${hours}:${minutes}:${seconds}`
}

const fullTime = (army) => {
  return Math.floor(army.time / army.speed) + army.delay;
};

export {
  secondsToDuration,
  fullTime
}
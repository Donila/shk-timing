const convertArmyToShort = (army) => {
  let newObj = {}
  if (army.name) {
    newObj.n = army.name
  }
  if (army.speed > 0 && army.speed < 7) {
    newObj.s = army.speed
  }
  if (!isNaN(army.delay)) {
    newObj.d = army.delay
  }
  if (!isNaN(army.time)) {
    newObj.t = army.time
  }

  return newObj;
}

const convertArmyFromShort = (a) => {
  let army = {};

  if (a.n) {
    army.name = a.n
  }

  if (!isNaN(a.s) && a.s > 0 && a.s < 7) {
    army.speed = a.s
  }

  if (!isNaN(a.d)) {
    army.delay = a.d
  }

  if (!isNaN(a.t)) {
    army.time = a.t
  }

  return army;
}

const convertStringToArmy = (atkString) => {
  let parsed = {}

  try {
    parsed = JSON.parse(atkString);
    // eslint-disable-next-line no-empty
  } catch (e) {
  }

  let army = convertArmyFromShort(parsed)

  return army
}

const convertAttackToShort = (attack) => {
  let a = {}

  if (attack.armies) {
    a.a = attack.armies.map((army) => {
      return convertArmyToShort(army)
    })
  }

  if (attack.name) {
    a.n = attack.name;
  }

  if (!isNaN(attack.time)) {
    a.t = attack.time
  }

  return a
}

const convertAttackFromShort = (a) => {
  let attack = {}

  if (a.a) {
    attack.armies = a.a.map((army) => {
      return convertArmyFromShort(army)
    })
  }

  if (a.n) {
    attack.name = a.n;
  }

  if (!isNaN(a.t)) {
    attack.time = a.t
  }

  return attack
}

const convertAttackToString = (attack) => {
  let stringified = ''
  let attackObj = convertAttackToShort(attack)

  try {
    stringified = JSON.stringify(attackObj);
    // eslint-disable-next-line no-empty
  } catch (e) {
  }
  return stringified;
}

const convertStringToAttack = (stringified) => {
  let attackObj = {}

  try {
    attackObj = JSON.parse(stringified);
    // eslint-disable-next-line no-empty
  } catch (e) {
  }
  return attackObj;
}

const convertAttackToUrl = (attack) => {
  const attackStr = convertAttackToString(attack)
  return encodeURI(attackStr);
}

const convertAttackFromUrl = (url) => {
  const attackStr = decodeURI(url)
  let shorten = convertStringToAttack(attackStr)
  return convertAttackFromShort(shorten)
}

export {
  convertArmyToShort,
  convertArmyFromShort,
  convertStringToArmy,
  convertStringToAttack,
  convertAttackToShort,
  convertAttackFromShort,
  convertAttackToString,
  convertAttackToUrl,
  convertAttackFromUrl
}
import { expect, assert } from 'chai'
import * as urlConverter from '@/helpers/urlConverter'
import * as attackHelper from '@/helpers/attack'
import * as armyHelper from '@/helpers/army'

const defaultArmyShorten = {
  s: 1,
  d: 0,
  n: 'basic army',
  t: 0
}

const defaultAttack = {
  armies: [attackHelper.defaultArmy()],
  time: '0000',
  name: 'Default Attack'
}

const defaultAttackShorten = {
  a: [{
    s: 1,
    d: 0,
    n: 'basic army',
    t: 0
  }],
  t: '0000',
  n: 'Default Attack'
}

const defaultArmyStringified = '{"n":"basic army","s":1,"d":0,"t":0}'
const defaultAttackStringified = '{"a":[{"n":"basic army","s":1,"d":0,"t":0}],"n":"Default Attack","t":"0000"}'
const defaultAttackUrl = '%7B%22a%22:%5B%7B%22n%22:%22basic%20army%22,%22s%22:1,%22d%22:0,%22t%22:0%7D%5D,%22n%22:%22Default%20Attack%22,%22t%22:%220000%22%7D'

describe('urlConverter tests', () => {
  it('convertArmyToShort converts correct Attack to shorten form', () => {
    const army = { ...attackHelper.defaultArmy() }

    let result = urlConverter.convertArmyToShort(army)

    compareShortArmies(result, defaultArmyShorten)
  })

  it('convertArmyFromShort converts correct Attack from shorten form', () => {
    const army = { ...defaultArmyShorten }

    let result = urlConverter.convertArmyFromShort(army)

    compareShortArmies(result, attackHelper.defaultArmy())
  })

  it('convertStringToArmy converts correct Army to string', () => {
    let result = urlConverter.convertStringToArmy(defaultArmyStringified);

    compareArmies(result, attackHelper.defaultArmy())
  })

  it('convertAttackToShort converts correct Attack to shorten form', () => {
    const attack = { ...defaultAttack }

    let result = urlConverter.convertAttackToShort(attack)

    compareShortAttacks(result, defaultAttackShorten)
  })

  it('convertAttackFromShort converts correct Attack from shorten form', () => {
    const attack = { ...defaultAttackShorten }

    let result = urlConverter.convertAttackFromShort(attack)

    compareAttacks(result, defaultAttack)
  })

  it('convertAttackToString converts correct Attack to string', () => {
    const attack = { ...defaultAttack }

    let result = urlConverter.convertAttackToString(attack)

    expect(result).eq(defaultAttackStringified)
  })

  it('convertAttackToUrl converts correct Attack to url', () => {
    const attack = { ...defaultAttack }

    let result = urlConverter.convertAttackToUrl(attack)

    expect(result).eq(defaultAttackUrl)
  })

  it('convertAttackFromUrl converts correct url to Attack', () => {
    let result = urlConverter.convertAttackFromUrl(defaultAttackUrl)

    compareAttacks(result, defaultAttack)
  })
})

describe('army tests', () => {
  it('armyToEditableModel with 1.5h time', () => {
    let army = { time: 3600 * 1.5, ...attackHelper.defaultArmy() }
    let result = armyHelper.toEditableModel(army)
    expect(result.h === 1);
    expect(result.m === 30);
  })

  it('armyFromEditableModel with 1h30m01s time', () => {
    let army = { h: 1, m: 30, s: 1, speed: 1, delay: 0, name: 'test' }
    let result = armyHelper.fromEditableModel(army)
    expect(result.time).to.be.a('number')
    expect(result.time).eq(5401);
  })

  it('armyFromEditableModel with 1h time on 2x speed', () => {
    let army = { h: 1, m: 0, s: 0, speed: 2, delay: 0, name: 'test' }
    let result = armyHelper.fromEditableModel(army)
    expect(result.time).to.be.a('number')
    expect(result.time).eq(1800);
  })

  it('humanizeArmyTime 1h 1m 1s to 1:01:01', () => {
    let result = armyHelper.humanizeArmyTime(1, 1, 1)
    expect(result).eq('1:01:01')
  })

  it('humanizeArmyTime 0h 10m 10s to 0:10:10', () => {
    let result = armyHelper.humanizeArmyTime(0, 10, 10)
    expect(result).eq('0:10:10')
  })

  it('army buildXTable with 1h time', () => {
    let army = { time: 3600 }
    let result = armyHelper.buildXTable(army)
    expect(result).to.be.an('array')
    expect(result.length).eq(6);
    expect(result[0]).eq(3600);
    expect(result[1]).eq(1800);
  })

  it('army whenToGo for 22:00, 1h duration on 2x with 10s delay', () => {
    let army = { time: 3600, delay: 10, speed: 2 }
    let time = '2200'
    let result = armyHelper.whenToGo(army, time)

    expect(result.format('HH:mm:ss')).eq('21:30:10')
  })
})

describe('attack tests', () => {
  it('attack convertTimeInput from 1825 to {hours: 18, minutes: 25}', () => {
    let input = 1825
    let result = attackHelper.convertTimeInput(input)

    expect(result.hours).eq(18)
    expect(result.minutes).eq(25)
  })
})

const compareArmies = (army1, army2) => {
  expect(army1.speed).eq(army2.speed)
  expect(army1.name).eq(army2.name)
  expect(army1.delay).eq(army2.delay)
  expect(army1.time).eq(army2.time)
}

const compareShortArmies = (a1, a2) => {
  expect(a1.s).eq(a2.s)
  expect(a1.n).eq(a2.n)
  expect(a1.d).eq(a2.d)
  expect(a1.t).eq(a2.t)
}

const compareAttacks = (attack1, attack2) => {
  expect(attack1.name).eq(attack2.name)
  expect(attack1.time).eq(attack2.time)
  expect(attack1.armies.length).eq(attack2.armies.length)
  attack1.armies.forEach((army1) => {
    let army2 = attack2.armies.filter((a) => a.name == army1.name)[0]
    if (army2) {
      compareArmies(army1, army2)
    } else {
      assert.fail()
    }
  })
}

const compareShortAttacks = (attack1, attack2) => {
  expect(attack1.n).eq(attack2.n)
  expect(attack1.t).eq(attack2.t)
  expect(attack1.a.length).eq(attack2.a.length)
  attack1.a.forEach((army1) => {
    let army2 = attack2.a.filter((a) => a.n == army1.n)[0]
    if (army2) {
      compareShortArmies(army1, army2)
    } else {
      assert.fail()
    }
  })
}
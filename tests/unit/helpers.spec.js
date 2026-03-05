import { expect } from 'vitest'
import * as urlConverter from '@/helpers/urlConverter'
import * as attackHelper from '@/helpers/attack'
import * as armyHelper from '@/helpers/army'
import * as timeHelper from '@/helpers/time'
import * as discordParser from '@/helpers/discordBotArmiesParser'

// ─── fixtures ────────────────────────────────────────────────────────────────

const basicArmy = () => ({ name: 'basic army', time: 0, speed: 1, delay: 0 })

const defaultAttack = {
  armies: [basicArmy()],
  time: '0000',
  name: 'Default Attack'
}

const defaultArmyShorten    = { n: 'basic army', s: 1, d: 0, t: 0 }
const defaultAttackShorten  = { a: [defaultArmyShorten], t: '0000', n: 'Default Attack' }
const defaultAttackStringified = '{"a":[{"n":"basic army","s":1,"d":0,"t":0}],"n":"Default Attack","t":"0000"}'
const defaultAttackUrl = '%7B%22a%22:%5B%7B%22n%22:%22basic%20army%22,%22s%22:1,%22d%22:0,%22t%22:0%7D%5D,%22n%22:%22Default%20Attack%22,%22t%22:%220000%22%7D'

const DISCORD_SAMPLE = `| Army Name | Travel Time | Speed |
| --- | --- | --- |
| --- | --- | --- |
| Swords | 1h 30m 10s | 1x |
| Archers | 2h 5m | 1x |
| Cavalry | 45m 30s | 1x |
|`

// ─── time.js ─────────────────────────────────────────────────────────────────

describe('time — secondsToDuration', () => {
  it('returns 00:00:00 for 0', () => {
    expect(timeHelper.secondsToDuration(0)).toBe('00:00:00')
  })

  it('returns 00:00:00 for null/undefined', () => {
    expect(timeHelper.secondsToDuration(null)).toBe('00:00:00')
    expect(timeHelper.secondsToDuration(undefined)).toBe('00:00:00')
  })

  it('formats 3661s as 01:01:01', () => {
    expect(timeHelper.secondsToDuration(3661)).toBe('01:01:01')
  })

  it('formats 3600s as 01:00:00', () => {
    expect(timeHelper.secondsToDuration(3600)).toBe('01:00:00')
  })

  it('formats 60s as 00:01:00', () => {
    expect(timeHelper.secondsToDuration(60)).toBe('00:01:00')
  })

  it('formats 59s as 00:00:59', () => {
    expect(timeHelper.secondsToDuration(59)).toBe('00:00:59')
  })

  it('handles > 24h (90061s → 25:01:01)', () => {
    expect(timeHelper.secondsToDuration(90061)).toBe('25:01:01')
  })
})

describe('time — fullTime', () => {
  it('returns 0 for null army', () => {
    expect(timeHelper.fullTime(null)).toBe(0)
    expect(timeHelper.fullTime(undefined)).toBe(0)
  })

  it('returns time at 1x speed with no delay', () => {
    expect(timeHelper.fullTime({ time: 3600, speed: 1, delay: 0 })).toBe(3600)
  })

  it('halves time at 2x speed', () => {
    expect(timeHelper.fullTime({ time: 3600, speed: 2, delay: 0 })).toBe(1800)
  })

  it('adds delay to travel time', () => {
    expect(timeHelper.fullTime({ time: 3600, speed: 1, delay: 10 })).toBe(3610)
  })

  it('floors fractional seconds', () => {
    expect(timeHelper.fullTime({ time: 3601, speed: 2, delay: 0 })).toBe(1800)
  })

  it('returns only delay when time is 0', () => {
    expect(timeHelper.fullTime({ time: 0, speed: 1, delay: 5 })).toBe(5)
  })
})

describe('time — getSuggestedTime', () => {
  it('returns a string in HH:mm format', () => {
    const army = { time: 3600, speed: 1, delay: 0 }
    const result = timeHelper.getSuggestedTime(army, 3)
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })

  it('returns HH:mm for null army', () => {
    const result = timeHelper.getSuggestedTime(null, 3)
    expect(result).toMatch(/^\d{2}:\d{2}$/)
  })
})

// ─── attack.js ───────────────────────────────────────────────────────────────

describe('attack — defaultArmy', () => {
  it('returns correct shape', () => {
    const army = attackHelper.defaultArmy()
    expect(army.speed).toBe(1)
    expect(army.delay).toBe(0)
    expect(army.name).toBe('basic army')
    expect(army.time).toBe(0)
  })

  it('returns a fresh object each call', () => {
    const a = attackHelper.defaultArmy()
    const b = attackHelper.defaultArmy()
    expect(a).not.toBe(b)
  })
})

describe('attack — emptyAttack', () => {
  it('has empty armies array', () => {
    const atk = attackHelper.emptyAttack()
    expect(atk.armies).toEqual([])
    expect(atk.time).toBe('0000')
    expect(atk.name).toBe('')
  })
})

describe('attack — defaultAttack', () => {
  it('has one army, correct time and name', () => {
    const atk = attackHelper.defaultAttack()
    expect(atk.armies).toHaveLength(1)
    expect(atk.time).toBe('0000')
    expect(atk.name).toBe('')
  })
})

describe('attack — convertTimeInput', () => {
  it('parses 1825 → { hours: 18, minutes: 25 }', () => {
    const r = attackHelper.convertTimeInput(1825)
    expect(r.hours).toBe(18)
    expect(r.minutes).toBe(25)
  })

  it('parses 0 → { hours: 0, minutes: 0 }', () => {
    const r = attackHelper.convertTimeInput(0)
    expect(r.hours).toBe(0)
    expect(r.minutes).toBe(0)
  })

  it('parses 2359 → { hours: 23, minutes: 59 }', () => {
    const r = attackHelper.convertTimeInput(2359)
    expect(r.hours).toBe(23)
    expect(r.minutes).toBe(59)
  })

  it('parses 100 → { hours: 1, minutes: 0 }', () => {
    const r = attackHelper.convertTimeInput(100)
    expect(r.hours).toBe(1)
    expect(r.minutes).toBe(0)
  })
})

describe('attack — getSlowestArmy', () => {
  it('returns null for empty array', () => {
    expect(attackHelper.getSlowestArmy([])).toBeNull()
  })

  it('returns the only army in a single-element array', () => {
    const army = { name: 'A', time: 3600, speed: 1, delay: 0 }
    expect(attackHelper.getSlowestArmy([army])).toBe(army)
  })

  it('returns the army with the highest fullTime', () => {
    const fast   = { name: 'fast',   time: 1800, speed: 1, delay: 0 }
    const slow   = { name: 'slow',   time: 3600, speed: 1, delay: 0 }
    const medium = { name: 'medium', time: 2700, speed: 1, delay: 0 }
    expect(attackHelper.getSlowestArmy([fast, slow, medium])).toBe(slow)
  })

  it('accounts for speed when comparing', () => {
    // time=7200 speed=2 → fullTime=3600; time=3601 speed=1 → fullTime=3601
    const a = { name: 'a', time: 7200, speed: 2, delay: 0 }
    const b = { name: 'b', time: 3601, speed: 1, delay: 0 }
    expect(attackHelper.getSlowestArmy([a, b])).toBe(b)
  })

  it('accounts for delay when comparing', () => {
    const noDelay    = { name: 'noDelay',    time: 3600, speed: 1, delay: 0 }
    const withDelay  = { name: 'withDelay',  time: 3600, speed: 1, delay: 10 }
    expect(attackHelper.getSlowestArmy([noDelay, withDelay])).toBe(withDelay)
  })
})

// ─── army.js ─────────────────────────────────────────────────────────────────

describe('army — toEditableModel', () => {
  it('splits 1.5h into h=1, m=30', () => {
    const army = { ...basicArmy(), time: 3600 * 1.5 }
    const r = armyHelper.toEditableModel(army)
    expect(r.h).toBe(1)
    expect(r.m).toBe(30)
    expect(r.s).toBe(0)
  })

  it('keeps name, delay and speed', () => {
    const army = { name: 'X', time: 0, speed: 3, delay: 5 }
    const r = armyHelper.toEditableModel(army)
    expect(r.name).toBe('X')
    expect(r.speed).toBe(3)
    expect(r.delay).toBe(5)
  })

  it('handles time > 24h (days)', () => {
    const army = { ...basicArmy(), time: 25 * 3600 + 61 } // 25h 1m 1s
    const r = armyHelper.toEditableModel(army)
    expect(r.h).toBe(25)
    expect(r.m).toBe(1)
    expect(r.s).toBe(1)
  })
})

describe('army — fromEditableModel', () => {
  it('converts 1h 30m 1s at speed 1 → 5401s', () => {
    const model = { h: 1, m: 30, s: 1, speed: 1, delay: 0, name: 'test' }
    expect(armyHelper.fromEditableModel(model).time).toBe(5401)
  })

  it('multiplies raw time by speed (1h at 2x → 7200s stored)', () => {
    const model = { h: 1, m: 0, s: 0, speed: 2, delay: 0, name: 'test' }
    expect(armyHelper.fromEditableModel(model).time).toBe(7200)
  })

  it('parses delay and speed as integers', () => {
    const model = { h: 0, m: 0, s: 0, speed: '3', delay: '5', name: 'x' }
    const r = armyHelper.fromEditableModel(model)
    expect(r.speed).toBe(3)
    expect(r.delay).toBe(5)
  })
})

describe('army — humanizeArmyTime', () => {
  it('formats 1h 1m 1s → "1:01:01"', () => {
    expect(armyHelper.humanizeArmyTime(1, 1, 1)).toBe('1:01:01')
  })

  it('formats 0h 10m 10s → "0:10:10"', () => {
    expect(armyHelper.humanizeArmyTime(0, 10, 10)).toBe('0:10:10')
  })

  it('pads single-digit minutes and seconds', () => {
    expect(armyHelper.humanizeArmyTime(2, 5, 3)).toBe('2:05:03')
  })
})

describe('army — stringifyArmyTime', () => {
  it('formats 3661s → "1:01:01"', () => {
    expect(armyHelper.stringifyArmyTime(3661)).toBe('1:01:01')
  })

  it('formats 0s → "0:00:00"', () => {
    expect(armyHelper.stringifyArmyTime(0)).toBe('0:00:00')
  })

  it('formats 3600s → "1:00:00"', () => {
    expect(armyHelper.stringifyArmyTime(3600)).toBe('1:00:00')
  })

  it('handles > 24h (86461s → "24:01:01")', () => {
    expect(armyHelper.stringifyArmyTime(86461)).toBe('24:01:01')
  })
})

describe('army — buildXTable', () => {
  it('returns 6 entries for all speed multipliers', () => {
    const result = armyHelper.buildXTable({ time: 3600 })
    expect(result).toHaveLength(6)
  })

  it('divides army time by each speed', () => {
    const result = armyHelper.buildXTable({ time: 3600 })
    expect(result[0]).toBe(3600)   // 1x
    expect(result[1]).toBe(1800)   // 2x
    expect(result[2]).toBe(1200)   // 3x
    expect(result[5]).toBe(600)    // 6x
  })
})

describe('army — whenToGo', () => {
  it('subtracts travel time from attack time (22:00, 1h/2x, 10s delay → 21:30:10)', () => {
    const army = { time: 3600, delay: 10, speed: 2 }
    const result = armyHelper.whenToGo(army, '2200')
    expect(result.format('HH:mm:ss')).toBe('21:30:10')
  })

  it('returns a moment object', () => {
    const army = { time: 3600, delay: 0, speed: 1 }
    const result = armyHelper.whenToGo(army, '1200')
    expect(typeof result.format).toBe('function')
  })
})

// ─── urlConverter.js ─────────────────────────────────────────────────────────

describe('urlConverter — convertArmyToShort', () => {
  it('converts a full army to short keys', () => {
    const r = urlConverter.convertArmyToShort(basicArmy())
    expect(r).toEqual(defaultArmyShorten)
  })

  it('omits speed when out of range', () => {
    const r = urlConverter.convertArmyToShort({ name: 'x', speed: 7, delay: 0, time: 0 })
    expect(r.s).toBeUndefined()
  })
})

describe('urlConverter — convertArmyFromShort', () => {
  it('restores army from short keys', () => {
    const r = urlConverter.convertArmyFromShort(defaultArmyShorten)
    expect(r).toEqual(basicArmy())
  })

  it('omits speed when out of range', () => {
    const r = urlConverter.convertArmyFromShort({ n: 'x', s: 8, d: 0, t: 0 })
    expect(r.speed).toBeUndefined()
  })
})

describe('urlConverter — convertStringToArmy', () => {
  it('parses a valid JSON army string', () => {
    const str = '{"n":"basic army","s":1,"d":0,"t":0}'
    const r = urlConverter.convertStringToArmy(str)
    expect(r).toEqual(basicArmy())
  })

  it('returns empty object for invalid JSON', () => {
    const r = urlConverter.convertStringToArmy('not-json')
    expect(r).toEqual({})
  })
})

describe('urlConverter — convertAttackToShort / convertAttackFromShort', () => {
  it('round-trips an attack through short form', () => {
    const short = urlConverter.convertAttackToShort(defaultAttack)
    expect(short).toEqual(defaultAttackShorten)

    const restored = urlConverter.convertAttackFromShort(short)
    expect(restored.name).toBe(defaultAttack.name)
    expect(restored.time).toBe(defaultAttack.time)
    expect(restored.armies).toHaveLength(1)
  })
})

describe('urlConverter — convertAttackToString / convertAttackToUrl / convertAttackFromUrl', () => {
  it('serializes an attack to JSON string', () => {
    expect(urlConverter.convertAttackToString(defaultAttack)).toBe(defaultAttackStringified)
  })

  it('encodes an attack to a URL-safe string', () => {
    expect(urlConverter.convertAttackToUrl(defaultAttack)).toBe(defaultAttackUrl)
  })

  it('decodes a URL back to an attack', () => {
    const r = urlConverter.convertAttackFromUrl(defaultAttackUrl)
    expect(r.name).toBe(defaultAttack.name)
    expect(r.time).toBe(defaultAttack.time)
    expect(r.armies).toHaveLength(1)
    expect(r.armies[0].name).toBe('basic army')
  })
})

// ─── discordBotArmiesParser.js ────────────────────────────────────────────────

describe('discordParser — convertFromDiscordBot', () => {
  it('returns [] when input has ≤ 4 lines', () => {
    expect(discordParser.convertFromDiscordBot('')).toEqual([])
    expect(discordParser.convertFromDiscordBot('a\nb\nc\nd')).toEqual([])
  })

  it('parses army names and travel times from Discord table', () => {
    const result = discordParser.convertFromDiscordBot(DISCORD_SAMPLE)
    expect(result).toHaveLength(3)

    expect(result[0].name).toBe('Swords')
    expect(result[0].time).toBe(1 * 3600 + 30 * 60 + 10) // 5410s
    expect(result[0].speed).toBe(1)
    expect(result[0].delay).toBe(0)

    expect(result[1].name).toBe('Archers')
    expect(result[1].time).toBe(2 * 3600 + 5 * 60) // 7500s

    expect(result[2].name).toBe('Cavalry')
    expect(result[2].time).toBe(45 * 60 + 30) // 2730s
  })
})

describe('discordParser — duration parsing', () => {
  const parse = (str) => {
    const input = `h1\nh2\nh3\n| Army | ${str} | 1x |\n|`
    return discordParser.convertFromDiscordBot(input)[0].time
  }

  it('parses hours only', () => {
    expect(parse('2h')).toBe(7200)
  })

  it('parses minutes only', () => {
    expect(parse('45m')).toBe(2700)
  })

  it('parses seconds only', () => {
    expect(parse('30s')).toBe(30)
  })

  it('parses days', () => {
    expect(parse('1d')).toBe(86400)
  })

  it('parses combined units', () => {
    expect(parse('1h 30m 10s')).toBe(5410)
  })

  it('returns 0 for empty/unrecognised string', () => {
    expect(parse('???')).toBe(0)
  })
})

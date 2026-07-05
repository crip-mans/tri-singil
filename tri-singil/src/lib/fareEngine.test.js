import { describe, expect, it } from 'vitest'
import { calculateFare, MIN_FARE } from './fareEngine'

const fareMatrix = [
  {
    origin_zone_id: 'zone-a',
    destination_zone_id: 'zone-b',
    base_fare: 30,
    effective_date: '2026-01-01',
    is_active: true,
  },
  {
    origin_zone_id: 'zone-a',
    destination_zone_id: 'zone-e',
    base_fare: 15,
    effective_date: '2026-01-01',
    is_active: true,
  },
]

const modifiers = [
  { type: 'night_surcharge', calculation: 'flat', value: 5, is_active: true },
  { type: 'student_discount', calculation: 'percent', value: 20, is_active: true },
  { type: 'senior_discount', calculation: 'percent', value: 20, is_active: true },
]

describe('calculateFare', () => {
  it('returns the base fare for a normal daytime trip with no discounts', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-b',
      passengerType: 'regular',
      isNightTime: false,
      fareMatrix,
      modifiers,
    })

    expect(result).toEqual({
      fare: 30,
      breakdown: { baseFare: 30, surcharge: 0, discount: 0, total: 30 },
    })
  })

  it('returns an error when no fare rule exists for the route', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-c',
      passengerType: 'regular',
      isNightTime: false,
      fareMatrix,
      modifiers,
    })

    expect(result).toEqual({ error: 'No fare rule for this route yet' })
  })

  it('applies the flat night surcharge', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-b',
      passengerType: 'regular',
      isNightTime: true,
      fareMatrix,
      modifiers,
    })

    expect(result.fare).toBe(35)
    expect(result.breakdown.surcharge).toBe(5)
  })

  it('applies the percent student discount', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-b',
      passengerType: 'student',
      isNightTime: false,
      fareMatrix,
      modifiers,
    })

    expect(result.fare).toBe(24)
    expect(result.breakdown.discount).toBe(6)
  })

  it('stacks night surcharge and student discount', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-b',
      passengerType: 'student',
      isNightTime: true,
      fareMatrix,
      modifiers,
    })

    expect(result.fare).toBe(29)
    expect(result.breakdown).toEqual({
      baseFare: 30,
      surcharge: 5,
      discount: 6,
      total: 29,
    })
  })

  it('enforces the minimum fare floor when discounts push the total too low', () => {
    const result = calculateFare({
      originZoneId: 'zone-a',
      destZoneId: 'zone-e',
      passengerType: 'senior',
      isNightTime: false,
      fareMatrix,
      modifiers,
    })

    expect(result.fare).toBe(MIN_FARE)
    expect(result.breakdown.total).toBe(MIN_FARE)
  })
})

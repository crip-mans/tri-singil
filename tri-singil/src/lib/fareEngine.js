export const MIN_FARE = 10

const DISCOUNT_TYPE_BY_PASSENGER = {
  student: 'student_discount',
  senior: 'senior_discount',
  pwd: 'pwd_discount',
}

function applyModifier(modifier, baseFare) {
  if (modifier.calculation === 'percent') {
    return (baseFare * Number(modifier.value)) / 100
  }
  return Number(modifier.value)
}

function findRoute(fareMatrix, originZoneId, destZoneId) {
  const matches = fareMatrix.filter(
    (entry) =>
      entry.origin_zone_id === originZoneId &&
      entry.destination_zone_id === destZoneId &&
      entry.is_active
  )

  if (matches.length === 0) return null

  return matches.sort(
    (a, b) => new Date(b.effective_date) - new Date(a.effective_date)
  )[0]
}

export function calculateFare({
  originZoneId,
  destZoneId,
  passengerType,
  isNightTime,
  fareMatrix,
  modifiers,
}) {
  const route = findRoute(fareMatrix, originZoneId, destZoneId)

  if (!route) {
    return { error: 'No fare rule for this route yet' }
  }

  const baseFare = Number(route.base_fare)

  let surcharge = 0
  if (isNightTime) {
    const nightSurcharge = modifiers.find(
      (m) => m.type === 'night_surcharge' && m.is_active
    )
    if (nightSurcharge) {
      surcharge = applyModifier(nightSurcharge, baseFare)
    }
  }

  let discount = 0
  const discountType = DISCOUNT_TYPE_BY_PASSENGER[passengerType]
  if (discountType) {
    const discountModifier = modifiers.find(
      (m) => m.type === discountType && m.is_active
    )
    if (discountModifier) {
      discount = applyModifier(discountModifier, baseFare)
    }
  }

  const rawTotal = baseFare + surcharge - discount
  const total = Math.round(Math.max(rawTotal, MIN_FARE))

  return {
    fare: total,
    breakdown: {
      baseFare,
      surcharge,
      discount,
      total,
    },
  }
}

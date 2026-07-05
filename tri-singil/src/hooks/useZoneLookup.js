import { useMemo } from 'react'
import { point, booleanPointInPolygon } from '@turf/turf'

// Resolves which zone (if any) a lat/lng point falls inside, given the
// zones' GeoJSON Polygon boundaries.
export function useZoneLookup(location, zones) {
  return useMemo(() => {
    if (!location) return null

    const pt = point([location.lng, location.lat])

    const match = zones.find((zone) => {
      if (!zone.boundary) return false
      try {
        return booleanPointInPolygon(pt, zone.boundary)
      } catch {
        return false
      }
    })

    return match ? match.id : null
  }, [location, zones])
}

import { useEffect, useMemo, useState } from 'react'
import { pointOnFeature } from '@turf/turf'
import MapView from '../components/MapView'
import PassengerTypeToggle from '../components/PassengerTypeToggle'
import FareBreakdown from '../components/FareBreakdown'
import LocationSearch from '../components/LocationSearch'
import { fetchZones, fetchFareMatrix, fetchModifiers } from '../lib/zonesApi'
import { calculateFare } from '../lib/fareEngine'
import { useZoneLookup } from '../hooks/useZoneLookup'
import { useGeolocation } from '../hooks/useGeolocation'

const DEFAULT_CENTER = [14.5995, 120.9842]
const DEFAULT_ZOOM = 15

function zoneLabel(point, zoneId, zones) {
  if (!point) return ''
  if (!zoneId) return 'Outside known service area'
  return zones.find((zone) => zone.id === zoneId)?.name ?? 'Outside known service area'
}

function timeStringToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

function isNightTimeNow(modifiers) {
  const nightModifier = modifiers.find((m) => m.type === 'night_surcharge' && m.is_active)
  if (!nightModifier?.time_start || !nightModifier?.time_end) return false

  const start = timeStringToMinutes(nightModifier.time_start)
  const end = timeStringToMinutes(nightModifier.time_end)
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // Night windows commonly wrap past midnight (e.g. 22:00 -> 05:00).
  if (start <= end) {
    return nowMinutes >= start && nowMinutes < end
  }
  return nowMinutes >= start || nowMinutes < end
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

function Spinner() {
  return <span className="block h-4 w-4 animate-spin rounded-full border-2 border-orange-200 border-t-orange-600" />
}

// Guarantees a point that actually falls inside the zone's polygon (unlike a
// plain geometric centroid, which can land outside on concave shapes).
function pointFromZone(zone) {
  if (!zone.boundary) return null
  const [lng, lat] = pointOnFeature(zone.boundary).geometry.coordinates
  return { lat, lng }
}

function Home() {
  const [zones, setZones] = useState([])
  const [fareMatrix, setFareMatrix] = useState([])
  const [modifiers, setModifiers] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [origin, setOrigin] = useState(null)
  const [destination, setDestination] = useState(null)
  const [passengerType, setPassengerType] = useState('regular')

  const {
    location: gpsLocation,
    error: gpsError,
    loading: gpsLoading,
    requestLocation,
  } = useGeolocation()

  useEffect(() => {
    Promise.all([fetchZones(), fetchFareMatrix(), fetchModifiers()])
      .then(([zonesData, fareMatrixData, modifiersData]) => {
        setZones(zonesData)
        setFareMatrix(fareMatrixData)
        setModifiers(modifiersData)
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setDataLoading(false))
  }, [])

  useEffect(() => {
    if (gpsLocation) {
      setOrigin(gpsLocation)
      setDestination(null)
    }
  }, [gpsLocation])

  const originZoneId = useZoneLookup(origin, zones)
  const destinationZoneId = useZoneLookup(destination, zones)

  const handlePointSelect = (point) => {
    if (!origin || destination) {
      setOrigin(point)
      setDestination(null)
    } else {
      setDestination(point)
    }
  }

  const handleSelectOriginZone = (zone) => {
    const point = pointFromZone(zone)
    if (!point) return
    setOrigin(point)
    setDestination(null)
  }

  const handleSelectDestinationZone = (zone) => {
    const point = pointFromZone(zone)
    if (!point) return
    setDestination(point)
  }

  const markers = useMemo(() => {
    const points = []
    if (origin) points.push({ position: [origin.lat, origin.lng], label: 'Origin' })
    if (destination) points.push({ position: [destination.lat, destination.lng], label: 'Destination' })
    return points
  }, [origin, destination])

  const mapCenter = gpsLocation ? [gpsLocation.lat, gpsLocation.lng] : DEFAULT_CENTER

  const fareResult = useMemo(() => {
    if (!originZoneId || !destinationZoneId) return null
    return calculateFare({
      originZoneId,
      destZoneId: destinationZoneId,
      passengerType,
      isNightTime: isNightTimeNow(modifiers),
      fareMatrix,
      modifiers,
    })
  }, [originZoneId, destinationZoneId, passengerType, fareMatrix, modifiers])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white px-4 py-3 shadow-sm">
        <span className="text-xl font-bold text-orange-600">Tri-Singil</span>
      </header>

      <main className="mx-auto max-w-md space-y-4 p-4">
        {/* Input card — the first thing shown, modal-style */}
        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Plan your trip
          </h2>

          {(loadError || gpsError) && (
            <div className="mb-4 space-y-2">
              {loadError && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  Failed to load zones: {loadError}
                </div>
              )}
              {gpsError && (
                <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{gpsError}</div>
              )}
            </div>
          )}

          <div className="mb-4 flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <span className="h-3 w-3 shrink-0 rounded-full bg-green-600" />
              <span className="my-1 w-px flex-1 bg-gray-300" />
              <span className="h-3 w-3 shrink-0 rounded-full bg-orange-600" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <LocationSearch
                  label="From"
                  value={zoneLabel(origin, originZoneId, zones)}
                  zones={zones}
                  onSelectZone={handleSelectOriginZone}
                />
                <button
                  onClick={requestLocation}
                  disabled={gpsLoading}
                  aria-label="Use my location"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 disabled:opacity-50"
                >
                  {gpsLoading ? <Spinner /> : <LocationIcon />}
                </button>
              </div>
              <LocationSearch
                label="To"
                value={zoneLabel(destination, destinationZoneId, zones)}
                zones={zones}
                onSelectZone={handleSelectDestinationZone}
              />
            </div>
          </div>

          {dataLoading ? (
            <p className="text-center text-sm text-gray-500">Loading fare data…</p>
          ) : !origin ? (
            <p className="text-center text-sm text-gray-500">
              Use your location or search above to set your origin.
            </p>
          ) : !destination ? (
            <p className="text-center text-sm text-gray-500">Search above to set your destination.</p>
          ) : !originZoneId || !destinationZoneId ? (
            <p className="text-center text-sm text-gray-500">
              Fare can't be calculated while a point is outside the known service area.
            </p>
          ) : (
            <div className="space-y-4">
              <PassengerTypeToggle value={passengerType} onChange={setPassengerType} />
              <FareBreakdown result={fareResult} />
            </div>
          )}
        </div>

        {/* Map — secondary, shown below the trip details */}
        <div className="h-72 w-full overflow-hidden rounded-2xl shadow-lg">
          <MapView
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            zones={zones}
            markers={markers}
            onPointSelect={handlePointSelect}
          />
        </div>
      </main>
    </div>
  )
}

export default Home

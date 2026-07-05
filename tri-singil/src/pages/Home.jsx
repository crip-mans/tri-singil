import { useEffect, useMemo, useState } from 'react'
import MapView from '../components/MapView'
import PassengerTypeToggle from '../components/PassengerTypeToggle'
import FareBreakdown from '../components/FareBreakdown'
import { fetchZones, fetchFareMatrix, fetchModifiers } from '../lib/zonesApi'
import { calculateFare } from '../lib/fareEngine'
import { useZoneLookup } from '../hooks/useZoneLookup'
import { useGeolocation } from '../hooks/useGeolocation'

const DEFAULT_CENTER = [14.5995, 120.9842]
const DEFAULT_ZOOM = 15

function zoneLabel(point, zoneId, zones) {
  if (!point) return 'Tap the map to select'
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
    <div className="min-h-screen p-4">
      <h1 className="text-4xl font-semibold text-center mb-4">Tri-Singil</h1>

      {loadError && (
        <p className="text-center text-red-600 mb-2">Failed to load zones: {loadError}</p>
      )}

      <div className="text-center mb-4">
        <button
          onClick={requestLocation}
          disabled={gpsLoading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {gpsLoading ? 'Locating…' : 'Use my location'}
        </button>
        {gpsError && <p className="text-red-600 mt-2">{gpsError}</p>}
      </div>

      <div className="h-[500px] w-full mb-4">
        <MapView
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          zones={zones}
          markers={markers}
          onPointSelect={handlePointSelect}
        />
      </div>

      <div className="text-center space-y-1 mb-6">
        <p>Origin: {zoneLabel(origin, originZoneId, zones)}</p>
        <p>Destination: {zoneLabel(destination, destinationZoneId, zones)}</p>
      </div>

      {dataLoading ? (
        <p className="text-center text-gray-500">Loading fare data…</p>
      ) : !origin ? (
        <p className="text-center text-gray-500">
          Use your location or tap the map to set your origin.
        </p>
      ) : !destination ? (
        <p className="text-center text-gray-500">Tap the map to set your destination.</p>
      ) : !originZoneId || !destinationZoneId ? (
        <p className="text-center text-gray-500">
          Fare can't be calculated while a point is outside the known service area.
        </p>
      ) : (
        <div className="space-y-4">
          <PassengerTypeToggle value={passengerType} onChange={setPassengerType} />
          <FareBreakdown result={fareResult} />
        </div>
      )}
    </div>
  )
}

export default Home

import { useEffect, useMemo, useState } from 'react'
import { pointOnFeature } from '@turf/turf'
import { motion } from 'framer-motion'
import MapView from '../components/MapView'
import RouteInputCard from '../components/RouteInputCard'
import PassengerTypeToggle from '../components/PassengerTypeToggle'
import FareEstimateCard from '../components/FareEstimateCard'
import { fetchZones, fetchFareMatrix, fetchModifiers } from '../lib/zonesApi'
import { calculateFare } from '../lib/fareEngine'
import { useZoneLookup } from '../hooks/useZoneLookup'
import { useGeolocation } from '../hooks/useGeolocation'
import { addHistoryEntry } from '../lib/history'

const DEFAULT_CENTER = [14.5995, 120.9842]
const DEFAULT_ZOOM = 15

function zoneName(zoneId, zones) {
  return zones.find((zone) => zone.id === zoneId)?.name ?? null
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
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

// Guarantees a point that actually falls inside the zone's polygon (unlike a
// plain geometric centroid, which can land outside on concave shapes).
function pointFromZone(zone) {
  if (!zone.boundary) return null
  const [lng, lat] = pointOnFeature(zone.boundary).geometry.coordinates
  return { lat, lng }
}

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: index * 0.04, ease: 'easeOut' },
  }),
}

function Card({ index, className, children }) {
  return (
    <motion.div custom={index} variants={cardVariants} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

function MapPage() {
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

  const originName = zoneName(originZoneId, zones)
  const destinationName = zoneName(destinationZoneId, zones)

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

  useEffect(() => {
    if (fareResult && !fareResult.error && originName && destinationName) {
      addHistoryEntry({ originName, destinationName, passengerType, fare: fareResult.fare })
    }
  }, [fareResult, originName, destinationName, passengerType])

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pt-6">
      <Card index={0}>
        <p className="text-sm font-medium text-slate">{greeting()}</p>
        <h1 className="font-display text-2xl font-bold text-charcoal">Where are you headed?</h1>
      </Card>

      {loadError && (
        <Card index={1} className="card p-4">
          <p className="text-sm font-medium text-coral">Failed to load fare data: {loadError}</p>
        </Card>
      )}

      <Card index={1}>
        <RouteInputCard
          origin={origin}
          destination={destination}
          originLabel={origin ? originName ?? '' : ''}
          destinationLabel={destination ? destinationName ?? '' : ''}
          originOutside={Boolean(origin) && !originZoneId}
          destinationOutside={Boolean(destination) && !destinationZoneId}
          zones={zones}
          onSelectOriginZone={handleSelectOriginZone}
          onSelectDestinationZone={handleSelectDestinationZone}
          gpsLoading={gpsLoading}
          gpsError={gpsError}
          onRequestLocation={requestLocation}
        />
      </Card>

      <Card index={2} className="card h-64 overflow-hidden">
        <MapView
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          zones={zones}
          markers={markers}
          onPointSelect={handlePointSelect}
        />
      </Card>

      <Card index={3}>
        <FareEstimateCard result={dataLoading ? null : fareResult} passengerType={passengerType} />
      </Card>

      <Card index={4}>
        <PassengerTypeToggle value={passengerType} onChange={setPassengerType} />
      </Card>
    </div>
  )
}

export default MapPage

import { IconMapPin, IconCurrentLocation } from '@tabler/icons-react'
import LocationSearch from './LocationSearch'

function Spinner() {
  return (
    <span className="block h-4 w-4 animate-spin rounded-full border-2 border-marigold/30 border-t-marigold" />
  )
}

function RouteInputCard({
  origin,
  destination,
  originLabel,
  destinationLabel,
  originOutside,
  destinationOutside,
  zones,
  onSelectOriginZone,
  onSelectDestinationZone,
  gpsLoading,
  gpsError,
  onRequestLocation,
}) {
  return (
    <div className="card p-5">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            type="button"
            onClick={!origin ? onRequestLocation : undefined}
            disabled={gpsLoading || Boolean(origin)}
            aria-label="Use my location"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-marigold/15 text-marigold transition-opacity disabled:opacity-60"
          >
            {gpsLoading ? <Spinner /> : <IconCurrentLocation size={16} stroke={2} />}
          </button>
          <span className="w-px flex-1 bg-slate/25" />
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-coral/15 text-coral">
            <IconMapPin size={16} stroke={2} />
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <LocationSearch
              label="Where from?"
              value={originLabel}
              zones={zones}
              onSelectZone={onSelectOriginZone}
            />
            {originOutside && (
              <p className="mt-1 text-xs font-medium text-coral">Outside known service area</p>
            )}
            {gpsError && !origin && <p className="mt-1 text-xs font-medium text-coral">{gpsError}</p>}
          </div>
          <div>
            <LocationSearch
              label="Where to?"
              value={destinationLabel}
              zones={zones}
              onSelectZone={onSelectDestinationZone}
            />
            {destinationOutside && (
              <p className="mt-1 text-xs font-medium text-coral">Outside known service area</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteInputCard

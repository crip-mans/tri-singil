import { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite doesn't resolve Leaflet's default marker icon URLs, so point them
// at the bundled assets directly. Used as a fallback for unrecognized labels.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function dotIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.45);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

const ORIGIN_ICON = dotIcon('#F4A63A')
const DESTINATION_ICON = dotIcon('#E8583D')

function markerIconFor(label) {
  if (label === 'Origin') return ORIGIN_ICON
  if (label === 'Destination') return DESTINATION_ICON
  return undefined
}

function polygonToPositions(boundary) {
  if (!boundary || boundary.type !== 'Polygon') return null
  return boundary.coordinates.map((ring) => ring.map(([lng, lat]) => [lat, lng]))
}

function ClickHandler({ onPointSelect }) {
  useMapEvents({
    click(e) {
      onPointSelect?.({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function Recenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView(center)
  }, [center, map])
  return null
}

function MapView({ center, zoom, zones = [], markers = [], onPointSelect }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickHandler onPointSelect={onPointSelect} />
      <Recenter center={center} />

      {zones.map((zone) => {
        const positions = polygonToPositions(zone.boundary)
        if (!positions) return null
        return (
          <Polygon
            key={zone.id}
            positions={positions}
            pathOptions={{ color: '#1F8A85', weight: 1, fillOpacity: 0.08 }}
          />
        )
      })}

      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={markerIconFor(marker.label)}>
          {marker.label ? <Popup>{marker.label}</Popup> : null}
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView

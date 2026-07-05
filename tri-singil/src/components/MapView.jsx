import { useEffect } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite doesn't resolve Leaflet's default marker icon URLs, so point them
// at the bundled assets directly.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

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
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
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
            pathOptions={{ color: '#2563eb', weight: 1, fillOpacity: 0.1 }}
          />
        )
      })}

      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.label ? <Popup>{marker.label}</Popup> : null}
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView

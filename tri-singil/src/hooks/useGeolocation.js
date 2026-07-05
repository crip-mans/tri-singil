import { useCallback, useState } from 'react'

const ERROR_MESSAGES = {
  1: 'Location permission denied. You can still tap the map to set your origin.',
  2: 'Location unavailable. You can still tap the map to set your origin.',
  3: 'Location request timed out. You can still tap the map to set your origin.',
}

// Requires a user gesture to call requestLocation — some Android browsers
// silently block geolocation prompts triggered without one.
export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLoading(false)
      },
      (err) => {
        setError(ERROR_MESSAGES[err.code] ?? 'Unable to get your location.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { location, error, loading, requestLocation }
}

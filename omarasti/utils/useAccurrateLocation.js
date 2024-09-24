import { useEffect, useState } from 'react'

/**
 * When you start getting coordinates from phone GPS,
 * it takes some time to get accurrate results.
 * accurracyWanted filters out results e.g. with 30meters variation
 */
const useAccurrateLocation = (accurracyWanted, accurracyWaitTime) => {
  const [accuracy, setAccuracy] = useState(0)
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [error, setError] = useState('')

  useEffect(() => {
    if (navigator.geolocation) {
      let timeout
      const geoId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setAccuracy(position.coords.accuracy)

          if (accurracyWanted == null || position.coords.accuracy < accurracyWanted) {
            setError('')
            setLocation({ lat, lng })
          }
        },
        (e) => {
          setError(e.message)
          setTimeout(() => setError(''), 3000)
        },
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
      )
      if (accurracyWanted && accurracyWaitTime) {
        timeout = setTimeout(() => {
          if (!accuracy || accuracy < accurracyWanted) {
            setError(`Haluttu paikannustarkkuus ei saavutettu, tarkkuus(${accuracy}`)
            setTimeout(() => setError(''), 3000)
          }
        }, accurracyWaitTime * 1000)
      }
      return () => {
        window.navigator.geolocation.clearWatch(geoId)
        if (timeout) {
          clearTimeout(timeout)
        }
      }
    }
  }, [accurracyWaitTime, accurracyWanted])

  return [location, accuracy, error]
}

export { useAccurrateLocation }

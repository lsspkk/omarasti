import { useState, useEffect } from 'react'
import { simulation } from './location'

// device orientation
// https://developer.mozilla.org/en-US/docs/Web/Events/Detecting_device_orientation
const useDeviceOrientation = () => {
  const [deviceOrientation, setDeviceOrientation] = useState<{ available: boolean; alpha?: number }>({
    available: false,
    alpha: undefined,
  })
  const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout | undefined>()
  const [counter, setCounter] = useState(0)

  function handleDeviceOrientation(event) {
    if (typeof event.alpha === 'number') {
      const newAlpha = Math.round(event.alpha)
      newAlpha !== deviceOrientation.alpha && setDeviceOrientation({ alpha: event.alpha, available: true })
    }
  }

  useEffect(() => {
    if (!simulation) {
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true)

      return () => {
        window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation)
      }
    }
    const newCounter = Math.random() < 0.5 ? -10 : 10
    const handle = setTimeout(() => setCounter(newCounter), 100)
    setTimeoutHandle(handle)
    return () => clearTimeout(timeoutHandle)
  }, [])

  useEffect(() => {
    if (counter == 0) {
      const newCounter = Math.random() < 0.5 ? -10 : 10
      const handle = setTimeout(() => setCounter(newCounter), 100)
      setTimeoutHandle(handle)
    } else {
      const change = (counter > 0 ? 1 : -1) * Math.random() * 10
      const newCounter = counter > 0 ? counter - 1 : counter + 1
      const alpha = deviceOrientation.available === false ? Math.random() * 360 : deviceOrientation.alpha + change
      setDeviceOrientation({ available: true, alpha })
      const handle = setTimeout(() => setCounter(newCounter), 100)
      setTimeoutHandle(handle)
    }
  }, [counter])

  return deviceOrientation
}

export { useDeviceOrientation }

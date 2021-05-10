import { useState, useEffect } from 'react'

// device orientation
// https://developer.mozilla.org/en-US/docs/Web/Events/Detecting_device_orientation
const useDeviceOrientation = () => {
    const [deviceOrientation, setDeviceOrientation] = useState({available: false, alpha: undefined});
  
    function handleDeviceOrientation(event) {
      if (event?.alpha === number) {

        const newAlpha = Math.round(event.alpha)
        newAlpha !== deviceOrientation.alpha && setDeviceOrientation({alpha: (360 - event.alpha), available: true})
      }
    }
  
    useEffect(() => {
      window.addEventListener('deviceorientationabsolute', handleDeviceOrientation, true)
  
      return () => {
        window.removeEventListener('deviceorientationabsolute', handleDeviceOrientation)
      };
    }, [])
  
    return deviceOrientation
  }
  
  export { useDeviceOrientation }
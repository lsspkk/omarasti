import { useState, useEffect } from 'react'

// device orientation
// https://developer.mozilla.org/en-US/docs/Web/Events/Detecting_device_orientation
const useDeviceOrientation = () => {
    const [deviceOrientation, setDeviceOrientation] = useState({available: false, alpha: undefined});
  
    function handleDeviceOrientation(event) {
      if (event.absolute) {
        setDeviceOrientation({alpha: event.alpha, available: true})
      }
    }
  
    useEffect(() => {
      window.addEventListener('deviceorientation', handleDeviceOrientation, true)
  
      return () => {
        window.removeEventListener('deviceorientation', handleDeviceOrientation)
      };
    }, [])
  
    return deviceOrientation
  }
  
  export { useDeviceOrientation }
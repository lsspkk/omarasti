import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'

const CustomRastiMarker = () => {
  return (
    <svg width='50' height='50' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='50' cy='50' r='45' stroke='#FA923B' stroke-width='5' />
    </svg>
  )
}

export const RastiMarker = ({ position }) => {
  const iconMarkup = renderToStaticMarkup(<CustomRastiMarker />)
  const customMarkerIcon = divIcon({
    html: iconMarkup
  })
  console.log(position.latlng)
  return (
    <Marker
      position={position}
      icon={customMarkerIcon}
    >
      <Popup>lat: {position.lat},<br />lng: {position.lng}</Popup>
    </Marker>
  )
}

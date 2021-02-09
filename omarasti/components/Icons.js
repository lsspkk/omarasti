import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'

export const MARKER_SIZE = 50

const CustomRastiMarker = () => {
  return (
    <svg style={{position:'relative', marginLeft:"-20px", marginTop: "-20px"}} 
      width={MARKER_SIZE} height={MARKER_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='45' stroke='#FA923B' strokeWidth='10' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='40' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

export const RastiMarker = ({ position }) => {
  const iconMarkup = renderToStaticMarkup(<CustomRastiMarker />)
  const customMarkerIcon = divIcon({
    html: iconMarkup
  })
  return (
    <Marker
      position={position}
      icon={customMarkerIcon}
    >
      <Popup>lat: {position.lat},<br />lng: {position.lng}</Popup>
    </Marker>
  )
}

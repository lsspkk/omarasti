import { Marker } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'

export const PERSON_SIZE = 50

const PersonSvg = ({color}) => {
  const strokeColor = color !== undefined ? color : '#3B32AB'
  return (
    <svg style={{ position: 'relative', marginLeft: "-20px", marginTop: "-20px" }}
      width={PERSON_SIZE} height={PERSON_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={PERSON_SIZE} cy={PERSON_SIZE} r='10' stroke={strokeColor} strokeWidth='40' />
      <circle cx={PERSON_SIZE} cy={PERSON_SIZE} r='10' stroke='#ffffff' strokeWidth='5' />
    </svg>
  )
}

export const PersonMarker = ({ latlng , color}) => {
  const iconMarkup = renderToStaticMarkup(<PersonSvg color={color}/>)
  const customMarkerIcon = divIcon({ html: iconMarkup })
  
  if( !latlng ) return (<></>)
  return (<Marker position={latlng} icon={customMarkerIcon} />)
}

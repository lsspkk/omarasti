import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { positionsState, designModeState } from './DesignMenu'
import { useRecoilState, } from 'recoil'

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
  const [mode] = useRecoilState(designModeState)
  const [positions, setPositions] = useRecoilState(positionsState)
  const iconMarkup = renderToStaticMarkup(<CustomRastiMarker />)
  const customMarkerIcon = divIcon({
    html: iconMarkup
  })

  const onClick = () => {
    console.log(mode)
    mode === 'remove' && setPositions(positions.filter(p => !p.equals(position)))
  }

  const onDragend = (e) => {
    const i = positions.indexOf(position)
    console.log(position, e.target._latlng)

    const newPositions = [...positions.slice(0,i), e.target._latlng, ...positions.slice(i+1)]
    setPositions(newPositions)
  }

  return (
    <Marker
      position={position}
      icon={customMarkerIcon}
      draggable={mode === 'move' ? true : false}
      eventHandlers={{click: onClick, dragend: onDragend}}
    >
      { mode === 'add' &&
         <Popup>lat: {position.lat},<br />lng: {position.lng}</Popup>
      }
    </Marker>
  )
}

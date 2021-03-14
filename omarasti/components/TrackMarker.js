import { useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { designModeState } from './DesignMenu'
import { useRecoilState, } from 'recoil'
import { trackState } from '../pages/track.js'
import { Button } from './Buttons'

export const MARKER_SIZE = 50

const CustomRastiMarker = () => {
  return (
    <svg style={{ position: 'relative', marginLeft: "-20px", marginTop: "-20px" }}
      width={MARKER_SIZE} height={MARKER_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='45' stroke='#FA923B' strokeWidth='10' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='40' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

export const TrackMarker = ({ marker, published }) => {
  const [track, setTrack] = useRecoilState(trackState)
  const [mode] = useRecoilState(designModeState)
  const [description, setDescription] = useState(marker.description)
  const iconMarkup = renderToStaticMarkup(<CustomRastiMarker />)
  const customMarkerIcon = divIcon({
    html: iconMarkup
  })

  const onClick = () => {
    if (mode === 'remove') {
      const markers = track.markers.filter(p => p.latlng.lat !== marker.latlng.lat || p.latlng.lng !== marker.latlng.lng)
      setTrack({ ...track, markers })
    }
  }
  const onDragend = (e) => {
    //console.log(position, e.target._latlng)
    const newMarker = { ...marker, latlng: e.target._latlng }
    updateMarkers(newMarker)
  }
  const updateMarkers = (newMarker) => {
    const i = track.markers.findIndex(p => p.latlng === marker.latlng)
    const markers = [...track.markers.slice(0, i), newMarker, ...track.markers.slice(i + 1)]
    setTrack({ ...track, markers })
  }

  const updateDescription = () => updateMarkers({ ...marker, description })

  const initMarker = useRef()
  return (
    <Marker
      position={marker.latlng}
      icon={customMarkerIcon}
      draggable={mode === 'move' ? true : false}
      eventHandlers={{ click: onClick, dragend: onDragend }}
      ref={initMarker}
      onClose={() => updateDescription()}
    >
      { mode !== 'remove' &&
        <Popup autoClose={false}>

          <div className="flex">

            <label>Rastikuvaus:</label>
            {published && <div>{marker.description}</div>}
            {!published && <input value={description} onChange={(e) => setDescription(e.target.value)} />}

          </div>
          <div className="flex">
            <div>
              <label>lat: {marker.latlng.lat}</label><br />
              <label>lng: {marker.latlng.lng}</label>
            </div>
            <Button onClick={() => initMarker.current._map.closePopup()}>OK</Button>
          </div>
        </Popup>
      }
    </Marker>
  )
}

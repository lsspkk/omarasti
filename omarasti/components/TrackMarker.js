import { useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { designModeState } from './DesignMenu'
import { useRecoilState, } from 'recoil'
import { trackState } from '../pages/track.js'
import { Button } from './Buttons'

const MARKER_SIZE = 50

const CustomTrackMarker = () => {
  return (

    <svg style={{ position: 'relative', marginLeft: "-20px", marginTop: "-20px" }}
      width={MARKER_SIZE} height={MARKER_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='45' stroke='#FA923B' strokeWidth='10' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='40' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

const FinishMarker = () => {
  return (

    <svg style={{ position: 'relative', marginLeft: "-20px", marginTop: "-20px" }}
      width={MARKER_SIZE} height={MARKER_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='39' stroke='#FA923B' strokeWidth='5' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='48' stroke='#FA923B' strokeWidth='5' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='37' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='41' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='47' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

const StartMarker = ({angle}) => {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{transformBox: 'fill-box', transformOrigin: 'center 50%', transform: `rotate(${Math.round(angle)}deg)`, margin: '-26px 0 0 -26px'}}>
    <g filter="url(#filter0_d)">
    <path d="M7.57278 43L30.5 3.96195L53.4272 43H7.57278Z" stroke="#FA923B" strokeWidth="3"/>
    <path d="M10.1484 42.25L30.5 7L50.8516 42.25H10.1484Z" stroke="black" strokeOpacity="0.2"/>
    <path d="M4.95948 44.5L30.5 0.987732L56.0405 44.5H4.95948Z" stroke="black" strokeOpacity="0.2"/>
    </g>
    <defs>
    <filter id="filter0_d" x="0.0862274" y="0" width="60.8275" height="53" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
    </filter>
    </defs>
    </svg>


  )
}


const TrackMarker = ({ marker, published, index, isLastMarker, angle }) => {
  const [track, setTrack] = useRecoilState(trackState)
  const [mode] = useRecoilState(designModeState)
  const [description, setDescription] = useState(marker.description)

  const startIcon = renderToStaticMarkup(<StartMarker angle={angle}/>)
  const startHtml = `<span style="">${startIcon}</span>`

  const finishIcon = renderToStaticMarkup(<FinishMarker/>)
  const finishHtml = `<span style="">${finishIcon}</span>`

  const markerIcon = renderToStaticMarkup(<CustomTrackMarker />)
  const number = (index > 0 && !isLastMarker) ? index : ''
  const markerHtml = `<span class="track-marker-number">${number}</span>${markerIcon}`

  const html = index == 0 ? startHtml : isLastMarker ? finishHtml : markerHtml
  const customMarkerIcon = divIcon({ html })

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

export { MARKER_SIZE, TrackMarker, StartMarker, FinishMarker }
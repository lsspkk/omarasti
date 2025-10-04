import { useRef, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { designModeState } from './DesignMenu'
import { useRecoilState } from 'recoil'
import { trackState } from '../models/state'
import MarkerPopup from './MarkerPopup'

const MARKER_SIZE = 50

const CustomTrackMarker = () => {
  return (
    <svg
      style={{ position: 'relative', marginLeft: '-20px', marginTop: '-20px' }}
      width={MARKER_SIZE}
      height={MARKER_SIZE}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='45' stroke='#fa4362' strokeWidth='10' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='40' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

const FinishMarker = () => {
  return (
    <svg
      style={{ position: 'relative', marginLeft: '-20px', marginTop: '-20px' }}
      width={MARKER_SIZE}
      height={MARKER_SIZE}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='39' stroke='#fa4362' strokeWidth='5' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='48' stroke='#fa4362' strokeWidth='5' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='37' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='41' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='47' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

const StartMarker = ({ angle }) => {
  return (
    <svg
      width='60'
      height='60'
      viewBox='0 0 60 60'
      fill='none'
      style={{
        transformBox: 'fill-box',
        transformOrigin: 'center 50%',
        transform: `rotate(${Math.round(angle)}deg)`,
        margin: '-26px 0 0 -26px',
      }}
    >
      <g>
        <path d='M7.57278 43L30.5 3.96195L53.4272 43H7.57278Z' stroke='#fa4362' strokeWidth='4' />
        <path d='M10.1484 42.25L30.5 7L50.8516 42.25H10.1484Z' stroke='black' strokeOpacity='0.2' />
        <path d='M4.95948 44.5L30.5 0.987732L56.0405 44.5H4.95948Z' stroke='black' strokeOpacity='0.2' />
      </g>
    </svg>
  )
}

const TrackMarker = ({
  marker,
  published,
  index,
  isLastMarker,
  angle,
}: {
  marker: { latlng: { lat: number; lng: number }; description: string; visibility?: number }
  published: boolean
  index: number
  isLastMarker: boolean
  angle: number
}) => {
  const [track, setTrack] = useRecoilState(trackState)
  const [mode] = useRecoilState(designModeState)
  const [description, setDescription] = useState(marker.description)
  const [visibility, setVisibility] = useState(marker.visibility ?? 50)

  const startIcon = renderToStaticMarkup(<StartMarker angle={angle} />)
  const startHtml = `<span style="">${startIcon}</span>`

  const finishIcon = renderToStaticMarkup(<FinishMarker />)
  const finishHtml = `<span style="">${finishIcon}</span>`

  const markerIcon = renderToStaticMarkup(<CustomTrackMarker />)
  const number = index > 0 && !isLastMarker ? index : ''
  const markerHtml = `<span class="track-marker-number">${number}</span>${markerIcon}`

  const html = index == 0 ? startHtml : isLastMarker ? finishHtml : markerHtml
  const customMarkerIcon = divIcon({ html })

  const onClick = () => {
    if (mode === 'remove') {
      const markers = track.markers.filter(
        (p) => p.latlng.lat !== marker.latlng.lat || p.latlng.lng !== marker.latlng.lng
      )
      setTrack({ ...track, markers })
    }
  }
  const onDragend = (e: L.DragEndEvent) => {
    const ll = (e.target as L.Marker).getLatLng()
    const newMarker = { ...marker, latlng: { lat: ll.lat, lng: ll.lng } }
    updateMarkers(newMarker)
  }
  const updateMarkers = (newMarker: typeof marker) => {
    const i = track.markers.findIndex((p) => p.latlng.lat === marker.latlng.lat && p.latlng.lng === marker.latlng.lng)
    const markers = [...track.markers.slice(0, i), newMarker, ...track.markers.slice(i + 1)]
    setTrack({ ...track, markers })
  }

  const updateMarkerData = () => {
    updateMarkers({ ...marker, description, visibility })
  }

  const markerRef = useRef<L.Marker | null>(null)

  return (
    <Marker
      position={marker.latlng}
      icon={customMarkerIcon}
      draggable={mode === 'move'}
      eventHandlers={{ click: onClick, dragend: onDragend }}
      ref={markerRef}
    >
      {mode !== 'remove' && (
        <Popup
          autoClose={false}
          eventHandlers={{
            popupclose: () => updateMarkerData(),
          }}
        >
          <MarkerPopup
            description={description}
            visibility={visibility}
            latlng={marker.latlng}
            published={published}
            onDescriptionChange={setDescription}
            onVisibilityChange={setVisibility}
            onClose={() => markerRef.current?.closePopup()}
            markerIndex={index}
          />
        </Popup>
      )}
    </Marker>
  )
}

export { MARKER_SIZE, TrackMarker, StartMarker, FinishMarker }

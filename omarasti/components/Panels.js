import { angleInDegrees } from '../utils/location'
import { Button } from './Buttons'

export const MARKER_SIZE = 200

const Compass = () => {
  return (
    <svg style={{ position: 'relative', marginLeft: "0px", marginTop: "0px" }}
      width={MARKER_SIZE} height={MARKER_SIZE} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='45' stroke='#FA923B' strokeWidth='10' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r='40' stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
      <circle cx={MARKER_SIZE} cy={MARKER_SIZE} r={MARKER_SIZE} stroke='rgba(0,0,0,0.5)' strokeWidth='1' />
    </svg>
  )
}

export const SeeMarkerPanel = ({ location, marker, isLastMarker, markerNumber }) => {

  const direction = angleInDegrees(location.latlng, marker.latlng)
  const title = isLastMarker ? 'Maali näkyy' : `Rasti ${markerNumber} näkyy`
  return (
    <div className="w-200 h-200 p-10 flex flex-col">

      <h1 className="w-200">{title}</h1>
      <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
      <div className="w-100">Suunta: {Math.trunc(direction)} astetta</div>
      <h1 className="w-200">Rastikuvaus:</h1>
      <div className="w-200">{marker.description === '' ? '-' : marker.description}</div>
    </div>
  )
}

export const TouchMarkerPanel = ({touchMarker, marker, markerNumber}) => {
  return (
    <div className="w-200 h-200 p-10 flex flex-col">

      <h1 className="w-200">Olet rastilla {markerNumber}</h1>
      <h1 className="w-200">Rastikuvaus:</h1>
      <div className="w-200">{marker.description === '' ? '-' : marker.description}</div>
      <div className="w-200"><Button onClick={() => touchMarker()}>Leimaa rasti</Button></div>
    </div>
  )
}

export const SeeFinishPanel = ({finishRun}) => {
  return (
    <div className="w-200 h-200 p-10 flex flex-col">

      <h1 className="w-200">Olet maalissa</h1>
      <div className="w-200"><Button onClick={() => finishRun()}>Päätä suunnistus</Button></div>
    </div>
  )
}
import { angleInDegrees } from '../utils/location'
import { Button } from './Buttons'
import { Compass } from "./Compass"

export const MARKER_SIZE = 200

export const SeeMarkerPanel = ({ location, marker, markerNumber }) => {

  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <div className="p-10 ">

      <h1 className="w-200">Rasti näkyy</h1>
      <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
      <div className="w-100">Suunta: {direction} astetta</div>
      { marker.description !== '' && <>
        <h1 className="w-200">Rastikuvaus:</h1>
        <div className="w-200">{marker.description}</div>
      </>
      }
      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
        <Compass angle={direction} />
      </div>
    </div>
  )
}

export const TouchMarkerPanel = ({ touchMarker, marker, markerNumber }) => {
  return (
    <div className="w-200 h-200 p-10 flex flex-col">

      <h1 className="w-200">Olet rastilla {markerNumber}</h1>
      <h1 className="w-200">Rastikuvaus:</h1>
      <div className="w-200">{marker.description === '' ? '-' : marker.description}</div>
      <div className="w-200"><Button onClick={() => touchMarker()}>Leimaa rasti</Button></div>
    </div>
  )
}

export const SeeFinishPanel = ({ location, marker }) => {
  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <div className="p-10 ">

      <h1 className="w-200">Maali näkyy</h1>
      <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
      <div className="w-100">Suunta: {direction} astetta</div>
      <div style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
        <Compass angle={direction} />
      </div>
    </div>
  )

}

export const InFinishPanel = ({ finishRun }) => {
  return (
    <div className="w-200 h-200 p-10 flex flex-col">

      <h1 className="w-200">Olet maalissa</h1>
      <div className="w-200"><Button onClick={() => finishRun()}>Päätä suunnistus</Button></div>
    </div>
  )
}
import { trackState } from '../models/state'
import { angleInDegrees } from '../utils/location'
import { Button } from './Buttons'
import { Compass } from "./Compass"

export const MARKER_SIZE = 200

export const SeeMarkerPanel = ({ location, marker, markerNumber }) => {

  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <div className="w-full p-10 flex flex-col md:flex-row justify-between">
      <div>
        <Compass angle={direction} />
      </div>

      <div className="flex flex-col mr-20 justify-start mt-20 md:mt-0">
        <h1 className="w-200">Rasti näkyy</h1>
        {marker.description !== '' && <>
          <h3 className="w-200">Rastikuvaus:</h3>
          <div className="w-200">{marker.description}</div>
        </>

        }
        <div className="w-100">Suunta: {direction} astetta</div>
        <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
      </div>
    </div>
  )
}

export const TouchMarkerPanel = ({ touchMarker, track, markerNumber }) => {
  const marker = track.markers[markerNumber - 1]
  return (
    <div className="w-full p-10 flex flex-col md:flex-row justify-between">

      <div className='w-80 mr-10'>
        <img src='/logo.svg' alt='RastiLippu' className='w-80' />
        <div className='relative  mt-2 bold opacity-5 '
          style={{ top: '-160px', right: '20px', textAlign: 'right', width: '200px' }}>
          <span className='text-sm mr-3 inline-block'>{track.name}<br /> </span>
          <br /> <span className='text-6xl'>{markerNumber}</span></div>
      </div>
      <div className="flex flex-col mr-20 justify-start">
        {marker.description !== '' && <>
          <h1 className="w-200">Rastikuvaus:</h1>
          <div className="w-200">{marker.description}</div>
        </>
        }
        <h1>Olet rastilla</h1>
        <div className="flex justify-end">
          <Button className="w-30 p-3 mt-10" onClick={() => touchMarker()}>Leimaa</Button></div>
      </div>
    </div>
  )
}

export const SeeFinishPanel = ({ location, marker }) => {
  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <div className="w-full p-10 flex flex-col md:flex-row justify-between">
      <div>
        <Compass angle={direction} />
      </div>
      <div className="flex flex-col mr-20 justify-start">
        <h1 className="w-200">Maali näkyy</h1>
        <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
        <div className="w-100">Suunta: {direction} astetta</div>
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
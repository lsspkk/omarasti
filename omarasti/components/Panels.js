import { PromiseProvider } from 'mongoose'
import { trackState } from '../models/state'
import { angleInDegrees } from '../utils/location'
import { Button } from './Buttons'
import { Compass } from "./Compass"

export const MARKER_SIZE = 200

const Panel = ({ children }) => {
  return (
    <div className="container pl-20 flex flex-col md:flex-row justify-between absolute top-0 mt-16 sm:mt-20  items-start" style={{ zIndex: '1000' }}>
      {children}
    </div>
  )
}

export const SeeMarkerPanel = ({ location, marker, markerNumber }) => {

  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <Panel>
      <div className="shadow-xl mb-20" style={{ background: 'rgba(255,255,255,0.7)' }}>
        <Compass angle={direction} />
      </div>

      <div className="flex flex-col mr-20 justify-start mt-16 bg-white p-4 shadow-xl">
        <h1 className="w-200">Rasti näkyy</h1>
        {marker.description !== '' && <>
          <h3 className="w-200">Rastikuvaus:</h3>
          <div className="w-200">{marker.description}</div>
        </>

        }
        <div className="w-100">Suunta: {direction} astetta</div>
        <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
      </div>
    </Panel>
  )
}

export const TouchMarkerPanel = ({ touchMarker, track, markerNumber }) => {
  const marker = track.markers[markerNumber - 1]
  return (
    <Panel>

      <div className='w-80 mr-10 mb-20'>
        <img src='/logo.svg' alt='RastiLippu' className='w-80 shadow-xl' />
        <div className='relative  mt-2 bold opacity-5 '
          style={{ top: '-160px', right: '20px', textAlign: 'right', width: '200px' }}>
          <span className='text-sm mr-3 inline-block'>{track.name}<br /> </span>
          <br /> <span className='text-6xl'>{markerNumber}</span></div>
      </div>
      <div className="flex flex-col mr-20 mt-16 justify-start bg-white p-4 shadow-xl">
        {marker.description !== '' && <>
          <h1 className="w-200">Rastikuvaus:</h1>
          <div className="w-200">{marker.description}</div>
        </>
        }
        <h1 className="" style={{ textShadow: '0 0 2px #fff' }}>Olet rastilla</h1>
        <div className="flex justify-end">
          <Button className="w-30 p-3 mt-10 shadow-xl" onClick={() => touchMarker()}>Leimaa</Button></div>
      </div>
    </Panel>
  )
}

export const SeeFinishPanel = ({ location, marker }) => {
  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <Panel>
      <div className="shadow-xl mb-20" style={{ background: 'rgba(255,255,255,0.7)' }}>
        <Compass angle={direction} />
      </div>
      <div className="flex flex-col mr-20 mt-16 justify-start bg-white p-4 shadow-xl">
        <h1 className="w-200">Maali näkyy</h1>
        <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
        <div className="w-100">Suunta: {direction} astetta</div>
      </div>
    </Panel>
  )

}

export const InFinishPanel = ({ finishRun }) => {
  return (
    <div className="container h-7/8 p-10 flex flex-col absolute top-20 bg-white absolute top-0" style={{ zIndex: '1000' }}>

      <h1 className="w-200 bg-white">Olet maaliviivalla</h1>
      <div className="w-200"><Button onClick={() => finishRun()}>Saavu maaliin</Button></div>
    </div>
  )
}
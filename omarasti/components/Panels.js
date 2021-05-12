import { angleInDegrees } from '../utils/location'
import { Button } from './Buttons'
import { Compass } from "./Compass"

export const MARKER_SIZE = 200

const Panel = ({ position, children }) => {

  let cName = 'top-0 mt-16 sm:mt-20'
  if (position === 'bottom')
    cName = 'bottom-0 p-4 mb-12 sm:mb-20 bg-white shadow-xl'

  return (
    <div className={`absolute right-0 mr-2 sm:mr-10 ${cName} ml-2 sm:ml-20 items-start`} style={{ zIndex: '1000' }}>
      {children}
    </div>
  )
}

const ShowOrientationPanel = () => {

  return (
      <Panel>
          <Compass cName='w-40 h-40 sm:w-auto'/>
      </Panel>
  )
}


const SeeMarkerPanel = ({ location, marker, markerNumber }) => {

  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <>
      <Panel>
        <div className="shadow-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
          <Compass angle={direction} closeToMarker={true} cName='w-40 h-40 sm:w-auto'/>
        </div>
      </Panel>
      <Panel position="bottom">

        <div className="flex flex-col mr-20 justify-start">
          <h1 className="w-200">Rasti {markerNumber} näkyy</h1>
          {marker.description !== '' && <>
            <h3 className="">Rastikuvaus:</h3>
            <div className="">{marker.description}</div>
          </>

          }
          <div className="w-100">Suunta: {direction} astetta</div>
          <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
        </div>
      </Panel>
    </>
  )
}

const TouchMarkerPanel = ({ touchMarker, track, markerNumber }) => {
  const marker = track.markers[markerNumber - 1]
  return (
    <>
      <Panel>

        <div className=''>
          <img src='/logo.svg' alt='RastiLippu' className='w-80 shadow-xl' />
          <div className='relative  mt-2 bold opacity-5 '
            style={{ top: '-160px', right: '20px', textAlign: 'right', width: '200px' }}>
            <span className='text-sm mr-3 inline-block'>{track.name}<br /> </span>
            <br /> <span className='text-6xl'>{markerNumber}</span></div>
        </div>
      </Panel>
      <Panel position={"bottom"}>
        <div className="w-40">
          {marker.description !== '' && <>
            <h1 className="">Rastikuvaus:</h1>
            <div className="">{marker.description}</div>
          </>
          }
          <h1 className="" style={{ textShadow: '0 0 2px #fff' }}>Olet rastilla {markerNumber}</h1>
          <div className="flex justify-end">
            <Button className="w-30 p-3 mt-5 shadow-xl" onClick={() => touchMarker()}>Leimaa</Button></div>
        </div>
      </Panel>
    </>
  )
}

const SeeFinishPanel = ({ location, marker }) => {
  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <>
      <Panel>
        <div className="shadow-xl mb-20" style={{ background: 'rgba(255,255,255,0.7)' }}>
          <Compass angle={direction} closeToMarker={true}/>
        </div>
      </Panel>
      <Panel position={"bottom"}>
          <h1 className="w-200">Maali näkyy</h1>
          <div className="w-100">Etäisyys: {Math.trunc(location.distance)}m</div>
          <div className="w-100">Suunta: {direction} astetta</div>
      </Panel>
    </>
  )

}

const InFinishPanel = ({ finishRun }) => {
  return (
    <Panel position={"bottom"}>
       <h1 className="">Olet maaliviivalla!</h1>
        <div className=""><Button onClick={() => finishRun()}>Saavu maaliin</Button></div>
    </Panel>
  )
}

export { ShowOrientationPanel, SeeMarkerPanel, SeeFinishPanel, TouchMarkerPanel, InFinishPanel }
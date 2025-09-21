import { angleInDegrees, simulation } from '../utils/location'
import { Button } from './Buttons'
import { Compass } from './Compass'

export const MARKER_SIZE = 200

const Panel = ({ position, children }: { position?: 'top' | 'bottom'; children?: React.ReactNode }) => {
  const pos = position === 'bottom' ? 'bottom-0 mb-12 sm:mb-20 bg-white/90 shadow-xl m-4' : 'top-0 mt-16 sm:mt-20'

  return (
    <div className={`fixed ${pos} left-0 right-0 z-[1000] px-2 sm:px-20`}>
      <div className='mx-auto max-w-full overflow-hidden rounded-lg'>{children}</div>
    </div>
  )
}

const ShowOrientationPanel = () => {
  return (
    <Panel>
      <div className='p-3'>
        <Compass cName='w-40 h-40 sm:w-auto absolute right-1 top-0' angle={0} />
      </div>
    </Panel>
  )
}

const SeeMarkerPanel = ({ location, marker, markerNumber }) => {
  const direction = Math.trunc(angleInDegrees(location.latlng, marker.latlng))
  return (
    <>
      <Panel>
        <Compass angle={direction} closeToMarker cName='w-40 h-40 absolute right-1 top-1 sm:w-auto bg-white/80 p-2' />
      </Panel>
      <Panel position='bottom'>
        <div className='flex flex-col justify-start p-4'>
          <h1>Rasti {markerNumber} näkyy</h1>
          {marker.description !== '' && (
            <>
              <h3>Rastikuvaus:</h3>
              <div>{marker.description}</div>
            </>
          )}
          <div>Suunta: {direction} astetta</div>
          <div>Etäisyys: {Math.trunc(location.distance)}m</div>
        </div>
      </Panel>
    </>
  )
}

const TouchMarkerPanel = ({ touchMarker, track, markerNumber }) => {
  //if (simulation) setTimeout(() => touchMarker(), 2500)
  const marker = track.markers[markerNumber - 1]
  return (
    <>
      <Panel>
        <div className='p-3 flex justify-end w-full relative'>
          <div className='relative'>
            <img src='/logo.svg' alt='RastiLippu' className='w-[50vw] max-h-[50vh] shadow-xl' />
            {/* Marker number in center of logo */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <span className='text-8xl font-bold text-black/50  drop-shadow-lg'>{markerNumber}</span>
            </div>
            {/* Track name at bottom of logo */}
            <div className='absolute bottom-4 left-0 right-0 text-center'>
              <span className='text-sm font-medium text-black/30 drop-shadow-md px-2 py-1 rounded'>{track.name}</span>
            </div>
          </div>
        </div>
      </Panel>
      <Panel position='bottom'>
        <div className='p-4'>
          {marker.description !== '' && (
            <>
              <h1>Rastikuvaus:</h1>
              <div>{marker.description}</div>
            </>
          )}
          <h1 style={{ textShadow: '0 0 2px #fff' }}>Olet rastilla {markerNumber}</h1>
          <div className='flex justify-end'>
            <Button className='w-30 p-3 mt-5 shadow-xl' onClick={() => touchMarker()}>
              Leimaa
            </Button>
          </div>
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
        <div className='p-3 shadow-xl mb-20 bg-white/70'>
          <Compass angle={direction} closeToMarker />
        </div>
      </Panel>
      <Panel position='bottom'>
        <div className='p-4'>
          <h1 className='w-full'>Maali näkyy</h1>
          <div>Etäisyys: {Math.trunc(location.distance)}m</div>
          <div>Suunta: {direction} astetta</div>
        </div>
      </Panel>
    </>
  )
}

const InFinishPanel = ({ finishRun }) => {
  if (simulation) setTimeout(() => finishRun(), 500)
  return (
    <Panel position='bottom'>
      <div className='p-4'>
        <h1>Olet maaliviivalla!</h1>
        <div>
          <Button onClick={() => finishRun()}>Saavu maaliin</Button>
        </div>
      </div>
    </Panel>
  )
}

export { ShowOrientationPanel, SeeMarkerPanel, SeeFinishPanel, TouchMarkerPanel, InFinishPanel }

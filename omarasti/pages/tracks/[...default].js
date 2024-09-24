import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout'
import { DesignMenu } from '../../components/DesignMenu'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ViewMenu } from '../../components/ViewMenu'
import { RunMenu } from '../../components/RunMenu'
import { useRecoilState } from 'recoil'
import { runState, trackState } from '../../models/state'
import { getCoordinates, distance, getLocation, INTERVALS } from '../../utils/location'
import {
  ShowOrientationPanel,
  SeeFinishPanel,
  SeeMarkerPanel,
  TouchMarkerPanel,
  InFinishPanel,
} from '../../components/Panels'
import { useAccurrateLocation } from '../../utils/useAccurrateLocation'

const DesignMap = dynamic(() => import('../../components/DesignMap'), { ssr: false })

const emptyLocationState = {
  canSeeMarker: false,
  canTouchMarker: false,
  latlng: { lat: -1, lng: -1 },
  distance: -1,
}
const TAMPERE = [61.5107, 23.7616]
const Design = ({ mapUrl }) => {
  const [run, setRun] = useRecoilState(runState)
  const [location, setLocation] = useState(emptyLocationState)
  const [track] = useRecoilState(trackState)
  const [myTimeout, setMyTimeout] = useState(-1)
  const [timer, setTimer] = useState('')
  const [accurrateLocation, accurracy, locationError] = useAccurrateLocation(30, 2) // 30m, 2s
  const [coordinates, setCoordinates] = useState(TAMPERE)

  const router = useRouter()

  async function updateRun() {
    // timer
    const now = new Date().getTime()
    const time = now - run.start.getTime()
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${minutes}m ${seconds}s`)

    // location
    const previousLatlng = location.latlng.lat === -1 ? track.markers[0].latlng : location.latlng
    let latlng
    if (locationError === '' && accurrateLocation.lat !== 0) {
      latlng = { ...accurrateLocation }
    } else {
      latlng = await getLocation(track.markers[run.targetMarker].latlng, previousLatlng)
    }

    const newRun = { ...run, currentLatlng: latlng }
    // every 10 seconds store the route in array
    if (run.routeMarkTime === undefined || now - run.routeMarkTime > INTERVALS.markRoute) {
      newRun.route = [...run.route, { latlng, timestamp: time }]
      newRun.routeMarkTime = now
    }
    setRun(newRun)
    const d = distance(latlng, track.markers[run.targetMarker].latlng)
    setLocation({ latlng, canSeeMarker: d < 100, canTouchMarker: d < 25, distance: d })
  }

  useEffect(() => {
    if (run && !run.end) {
      const timeout = window.setTimeout(() => updateRun(), INTERVALS.updateLocation)
      setMyTimeout(timeout)
      return () => clearTimeout(timeout)
    } else {
      setMyTimeout(-1)
      setTimer('')
    }
  }, [run, timer])

  useEffect(() => {
    if (track && track.markers.length > 0) {
      setCoordinates(() => track.markers[track.markers.length - 1].latlng)
    }
  }, [track])

  useEffect(() => {
    if (track && track.markers.length > 0) {
      setCoordinates(() => track.markers[track.markers.length - 1].latlng)
      return
    }
    getCoordinates()
      .then((position) => {
        setCoordinates([position.coords.latitude, position.coords.longitude])
      })
      .catch((error) => {
        console.log('No location:', error)
      })
  }, [])

  const stopRun = () => {
    if (myTimeout !== -1) clearTimeout(myTimeout)
    setMyTimeout(-1)
    setTimer('')
    setLocation(emptyLocationState)
    router.push('/tracks/run/stop')
  }

  const touchMarker = () => {
    const d = distance(location.latlng, track.markers[run.targetMarker + 1].latlng)
    setLocation({ ...location, canSeeMarker: d < 100, canTouchMarker: d < 20, distance: d })
    setRun({ ...run, markerTimes: [...run.markerTimes, new Date()], targetMarker: run.targetMarker + 1 })
  }

  const finishRun = () => {
    setLocation(emptyLocationState)
    const end = new Date()
    setTimer('')
    setRun({
      ...run,
      end,
      markerTimes: [...run.markerTimes, end],
      totalTime: end.getTime() - run.start.getTime(),
      route: [...run.route, { latlng: track.markers[run.targetMarker].latlng, timestamp: end.getTime() }],
    })
    router.push('/tracks/run/stop')
  }

  let menu = <ViewMenu />
  if (router.asPath === '/tracks/edit') {
    menu = <DesignMenu />
  } else if (run !== undefined) {
    menu = <RunMenu stopRun={stopRun} timer={timer} run={run} />
  }

  const isLastMarker = run?.targetMarker === track.markers.length - 1
  const mapCenter = coordinates

  return (
    <Layout map='true' menu={menu} hasRequiredData={track !== undefined}>
      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter} />
      {run !== undefined && (
        <>
          {!location.canTouchMarker && !location.canSeeMarker && <ShowOrientationPanel />}
          {!isLastMarker && location.canTouchMarker && (
            <TouchMarkerPanel touchMarker={touchMarker} track={track} markerNumber={run.targetMarker} />
          )}
          {!isLastMarker && !location.canTouchMarker && location.canSeeMarker && (
            <SeeMarkerPanel
              location={location}
              marker={track.markers[run.targetMarker]}
              markerNumber={run.targetMarker}
            />
          )}
          {isLastMarker && !location.canTouchMarker && location.canSeeMarker && (
            <SeeFinishPanel location={location} marker={track.markers[run.targetMarker]} />
          )}
          {isLastMarker && location.canTouchMarker && <InFinishPanel finishRun={finishRun} />}

          <div
            className='fixed bottom-0 left-0 p-1  bg-white xs:ml-10 md:ml-20'
            style={{ zIndex: '1000', fontSize: '0.5em' }}
          >
            GPS tarkkuus: {accurracy !== undefined ? Math.trunc(accurracy) : '-'}
            <br />
            Sijainti: {run.currentLatlng.lat} - {run.currentLatlng.lng}
          </div>
          {locationError !== '' && <span>{locationError}</span>}
        </>
      )}
    </Layout>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Design

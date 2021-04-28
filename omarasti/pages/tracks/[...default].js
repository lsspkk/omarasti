import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../components/Layout'
import { DesignMenu } from '../../components/DesignMenu'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ViewMenu } from '../../components/ViewMenu'
import { RunMenu } from '../../components/RunMenu'
import { useRecoilState, } from 'recoil'
import { runState, trackState } from '../../models/state'
import { distance, getLocation } from '../../utils/location'
import { SeeFinishPanel, SeeMarkerPanel, TouchMarkerPanel, InFinishPanel } from '../../components/Panels'
import { useAccurrateLocation } from '../../utils/useAccurrateLocation'

const DesignMap = dynamic(() => {
  return import('../../components/DesignMap')
}, { ssr: false })

const emptyLocationState = {
  canSeeMarker: false, 
  canTouchMarker: false,
  latlng: { lat: -1, lng: -1 },
  distance : -1
}


const Design = ({ mapUrl }) => {
  const [run, setRun] = useRecoilState(runState)
  const [session, loading] = useSession()
  const [location, setLocation] = useState(emptyLocationState)
  const [track] = useRecoilState(trackState)
  const [myTimeout, setMyTimeout] = useState(-1)
  const [timer, setTimer] = useState('')
  const [accurrateLocation, accurracy, locationError] = useAccurrateLocation(30, 2) // 30m, 2s

  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) { router.push('/'); return <div/> }



  async function updateRun() {
    // timer
    const now = new Date().getTime()
    const time = now - run.start.getTime()
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${(minutes)}m ${(seconds)}s`)

    // location
    const previousLatlng = location.latlng.lat === -1 ? track.markers[0].latlng : location.latlng
    let latlng = undefined
    if (locationError === '' && accurrateLocation.lat !== 0) {
      latlng = {...accurrateLocation } 
    }
    else {
      latlng = await getLocation(track.markers[run.targetMarker].latlng, previousLatlng)
    }

    let newRun = { ...run, currentLatlng: latlng }
    // every 10 seconds store the route in array
    if (run.routeMarkTime === undefined || now - run.routeMarkTime > 10000) {
      newRun.route = [...run.route, {latlng, timestamp: time}]
      newRun.routeMarkTime = now
    }
    setRun(newRun)
    const d = distance(latlng, track.markers[run.targetMarker].latlng)
    setLocation({latlng, canSeeMarker: d < 100, canTouchMarker: d < 25, distance: d})    
  }


  useEffect(() => {
    if (run && !run.end) {
      const timeout = window.setTimeout(() => updateRun(), 1000)
      setMyTimeout(timeout)
      return () => clearTimeout(timeout)
    }
    else {
      setMyTimeout(-1)
      setTimer('')
    }
  }, [run, timer])


  const stopRun = () => {
    if (myTimeout !== -1) clearTimeout(myTimeout)
    setMyTimeout(-1)
    setTimer('')
    setLocation(emptyLocationState)
    router.push('/tracks/run/stop')
  }


  const touchMarker = () => {
    const d = distance(location.latlng, track.markers[run.targetMarker+1].latlng)
    setLocation({...location, canSeeMarker: d < 100, canTouchMarker: d < 20, distance: d})
    setRun({...run, markerTimes: [...run.markerTimes, new Date()], targetMarker: run.targetMarker+1})

  }

  const finishRun = () => {
    setLocation(emptyLocationState)
    const end = new Date()
    setTimer('')
    setRun({...run, markerTimes: [...run.markerTimes, end], end, totalTime: (end.getTime() - run.start.getTime())})
    router.push('/tracks/run/stop')
  }


  // const showRoute = router.asPath === "/tracks/route" && (run !== undefined)
  const menu = router.asPath === "/tracks/edit" ? <DesignMenu /> : (run !== undefined ? <RunMenu stopRun={stopRun} timer={timer} /> : <ViewMenu />)

  const isLastMarker = run?.targetMarker === (track.markers.length - 1)
  let mapCenter = [61.504721, 23.825561]
  if (run !== undefined) mapCenter = track?.markers[run?.targetMarker-1].latlng
  else if (track !== undefined && track.markers.length > 0) mapCenter = track.markers[0].latlng

  return (
    <Layout menu={menu}>

      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter}/> 
      { run !== undefined && <>

        {
          !isLastMarker && location.canTouchMarker && 
          <TouchMarkerPanel touchMarker={touchMarker} track={track} markerNumber={run.targetMarker}/>
        }
        { !isLastMarker && !location.canTouchMarker && location.canSeeMarker && 
          <SeeMarkerPanel location={location} marker={track.markers[run.targetMarker]} markerNumber={run.targetMarker+1}/>
        }
        { isLastMarker && !location.canTouchMarker && location.canSeeMarker && 
          <SeeFinishPanel location={location} marker={track.markers[run.targetMarker]} /> 
        }
        { isLastMarker && location.canTouchMarker && 
          <InFinishPanel finishRun={finishRun}/> 
        }

        <div className="fixed bottom-0 left-0 p-1 text-xs bg-white xs:ml-10 md:ml-20"
         style={{zIndex: '1000'}}
        >
          GPS tarkkuus: { accurracy !== undefined ? Math.trunc(accurracy) : '-' }
          <br/>
          Sijainti: { run.currentLatlng.lat } - { run.currentLatlng.lng }
          </div>
          { locationError !== '' && <span>{locationError}</span> }
        </>
      }

    </Layout>
  )
}

export async function getServerSideProps() {
  //const mapUrl = 'https://xn--hyty-6qa.net/omarasti/{z}/{x}/{y}.png'
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Design
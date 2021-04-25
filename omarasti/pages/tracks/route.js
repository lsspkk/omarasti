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

const Route = ({ mapUrl }) => {
  const [run, setRun] = useRecoilState(runState)
  const [session, loading] = useSession()
  const [showRouteIndex, setShowRouteIndex] = useState(0)
  const [track] = useRecoilState(trackState)
  const [myTimeout, setMyTimeout] = useState(-1)
  const [timer, setTimer] = useState('')

  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) { router.push('/'); return <div/> }



  async function updateRoute() {
    const point = route[showRouteIndex]
    setShowRouteIndex(showRouteIndex+1)

    // timer
    const time = point.timestamp - run.start.getTime()
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${(minutes)}m ${(seconds)}s`)

    // location
    let latlng = point.latlng
    const d = distance(latlng, track.markers[run.targetMarker].latlng)
    setShowRouteIndex({latlng, canSeeMarker: d < 100, canTouchMarker: d < 25, distance: d})    
  }


  useEffect(() => {
    if (run && run.route && showRouteIndex < run.route.length) {
      const timeout = window.setTimeout(() => updateRoute(), 1000)
      setMyTimeout(timeout)
      return () => clearTimeout(timeout)
    }
    else {
      myTimeout !== -1 && clearTimeout(myTimeout)
      setMyTimeout(-1)
      setTimer('')
    }
  }, [run, timer])


  // const showRoute = router.asPath === "/tracks/route" && (run !== undefined)
  const menu =  (run !== undefined ? <RunMenu timer={timer} /> : <ViewMenu />)

  const isLastMarker = run?.targetMarker === (track.markers.length - 1)
  let mapCenter = [61.504721, 23.825561]
  if (run !== undefined) mapCenter = track?.markers[run?.targetMarker-1].latlng
  else if (track !== undefined && track.markers.length > 0) mapCenter = track.markers[0].latlng

  return (
    <Layout menu={menu}>

      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter} showRouteIndex={showRouteIndex} showRoute={true}/> 
    </Layout>
  )
}

export async function getServerSideProps() {
  //const mapUrl = 'https://xn--hyty-6qa.net/omarasti/{z}/{x}/{y}.png'
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Route
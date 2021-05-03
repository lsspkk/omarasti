import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../components/Layout'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { ViewMenu } from '../../components/ViewMenu'
import { RunMenu } from '../../components/RunMenu'
import { useRecoilState, } from 'recoil'
import { runState, trackState } from '../../models/state'
import { INTERVALS } from '../../utils/location'

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
  if (loading ) return <div>loading...</div>
  if (!session || !run) { router.push('/'); return <div/> }



  async function updateRoute() {
    const point = run.route[showRouteIndex]
    setShowRouteIndex(showRouteIndex+1)

    // timer
    const time = point.timestamp
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${(minutes)}m ${(seconds)}s`)
  }


  useEffect(() => {
    setTimer('')
    setShowRouteIndex(0)
  }, [run])

  useEffect(() => {
    if (run && run.route && showRouteIndex < run.route.length) {
      const timeout = window.setTimeout(() => updateRoute(), INTERVALS.drawRoute)
      setMyTimeout(timeout)
      return () => clearTimeout(timeout)
    }
    else {
      myTimeout !== -1 && clearTimeout(myTimeout)
      setTimer('')
      setMyTimeout(-1)
    }
  }, [run, showRouteIndex])

  const stopRun = () => {
    if (myTimeout !== -1) clearTimeout(myTimeout)
    setMyTimeout(-1)
    setTimer('')
    router.push('/tracks/run/stop')
  }

  const menu =  (run !== undefined ? <RunMenu stopRun={stopRun} timer={timer} /> : <ViewMenu />)

  let mapCenter = [61.504721, 23.825561]
  if (run !== undefined) mapCenter = track?.markers[run?.targetMarker-1].latlng
  else if (track !== undefined && track.markers.length > 0) mapCenter = track.markers[0].latlng

  return (
    <Layout map="true" menu={menu}>
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
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Layout } from '../../components/Layout'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { RunMenu } from '../../components/RunMenu'
import { useRecoilState } from 'recoil'
import { runState, trackState } from '../../models/state'
import { INTERVALS } from '../../utils/location'

const DesignMap = dynamic(
  () => {
    return import('../../components/DesignMap')
  },
  { ssr: false }
)

const Route = ({ mapUrl }) => {
  const [run] = useRecoilState(runState)
  const { data: session, status } = useSession()
  const [showRouteIndex, setShowRouteIndex] = useState(0)
  const [track] = useRecoilState(trackState)
  const [myTimeout, setMyTimeout] = useState(-1)
  const [timer, setTimer] = useState('')

  const router = useRouter()
  if (status === 'loading') return <div>loading...</div>
  if (!session || !run) {
    router.push('/')
    return <div />
  }

  async function updateRoute() {
    const point = run.route[showRouteIndex]
    setShowRouteIndex(showRouteIndex + 1)
    // timer
    const time = point.timestamp
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${minutes}m ${seconds}s`)
  }

  useEffect(() => {
    setTimer('')
    setShowRouteIndex(0)
  }, [run])

  useEffect(() => {
    if (run && run.route && showRouteIndex < run.route.length - 1) {
      const timeout = window.setTimeout(() => updateRoute(), INTERVALS.drawRoute)
      setMyTimeout(timeout)
      return () => clearTimeout(timeout)
    }
  }, [run, showRouteIndex])

  const stopRun = () => {
    if (myTimeout !== -1) clearTimeout(myTimeout)
    setMyTimeout(-1)
    setTimer('')
    router.push('/tracks/run/stop')
  }

  const menu = <RunMenu stopRun={stopRun} timer={timer} />
  const mapCenter = track?.markers[run?.targetMarker - 1].latlng

  return (
    <Layout map='true' menu={menu}>
      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter} showRouteIndex={showRouteIndex} showRoute />
    </Layout>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Route

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/client'
import { Layout } from '../../components/Layout'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { RunMenu } from '../../components/RunMenu'
import { useRecoilState, } from 'recoil'
import { resultState, routeColors, trackState } from '../../models/state'
import { INTERVALS } from '../../utils/location'

const DesignMap = dynamic(() => {
  return import('../../components/DesignMap')
}, { ssr: false })

const Route = ({ mapUrl }) => {
  const [results,] = useRecoilState(resultState)
  const [session, loading] = useSession()
  const [showRouteIndex, setShowRouteIndex] = useState(0)
  const [longestRun, setLongestRun] = useState({})
  const [track] = useRecoilState(trackState)
  const [myTimeout, setMyTimeout] = useState(-1)
  const [timer, setTimer] = useState('')

  const router = useRouter()
  if (loading ) return <div>loading...</div>
  if (!session || !results) { router.push('/'); return <div/> }


  async function updateRoute() {
    const point = longestRun.route[showRouteIndex]
    setShowRouteIndex(showRouteIndex+1)

    const time = point.timestamp
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${(minutes)}m ${(seconds)}s`)
  }

  useEffect(() => {
    setTimer('')
    if (results?.selected?.length > 1) {
      const routeLengths = results.selected.map(r => r.route.length)
      const longestRoute = Math.max(...routeLengths)
      const longestIndex = routeLengths.findIndex(r => r === longestRoute)
      setLongestRun(results.selected[longestIndex])
      setShowRouteIndex(0)
    }
  }, [results])


  useEffect(() => {

    if (results?.selected?.length > 1) {
      
      if (longestRun?.route !== undefined && showRouteIndex < (longestRun.route.length-1)) {
        const timeout = window.setTimeout(() => updateRoute(), INTERVALS.drawRoute)
        setMyTimeout(timeout)
        return () => clearTimeout(timeout)
      }
    }
    else {
      myTimeout !== -1 && clearTimeout(myTimeout)
      setTimer('')
      setMyTimeout(-1)
    }
  }, [results, showRouteIndex, longestRun])

  const stopRun = () => {
    if (myTimeout !== -1) clearTimeout(myTimeout)
    setLongestRun({})
    setMyTimeout(-1)
    setTimer('')
    router.push('/results')
  }

  const coloredRuns = results.selected.map((r,i) => ({...r, color: routeColors[i % routeColors.length]}))

  const compareRuns = [...coloredRuns].sort((a, b) => {
    if (a.totalTime === b.totalTime) return 0
    return (a.totalTime < b.totalTime) ? -1 : 1
  })

  const menu =  <RunMenu stopRun={stopRun} timer={timer} run={longestRun} compareRuns={compareRuns}/>
  const  mapCenter = track?.markers[0].latlng

  return (
    <Layout map="true" menu={menu}>
      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter} showRouteIndex={showRouteIndex} showRoute={true}/> 
    </Layout>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default Route
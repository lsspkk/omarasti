import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRecoilState, } from 'recoil'
import { resultState, trackState } from '../../models/state'
import { INTERVALS } from '../../utils/location'
import { demoResults, demoTrack } from './demodata'
import { Button } from '../../components/Buttons'
import { designModeState } from '../../components/DesignMenu'

const DesignMap = dynamic(() => {
  return import('../../components/DesignMap')
}, { ssr: false })


const TAMPERE = [61.5107, 23.7616]
const DemoRoute = ({ mapUrl }) => {
  const [results, setResults] = useRecoilState(resultState)
  const [showRouteIndex, setShowRouteIndex] = useState(0)
  const [longestRun, setLongestRun] = useState({})
  const [, setTrack] = useRecoilState(trackState)
  const [, setMyTimeout] = useState(-1)
  const [, setTimer] = useState('')
  const [, setMode] = useRecoilState(designModeState)

  const router = useRouter()

  async function updateRoute() {
    const point = longestRun.route[showRouteIndex]
    setShowRouteIndex(showRouteIndex + 1)

    const time = point.timestamp
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(() => `${(minutes)}m ${(seconds)}s`)
  }

  useEffect(() => {
    setTrack(demoTrack)
    setMode('view')
    window.setTimeout(() => start(), 500)
  },[])

  const start = async () => {
    await setResults({ selected: [...demoResults] })
    const routeLengths = demoResults.map(r => r.route.length)
    const longestRoute = Math.max(...routeLengths)
    const longestIndex = routeLengths.findIndex(r => r === longestRoute)
    await setLongestRun(demoResults[longestIndex])
    setShowRouteIndex(0)
  }


  useEffect(() => {
    if (results?.selected?.length > 1) {

      if (longestRun?.route !== undefined && showRouteIndex < (longestRun.route.length - 1)) {
        const timeout = window.setTimeout(() => updateRoute(), INTERVALS.drawRoute)
        setMyTimeout(timeout)
        return () => clearTimeout(timeout)
      }
    }
  }, [showRouteIndex, longestRun])


  const mapCenter = { lat: demoTrack.markers[2].latlng.lat, lng: demoTrack.markers[1].latlng.lng }

  return (
    <div>
      <div className="flex w-full justify-between items-center">
        <div className="justify-self-start" onClick={() => router.push('/')}>
          <div className='2-10 flex-none w-16 sm:w-30 md:mr-8 '>
            <img src='/logo.svg' alt='omaRasti' className='w-13 sm:w-20 sm:mt-2 sm:mb-2' />
            <span className='absolute top-0 mt-2 sm:mt-4 ml-2 bold opacity-5'>OMA<br />RASTI</span>
          </div>
        </div>

        <div className="mr-4">
          <Button onClick={() => start()}>Uusi startti!</Button>
          <Button className="ml-8" onClick={() => router.back()}>Takaisin</Button>
        </div>
      </div>

      <DesignMap mapUrl={mapUrl} mapCenter={mapCenter} showRouteIndex={showRouteIndex} showRoute={true} />
    </div>
  )
}

export async function getServerSideProps() {
  const mapUrl = process.env.TAMPERE_MAP_URL
  return { props: { mapUrl } }
}

export default DemoRoute
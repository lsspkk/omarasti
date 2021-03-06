import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { runState, trackState } from '../../../models/state'
import { totalDistance } from '../../../utils/location'
import { TrackDistance, RunDistance } from '../../../components/Distance'

function showTime(start, end) {
  if (!start || !end) return ''

  const time = end.getTime() - start.getTime()
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  const showMinutes = minutes !== 0 ? `${minutes}m` : ''
  return `${showMinutes} ${seconds}s`
}

const MarkerResult = ({ i, markerTime, run }) => {
  const [track] = useRecoilState(trackState)
  const markers = track.markers.slice(i, i + 2)
  const distance = totalDistance(markers)
  const startTime = i === 0 ? run.start : run.markerTimes[i-1]
  const speed = (distance/(markerTime-startTime)*1000*3.6).toFixed(2) +' km/h'

  return (
    <tr>
      <td className='text-left'>{i + 1}</td>
      <td className='text-left'>{showTime(startTime, markerTime)}</td>
      <td className='text-left'>{distance} m</td>
      <td className='text-left'>{speed}</td>
    </tr>
  )
}


const StopRun = () => {
  const [session, loading] = useSession()
  const [run, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) { router.push('/'); return <div /> }

  useEffect(() => {
    if (run && !run.end) {
      const ended = { ...run, end: new Date() }
      setRun(ended)
    }
  }, [run])


  function clear() {
    router.push('/tracks/view')
    setRun(undefined)
  }

  return (
    <Layout menu={<Button className="mr-4" onClick={() => clear()}>Takaisin</Button>}>
      <div className="container m-5 md:m-10 flex flex-col justify-between w-5/6">

        <div className="flex my-2">
          <h1>Rata:</h1>
          <h1 className="ml-5">{track.name}</h1>
        </div>
        <div className="flex mt-5">
          <TrackDistance markers={track.markers} />
        </div>
        <div className="flex mb-3">
          { run !== undefined && <RunDistance route={run.route} /> }
        </div>

        <div className="flex my-2">
          <h1 className="py-10">Aika: {run && showTime(run.start, run.end)}</h1>
        </div>


        {run && run?.markerTimes?.length > 0 &&
          <div>
            <table className="w-full md:w-1/2 ml-5 md:ml-20 mr-5">
              <tr>
                <th className='text-left w-1/6'>Rasti</th>
                <th className='text-left w-1/6'>Aika</th>
                <th className='text-left w-1/4'>Matka</th>
                <th className='text-left w-1/4'>Nopeus</th>
              </tr>
              {run.markerTimes.map((time, i) => <MarkerResult i={i} markerTime={time} run={run} />)}
            </table>
          </div>
        }
      </div>
      <div className="container flex justify-end w-full">
        <Button className="m-8" onClick={() => router.push('/tracks/route')}>Näytä reitti</Button>        
      </div>
    </Layout>
  )
}

export default StopRun
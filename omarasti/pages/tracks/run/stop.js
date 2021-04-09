import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { trackState } from '../../track'
import { runState } from './start'
import { totalDistance } from '../../../utils/location'

function showTime(start, end) {
  if (!start || !end) return ''

  const time = end.getTime() - start.getTime()
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  return `${(minutes)}m ${(seconds)}s`
}

const MarkerResult = ({ i, markerTime, run }) => {
  const [track] = useRecoilState(trackState)
  const markers=track.markers.slice(0, i+2)
  const distance = totalDistance(markers)

  return (
    <div className="flex w-full justify-between">
      <div className="text-3l">
        Rasti: {i + 1}
      </div>
      <div>
        Aika: {showTime(run.start, markerTime)}
      </div>
      <div>
        Matka: {distance}
      </div>
      <div>
      </div>
    </div>
  )
}


const StopRun = () => {
  const [session, loading] = useSession()
  const [run, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const router = useRouter()
  if (loading) return <div>loading...</div>
  if (!session || !track) router.push('/')

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
    <Layout menu={<div />}>
      <div className="container flex flex-col justify-between w-5/6">
          <h1 className="py-10">Aika {run && showTime(run.start, run.end)}</h1>
          <div className="flex">
            <label className="w-20">Pituus:</label>
            <div className="w-40">{totalDistance(track !== undefined ? track.markers : [])}</div>
          </div>
        <div>
          <h1 className="py-10">Rastiajat</h1>
          <div>
            {run && run.markerTimes && run.markerTimes.map((time, i) => <MarkerResult i={i} markerTime={time} run={run} />)}
          </div>
        </div>
      </div>
      <div className="container flex justify-center w-5/6">
        <Button className="m-8" onClick={() => clear()}>Takaisin</Button>
      </div>
    </Layout>
  )
}

export default StopRun
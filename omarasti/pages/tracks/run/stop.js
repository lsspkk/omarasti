import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { trackState } from '../../track'
import { runState } from './start'


function showTime(start, end) {
  if (!start || !end) return ''

  const time = end.getTime() - start.getTime()
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  return `${(minutes)}m ${(seconds)}s`
}

const MarkerResult = ({ i, marker, run }) => {
  return (
    <div className="flex">
      <div className="text-3l">
        {i + 1}
      </div>
      <div>
        Aika: {showTime(run.start, marker.time)}
      </div>
      <div>
        Matka: 1km
      </div>
      <div>
        Reitti: 2km
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
      <div className="container flex flex-col justify-between">
          <h1 className="py-10">Aika {run && showTime(run.start, run.end)}</h1>
          <div className="flex">
            <label className="w-20">Pituus:</label>
            <div className="w-40">{track?.length}</div>
          </div>
        <div>
          <h1 className="py-10">Rastiajat</h1>
          <div>
            {run && run.markers && run.markers.map((marker, i) => <MarkerResult i={i} marker={marker} run={run} />)}
          </div>
        </div>
      </div>
      <div className="container flex justify-center">
        <Button className="m-8" onClick={() => clear()}>Takaisin</Button>
      </div>
    </Layout>
  )
}

export default StopRun
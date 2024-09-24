import { useEffect, useState } from 'react'
import { Layout } from '../../../components/Layout'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { Button } from '../../../components/Buttons'
import { runState, trackState, resultState } from '../../../models/state'
import { userState } from '../../settings'
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
  const markers = track?.markers.slice(i, i + 2)
  const distance = totalDistance(markers)
  const startTime = i === 0 ? run.start : run.markerTimes[i - 1]
  const speed = ((distance / (markerTime - startTime)) * 1000 * 3.6).toFixed(1)

  return (
    <tr>
      <td className='text-center'>{i + 1}</td>
      <td className='text-center'>{showTime(startTime, markerTime)}</td>
      <td className='text-center'>{distance} m</td>
      <td className='text-center'>{speed}</td>
    </tr>
  )
}

const OldestResult = ({ run }) => {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const timestamp = new Date(run.start).toLocaleDateString('fi-FI', options)
  // todo show trackname, date, and totaltime
  return (
    <div className='text-sm text-gray-600'>
      <div>Pvm: {timestamp}</div>
      <div>Rata: {run?.track?.name}</div>
      <div>Tulos: {showTime(new Date(run.start), new Date(run.end))}</div>
    </div>
  )
}

const StopRun = () => {
  const [run, setRun] = useRecoilState(runState)
  const [track] = useRecoilState(trackState)
  const [results, setResults] = useRecoilState(resultState)
  const router = useRouter()
  const [userRuns, setUserRuns] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [message, setMessage] = useState('')
  const [user] = useRecoilState(userState)

  useEffect(() => {
    if (run && !run.end) {
      const ended = { ...run, end: new Date() }
      setRun(ended)
    }
    if (run && !isSaved) {
      fetch('/api/run/track/' + run.track)
        .then((res) => {
          if (!res.ok) {
            console.log('Error fetching runs of track:', run.track)
            return
          }
          return res.json()
        })
        .then((json) => {
          if (!json) return
          const trackRuns = json.data
          setResults({ trackRuns })
        })

      fetch('/api/run')
        .then((res) => {
          if (!res.ok) {
            console.log('Error fetching runs of user')
            return
          }
          return res.json()
        })
        .then((json) => json && setUserRuns(json.data))
    }
  }, [])

  const saveRun = async () => {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(run),
    })

    if (res.ok) {
      const { data: savedRun } = await res.json()

      // add saved run to results with place and runner name, and select for comparison
      const fasterRuns = results.trackRuns.filter((r) => r.totalTime < savedRun.totalTime)
      const slowerRuns = results.trackRuns.filter((r) => r.totalTime >= savedRun.totalTime)
      const placedRun = { ...savedRun, place: fasterRuns.length + 1, runner: { name: user?.name } }
      const trackRuns = [...fasterRuns, placedRun, ...slowerRuns]
      setResults({ trackRuns, selected: [placedRun] })
      setRun({ ...savedRun, start: run.start, end: run.end, markerTimes: run.markerTimes })
      setIsSaved(true)
    }
    setMessage(res.ok ? 'Tulos tallennettu' : 'Tuloksen tallennus epäonnistui')
    setTimeout(() => setMessage(''), 2000)
  }

  const back = () => {
    router.push('/tracks/view')
    setRun(undefined)
    setIsSaved(false)
  }

  const toCompare = () => {
    router.push('/results')
    setIsSaved(false)
  }

  return (
    <Layout
      menu={
        <Button className='mr-4' onClick={() => back()}>
          Takaisin
        </Button>
      }
    >
      <div className='container m-5 md:m-10 flex flex-col justify-between w-5/6'>
        {message.length > 0 && <div className='my-2'>{message}</div>}
        <div className='flex my-2'>
          <h1>Maali</h1>
          <h1 className='ml-5 mr-5'>-</h1>
          <h1 className=''>{track?.name}</h1>
        </div>
        <div className='flex mt-5'>
          <TrackDistance className='w-1/4' markers={track?.markers} />
        </div>
        <div className='flex mb-3'>{run !== undefined && <RunDistance className='w-1/4' route={run.route} />}</div>

        <div className='flex my-10'>
          <h1 className=''>Aika</h1>
          <h1 className='ml-5 mr-5'>-</h1>
          <h1>{run && showTime(run.start, run.end)}</h1>
        </div>

        {run && run?.markerTimes?.length > 0 && (
          <div>
            <table className='w-full md:w-3/4 ml-5 md:ml-20 mr-5 text-center'>
              <tbody>
                <tr>
                  <th className='text-center w-1/6'>Rasti</th>
                  <th className='text-center w-1/6'>Aika</th>
                  <th className='text-center w-1/4'>Matka</th>
                  <th className='text-center w-1/4'>
                    Nopeus <span className='font-normal'>(km/h)</span>
                  </th>
                </tr>
                {run.markerTimes.map((time, i) => (
                  <MarkerResult key={`markerresult${time}-${i}`} i={i} markerTime={time} run={run} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className='container flex justify-end w-full my-4'>
          <Button onClick={() => router.push('/tracks/route')}>Oma reitti</Button>
        </div>

        <div className='w-full mt-2'>
          <div className='flex justify-between items-end mb-4'>
            <h1>Tulosvertailu</h1>

            <div>Radalla tuloksia: {results.trackRuns?.length}</div>
          </div>

          {!isSaved && <div>Tallenna suunnistuksesi, ja voit vertailla aikoja sekä reittejä.</div>}
          {isSaved && userRuns.length == 1 && <div>Haasta kaverisi juoksemaan sama rata, ja vertailkaa tuloksia.</div>}
        </div>

        {!isSaved && userRuns.length > 5 && (
          <div className='w-full'>
            <div>Olet tallentanut jo 5 tulosta, jos tallennat, korvataan vanhin tulos</div>
            <OldestResult run={userRuns[0]} />
          </div>
        )}
        <div className='container flex justify-end w-full my-4'>
          {!isSaved && <Button onClick={() => saveRun()}>Tallenna</Button>}
          {isSaved && results.trackRuns.length > 1 && <Button onClick={() => toCompare()}>Vertaile</Button>}
        </div>
      </div>
    </Layout>
  )
}

export default StopRun

import Link from 'next/link'
import { trackState, resultState } from '../models/state'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { totalDistance } from '../utils/location'


const ResultList = () => {
  const [results] = useRecoilState(resultState)
  const [track] = useRecoilState(trackState)

  if (!results) return <div></div>

  const sortedRuns = [...results.trackRuns].sort((a, b) => {
    if (a.totalTime === b.totalTime) return 0
    return (a.totalTime < b.totalTime) ? 1 : -1
  })

  return (
    <div className="container">
      <h1 className="my-4">Rata {track.name} tulokset</h1>
      <div className="ml-5 md:ml-20 mr-5 text-sm md:text-1l">
        <div className="flex">
          <div className="w-3/4 mr-2 bold"></div>
          <div className="w-1/6 mr-2"></div>
          <div className="w-1/6"></div>
          <div className="w-1/6"></div>
          <div className="w-1/6 ml-4"></div>
        </div>

        {sortedRuns.map((runResult, i) => <RunResult i={i} run={runResult} />)}
      </div>

      <div className="w-full m-4 mt-8 text-right justify-end pr-10 ">
        <p>Valitse suunnistajat reittivertailuun</p>
        {results.selected?.length > 1 &&
          <div className="my-2">
            <Link href="/results/compare"><Button>Vertaile</Button></Link>
          </div>
        }
      </div>
    </div>
  )
}


const runner = (run) => (run.runner?.name !== undefined) ? run.runner.name : 'tuntematon'

const RunResult = ({ i, run }) => {
  const [results, setResults] = useRecoilState(resultState)

  const distance = `${(totalDistance(run.route) / 1000).toFixed(2)}`
  const speed = (distance / (run.totalTime) * 1000 * 3.6).toFixed(1)

  const time = run.totalTime
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  const showMinutes = minutes !== 0 ? `${minutes}m` : ''
  
  const changed = () => {
    if (results.selected.some(r => r._id === run._id)) {
      setResults({ ...results, selected: results.selected.filter(r => r._id !== run._id) })
    }
    else {
      setResults({ ...results, selected: [...results.selected, run] })
    }
  }

  const selected = results.selected.some(r => r._id === run._id)

  return (
    <div className="flex" key={`runrow${run._id}`}>
      <div className="w-3/4 mr-2 bold">{i + 1} {runner(run)}</div>
      <div className="w-1/8 mr-4">{`${showMinutes} ${seconds}s`}</div>
      <div className="w-1/6">{distance}km</div>
      <div className="w-1/6">{speed}km/h</div>
      <div className="w-1/6 text-center"><input type="checkbox" onChange={() => changed()} checked={selected} /></div>
    </div>
  )
}

export { ResultList }
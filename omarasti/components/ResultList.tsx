import Link from 'next/link'
import { trackState, resultState } from '../models/state'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { totalDistance } from '../utils/location'
import Checkbox from './Checkbox'
import { PopulatedRun } from '../models/Run'

const ResultList = () => {
  const [results] = useRecoilState(resultState)
  const [track] = useRecoilState(trackState)

  if (!results) return <div />

  return (
    <div className='container'>
      <h1 className='my-4'>Rata {track.name} tulokset</h1>
      <div className='md:ml-20 text-sm md:text-1l'>
        <div className='flex'>
          <div className='w-3/4 mr-2 bold' />
          <div className='w-1/6 mr-2' />
          <div className='w-1/6' />
          <div className='w-1/6' />
          <div className='w-1/6 ml-4' />
        </div>

        {results.trackRuns.map((runResult, i) => (
          <RunResult key={`rresult${runResult._id}`} i={i} run={runResult} />
        ))}
      </div>

      <div className='relative right-4 text-right mt-4 md:mt-10'>
        <div>Valitse suunnistajat reittivertailuun</div>
        {results.selected?.length > 1 && (
          <div className='my-2'>
            <Link href='/results/compare'>
              <Button>Vertaile</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export const runnerName = (run: PopulatedRun) => (run.runner?.name !== undefined ? run.runner.name : 'tuntematon')

const RunResult = ({ i, run }: { i: number; run: PopulatedRun }) => {
  const [results, setResults] = useRecoilState(resultState)

  const distance = `${(totalDistance(run.route) / 1000).toFixed(2)}`
  const speed = ((Number(distance) / run.totalTime) * 1000 * 3.6).toFixed(1)

  const time = run.totalTime
  const minutes = Math.floor(time / 60000)
  const seconds = Math.floor((time - minutes * 60000) / 1000)
  const showMinutes = minutes !== 0 ? `${minutes}m` : ''

  const changed = () => {
    if (results.selected.some((r) => r._id === run._id)) {
      setResults({ ...results, selected: results.selected.filter((r) => r._id !== run._id) })
    } else {
      setResults({ ...results, selected: [...results.selected, { ...run, place: i + 1 }] })
    }
  }

  const selected = results.selected.some((r) => r._id === run._id)
  const index = results.selected.findIndex((r) => r._id === run._id)

  return (
    <div className='flex w-full justify-between items-center' key={`runrow${run._id}`}>
      <div className='w-2/4 mr-2 bold'>
        {i + 1} {runnerName(run)}
      </div>
      <div className='mr-2'>{`${showMinutes} ${seconds}s`}</div>
      <div className='w-1/6 mr-1'>{distance}km<br/>{speed}km/h</div>
      <div className='w-1/6 flex justify-center'>
        <Checkbox id={`checkbox-${run._id}`} checked={selected} onChange={() => changed()} />
      </div>
    </div>
  )
}

export { ResultList }

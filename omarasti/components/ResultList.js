import Link from 'next/link'
import { trackState, resultState, routeColors } from '../models/state'
import { useRecoilState } from 'recoil'
import { Button } from './Buttons'
import { totalDistance } from '../utils/location'

const ResultList = () => {
  const [results] = useRecoilState(resultState)
  const [track] = useRecoilState(trackState)

  if (!results) return <div />

  return (
    <div className='container'>
      <h1 className='my-4'>Rata {track.name} tulokset</h1>
      <div className='ml-5 md:ml-20 mr-5 text-sm md:text-1l'>
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

      <div className='w-full m-4 mt-8 text-right justify-end pr-10 '>
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

const runner = (run) => (run.runner?.name !== undefined ? run.runner.name : 'tuntematon')

const RunResult = ({ i, run }) => {
  const [results, setResults] = useRecoilState(resultState)

  const distance = `${(totalDistance(run.route) / 1000).toFixed(2)}`
  const speed = ((distance / run.totalTime) * 1000 * 3.6).toFixed(1)

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
    <div className='flex' key={`runrow${run._id}`}>
      <div className='w-3/4 mr-2 bold'>
        {i + 1} {runner(run)}
      </div>
      <div className='w-1/8 mr-4'>{`${showMinutes} ${seconds}s`}</div>
      <div className='w-1/6 mr-1'>{distance}km</div>
      <div className='w-1/6 mr-1'>{speed}km/h</div>
      <div className='w-1/6 flex justify-center'>
        <label className='p-0 m-0'>
          <input type='checkbox' onChange={() => changed()} checked={selected} />
          {selected && <CustomCheckBox color={routeColors[index % routeColors.length]} />}
        </label>
      </div>
    </div>
  )
}
const CustomCheckBox = ({ color }) => {
  return (
    <svg
      viewBox='20px 20px'
      width='20px'
      height='20px'
      style={{ position: 'absolute', zIndex: '900', marginTop: '-24px' }}
    >
      <rect width='16px' height='16px' rx='3' x='1' y='1' fill={color} strokeWidth='1px' stroke='rgba(0,0,0,0.5)' />
    </svg>
  )
}

export { ResultList, CustomCheckBox }

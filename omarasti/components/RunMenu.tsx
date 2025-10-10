import { PopulatedRun } from '../models/Run'
import { SignInButton } from './Buttons'
import { runnerName } from './ResultList'

const RunMenu = ({
  run,
  stopRun,
  timer,
  isLastMarker,
  compareRuns = [],
}: {
  run: { end?: Date; targetMarker?: number }
  stopRun: () => void
  timer: string
  isLastMarker: boolean
  compareRuns?: (PopulatedRun & { place: number; color: string })[]
}) => {
  return (
    <div className='flex justify-between text-sm items-center w-full'>
      <div className='w-1/2'>
        <div className='flex'>
          <div>Suunnistusaika: </div>
          <div className='text-2l ml-1'>{timer}</div>
        </div>
        {run?.end && <div>Seuraava: {isLastMarker ? 'maali' : `rasti ${run?.targetMarker}`}</div>}
      </div>
      {compareRuns.length > 0 && (
        <div>
          {compareRuns.map((r) => (
            <div key={`runmenurunners-${r._id}`} style={{ color: r.color }}>
              {r.place} - {runnerName(r)}
            </div>
          ))}
        </div>
      )}

      <SignInButton onClick={() => stopRun()}>Lopeta</SignInButton>
    </div>
  )
}

export { RunMenu }

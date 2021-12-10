import { SignInButton } from './Buttons'

const runner = (run) => (run.runner?.name !== undefined) ? run.runner.name : 'tuntematon'


const RunMenu = ({ run, stopRun, timer, compareRuns = []}) => {

  const isLastMarker = run?.targetMarker === (run?.markers?.length - 1)

  return (
    <div className="flex justify-between text-sm items-center w-full">
      <div className="w-1/2">
        <div className="flex">
          <div>Suunnistusaika: </div>
          <div className="text-2l ml-1">
            {timer}
          </div>
        </div>
        { run !== undefined && run.end === undefined && 
        <div>
          Seuraava: {isLastMarker ? 'maali' : `rasti ${run?.targetMarker}`}
        </div>
        }
      </div>
      { compareRuns.length > 0 &&
        <div>
          { compareRuns.map(r => 
            <div key={`runmenurunners-${r._id}`} style={{color: r.color}}>{r.place} - {runner(r)}</div>
          )}
        </div>
      }

      <SignInButton onClick={() => stopRun()}>
      Lopeta
      </SignInButton>
    </div >
  )
}


export { RunMenu }
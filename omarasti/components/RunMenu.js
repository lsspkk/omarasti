import { SignInButton } from './Buttons'

const RunMenu = ({ run, stopRun, timer }) => {

  const isLastMarker = run?.targetMarker === (run?.markers?.length - 1)

  return (
    <div className="flex justify-between text-sm align-center w-full">
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

      <SignInButton onClick={() => stopRun()}>
      Lopeta
      </SignInButton>
    </div >
  )
}


export { RunMenu }
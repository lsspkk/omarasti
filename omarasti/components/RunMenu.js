import { SignInButton } from './Buttons'
import { runState } from '../models/state'
import { useRecoilState, } from 'recoil'

const RunMenu = ({stopRun, timer}) => {
  const [run] = useRecoilState(runState)

  const isLastMarker = run?.targetMarker === (run?.markers?.length -1)
  const target = isLastMarker ? 'maali' : `rasti ${run.targetMarker}`

  return (
    <div className="flex justify-between text-sm align-center w-full">
      <div className="w-1/2">
        <div className="flex">
          <div>Suunnistusaika: </div>
          <div className="text-2l ml-1">
            {timer}
          </div>
        </div>
        <div>
          Seuraava: {target}
        </div>
      </div>

      <SignInButton onClick={() => stopRun()}>
        Lopeta
      </SignInButton>
    </div>
  )
}


export { RunMenu }
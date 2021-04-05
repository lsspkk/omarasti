import { SignInButton } from './Buttons'
import { runState } from '../pages/tracks/run/start'
import { useRecoilState, } from 'recoil'

const RunMenu = ({stopRun, timer}) => {
  const [run] = useRecoilState(runState)

  // TODO say when next is the goal
  const target = `rasti ${run.targetMarker}`
  return (
    <div className="flex justify-between text-sm align-center">
      <div className="w-40">
        <div className="flex">
          <div>Suunnistus:</div>
          <div className="text-2l">
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
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SignInButton } from './Buttons'
import { runState } from '../pages/tracks/run/start'
import { useRecoilState, } from 'recoil'


const RunMenu = (props) => {
  const [run, setRun] = useRecoilState(runState)
  const [myInterval, setMyInterval] = useState(-1)
  const [timer, setTimer] = useState('')
  const router = useRouter()



  function updateTimer() {
    const time = (new Date().getTime()) - run.start.getTime()
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time - minutes * 60000) / 1000)
    setTimer(`${(minutes)}m ${(seconds)}s`)
  }

  // TODO add another interval for updating person latlng with getLocation
  // show some button on map, when close to the next marker
  useEffect(() => {
    if (run && !run.end) {
      if (myInterval === -1) {
        const handle = setInterval(() => updateTimer(), 1000)
        setMyInterval(handle)
      }
    }
    else {
      clearInterval(myInterval)
      setMyInterval(-1)
      setTimer('')
    }
  }, [run])

  // TODO say when next is the goal
  const target = `rasti ${run.currentMarker+1}`
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

      <SignInButton onClick={() => 
        {
          if (myInterval !== -1) clearInterval(myInterval)
          router.push('/tracks/run/stop')
        }}>
        Lopeta
      </SignInButton>
      {props.children}
    </div>
  )
}


export { RunMenu }

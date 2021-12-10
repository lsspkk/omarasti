import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from './Buttons'
import { useRecoilState, } from 'recoil'
import { runState } from '../models/state'

const ViewButton = ({ children, href}) => {
  const router = useRouter()
  const pageActive = router.asPath === href
  const bgColor = pageActive ? 'bg-green-600' : 'bg-green-300'

  return (
    <Button
      className={`${bgColor}`}
      onClick={() => !pageActive && router.push(href)}>
        {children}
    </Button>
  )
}

const ViewMenu = (props) => {
  const [, setRun] = useRecoilState(runState)

  return (
    <>
        <Link href="/tracks"><Button onClick={() => setRun(undefined)}>Radat</Button></Link>
        <ViewButton href='/tracks/run/start'>Suunnista</ViewButton>
      {props.children}
    </>
  )
}

export { ViewMenu, ViewButton }
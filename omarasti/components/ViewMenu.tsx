import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from './Buttons'
import { useRecoilState } from 'recoil'
import { runState } from '../models/state'

const ViewButton = ({ href }: { href: string }) => {
  const router = useRouter()
  const isStartPage = router.asPath === '/tracks/run/start'
  const variant = isStartPage ? 'primary' : 'green'
  const buttonText = isStartPage ? 'Takaisin' : 'Suunnista'
  const handleClick = () => {
    if (isStartPage) {
      router.push('/tracks/view')
    } else {
      router.push(href)
    }
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {buttonText}
    </Button>
  )
}

const ViewMenu = () => {
  const [, setRun] = useRecoilState(runState)

  return (
    <>
      <Link href='/tracks'>
        <Button onClick={() => setRun(undefined)}>Radat</Button>
      </Link>
      <ViewButton href='/tracks/run/start' />
    </>
  )
}

export { ViewMenu, ViewButton }

import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from './Buttons'

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
  return (
    <>
        <Link href="/tracks"><Button>Radat</Button></Link>
        <ViewButton href='/tracks/run/start'>Suunnista</ViewButton>
      {props.children}
    </>
  )
}

export { ViewMenu, ViewButton }
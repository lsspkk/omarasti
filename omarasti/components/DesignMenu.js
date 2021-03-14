import { atom, useRecoilState, } from 'recoil'
import Link from 'next/link'
import { Button } from './Buttons'

const designModeState = atom({
  key: 'designModeState',
  default: 'add',
})

const DesignMenu = (props) => {
  const [mode, setMode] = useRecoilState(designModeState)
  const normal = 'bg-orange-400'
  const selected = 'bg-orange-600'

  return (
    <>
      <Link href="/tracks"><Button>Radat</Button></Link>
      <Button><Link href='/track'> Rata</Link></Button>

      <Button
        className={mode === 'add' ? selected : normal}
        onClick={() => setMode('add')}>
        Lisää
      </Button>
      <Button
        className={mode === 'move' ? selected : normal}
        onClick={() => setMode('move')}>
        Siirrä
      </Button>
      <Button
        className={mode === 'remove' ? selected : normal}
        onClick={() => setMode('remove')}>
        Poista
      </Button>
      {props.children}
    </>
  )
}

export { DesignMenu, designModeState }

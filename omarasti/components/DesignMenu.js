import { atom, useRecoilState, } from 'recoil'
import Link from 'next/link'
import { Button } from './Buttons'

const designModeState = atom({
  key: 'designModeState',
  default: 'add',
})

const DesignMenu = (props) => {
  const [mode, setMode] = useRecoilState(designModeState)
  const normal = 'bg-green-300 '
  const selected = 'bg-green-100 border-b-2 border-orange-900'

  return (
    <>
      <Link href="/tracks"><Button className="mr-4">Radat</Button></Link>
      <Link href='/track'><Button className="bg-green-400">Rata</Button></Link>

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

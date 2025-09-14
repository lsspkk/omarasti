import { atom, useRecoilState } from 'recoil'
import Link from 'next/link'
import { Button } from './Buttons'
import { ReactNode } from 'react'
import React from 'react'

export type TrackViewMode = 'add' | 'move' | 'remove' | 'edit' | 'view'

const designModeState = atom<TrackViewMode>({
  key: 'designModeState',
  default: 'add',
})

const DesignMenu = ({ children }: { children?: ReactNode }) => {
  const [mode, setMode] = useRecoilState(designModeState)
  const normal = 'bg-green-300 '
  const selected = 'bg-green-100 border-b-2 border-orange-900'

  return (
    <React.Fragment>
      <Link href='/tracks'>
        <Button className='mr-4'>Radat</Button>
      </Link>
      <Link href='/track'>
        <Button className='bg-green-400'>Rata</Button>
      </Link>

      <Button className={mode === 'add' ? selected : normal} onClick={() => setMode('add')}>
        Lisää
      </Button>
      <Button className={mode === 'move' ? selected : normal} onClick={() => setMode('move')}>
        Siirrä
      </Button>
      <Button className={mode === 'remove' ? selected : normal} onClick={() => setMode('remove')}>
        Poista
      </Button>
      {children}
    </React.Fragment>
  )
}

export { DesignMenu, designModeState }

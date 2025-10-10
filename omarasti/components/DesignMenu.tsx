import { atom, useRecoilState } from 'recoil'
import Link from 'next/link'
import { Button } from './Buttons'
import { ReactNode, useState } from 'react'
import { ConfirmationDialog } from './ConfirmationDialog'
import { useRouter } from 'next/router'

export type TrackViewMode = 'add' | 'move' | 'remove' | 'edit' | 'view'

const designModeState = atom<TrackViewMode>({
  key: 'designModeState',
  default: 'add',
})

const DesignMenu = ({ children }: { children?: ReactNode }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const router = useRouter()

  const onClickRadat = () => {
    setShowConfirmDialog(true)
  }

  const onConfirm = () => {
    router.push('/tracks')
  }

  const onClose = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Button className='mr-4' variant='secondary' onClick={onClickRadat}>
        Radat
      </Button>
      <Link href='/track'>
        <Button>Rata</Button>
      </Link>

      {children}

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={onClose}
        onConfirm={onConfirm}
        title='Lopeta radan muokkaus?'
        message='Haluatko varmasti lopettaa radan muokkauksen ja palata rataluetteloon?'
        confirmText='Kyllä'
        cancelText='Ei'
      />
    </>
  )
}

const DesignBottomMenu = ({ children }: { children?: ReactNode }) => {
  const [mode, setMode] = useRecoilState(designModeState)
  const normal = 'border-1 border-gray-300 from from-gray-100 to-gray-200'
  const selected = 'border-1 border-gray-300 from-orange-400 to-purple-700 '

  return (
    <div className='gap-2 md:gap-8 fixed bottom-0 left-0 w-full bg-none bg-white shadow-inner flex justify-between items-center z-[1200]'>
      <div className='flex justify-end flex-grow items-center mr-2 md-mr-8 gap-2'>
        <div className='text-sm opacity-50 pr-2 md:pr-8'>Rastit </div>
        <Button variant='secondary' className={mode === 'move' ? selected : normal} onClick={() => setMode('move')}>
          Siirrä
        </Button>
        <Button variant='secondary' className={mode === 'add' ? selected : normal} onClick={() => setMode('add')}>
          Lisää
        </Button>
        <Button variant='secondary' className={mode === 'remove' ? selected : normal} onClick={() => setMode('remove')}>
          Poista
        </Button>
        {children}
      </div>
    </div>
  )
}

export { DesignMenu, designModeState, DesignBottomMenu }

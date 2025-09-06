'use client'

import { useEffect, useState } from 'react'
import { Button } from './Buttons'
import { useRouter } from 'next/navigation'
import { safePushState } from '../utils/browser'

export const BackConfirmation = ({
  title = 'Varmistus',
  message = 'Haluatko varmasti poistua tältä sivulta?',
}: {
  title?: string
  message?: string
}): React.ReactElement => {
  const [showDialog, setShowConfirm] = useState(false)
  const router = useRouter()

  const browserReloadhandler = (event: BeforeUnloadEvent) => {
    event.preventDefault()
    // native dialog
  }

  const browserBackHandler = (event: PopStateEvent) => {
    setShowConfirm(true)
    safePushState()
    event.preventDefault()
  }

  useEffect(() => {
    safePushState()
  }, [])

  const onCancel = () => {
    setShowConfirm(false)
  }

  const onOk = () => {
    window.removeEventListener('beforeunload', browserReloadhandler)
    window.removeEventListener('popstate', browserBackHandler)
    setShowConfirm(false)

    // miksi ei toimi
    // router.back()
    router.push('/tracks')
  }

  useEffect(() => {
    window.addEventListener('beforeunload', browserReloadhandler)
    window.addEventListener('popstate', browserBackHandler)

    return () => {
      window.removeEventListener('beforeunload', browserReloadhandler)
      window.removeEventListener('popstate', browserBackHandler)
    }
  }, [title])

  return (
    <>
      {showDialog && (
        <div
          className={`fixed w-full h-full inset-0 bg-gray-900 bg-opacity-50 justify-center items-center ${
            showDialog ? 'flex' : 'hidden'
          }`}
          style={{ zIndex: 1000 }}
        >
          <div className='tran bg-white p-4 rounded-lg flex-col gap-4'>
            <div className='text-lg font-bold'>{title}</div>
            <div>{message}</div>
            <div className='flex gap-4 justify-between'>
              <Button onClick={onCancel}>Peruuta</Button>
              <Button onClick={onOk}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Button } from './Buttons'
import { isWindow } from '../utils/browser'

export function BackConfirmation({
  title = 'Varmistus',
  message = 'Haluatko varmasti poistua tältä sivulta?',
}: {
  title?: string
  message?: string
}) {
  const [showDialog, setShowDialog] = useState(false)
  const [blockNav, setBlockNav] = useState(true)
  const [pendingBack, setPendingBack] = useState(false)

  useEffect(() => {
    if (!blockNav || !isWindow()) return

    window.history.pushState(null, '', window.location.href)
    const handlePopState = (e: PopStateEvent) => {
      if (blockNav) {
        setShowDialog(true)
        setPendingBack(true)
        // Do NOT push state again here, just block once
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window?.removeEventListener('popstate', handlePopState)
    }
  }, [blockNav])

  // Intercept browser tab close/reload
  useEffect(() => {
    if (!blockNav || !isWindow()) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = '' // Chrome requires returnValue to be set
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window?.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [blockNav])

  const handleOk = useCallback(() => {
    setShowDialog(false)
    setBlockNav(false)
    if (pendingBack) {
      setPendingBack(false)
      // Go back two steps to skip the dummy state
      window.history.go(-2)
    }
  }, [pendingBack])

  const handleCancel = useCallback(() => {
    setShowDialog(false)
    setPendingBack(false)
    setBlockNav(true)
    // Re-push dummy state to keep blocking
    window.history.pushState(null, '', window.location.href)
  }, [])

  return (
    <>
      {showDialog && (
        <div
          className='fixed w-full h-full inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'
          style={{ zIndex: 1000 }}
        >
          <div className='bg-white p-4 rounded-lg flex-col gap-4'>
            <div className='text-lg font-bold'>{title}</div>
            <div>{message}</div>
            <div className='flex gap-4 justify-between'>
              <Button onClick={handleCancel}>Peruuta</Button>
              <Button onClick={handleOk}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import React, { useEffect, useRef } from 'react'
import { Button } from './Buttons'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Kyllä',
  cancelText = 'Ei',
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      // Focus on the cancel button (Ei) by default
      cancelButtonRef.current.focus()
    }
  }, [isOpen])

  const onBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[2000]'
      onClick={onBackgroundClick}
      role='presentation'
      tabIndex={-1}
    >
      <div
        className='bg-white rounded-lg shadow-xl max-w-md w-full border-2 border-gray-200 relative z-[2200]'
        aria-modal='true'
        role='dialog'
        aria-labelledby='dialog-title'
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <h3 id='dialog-title' className='text-lg font-semibold text-gray-800'>
            {title}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded'
            aria-label='Sulje'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-4'>
          <p className='text-gray-700 text-sm leading-relaxed'>{message}</p>
        </div>

        {/* Buttons */}
        <div className='flex space-y-2 md:flex-row md:space-y-0 md:justify-end md:space-x-4 p-4 border-t border-gray-200'>
          <Button ref={cancelButtonRef} onClick={onClose} variant='secondary' className=' w-1/2'>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} variant='primary' className=' w-1/2'>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

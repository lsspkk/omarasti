import React from 'react'
import { Button } from './Buttons'
import RadioGroup from './RadioGroup'
import { useRecoilState, useRecoilValue } from 'recoil'
import { designModeState } from './DesignMenu'

interface MarkerPopupProps {
  description: string
  visibility: number
  latlng: { lat: number; lng: number }
  published: boolean
  onDescriptionChange: (value: string) => void
  onVisibilityChange: (value: number) => void
  onClose: () => void
  markerIndex: number
}

const VISIBILITY_OPTIONS = [
  { value: 100, label: '100m' },
  { value: 50, label: '50m' },
  { value: 25, label: '25m' },
  { value: 10, label: '10m' },
]

const MarkerPopup: React.FC<MarkerPopupProps> = ({
  description,
  visibility,
  latlng,
  published,
  onDescriptionChange,
  onVisibilityChange,
  onClose,
  markerIndex,
}) => {


    const [mode] = useRecoilState(designModeState)
    const isViewMode = mode === 'view'

  return (
    <div className='flex flex-col gap-2'>

      <div className='flex flex-col'>
        <label htmlFor={`description-${markerIndex}`} className='font-semibold mb-1'>
          Rastikuvaus:
        </label>
        {published || isViewMode ? (
          <div>{description}</div>
        ) : (
          <input
            id={`description-${markerIndex}`}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className='border rounded px-2 py-1'
          />
        )}
      </div>

      <div className='flex flex-col'>
        <label className='font-semibold mb-1'>Näkyvyys:</label>
        {published ? (
          <div>{visibility}m</div>
        ) : (
          <RadioGroup
            disabled={isViewMode}
            name={`visibility-${markerIndex}`}
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={(val) => onVisibilityChange(val as number)}
          />
        )}
      </div>

      <div className='flex justify-between items-end'>
        <div className='text-sm text-gray-600'>
          <div>lat: {latlng.lat.toFixed(5)}</div>
          <div>lng: {latlng.lng.toFixed(5)}</div>
        </div>
      </div>

      <Button onClick={onClose}>OK</Button>
      </div>
  )
}

export default MarkerPopup


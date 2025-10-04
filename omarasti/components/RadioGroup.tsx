import React from 'react'

interface RadioOption {
  value: string | number
  label: string
}

interface RadioGroupProps {
  name: string
  options: RadioOption[]
  value: string | number
  onChange: (value: string | number) => void
  className?: string
  disabled?: boolean
}

const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, value, onChange, className = '', disabled = false }) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className='flex items-center cursor-pointer'>
          <input
            type='radio'
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled}
            className='mr-1'
          />
          <span className={disabled ? 'text-gray-500' : ''}>{option.label}</span>
        </label>
      ))}
    </div>
  )
}

export default RadioGroup


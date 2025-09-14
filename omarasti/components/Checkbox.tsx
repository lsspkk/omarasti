import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({
  id,
  checked,
  onChange,
  className,
  label,
}: {
  id: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  label?: string
}) => {
  return (
    <div className='flex items-center'>
      <input id={id} type='checkbox' checked={checked} onChange={onChange} className={className} />
      {label && (
        <label htmlFor={id} className='ml-2'>
          {label}
        </label>
      )}
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
}

export default Checkbox

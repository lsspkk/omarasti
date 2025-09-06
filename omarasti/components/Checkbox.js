import React from 'react'
import PropTypes from 'prop-types'

const Checkbox = ({ id, checked, onChange, className, label }) => {
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

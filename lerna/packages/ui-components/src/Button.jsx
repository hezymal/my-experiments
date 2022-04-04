import React from 'react'
import { formatDate } from 'common-utils'

const buttonStyle = {
  padding: '10px 20px'
}

const Button = (props) => {
  return (
    <button
      className='btn btn-default'
      style={buttonStyle}
      onClick={props.handleClick}
    >
      {props.label} - {formatDate(new Date())}
    </button>
  )
}

Button.defaultProps = {
  onClick: () => {},
  label: ''
}

export default Button

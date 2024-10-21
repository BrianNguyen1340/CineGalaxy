import React from 'react'
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form'

import './FormInputGroup.scss'

type FormInputGroupType = {
  htmlFor: string
  labelChildren: React.ReactNode
  type: string
  placeholder?: string
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  validation?: RegisterOptions
  name: string
  id: string
  children?: React.ReactNode
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
}

const FormInputGroup: React.FC<FormInputGroupType> = ({
  htmlFor,
  labelChildren,
  type = 'text',
  placeholder = '',
  register,
  errors,
  validation = {},
  name,
  id,
  onBlur,
  icon,
  children,
}) => {
  const errorMessage = errors[name]?.message

  return (
    <div className='form-input-group'>
      <label htmlFor={htmlFor}>{labelChildren}</label>
      <div className='form-input'>
        <div className='icon'>{icon}</div>
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
          id={id}
          name={name}
          autoComplete='off'
          style={{
            backgroundColor: errorMessage ? '#ffe5ec' : 'white',
            borderColor: errorMessage && 'rgba(234, 100, 217, 0.4)',
            boxShadow: errorMessage && '0 0 0 2px rgba(234, 100, 217, 0.1)',
          }}
          onBlur={onBlur}
        />
        {children}
      </div>
      <span>{errorMessage && String(errorMessage)}</span>
    </div>
  )
}

export default FormInputGroup

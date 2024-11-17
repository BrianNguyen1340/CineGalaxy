import React from 'react'
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form'

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
  type,
  placeholder = '',
  register,
  errors,
  validation = {},
  name,
  id,
  onBlur,
  children,
}) => {
  const errorMessage = errors[name]?.message

  return (
    <div className='relative mb-5 flex flex-col'>
      <label
        htmlFor={htmlFor}
        className='mb-1 text-base font-semibold capitalize'
      >
        {labelChildren}
      </label>
      <div className='relative w-full'>
        <input
          type={type}
          placeholder={placeholder}
          {...register(name, validation)}
          id={id}
          name={name}
          autoComplete='off'
          className='appearance-none rounded-xl border-2 border-[#ddd] p-5 text-base text-[#222] outline-none transition placeholder:text-sm focus:border-[#00b4d8]'
          style={{
            backgroundColor: errorMessage ? '#ffe5ec' : 'white',
            borderColor: errorMessage && 'rgba(234, 100, 217, 0.4)',
            boxShadow: errorMessage && '0 0 0 2px rgba(234, 100, 217, 0.1)',
          }}
          onBlur={onBlur}
        />
        {children}
      </div>
      <span className='absolute top-[100%] pl-3 pt-[2px] text-sm italic text-[red]'>
        {errorMessage && String(errorMessage)}
      </span>
    </div>
  )
}

export default FormInputGroup

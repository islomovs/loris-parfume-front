'use client'

import React, { forwardRef, useState } from 'react'
import { cn } from '../../helpers/mergeFunction'

interface ICustomInputProps {
  title: string
  borders: 'rounded' | 'no-rounded'
  className?: string
  type: 'password' | 'number' | 'text'
  value?: string // Add the value prop
  disabled?: boolean // Add the disabled prop
}

export const CustomInput = forwardRef<HTMLInputElement, ICustomInputProps>(
  ({ title, borders, className, type, value, disabled, ...rest }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
    }

    return (
      <label
        htmlFor={title}
        className="form-group relative flex flex-col-reverse"
      >
        <input
          id={title}
          ref={ref}
          className={cn(
            `${className} peer transition-all duration-300 border-none focus:border-none block h-[50px] outline outline-[#e3e3e3] py-[13.5px] px-[11px] focus:outline-2 focus:outline-primary placeholder-transparent pb-0 peer:focus:pb-[4px] peer:not(:placeholder-shown):pb-[4px] pr-[40px]`,
            {
              'rounded-[5px]': borders === 'rounded',
              'rounded-0': borders === 'no-rounded',
            }
          )}
          type={isPasswordVisible || type === 'text' ? 'text' : 'password'}
          placeholder=" "
          value={value} // Pass the value prop
          disabled={disabled} // Pass the disabled prop
          {...rest}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-primary text-sm uppercase"
          >
            {isPasswordVisible ? 'Hide' : 'Show'}
          </button>
        )}

        <div className="absolute left-[11px] text-[#707070] text-xs top-1 transform transition-all duration-300 ease-in peer-placeholder-shown:top-[13.5px] peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:-translate-y-[0px] peer-focus:text-[#707070] peer:not(:placeholder-shown):top-1 peer:not(:placeholder-shown):text-xs peer:not(:placeholder-shown):-translate-y-[0px] peer:not(:placeholder-shown):text-primary">
          {title}
        </div>
      </label>
    )
  }
)

CustomInput.displayName = 'CustomInput'

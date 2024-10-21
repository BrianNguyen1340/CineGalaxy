import { KeyboardEvent, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SubmitHandler, useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { paths } from '~/utils/paths'
import {
  useVerifyOTPMutation,
  useResendOTPMutation,
} from '~/services/auth.service'
import { useAppSelector } from '~/hooks/redux'
import './VerifyOTP.scss'

type OTP = {
  code?: number
}

const VerifyOTP = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated && user) {
    return <Navigate to={paths.userPaths.home} />
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    trigger,
    setError,
  } = useForm()

  const [code, setCode] = useState<string[]>(Array(8).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const navigate = useNavigate()

  const [verifyOTPApi, { isLoading: isLoadingVerifyRegister }] =
    useVerifyOTPMutation()
  const [resendOTPApi, { isLoading: isLoadingResendOTP }] =
    useResendOTPMutation()

  const handleChange = async (index: number, value: string) => {
    const newCode = [...code]

    if (value && value.length > 1) {
      const pastedCode = value.slice(0, 8).split('')
      for (let i = 0; i < 8; i++) {
        newCode[i] = pastedCode[i] || ''
      }
      setCode(newCode)

      let lastFilledIndex = -1
      for (let i = newCode.length - 1; i >= 0; i--) {
        if (newCode[i] !== '') {
          lastFilledIndex = i
          break
        }
      }

      const focusIndex = lastFilledIndex < 7 ? lastFilledIndex + 1 : 7
      inputRefs.current[focusIndex]?.focus()
    } else {
      newCode[index] = value
      setCode(newCode)

      if (value && index < 7) {
        inputRefs.current[index + 1]?.focus()
      }

      setValue('code', newCode.join(''))
      await trigger('code')
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP: SubmitHandler<OTP> = async () => {
    const otpCode = code.join('')
    if (otpCode.length < 8) {
      setError('code', {
        type: 'manual',
        message: 'Vui lòng nhập đủ 8 chữ số OTP.',
      })
      return
    }

    try {
      nProgress.start()
      const response = await verifyOTPApi({
        code: code.join(''),
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      localStorage.removeItem('email')
      navigate(paths.userPaths.login)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleResendOTP = async () => {
    const email = localStorage.getItem('email')
    if (!email) {
      return
    }

    try {
      nProgress.start()
      const response = await resendOTPApi({
        email,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      localStorage.removeItem('email')
      navigate(paths.userPaths.verifyOtp)
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='verify-otp-container'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='content'
      >
        <h2>Xác minh OTP của bạn</h2>
        <p>Nhập 8 mã số đã được gửi tới email của bạn!</p>
        <form
          className='verify-otp-register-form'
          onSubmit={handleSubmit(handleVerifyOTP)}
        >
          <div className='input-fields'>
            {code.map((digit, index) => (
              <input
                {...register('code', {
                  required: 'Vui lòng nhập mã otp',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Chỉ được nhập số!',
                  },
                })}
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoComplete='off'
              />
            ))}
          </div>
          {errors.code && typeof errors.code.message === 'string' && (
            <div
              style={{
                marginTop: '10px',
                fontSize: '15px',
                fontStyle: 'italic',
                color: 'red',
              }}
            >
              {errors.code.message}
            </div>
          )}
          <button type='submit'>
            {isLoadingVerifyRegister ? 'Đang xác nhận' : 'Xác nhận'}
          </button>
        </form>
        <button
          className='resend-otp-form'
          onClick={handleResendOTP}
          disabled={isLoadingResendOTP ? true : false}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {isLoadingResendOTP && <HashLoader size='20' color='#fff' />}
            <span>{isLoadingResendOTP ? 'Đang đăng ký' : 'Đăng ký'}</span>
          </div>
        </button>
      </motion.div>
    </div>
  )
}

export default VerifyOTP

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

const VerifyOTP = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated && user) {
    return <Navigate to={paths.userPaths.home} />
  }

  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
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

  const handleVerifyOTP: SubmitHandler<{ code?: number }> = async () => {
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
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden text-center'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-fit overflow-hidden border-t border-[#ddd] bg-white p-5 shadow-md backdrop-blur-[24px]'
      >
        <div className='text-xl font-semibold capitalize'>
          Xác minh OTP của bạn
        </div>
        <p className='my-5'>Nhập 8 mã số đã được gửi tới email của bạn!</p>
        <form onSubmit={handleSubmit(handleVerifyOTP)}>
          <div className='flex items-center justify-center gap-[10px]'>
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
                className='h-12 w-12 rounded border-2 border-[#ccc] bg-[#f8f7f4] text-center font-semibold leading-8 outline-none focus:border-2 focus:border-[red]'
              />
            ))}
          </div>
          {errors.code && typeof errors.code.message === 'string' && (
            <div className='mt-3 italic text-[red]'>{errors.code.message}</div>
          )}
          <button
            type='submit'
            className='mt-5 flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
          >
            {isLoadingVerifyRegister ? 'Đang xác nhận' : 'Xác nhận'}
          </button>
        </form>
        <button
          className='mt-5 cursor-pointer bg-white p-1 capitalize transition duration-300'
          onClick={handleResendOTP}
          disabled={isLoadingResendOTP ? true : false}
        >
          <div className='flex items-center justify-center gap-3'>
            {isLoadingResendOTP && <HashLoader size='20' color='#fff' />}
            <span className='capitalize italic hover:text-[red] hover:underline'>
              {isLoadingResendOTP ? 'đang gửi lại otp' : 'gửi lại mã OTP'}
            </span>
          </div>
        </button>
      </motion.div>
    </div>
  )
}

export default VerifyOTP

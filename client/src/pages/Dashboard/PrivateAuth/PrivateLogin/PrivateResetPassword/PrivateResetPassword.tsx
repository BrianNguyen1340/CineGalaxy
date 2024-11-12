import { useForm, SubmitHandler } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'
import { Eye, EyeOff, FileLock, Mail } from 'lucide-react'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { useAppSelector } from '~/hooks/redux'
import { useResetPasswordMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const PrivateResetPassword = () => {
  useTitle('Xác nhận thay đổi mật khẩu panel')

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  if (isAuthenticated && user) {
    return <Navigate to={paths.dashboardPaths.dashboard} />
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<{
    password: string
  }>()

  const navigate = useNavigate()

  const { token } = useParams<{ token: string }>()

  const [resetPasswordApi, { isLoading: isLoadingResetPassword }] =
    useResetPasswordMutation()

  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)

  const [showHideConfirmPassword, setShowHideConfirmPassword] =
    useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleShowHideConfirmPassword = () => {
    setShowHideConfirmPassword((prevState) => !prevState)
  }

  const handleResetPassword: SubmitHandler<{
    password: string
  }> = async (data) => {
    try {
      nProgress.start()
      const { password } = data

      if (!token) {
        throw new Error('Token không hợp lệ!')
      }

      const response = await resetPasswordApi({
        token,
        password,
      }).unwrap()

      Swal.fire('Thành công!', response.message)
      navigate(paths.userPaths.login)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-x-hidden bg-white'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-[500px] overflow-hidden border-t border-[#ddd] bg-white p-5 shadow-md backdrop-blur-[24px]'
      >
        <div className='w-full'>
          <div className='mb-[30px] text-center text-xl font-semibold'>
            Thay đổi mật khẩu của bạn
          </div>
        </div>
        <form onSubmit={handleSubmit(handleResetPassword)} className='w-full'>
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập mật khẩu!',
            }}
            htmlFor='password'
            labelChildren='mật khẩu'
            type={showHidePassword ? 'text' : 'password'}
            id='password'
            placeholder='Nhập mật khẩu mới'
            name='password'
            children={
              <button
                type='button'
                className='absolute right-3 top-[50%] z-10 flex translate-y-[-50%] cursor-pointer items-center justify-center bg-transparent p-3'
                onClick={handleShowHidePassword}
              >
                {showHidePassword ? <Eye size='20' /> : <EyeOff size='20' />}
              </button>
            }
            icon={<FileLock />}
          />
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng xác nhận mật khẩu!',
              validate: (value: string) =>
                value === getValues('password') || 'Mật khẩu không khớp!',
            }}
            htmlFor='confirmPassword'
            labelChildren='Xác nhận mật khẩu'
            type={showHideConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            name='confirmPassword'
            placeholder='Nhập lại mật khẩu mới'
            children={
              <button
                type='button'
                className='absolute right-3 top-[50%] z-10 flex translate-y-[-50%] cursor-pointer items-center justify-center bg-transparent p-3'
                onClick={handleShowHideConfirmPassword}
              >
                {showHideConfirmPassword ? (
                  <Eye size='20' />
                ) : (
                  <EyeOff size='20' />
                )}
              </button>
            }
            icon={<Mail />}
          />
          <button
            type='submit'
            className='flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
            disabled={isLoadingResetPassword ? true : false}
          >
            <div className='flex items-center justify-center gap-[10px]'>
              {isLoadingResetPassword && <HashLoader size='20' color='#fff' />}
              <span>
                {isLoadingResetPassword
                  ? 'Đang thay đổi mật khẩu'
                  : 'Thay đổi mật khẩu'}
              </span>
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default PrivateResetPassword

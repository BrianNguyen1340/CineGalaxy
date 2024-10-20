import { useForm, SubmitHandler } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'
import { Eye, EyeOff, FileLock, Mail } from 'lucide-react'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { FormInputGroup } from '~/components'
import { useResetPasswordMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import { useAppSelector } from '~/hooks/redux'
import './ResetPassword.scss'

type ResetPasswordData = {
  password: string
}

const ResetPassword = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated && user) {
    return <Navigate to={paths.userPaths.home} />
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<ResetPasswordData>()

  const navigate = useNavigate()

  const { token } = useParams<{ token: string }>()

  const [resetPasswordApi, { isLoading }] = useResetPasswordMutation()
  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)
  const [showHideConfirmPassword, setShowHideConfirmPassword] =
    useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleShowHideConfirmPassword = () => {
    setShowHideConfirmPassword((prevState) => !prevState)
  }

  const handleResetPassword: SubmitHandler<ResetPasswordData> = async (
    data,
  ) => {
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
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='reset-password-container'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='content'
      >
        <div className='auth-content'>
          <div className='title'>CineGalaxy</div>
          <div className='sub-title'>Thay đổi mật khẩu của bạn</div>
        </div>
        <form onSubmit={handleSubmit(handleResetPassword)}>
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập mật khẩu!',
            }}
            htmlFor='password'
            labelChildren='password'
            type={showHidePassword ? 'text' : 'password'}
            id='password'
            placeholder='Nhập mật khẩu mới'
            name='password'
            children={
              <button
                type='button'
                className='btn-show-hide-password'
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
                className='btn-show-hide-password'
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
            className='btn-submit-reset-password'
            disabled={isLoading ? true : false}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isLoading && <HashLoader size='20' color='#fff' />}
              <span>
                {isLoading ? 'Đang thay đổi mật khẩu' : 'Thay đổi mật khẩu'}
              </span>
            </div>
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default ResetPassword

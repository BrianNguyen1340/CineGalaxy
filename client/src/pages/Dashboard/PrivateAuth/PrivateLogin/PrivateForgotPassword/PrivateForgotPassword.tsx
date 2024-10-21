import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Mail } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { FormInputGroup, Loader } from '~/components'
import { useForgotPasswordMutation } from '~/services/auth.service'
import './PrivateForgotPassword.scss'

type ForgotPasswordData = {
  email: string
}

const PrivateForgotPassword = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated) {
    if (user?.role === 0 || user?.role === 1 || user?.role === 2) {
      return <Navigate to={paths.dashboardPaths.dashboard} />
    } else if (user?.role === 3) {
      return <Navigate to={paths.userPaths.home} />
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>()

  const navigate = useNavigate()

  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation()

  const handleForgotPassword: SubmitHandler<ForgotPasswordData> = async (
    reqBody,
  ) => {
    try {
      const { email } = reqBody
      nProgress.start()

      const response = await forgotPasswordApi({ email }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.userPaths.resetPassword)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='private-forgot-password-container'>
      <div className='content'>
        <div className='auth-content'>
          <div className='title'>quên mật khẩu</div>
        </div>
        <form onSubmit={handleSubmit(handleForgotPassword)}>
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập email!',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Vui lòng nhập đúng định dạng email!',
              },
            }}
            htmlFor='email'
            labelChildren='email'
            type='text'
            id='email'
            name='email'
            placeholder='example@.com'
            icon={<Mail />}
          />
          <button
            type='submit'
            className='btn-submit-forgot-password'
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
              <span>{isLoading ? 'Đang gửi yêu cầu' : 'Xác nhận email'}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrivateForgotPassword

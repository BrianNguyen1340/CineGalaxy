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
import './ForgotPassword.scss'

type ForgotPasswordData = {
  email: string
}

const ForgotPassword = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated) {
    if (user?.role === 3) {
      return <Navigate to={paths.userPaths.home} />
    } else if (user?.role === 0 || user?.role === 1 || user?.role === 2) {
      return <Navigate to={paths.dashboardPaths.dashboard} />
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>()

  const navigate = useNavigate()

  const [forgotPasswordApi, { isLoading }] = useForgotPasswordMutation()
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

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
    <div className='forgot-password-container'>
      {!isVideoLoaded && (
        <div className='loading-screen'>
          <Loader />
        </div>
      )}
      <div className={`bg ${isVideoLoaded ? 'visible' : 'hidden'}`}>
        <video
          src='videos/forgot-password-video.mp4'
          autoPlay
          loop
          muted
          onCanPlayThrough={handleVideoLoaded}
        />
      </div>
      {isVideoLoaded && (
        <div className='content'>
          <div className='auth-content'>
            <div className='title'>CineGalaxy</div>
            <div className='sub-title'>quên mật khẩu</div>
            <div className='description'>
              Nhập địa chỉ email bạn đã sử dụng khi đăng ký và chúng tôi sẽ gửi
              hướng dẫn để đặt lại mật khẩu cho bạn
            </div>
            <div className='description'>
              Vì lý do bảo mật, chúng tôi <strong>KHÔNG</strong> lưu trữ mật
              khẩu của bạn. Vì vậy, hãy yên tâm rằng chúng tôi sẽ không bao giờ
              gửi mật khẩu của bạn qua email
            </div>
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
      )}
    </div>
  )
}

export default ForgotPassword

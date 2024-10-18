import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, FileLock, Mail } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import NProgress from 'nprogress'

import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { FormInputGroup, GoogleAuth, Loader } from '~/components'
import { useLoginMutation } from '~/services/auth.service'
import { paths } from '~/utils/paths'
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '~/redux/reducers/user.reducer'
import './Login.scss'

type UserData = {
  email: string
  password: string
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user } = useAppSelector((state) => state.user)

  const [loginApi, { isLoading }] = useLoginMutation()
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)
  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      if (user.role === 0 || user.role === 1 || user.role === 2) {
        navigate(paths.dashboardPaths.dashboard)
      } else {
        navigate(paths.userPaths.home)
      }
    }
  }, [user, navigate])

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  const handleLogin: SubmitHandler<UserData> = async (reqBody) => {
    try {
      const { email, password } = reqBody
      dispatch(loginStart())
      NProgress.start()

      const response = await loginApi({ email, password }).unwrap()

      dispatch(
        loginSuccess({
          user: response.data,
        }),
      )

      Swal.fire('Thành công', response.message, 'success')

      if (
        response.user?.role === 0 ||
        response.user?.role === 1 ||
        response.user?.role === 2
      ) {
        navigate(paths.dashboardPaths.dashboard)
      }
      if (response.user?.role === 3) {
        navigate(paths.userPaths.home)
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message))
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      NProgress.done()
    }
  }

  return (
    <div className='login-container'>
      {!isVideoLoaded && (
        <div className='loading-screen'>
          <Loader />
        </div>
      )}
      <div className={`bg ${isVideoLoaded ? 'visible' : 'hidden'}`}>
        <video
          src='videos/login-video.mp4'
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
            <div className='sub-title'>Đăng nhập tài khoản</div>
            <GoogleAuth />
            <hr className='divider' />
          </div>
          <form onSubmit={handleSubmit(handleLogin)}>
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
              labelChildren={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>Email</div>
                  <div className='forgot-password-director-btn'>
                    <Link to={paths.userPaths.forgotPassword}>
                      quên mật khẩu?
                    </Link>
                  </div>
                </div>
              }
              type='text'
              id='email'
              name='email'
              icon={<Mail />}
            />
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
            <button
              type='submit'
              disabled={isLoading ? true : false}
              className='btn-submit-login'
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
                <span>{isLoading ? 'Đang đăng nhập' : 'Đăng nhập'}</span>
              </div>
            </button>
            <p>
              Đã có tài khoản?
              <Link to={paths.userPaths.register}>đăng ký</Link>
            </p>
          </form>
        </div>
      )}
    </div>
  )
}

export default Login

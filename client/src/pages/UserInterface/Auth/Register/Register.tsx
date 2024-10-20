import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Eye,
  EyeOff,
  FileLock,
  FolderPen,
  Mail,
} from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import {
  FormInputGroup,
  GoogleAuth,
  Loader,
  PasswordStrength,
} from '~/components'
import {
  useRegisterMutation,
  // useCheckEmailExistMutation,
} from '~/services/auth.service'
import './Register.scss'
import { useAppSelector } from '~/hooks/redux'

type UserData = {
  email: string
  password: string
  name: string
}

const Register = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  if (isAuthenticated && user) {
    return <Navigate to={paths.userPaths.home} />
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserData>()

  const password = watch('password')

  const navigate = useNavigate()

  const [registerApi, { isLoading }] = useRegisterMutation()
  // const [checkEmailExistApi] = useCheckEmailExistMutation();
  const [showForm, setShowForm] = useState<boolean>(false)

  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)
  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleContinueWithEmail = () => {
    setShowForm(true)
  }

  const handleBackToAuthContent = () => {
    setShowForm(false)
    reset()
  }

  const handleRegister: SubmitHandler<UserData> = async (reqBody) => {
    const { email, name, password } = reqBody

    try {
      nProgress.start()
      const response = await registerApi({
        email,
        password,
        name,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      localStorage.setItem('email', email)
      navigate(paths.userPaths.verifyOtp)
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  return (
    <div className='register-container'>
      {!isVideoLoaded && (
        <div className='loading-screen'>
          <Loader />
        </div>
      )}
      <div className={`bg ${isVideoLoaded ? 'visible' : 'hidden'}`}>
        <video
          src='videos/register-video2.mp4'
          autoPlay
          loop
          muted
          onCanPlayThrough={handleVideoLoaded}
        />
      </div>
      {isVideoLoaded && (
        <div className='content'>
          {showForm && (
            <button
              className='btn-change-tab'
              onClick={handleBackToAuthContent}
            >
              <ChevronLeft size='30' />
            </button>
          )}
          <div className={`auth-content ${showForm ? 'hidden' : 'show'}`}>
            <div className='title'>CineGalaxy</div>
            <div className='sub-title'>Đăng ký tài khoản</div>
            <GoogleAuth />
            <hr className='divider' />
            <button
              className='continue-with-email'
              onClick={handleContinueWithEmail}
            >
              Tiếp tục với email
            </button>
            <p>
              Đã có tài khoản?
              <Link to={paths.userPaths.login}>đăng nhập</Link>
            </p>
          </div>
          <form
            className={`${showForm ? 'show' : 'hidden'}`}
            onSubmit={handleSubmit(handleRegister)}
          >
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
            <FormInputGroup
              register={register}
              errors={errors}
              validation={{
                required: 'Vui lòng nhập họ tên!',
                minLength: {
                  value: 6,
                  message: 'Họ tên có tối thiểu 6 ký tự!',
                },
                maxLength: {
                  value: 50,
                  message: 'Họ tên có tối đa 50 ký tự!',
                },
                pattern: {
                  value: /^[a-zA-Z0-9\s]*$/,
                  message: 'Họ tên không được chứa ký tự đặc biệt!',
                },
              }}
              htmlFor='name'
              labelChildren='name'
              type='text'
              id='name'
              name='name'
              icon={<FolderPen />}
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
            <PasswordStrength password={password} />
            <button
              className='btn-submit-register'
              type='submit'
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
                <span>{isLoading ? 'Đang đăng ký' : 'Đăng ký'}</span>
              </div>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Register

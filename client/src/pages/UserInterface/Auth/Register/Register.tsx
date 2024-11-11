import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useRegisterMutation } from '~/services/auth.service'
import { FormInputGroup, GoogleAuth, PasswordStrength } from '~/components'
import useTitle from '~/hooks/useTitle'

const Register = () => {
  useTitle('Đăng ký')

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
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<{
    email: string
    name: string
    password: string
  }>()

  const password = watch('password')

  const navigate = useNavigate()

  const [registerApi, { isLoading }] = useRegisterMutation()

  const [showForm, setShowForm] = useState<boolean>(false)

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

  const handleRegister: SubmitHandler<{
    email: string
    name: string
    password: string
  }> = async (reqBody) => {
    const { email, password, name } = reqBody

    try {
      nProgress.start()

      const response = await registerApi({
        email,
        name,
        password,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      localStorage.setItem('email', email)
      
      navigate(paths.userPaths.verifyOtp)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center overflow-x-hidden bg-white'>
      <div className='hidden h-full min-w-[500px] items-center justify-center 1200px:flex'>
        <video
          src='videos/register-video2.mp4'
          autoPlay
          loop
          muted
          className='block h-full w-[500px] object-cover'
        />
      </div>
      <div
        className={`relative flex h-full w-full items-center justify-center`}
      >
        {showForm && (
          <button
            className='absolute left-[50px] top-[50px] hidden h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border-2 border-[#ddd] bg-white transition duration-300 hover:bg-black hover:text-white 700px:flex'
            onClick={handleBackToAuthContent}
          >
            <ChevronLeft size='30' />
          </button>
        )}
        <div className='relative mx-auto flex h-full w-[500px] flex-col items-center justify-center'>
          <div
            className={`${showForm ? 'opacity-0' : 'opacity-1'} opacity-1 absolute w-[500px] rounded-[3px]`}
          >
            <div className='mb-[30px] text-center text-xl font-semibold capitalize'>
              Đăng ký tài khoản
            </div>
            <GoogleAuth />
            <div className='relative my-4 flex items-center'>
              <hr className='flex-grow border-t border-gray-400' />
              <span className='mx-4 bg-white px-4 font-semibold text-gray-600'>
                OR
              </span>
              <hr className='flex-grow border-t border-gray-400' />
            </div>
            <button
              className='w-full cursor-pointer rounded-[40px] border-2 border-[#ddd] bg-white p-6 text-sm font-semibold transition duration-300 hover:border-2 hover:border-[#f97417] hover:bg-[#f97417] hover:text-white'
              onClick={handleContinueWithEmail}
            >
              Tiếp tục với email
            </button>
            <p className='mt-6 text-center capitalize'>
              Đã có tài khoản?
              <Link
                to={paths.userPaths.login}
                className='ml-1 capitalize underline transition duration-300 hover:text-[red]'
              >
                đăng nhập
              </Link>
            </p>
          </div>
          <form
            className={`${showForm ? 'block' : 'hidden'} z-10 w-full p-4`}
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
              placeholder='Vui lòng nhập tên!'
            />
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
              name='password'
              children={
                <button
                  type='button'
                  className='absolute right-3 top-[50%] z-10 flex translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-white p-3'
                  onClick={handleShowHidePassword}
                >
                  {showHidePassword ? <Eye size='18' /> : <EyeOff size='18' />}
                </button>
              }
              placeholder='Vui lòng nhập mật khẩu!'
            />
            <PasswordStrength password={password} />
            <button
              className='mt-5 flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
              type='submit'
              disabled={isLoading ? true : false}
            >
              <div className='flex items-center justify-center gap-[10px]'>
                {isLoading && <HashLoader size='20' color='#fff' />}
                <span>{isLoading ? 'Đang đăng ký' : 'Đăng ký'}</span>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

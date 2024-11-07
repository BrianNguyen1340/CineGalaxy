import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useLoginMutation } from '~/services/auth.service'
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '~/redux/reducers/user.reducer'
import { FormInputGroup } from '~/components'

const PrivateLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user } = useAppSelector((state) => state.user)
  if (user) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string
    password: string
  }>()

  const [loginApi, { isLoading }] = useLoginMutation()
  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleLogin: SubmitHandler<{
    email: string
    password: string
  }> = async (reqBody) => {
    try {
      const { email, password } = reqBody
      dispatch(loginStart())
      nProgress.start()

      const response = await loginApi({ email, password }).unwrap()

      dispatch(
        loginSuccess({
          user: response.data,
        }),
      )

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.dashboard)
    } catch (error: any) {
      dispatch(loginFailure(error.data.message))
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative flex h-screen w-full items-center justify-center bg-white'>
      <div className='bordert-2 w-[500px] rounded-[20px] border-l-2 border-r-2 border-[#eee] p-5 shadow-md'>
        <div className='mb-[30px] text-center text-xl font-semibold capitalize'>
          login panel
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
              <div className='flex items-center justify-between'>
                <div>Email</div>
                <div>
                  <Link
                    to={paths.userPaths.privateForgotPassword}
                    className='italic hover:text-[red] hover:underline hover:opacity-80'
                  >
                    quên mật khẩu?
                  </Link>
                </div>
              </div>
            }
            type='text'
            id='email'
            name='email'
            placeholder='example@gmail.com'
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
                {showHidePassword ? <Eye size='20' /> : <EyeOff size='20' />}
              </button>
            }
            placeholder='Vui lòng nhập mật khẩu!'
          />
          <button
            type='submit'
            disabled={isLoading ? true : false}
            className='flex w-full cursor-pointer items-center justify-center rounded-[40px] bg-[#f97417] p-5 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
          >
            <div className='flex items-center justify-center gap-[10px]'>
              {isLoading && <HashLoader size='20' color='#fff' />}
              <span>{isLoading ? 'Đang đăng nhập' : 'Đăng nhập'}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}

export default PrivateLogin

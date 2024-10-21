import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, FileLock, Mail } from 'lucide-react'
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
import './PrivateLogin.scss'

type UserData = {
  email: string
  password: string
}

const PrivateLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserData>()

  const [loginApi, { isLoading }] = useLoginMutation()
  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleLogin: SubmitHandler<UserData> = async (reqBody) => {
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
      dispatch(loginFailure(error.message))
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 0 || user?.role === 1 || user?.role === 2) {
        navigate(paths.dashboardPaths.dashboard)
      } else if (user?.role === 3) {
        navigate(paths.userPaths.home)
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <div className='private-login-container'>
      <div className='content'>
        <div className='title'>login panel</div>
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
                  <Link to={paths.userPaths.privateForgotPassword}>
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
        </form>
      </div>
    </div>
  )
}

export default PrivateLogin

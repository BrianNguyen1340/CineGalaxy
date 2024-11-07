import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { auth } from '~/firebase/firebase.config'
import { useGoogleLoginMutation } from '~/services/auth.service'
import { useAppDispatch } from '~/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { paths } from '~/utils/paths'
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '~/redux/reducers/user.reducer'

const GoogleAuth = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [googleLoginApi, { isLoading }] = useGoogleLoginMutation()

  const handleGoogleClick = async () => {
    try {
      dispatch(loginStart())
      nProgress.start()

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const email = result.user.email
      const name = result.user.displayName
      const photoURL = result.user.photoURL

      if (!email || !name || !photoURL) {
        throw new Error('Missing data!')
      }
      const response = await googleLoginApi({
        email,
        name,
        photoURL,
      }).unwrap()

      dispatch(
        loginSuccess({
          user: response.data,
        }),
      )

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.userPaths.home)
    } catch (error: any) {
      dispatch(loginFailure(error.message))
      Swal.fire('Thất bại!', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <button
      type='button'
      className='flex w-full cursor-pointer items-center justify-center gap-3 rounded-[40px] bg-[#0d0c22] p-6 text-sm font-semibold capitalize text-white transition duration-500 hover:opacity-70'
      onClick={handleGoogleClick}
      disabled={isLoading ? true : false}
    >
      <FcGoogle size='16' />
      <span>{isLoading ? 'Đang đăng nhập' : 'Đăng nhập với google'}</span>
    </button>
  )
}

export default GoogleAuth

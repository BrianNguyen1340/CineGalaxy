import { FcGoogle } from 'react-icons/fc'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { auth } from '~/firebase/firebase.config'
import { useGoogleLoginMutation } from '~/services/auth.service'
import { useAppDispatch } from '~/hooks/redux'
import { useNavigate } from 'react-router-dom'
import { paths } from '~/utils/paths'
import { setCredentials } from '~/redux/reducers/user.reducer'

const GoogleAuth = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [googleLoginApi, { isLoading: isLoadingGoogleLogin }] =
    useGoogleLoginMutation()

  const handleGoogleClick = async () => {
    try {
      nProgress.start()

      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const email = result.user.email
      const name = result.user.displayName
      const photoURL = result.user.photoURL

      if (!email || !name || !photoURL) {
        throw new Error('Missing data!')
      }
      
      const { data, accessToken, message } = await googleLoginApi({
        email,
        name,
        photoURL,
      }).unwrap()

      dispatch(
        setCredentials({
          user: data,
          token: accessToken,
        }),
      )

      Swal.fire('Thành công', message, 'success')
      navigate(paths.userPaths.home)
    } catch (error: any) {
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
      disabled={isLoadingGoogleLogin ? true : false}
    >
      <FcGoogle size='16' />
      <span>
        {isLoadingGoogleLogin ? 'Đang đăng nhập' : 'Đăng nhập với google'}
      </span>
    </button>
  )
}

export default GoogleAuth

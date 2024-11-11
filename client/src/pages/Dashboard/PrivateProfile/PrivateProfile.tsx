import { useAppSelector } from '~/hooks/redux'
import useTitle from '~/hooks/useTitle'

const PrivateProfile = () => {
  useTitle('Trang thông tin cá nhân')

  const { user } = useAppSelector((state) => state.user)

  return <div className='relative h-fit w-full'></div>
}

export default PrivateProfile

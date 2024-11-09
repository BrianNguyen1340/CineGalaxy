import { useAppSelector } from '~/hooks/redux'

const PrivateProfile = () => {
  const { user } = useAppSelector((state) => state.user)

  return <div className='relative h-fit w-full'></div>
}

export default PrivateProfile

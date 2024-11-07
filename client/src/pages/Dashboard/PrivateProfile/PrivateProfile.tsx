import { useAppSelector } from '~/hooks/redux'

const PrivateProfile = () => {
  const { user } = useAppSelector((state) => state.user)

  return (
    <div>
      <img src={user?.photoURL} alt='' />
    </div>
  )
}

export default PrivateProfile

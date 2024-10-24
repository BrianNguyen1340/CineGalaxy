import { useNavigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'

import { useGetUserByAdminQuery } from '~/services/user.service'
import './UpdateAccount.scss'

const UpdateAccount = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const { data: user, refetch } = useGetUserByAdminQuery(id)
  console.log(user)

  return (
    <div className='update-account-container'>
      <div className='title'>
        <span>Cập nhật tài khoản</span>
        <Star color='yellow' />
        {user?.data?.name}
        <Star color='yellow' />
      </div>
    </div>
  )
}

export default UpdateAccount

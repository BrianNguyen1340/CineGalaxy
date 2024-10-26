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
    <div className='container'>
      <div className='title'>Cập nhật tài khoản</div>
    </div>
  )
}

export default UpdateAccount

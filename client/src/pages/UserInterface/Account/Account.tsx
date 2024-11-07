import { Link } from 'react-router-dom'
import { PiUserList } from 'react-icons/pi'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'

const Account = () => {
  const { user } = useAppSelector((state) => state.user)

  return (
    <div className='relative h-fit w-full'>
      <div className='mx-auto w-[1000px] py-12'>
        <div className='mb-12'>
          <h1 className='text-xl font-semibold capitalize'>tài khoản</h1>
          <div className='mt-[10px] text-lg'>
            <strong>{user?.name}</strong>, {user?.email}.
          </div>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <div
            className='min-h-[156px] rounded-[12px] transition duration-300 hover:scale-[1.05]'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px ' }}
          >
            <Link
              to={paths.userPaths.profile}
              className='block h-full w-full p-4'
            >
              <div className='mb-5'>
                <PiUserList size='30' />
              </div>
              <div>
                <div className='mb-3 font-semibold'>Thông tin cá nhân</div>
                <div className='text-[#555]'>
                  Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ
                  với bạn
                </div>
              </div>
            </Link>
          </div>
          <div
            className='min-h-[156px] rounded-[12px] transition duration-300 hover:scale-[1.05]'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px ' }}
          >
            <Link
              to={paths.userPaths.profile}
              className='block h-full w-full p-4'
            >
              <div className='mb-5'>
                <PiUserList size='30' />
              </div>
              <div>
                <div className='mb-3 font-semibold'>Thông tin cá nhân</div>
                <div className='text-[#555]'>
                  Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ
                  với bạn
                </div>
              </div>
            </Link>
          </div>
          <div
            className='min-h-[156px] rounded-[12px] transition duration-300 hover:scale-[1.05]'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px ' }}
          >
            <Link
              to={paths.userPaths.profile}
              className='block h-full w-full p-4'
            >
              <div className='mb-5'>
                <PiUserList size='30' />
              </div>
              <div>
                <div className='mb-3 font-semibold'>Thông tin cá nhân</div>
                <div className='text-[#555]'>
                  Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ
                  với bạn
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { PiUserList } from 'react-icons/pi'
import { TbPasswordFingerprint } from 'react-icons/tb'
import { Eye, EyeOff } from 'lucide-react'
import { HashLoader } from 'react-spinners'
import ReactModal from 'react-modal'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useUpdatePasswordMutation } from '~/services/user.service'
import { FormInputGroup, PasswordStrength } from '~/components'
import useTitle from '~/hooks/useTitle'

ReactModal.setAppElement('#root')

const Account = () => {
  useTitle('Tài khoản')

  const { user } = useAppSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ password: string; confirmPassword: string }>()

  const password = watch('password')

  const [updateApi, { isLoading }] = useUpdatePasswordMutation()

  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const [showHidePassword, setShowHidePassword] = useState<boolean>(false)
  const [showHideConfirmPassword, setShowHideConfirmPassword] =
    useState<boolean>(false)

  const handleShowHidePassword = () => {
    setShowHidePassword((prevState) => !prevState)
  }

  const handleShowHideConfirmPassword = () => {
    setShowHideConfirmPassword((prevState) => !prevState)
  }

  const handleChangePassword: SubmitHandler<{
    password: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { password } = reqBody

      await updateApi({ id: user?.id, password }).unwrap()

      setIsOpen(false)

      Swal.fire('Thành công', 'Thay đổi mật khẩu thành công!', 'success')
    } catch (error: any) {
      Swal.fire('Thất bại', error.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full'>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: '400px',
          },
        }}
      >
        <div className='p-4 text-center text-xl font-semibold capitalize'>
          thay đổi mật khẩu
        </div>
        <form onSubmit={handleSubmit(handleChangePassword)}>
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
                {showHidePassword ? <Eye size='18' /> : <EyeOff size='18' />}
              </button>
            }
            placeholder='Vui lòng nhập mật khẩu'
          />
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng xác nhận mật khẩu!',
              validate: (value) =>
                value === watch('password') || 'Mật khẩu xác nhận không khớp',
            }}
            htmlFor='confirmPassword'
            labelChildren='xác nhận mật khẩu'
            type={showHideConfirmPassword ? 'text' : 'password'}
            id='confirmPassword'
            name='confirmPassword'
            children={
              <button
                type='button'
                className='absolute right-3 top-[50%] z-10 flex translate-y-[-50%] cursor-pointer items-center justify-center rounded-full bg-white p-3'
                onClick={handleShowHideConfirmPassword}
              >
                {showHideConfirmPassword ? (
                  <Eye size='18' />
                ) : (
                  <EyeOff size='18' />
                )}
              </button>
            }
            placeholder='Vui lòng xác nhận mật khẩu'
          />
          <PasswordStrength password={password} />
          <div className='mt-6 flex items-center justify-center gap-4'>
            <div
              className='cursor-pointer rounded border-2 px-3 py-2 font-semibold capitalize transition duration-500 hover:bg-black hover:text-white'
              onClick={closeModal}
            >
              hủy
            </div>
            <button
              type='submit'
              disabled={isLoading ? true : false}
              className='flex w-fit cursor-pointer items-center justify-center rounded bg-[#f97417] px-4 py-2 text-base font-semibold capitalize text-white transition duration-300 hover:opacity-80'
            >
              <div className='flex items-center justify-center gap-3'>
                {isLoading && <HashLoader size='16' color='#fff' />}
                <span>{isLoading ? 'Đang lưu' : 'Lưu'}</span>
              </div>
            </button>
          </div>
        </form>
      </ReactModal>
      <div className='mx-auto w-[1000px] py-12'>
        <div className='mb-12'>
          <h1 className='text-xl font-semibold capitalize'>tài khoản</h1>
          <div className='mt-[10px] text-lg'>
            <strong>{user?.name}</strong>, {user?.email}.
          </div>
        </div>
        <div className='grid grid-cols-3 gap-5'>
          <div
            className='min-h-[156px] rounded-[12px] transition duration-500 hover:scale-[1.05]'
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
            className='relative min-h-[156px] cursor-pointer rounded-[12px] transition duration-500 hover:scale-[1.05]'
            style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px' }}
            onClick={openModal}
          >
            <div className='h-full w-full p-4'>
              <div className='mb-5'>
                <TbPasswordFingerprint size='30' />
              </div>
              <div>
                <div className='mb-3 font-semibold'>Thay đổi mật khẩu</div>
                <div className='text-[#555]'>
                  Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ
                  với bạn
                </div>
              </div>
            </div>
          </div>
          <div
            className='min-h-[156px] rounded-[12px] transition duration-500 hover:scale-[1.05]'
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

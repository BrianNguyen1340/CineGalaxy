import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatLoader, HashLoader } from 'react-spinners'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import { useGetUserQuery, useUpdateUserMutation } from '~/services/user.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateAccount = () => {
  useTitle('Admin | Cập nhật tài khoản')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    email: string
    name: string
    role: number
  }>()

  const {
    data: user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    refetch: refetchUser,
  } = useGetUserQuery(id)

  useEffect(() => {
    if (user?.data) {
      setValue('name', user?.data?.name)
      setValue('email', user?.data?.email)
      setValue('role', user?.data?.role)
    }
  }, [setValue, user])

  useEffect(() => {
    refetchUser()
  }, [refetchUser])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateUserMutation()

  const handleUpdate: SubmitHandler<{
    email: string
    name: string
    role: number
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { email, name, role } = reqBody
      const response = await updateApi({ id, email, name, role }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.accounts.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingUser)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )
  if (isSuccessUser) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật tài khoản
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên người dùng!',
            }}
            labelChildren='tên người dùng'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên người dùng'
            type='text'
            name='name'
          />

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
            labelChildren='email'
            type='text'
            id='email'
            name='email'
            placeholder='example@.com'
          />

          <div className='my-5 flex flex-col'>
            <label htmlFor='role' className='mb-1 font-semibold capitalize'>
              Chọn vai trò người dùng
            </label>
            <select
              {...register('role', {
                required: 'Vui lòng chọn vai trò người dùng',
              })}
              name='role'
              id='role'
              className='p-2 capitalize'
            >
              <option>Chọn vai trò</option>
              <option value='0'>0</option>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
            </select>
          </div>

          <button
            type='submit'
            disabled={isLoadingUpdate ? true : false}
            className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
          >
            <div className='flex items-center justify-center gap-3'>
              {isLoadingUpdate && <HashLoader size='20' color='#fff' />}
              <span className='capitalize'>
                {isLoadingUpdate ? 'đang lưu' : 'lưu'}
              </span>
            </div>
          </button>
        </form>
      </div>
    )
  }

  return content
}

export default UpdateAccount

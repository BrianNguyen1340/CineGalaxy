import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateCinemaMutation } from '~/services/cinema.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { CinemaComplexType } from '~/types/cinemaComplex.type'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên rạp là bắt buộc'),
  email: Yup.string().trim().email().required('Email rạp là bắt buộc'),
  address: Yup.string().trim().required('Địa chỉ rạp là bắt buộc'),
  phone: Yup.string().trim().required('Số điện thoại rạp là bắt buộc'),
  cinemaComplex: Yup.string().trim().required('Tên cụm rạp là bắt buộc'),
})

const CreateCinema = () => {
  useTitle('Admin | Tạp rạp')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string
    email: string
    address: string
    phone: string
    cinemaComplex: string
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: cinemaComplexes,
    isLoading,
    isSuccess,
    refetch,
  } = useGetCinemaComplexesQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [createApi, { isLoading: isLoadingCreate }] = useCreateCinemaMutation()

  const handleCreate: SubmitHandler<{
    name: string
    email: string
    address: string
    phone: string
    cinemaComplex: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, email, phone, address, cinemaComplex } = reqBody
      const response = await createApi({
        name,
        email,
        phone,
        address,
        cinemaComplex,
      }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.cinemas.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoading) content = <div>Loading...</div>
  if (isSuccess) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo rạp
        </div>
        
        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên rạp!',
            }}
            labelChildren='tên rạp'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên rạp'
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
            labelChildren='email'
            htmlFor='email'
            id='email'
            placeholder='Vui lòng nhập email'
            type='text'
            name='email'
          />

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập địa chỉ rạp!',
            }}
            labelChildren='address'
            htmlFor='address'
            id='address'
            placeholder='Vui lòng nhập địa chỉ rạp'
            type='text'
            name='address'
          />

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập số điện thoại rạp!',
            }}
            labelChildren='phone'
            htmlFor='phone'
            id='phone'
            placeholder='Vui lòng nhập số điện thoại rạp'
            type='text'
            name='phone'
          />

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='cinemaComplex'
              className='mb-1 font-semibold capitalize'
            >
              cụm rạp
            </label>
            <select
              {...register('cinemaComplex', {
                required: 'Vui lòng chọn cụm rạp',
              })}
              id='cinemaComplex'
              name='cinemaComplex'
              className='p-2 capitalize'
            >
              <option>Chọn cụm rạp</option>
              {cinemaComplexes?.data?.map(
                (item: CinemaComplexType, index: number) => (
                  <option key={index} value={item._id} className='capitalize'>
                    {item?.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <button
            type='submit'
            disabled={isLoadingCreate ? true : false}
            className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
          >
            <div className='flex items-center justify-center gap-3'>
              {isLoadingCreate && <HashLoader size='20' color='#fff' />}
              <span className='capitalize'>
                {isLoadingCreate ? 'đang lưu' : 'lưu'}
              </span>
            </div>
          </button>
        </form>
      </div>
    )
  }

  return content
}

export default CreateCinema

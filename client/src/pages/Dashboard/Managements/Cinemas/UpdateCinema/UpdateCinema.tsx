import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { FormInputGroup, Loader } from '~/components'
import {
  useGetCinemaQuery,
  useUpdateCinemaMutation,
} from '~/services/cinema.service'
import { useGetAllCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { paths } from '~/utils/paths'
import './UpdateCinema.scss'

const UpdateCinema = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string
    email: string
    phone: string
    address: string
    cinemaComplex: string
  }>()

  const { data: cinema, refetch } = useGetCinemaQuery(id)
  const { data: cinemaComplexes = [], isLoading: isLoadingCinemaComplexes } =
    useGetAllCinemaComplexesQuery({})

  const [updateApi, { isLoading }] = useUpdateCinemaMutation()

  useEffect(() => {
    if (cinema?.data) {
      setValue('name', cinema?.data?.name)
      setValue('email', cinema?.data?.email)
      setValue('phone', cinema?.data?.phone)
      setValue('address', cinema?.data?.address)
      setValue('cinemaComplex', cinema?.data?.cinemaComplex?._id)
    }
  }, [cinema, setValue])

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoadingCinemaComplexes) {
    return <Loader />
  }

  const handleUpdate: SubmitHandler<{
    name: string
    email: string
    phone: string
    address: string
    cinemaComplex: string
  }> = async (reqBody) => {
    try {
      const { name, email, phone, address, cinemaComplex } = reqBody

      const response = await updateApi({
        id,
        name,
        email,
        phone,
        address,
        cinemaComplex,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.cinemas.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='container'>
      <div className='title'>cập nhật rạp</div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
        style={{ width: '500px', margin: '0 auto' }}
      >
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{ required: 'Vui lòng nhập tên!' }}
          htmlFor='name'
          labelChildren='name'
          type='text'
          id='name'
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
            required: 'Vui lòng nhập địa chỉ!',
          }}
          labelChildren='address'
          htmlFor='address'
          id='address'
          placeholder='Vui lòng nhập địa chỉ'
          type='text'
          name='address'
        />
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập số điện thoại!',
          }}
          labelChildren='phone'
          htmlFor='phone'
          id='phone'
          placeholder='Vui lòng nhập số điện thoại'
          type='text'
          name='phone'
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            marginBottom: '20px',
          }}
        >
          <label
            htmlFor=''
            style={{ textTransform: 'capitalize', fontWeight: 700 }}
          >
            cụm rạp
          </label>
          <select
            {...register('cinemaComplex', {
              required: 'Vui lòng chọn cụm rạp',
            })}
            id='cinemaComplex'
            name='cinemaComplex'
            style={{ padding: '10px', outline: 'none' }}
          >
            <option value=''>Chọn cụm rạp</option>
            {cinemaComplexes?.data?.map((item: any) => (
              <option key={item?._id} value={item?._id}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          disabled={isLoading ? true : false}
          className='btn-update'
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {isLoading && <HashLoader size='20' color='#fff' />}
            <span>{isLoading ? 'Đang cập nhật' : 'Cập nhật'}</span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default UpdateCinema

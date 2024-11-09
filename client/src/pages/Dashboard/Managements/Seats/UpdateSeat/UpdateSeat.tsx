import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useGetSeatQuery, useUpdateSeatMutation } from '~/services/seat.service'
import { FaRegStar } from 'react-icons/fa'
import { FormInputGroup, Loader } from '~/components'
import { paths } from '~/utils/paths'

const UpdateSeat = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    row: string
    number: number
    type: string
    status: string
    price: number
  }>()

  const { data: seat, refetch, isLoading: isLoadingSeat } = useGetSeatQuery(id)
  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateSeatMutation()

  useEffect(() => {
    if (seat?.data) {
      setValue('row', seat?.data?.row)
      setValue('number', seat?.data?.number)
      setValue('type', seat?.data?.type)
      setValue('status', seat?.data?.status)
      setValue('price', seat?.data?.price)
    }
  }, [seat, setValue])

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoadingSeat) {
    return <Loader />
  }

  const handleUpdate: SubmitHandler<{
    row: string
    number: number
    type: string
    status: string
    price: number
  }> = async (reqBody) => {
    try {
      const { row, number, type, status, price } = reqBody

      const response = await updateApi({
        id,
        row,
        number,
        type,
        status,
        price,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.seats.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        cập nhật ghế
      </div>
      <form onSubmit={handleSubmit(handleUpdate)} className='mx-auto w-[500px]'>
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='subtitle'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            hàng ghế
          </label>
          <select
            {...register('row', {
              required: 'Vui lòng chọn hàng ghế',
            })}
            id='row'
            name='row'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn hàng ghế
            </option>
            <option value='A'>A</option>
            <option value='B'>B</option>
            <option value='C'>C</option>
            <option value='D'>D</option>
            <option value='E'>E</option>
            <option value='E'>E</option>
            <option value='F'>F</option>
            <option value='G'>G</option>
            <option value='H'>H</option>
            <option value='I'>I</option>
            <option value='J'>J</option>
          </select>
        </div>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập số ghế!',
            pattern: {
              value: /^\d+$/,
              message: 'Chỉ được nhập số',
            },
          }}
          labelChildren='số ghế'
          htmlFor='number'
          id='number'
          placeholder='Vui lòng nhập số ghế'
          type='text'
          name='number'
          icon={<FaRegStar color='red' />}
        />
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='subtitle'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            loại ghế
          </label>
          <select
            {...register('type', {
              required: 'Vui lòng chọn loại ghế',
            })}
            id='type'
            name='type'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn loại ghế
            </option>
            <option value='Standard'>Standard</option>
            <option value='Vip'>Vip</option>
            <option value='Kid'>Kid</option>
            <option value='Couple'>Couple</option>
          </select>
        </div>
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='subtitle'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            trạng thái ghế
          </label>
          <select
            {...register('status', {
              required: 'Vui lòng chọn trạng thái ghế',
            })}
            id='status'
            name='status'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn trạng thái ghế
            </option>
            <option value='Available'>Available</option>
            <option value='Unavailable'>Unavailable</option>
            <option value='Booked'>Booked</option>
          </select>
        </div>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập giá ghế!',
            pattern: {
              value: /^\d+$/,
              message: 'Chỉ được nhập số',
            },
          }}
          labelChildren='giá ghế'
          htmlFor='price'
          id='price'
          placeholder='Vui lòng nhập giá ghế'
          type='text'
          name='price'
          icon={<FaRegStar color='red' />}
        />
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

export default UpdateSeat

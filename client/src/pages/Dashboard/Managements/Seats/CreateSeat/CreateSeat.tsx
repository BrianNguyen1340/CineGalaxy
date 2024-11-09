import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { FaRegStar } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateSeatMutation } from '~/services/seat.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { FormInputGroup, Loader } from '~/components'
import { paths } from '~/utils/paths'

const CreateSeat = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    row: string
    number: number
    type: string
    room: string
  }>()

  const navigate = useNavigate()

  const { data: rooms, isLoading: isLoadingRooms } = useGetRoomsQuery({})
  console.log(rooms)
  const [createApi, { isLoading }] = useCreateSeatMutation()

  const handleCreate: SubmitHandler<{
    row: string
    number: number
    type: string
    room: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { row, number, room, type } = reqBody

      const response = await createApi({
        row,
        number,
        room,
        type,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.seats.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  if (isLoadingRooms) {
    return <Loader />
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạo ghế
      </div>
      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        <div className='mb-6 flex flex-col'>
          <label className='mb-1 font-semibold capitalize'>hàng ghế</label>
          <select
            {...register('row', {
              required: 'Vui lòng chọn hàng ghế',
            })}
            id='row'
            name='row'
            className='p-2'
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
        <div className='mb-6 flex flex-col'>
          <label htmlFor='subtitle' className='mb-1 font-semibold capitalize'>
            loại ghế
          </label>
          <select
            {...register('type', {
              required: 'Vui lòng chọn loại ghế',
            })}
            id='type'
            name='type'
            className='p-2'
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
        <div className='mb-6 flex flex-col'>
          <label htmlFor='subtitle' className='mb-1 font-semibold capitalize'>
            phòng
          </label>
          <select
            {...register('room', {
              required: 'Vui lòng chọn loại ghế',
            })}
            id='room'
            name='room'
            className='p-2'
          >
            <option value='' aria-hidden='true'>
              Chọn phòng
            </option>
            {rooms?.data?.map((room: any) => (
              <option key={room._id} value={room._id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          disabled={isLoading ? true : false}
          className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
        >
          <div className='flex items-center justify-center gap-3'>
            {isLoading && <HashLoader size='20' color='#fff' />}
            <span className='capitalize'>{isLoading ? 'đang lưu' : 'lưu'}</span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default CreateSeat

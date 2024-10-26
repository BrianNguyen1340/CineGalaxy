import { SubmitHandler, useForm } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateRoomMutation } from '~/services/room.service'
import { useGetAllCinemaQuery } from '~/services/cinema.service'
import { paths } from '~/utils/paths'
import { FormInputGroup, Loader } from '~/components'
import './CreateRoom.scss'

const CreateRoom = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string
    opacity: number
    status: string
    screen: string
    cinema: string
  }>()

  const navigate = useNavigate()

  const [createApi, { isLoading }] = useCreateRoomMutation()
  const { data: cinemas, isLoading: isLoadingCinemas } = useGetAllCinemaQuery(
    {},
  )

  const handleCreate: SubmitHandler<{
    name: string
    opacity: number
    status: string
    screen: string
    cinema: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, opacity, status, screen, cinema } = reqBody

      const response = await createApi({
        name,
        opacity,
        status,
        screen,
        cinema,
      }).unwrap()

      if (!response.success) {
        Swal.fire('Thất bại', response.message, 'error')
      }

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.rooms.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  if (isLoadingCinemas) {
    return <Loader />
  }

  return (
    <div className='container'>
      <div className='title'>tạp phòng</div>
      <form
        onSubmit={handleSubmit(handleCreate)}
        style={{ width: '500px', margin: '0 auto' }}
      >
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên!',
          }}
          labelChildren='name'
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
            required: 'Vui lòng sức chứa phòng!',
            pattern: {
              value: /^\d+$/,
              message: 'Chỉ được nhập số',
            },
          }}
          labelChildren='opacity'
          htmlFor='opacity'
          id='opacity'
          placeholder='Vui lòng sức chứa phòng'
          type='text'
          name='opacity'
        />
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='status'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            tình trạng
          </label>
          <select
            {...register('status', {
              required: 'Vui lòng chọn tình trạng',
            })}
            id='status'
            name='status'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn tình trạng
            </option>
            <option value='có sẵn'>có sẵn</option>
            <option value='bảo trì'>bảo trì</option>
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
            htmlFor='screen'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            loại màn hình
          </label>
          <select
            {...register('screen', {
              required: 'Vui lòng chọn loại màn hình',
            })}
            id='screen'
            name='screen'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn loại màn hình
            </option>
            <option value='2D'>2D</option>
            <option value='3D'>3D</option>
          </select>
        </div>
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
            rạp
          </label>
          <select
            {...register('cinema', {
              required: 'Vui lòng chọn rạp',
            })}
            id='cinema'
            name='cinema'
            style={{ padding: '10px', outline: 'none' }}
          >
            <option value=''>Chọn rạp</option>
            {cinemas?.data?.map((item: any) => (
              <option key={item?._id} value={item?._id}>
                {item?.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          disabled={isLoading ? true : false}
          className='btn-create'
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
            <span>{isLoading ? 'Đang tạo' : 'Tạo'}</span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default CreateRoom

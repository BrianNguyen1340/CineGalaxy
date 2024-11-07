import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import { FormInputGroup, Loader } from '~/components'
import { useUpdateRoomMutation, useGetRoomQuery } from '~/services/room.service'
import { useGetAllCinemaQuery } from '~/services/cinema.service'

const UpdateRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string
    opacity: number
    status: string
    screen: string
    cinema: string
  }>()

  const {
    data: room,
    refetch: refetchRoom,
    isLoading: isLoadingRoom,
  } = useGetRoomQuery(id)
  const {
    data: cinemas = [],
    refetch: refetchCinema,
    isLoading: isLoadingCinema,
  } = useGetAllCinemaQuery({})
  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateRoomMutation()

  useEffect(() => {
    if (room?.data) {
      setValue('name', room?.data?.name)
      setValue('opacity', room?.data?.opacity)
      setValue('status', room?.data?.status)
      setValue('screen', room?.data?.screen)
      setValue('cinema', room?.data?.cinema?._id)
    }
  }, [setValue, room])

  useEffect(() => {
    refetchCinema()
    refetchRoom()
  }, [refetchCinema, refetchRoom])

  const handleUpdate: SubmitHandler<{
    name: string
    opacity: number
    status: string
    screen: string
    cinema: string
  }> = async (reqBody) => {
    try {
      const { name, opacity, status, screen, cinema } = reqBody
      const response = await updateApi({
        id,
        name,
        opacity,
        status,
        screen,
        cinema,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.rooms.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  if (isLoadingRoom && isLoadingUpdate && isLoadingCinema) {
    return <Loader />
  }

  return (
    <div className='container'>
      <div className='title'>cập nhật phòng</div>
      <form
        onSubmit={handleSubmit(handleUpdate)}
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
          disabled={isLoadingUpdate ? true : false}
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
            {isLoadingUpdate && <HashLoader size='20' color='#fff' />}
            <span>{isLoadingUpdate ? 'Đang cập nhật' : 'Cập nhật'}</span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default UpdateRoom

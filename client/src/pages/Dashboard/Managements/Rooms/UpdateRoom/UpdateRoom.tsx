import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import { useUpdateRoomMutation, useGetRoomQuery } from '~/services/room.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên phòng là bắt buộc'),
  opacity: Yup.number().required('Sức chứa phòng là bắt buộc'),
  status: Yup.string().trim().required('Tình trạng phòng là bắt buộc'),
  screen: Yup.string().trim().required('Màn hình phòng là bắt buộc'),
  cinema: Yup.string().trim().required('Rạp của phòng là bắt buộc'),
})

const UpdateRoom = () => {
  useTitle('Admin | Cập nhật phòng')

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
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: room,
    isLoading: isLoadingRoom,
    isSuccess: isSuccessRoom,
    refetch: refetchRoom,
  } = useGetRoomQuery(id)

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinema,
  } = useGetCinemasQuery({})

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

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateRoomMutation()

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

  let content

  if (isLoadingRoom || isLoadingUpdate || isLoadingCinemas)
    content = <div>Loading...</div>

  if (isSuccessRoom || isSuccessCinemas) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật phòng
        </div>
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
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

export default UpdateRoom

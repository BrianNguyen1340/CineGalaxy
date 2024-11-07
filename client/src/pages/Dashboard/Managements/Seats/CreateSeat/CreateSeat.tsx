import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { FaRegStar } from 'react-icons/fa'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateSeatMutation } from '~/services/seat.service'
import { FormInputGroup } from '~/components'
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
    status: string
    price: string
  }>()

  const navigate = useNavigate()

  const [createApi, { isLoading }] = useCreateSeatMutation()

  const handleCreate: SubmitHandler<{
    row: string
    number: number
    type: string
    status: string
    price: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { row, number, status, type, price } = reqBody

      const response = await createApi({
        row,
        number,
        status,
        type,
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
    <div className='container'>
      <div className='title'>tạo ghế</div>
      <form
        onSubmit={handleSubmit(handleCreate)}
        style={{ width: '500px', margin: '0 auto' }}
      >
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
          disabled={isLoading ? true : false}
          className='btn-create'
        >
          {isLoading ? 'Đang tạo' : 'Tạo'}
        </button>
      </form>
    </div>
  )
}

export default CreateSeat

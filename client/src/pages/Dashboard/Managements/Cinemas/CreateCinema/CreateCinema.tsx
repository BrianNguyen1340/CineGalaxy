import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateCinemaMutation } from '~/services/cinema.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import './CreateCinema.scss'

const CreateCinema = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; email: string; phone: string; address: string }>()

  const [createApi, { isLoading }] = useCreateCinemaMutation()

  const handleCreate: SubmitHandler<{
    name: string
    email: string
    phone: string
    address: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, email, phone, address } = reqBody

      const response = await createApi({ name, email, phone, address }).unwrap()

      if (!response.success) {
        Swal.fire('Thất bại', response.message, 'error')
      }

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.cinemas.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='create-cinema-container'>
      <div className='title'>tạo rạp</div>
      <form onSubmit={handleSubmit(handleCreate)}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
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
              required: 'Vui lòng nhập số điện thoại!',
            }}
            labelChildren='phone'
            htmlFor='phone'
            id='phone'
            placeholder='Vui lòng nhập số điện thoại'
            type='text'
            name='phone'
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

export default CreateCinema

import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateGenreMutation } from '~/services/genre.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'

const CreateGenre = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>()

  const navigate = useNavigate()

  const [createApi, { isLoading }] = useCreateGenreMutation()

  const handleCreate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name } = reqBody

      const response = await createApi({ name }).unwrap()

      if (!response.success) {
        Swal.fire('Thất bại', response.message, 'error')
      }

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.genres.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='container'>
      <div className='title'>tạo danh mục phim</div>
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
          placeholder='Vui lòng nhập tên danh mục'
          type='text'
          name='name'
        />
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

export default CreateGenre

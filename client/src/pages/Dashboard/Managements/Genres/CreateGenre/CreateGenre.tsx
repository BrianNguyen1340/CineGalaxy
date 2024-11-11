import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateGenreMutation } from '~/services/genre.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên thể loại phim là bắt buộc'),
})

const CreateGenre = () => {
  useTitle('Admin | Tạo thể loại phim')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: yupResolver(validationSchema),
  })

  const navigate = useNavigate()

  const [createApi, { isLoading }] = useCreateGenreMutation()

  const handleCreate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      nProgress.start()

      const { name } = reqBody

      const response = await createApi({ name }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.genres.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạo danh mục phim
      </div>
      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên thể loại phim!',
          }}
          labelChildren='tên thể loại phim'
          htmlFor='name'
          id='name'
          placeholder='Vui lòng nhập tên thể loại phim'
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

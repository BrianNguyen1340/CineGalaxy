import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetGenreQuery,
  useUpdateGenreMutation,
} from '~/services/genre.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'

const UpdateGenre = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>()

  const { data: genre, refetch } = useGetGenreQuery(id)
  const [updateApi, { isLoading }] = useUpdateGenreMutation()

  useEffect(() => {
    if (genre?.data) {
      setValue('name', genre?.data?.name)
    }
  }, [genre, setValue])

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleUpdate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      const { name } = reqBody

      const response = await updateApi({ id, name }).unwrap()

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
      <div className='title'>Cập nhật thể loại phim</div>
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

export default UpdateGenre

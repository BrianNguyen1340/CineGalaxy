import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetGenreQuery,
  useUpdateGenreMutation,
} from '~/services/genre.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import { HashLoader } from 'react-spinners'
import { Star } from 'lucide-react'
import './UpdateGenre.scss'

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
      <div className='title'>
        <span>Cập nhật thể loại phim</span>
        <Star color='yellow' />
        {genre.data.name}
        <Star color='yellow' />
      </div>
      <form onSubmit={handleSubmit(handleUpdate)}>
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
          className='btn-update'
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
            <span>{isLoading ? 'Đang cập nhật' : 'Cập nhật'}</span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default UpdateGenre

import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { FormInputGroup, Loader } from '~/components'
import {
  useGetCinemaComplexQuery,
  useUpdateCinemaComplexMutation,
} from '~/services/cinemaComplex.service'
import { paths } from '~/utils/paths'
import './UpdateCinemaComplex.scss'

const UpdateCinemaComplex = () => {
  const { id } = useParams()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>()

  const { data: cinemaComplex, refetch } = useGetCinemaComplexQuery(id)

  const [updateApi, { isLoading }] = useUpdateCinemaComplexMutation()

  useEffect(() => {
    if (cinemaComplex?.data) {
      setValue('name', cinemaComplex?.data?.name)
    }
  }, [cinemaComplex, setValue])

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return <Loader />
  }

  const handleUpdate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      const { name } = reqBody

      const response = await updateApi({ id, name }).unwrap()

      Swal.fire('Thành công', response.message, 'success')

      navigate(paths.dashboardPaths.managements.cinemaComplexes.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='container'>
      <div className='title'>Cập nhật danh mục phim</div>
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

export default UpdateCinemaComplex

import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatLoader, HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetGenreQuery,
  useUpdateGenreMutation,
} from '~/services/genre.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateGenre = () => {
  useTitle('Admin | Cập nhật thể loại phim')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>()

  const {
    data: genre,
    isLoading: isLoadingGenre,
    isSuccess: isSuccessGenre,
    refetch: refetchGenre,
  } = useGetGenreQuery(id)

  useEffect(() => {
    if (genre?.data) {
      setValue('name', genre?.data?.name)
    }
  }, [genre, setValue])

  useEffect(() => {
    refetchGenre()
  }, [refetchGenre])

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateGenreMutation()

  const handleUpdate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      const { name } = reqBody
      const response = await updateApi({ id, name }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.genres.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoadingGenre)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessGenre) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          Cập nhật thể loại phim
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{ required: 'Vui lòng nhập tên thể loại!' }}
            htmlFor='name'
            labelChildren='tên thể loại'
            type='text'
            id='name'
            name='name'
          />

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

export default UpdateGenre

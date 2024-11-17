import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { BeatLoader, HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetCinemaComplexQuery,
  useUpdateCinemaComplexMutation,
} from '~/services/cinemaComplex.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const UpdateCinemaComplex = () => {
  useTitle('Admin | Cập nhật cụm rạp')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>()

  const {
    data: cinemaComplex,
    isLoading,
    isSuccess,
    refetch,
  } = useGetCinemaComplexQuery(id)

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (cinemaComplex?.data) {
      setValue('name', cinemaComplex?.data?.name)
    }
  }, [cinemaComplex, setValue])

  const [updateApi, { isLoading: isLoadingUpdate }] =
    useUpdateCinemaComplexMutation()

  const handleUpdate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      const { name } = reqBody
      const response = await updateApi({ id, name }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.cinemaComplexes.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoading)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccess) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          Cập nhật danh mục phim
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{ required: 'Vui lòng nhập tên cụm rạp!' }}
            htmlFor='name'
            labelChildren='tên cụm rạp'
            type='text'
            id='name'
            name='name'
            placeholder='Vui lòng nhập tên cụm rạp'
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

export default UpdateCinemaComplex

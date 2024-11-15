import { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useGetProductCategoryQuery,
  useUpdateProductCategoryMutation,
} from '~/services/productCategory.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên danh mục sản phẩm là bắt buộc'),
})

const UpdateProductCategory = () => {
  useTitle('Admin | Cập nhật thể loại phim')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ name: string }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: genre,
    isLoading: isLoadingGenre,
    isSuccess: isSuccessGenre,
    refetch: refetchGenre,
  } = useGetProductCategoryQuery(id)

  useEffect(() => {
    if (genre?.data) {
      setValue('name', genre?.data?.name)
    }
  }, [genre, setValue])

  useEffect(() => {
    refetchGenre()
  }, [refetchGenre])

  const [updateApi, { isLoading: isLoadingUpdate }] =
    useUpdateProductCategoryMutation()

  const handleUpdate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      const { name } = reqBody
      const response = await updateApi({ id, name }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.productCategories.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingGenre) content = <div>Loading...</div>
  if (isSuccessGenre) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          Cập nhật danh mục sản phẩm
        </div>
        
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{ required: 'Vui lòng nhập tên danh mục sản phẩm!' }}
            htmlFor='name'
            labelChildren='tên danh mục sản phẩm'
            type='text'
            id='name'
            name='name'
            placeholder='Vui lòng nhập danh mục sản phẩm'
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

export default UpdateProductCategory

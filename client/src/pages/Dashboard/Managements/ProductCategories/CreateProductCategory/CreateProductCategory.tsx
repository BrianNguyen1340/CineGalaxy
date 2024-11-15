import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useCreateProductCategoryMutation } from '~/services/productCategory.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên danh mục sản phẩm là bắt buộc'),
})

const CreateProductCategory = () => {
  useTitle('Manager | Tạo danh mục sản phẩm')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>({
    resolver: yupResolver(validationSchema),
  })

  const [createApi, { isLoading: isLoadingCreate }] =
    useCreateProductCategoryMutation()

  const handleCreate: SubmitHandler<{ name: string }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name } = reqBody
      const response = await createApi({ name }).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.productCategories.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        tạo danh mục sản phẩm
      </div>
      
      <form onSubmit={handleSubmit(handleCreate)} className='mx-auto w-[500px]'>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên danh mục sản phẩm!',
          }}
          labelChildren='tên danh mục sản phẩm'
          htmlFor='name'
          id='name'
          placeholder='Vui lòng nhập tên danh mục sản phẩm'
          type='text'
          name='name'
        />

        <button
          type='submit'
          disabled={isLoadingCreate ? true : false}
          className='rounded bg-black px-4 py-3 font-semibold text-white transition duration-300 hover:opacity-70'
        >
          <div className='flex items-center justify-center gap-3'>
            {isLoadingCreate && <HashLoader size='20' color='#fff' />}
            <span className='capitalize'>
              {isLoadingCreate ? 'đang lưu' : 'lưu'}
            </span>
          </div>
        </button>
      </form>
    </div>
  )
}

export default CreateProductCategory

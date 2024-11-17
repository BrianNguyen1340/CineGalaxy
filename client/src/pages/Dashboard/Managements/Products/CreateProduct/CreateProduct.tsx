import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import {
  useCreateProductMutation,
  useUploadProductMutation,
} from '~/services/product.service'
import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { ProductCategoryType } from '~/types/productCategory.type'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { FaCloudUploadAlt } from 'react-icons/fa'

const CreateProduct = () => {
  useTitle('Manager | Tạo sản phẩm')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string
    category: string
    price: number
    size: string
    image: string
    description?: string
  }>()

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isSuccess: isSuccessProductCategories,
    refetch: refetchProductCategories,
  } = useGetProductCategoriesQuery({})

  useEffect(() => {
    refetchProductCategories()
  }, [refetchProductCategories])

  const [image, setImage] = useState<File | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [uploadApi] = useUploadProductMutation()
  const handleUploadProduct = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        Swal.fire('Thất bại', 'Không có tệp nào được chọn!', 'error')
        return
      }
      const selectedFile = event.target.files[0]
      const formData = new FormData()
      formData.append('image', selectedFile)
      const response = await uploadApi(formData).unwrap()
      setImage(response.image)
      setImageURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [createApi, { isLoading: isLoadingCreate }] = useCreateProductMutation()

  const handleCreate: SubmitHandler<{
    name: string
    category: string
    price: number
    size: string
    image: string
    description?: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, category, price, size, description } = reqBody

      const response = await createApi({
        name,
        category,
        price,
        size,
        description,
        image: imageURL,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.products.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (isLoadingProductCategories) content = <div>Loading...</div>
  if (isSuccessProductCategories) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo sản phẩm
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên sản phẩm!',
            }}
            labelChildren='tên sản phẩm'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên sản phẩm'
            type='text'
            name='name'
          />

          <div className='mb-5 flex flex-col'>
            <label htmlFor='category' className='mb-1 font-semibold capitalize'>
              danh mục sản phẩm
            </label>
            <select
              {...register('category', {
                required: 'Vui lòng chọn rạp',
              })}
              id='category'
              name='category'
              className='p-2 capitalize'
            >
              <option>Chọn danh mục sản phẩm</option>
              {productCategories?.data?.map(
                (item: ProductCategoryType, index: number) => (
                  <option key={index} value={item._id}>
                    {item?.name}
                  </option>
                ),
              )}
            </select>
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập giá sản phẩm!',
            }}
            labelChildren='giá sản phẩm'
            htmlFor='price'
            id='price'
            placeholder='Vui lòng nhập giá sản phẩm'
            type='text'
            name='price'
          />

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='movieRating'
              className='mb-1 font-semibold capitalize'
            >
              Kích cỡ
            </label>
            <select
              {...register('size', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='size'
              name='size'
              className='p-2 capitalize'
            >
              <option>Chọn kích cỡ</option>
              <option value='Small'>Small</option>
              <option value='Medium'>Medium</option>
              <option value='Large'>Large</option>
            </select>
          </div>

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>hình ảnh</label>
            <label htmlFor='image' className='mb-1 font-semibold capitalize'>
              {image ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              {...register('image', {
                required: 'Vui lòng chọn ảnh',
              })}
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleUploadProduct}
              className='hidden'
            />
            {errors.image && (
              <div className='mb-1 text-sm text-[red]'>
                {errors.image.message}
              </div>
            )}
            {imageURL ? (
              <img src={imageURL} alt='image preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='image review' width={250} />
            )}
          </div>

          <div className='mb-5'>
            <label
              htmlFor='description'
              className='mb-1 block font-semibold capitalize'
            >
              mô tả
            </label>
            <textarea
              id='description'
              name='description'
              className='h-[300px] w-full rounded border-2 p-3 text-base outline-none'
            />
          </div>

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

  return content
}

export default CreateProduct

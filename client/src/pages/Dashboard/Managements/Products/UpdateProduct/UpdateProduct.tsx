import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import { HashLoader } from 'react-spinners'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import {
  useUpdateProductMutation,
  useGetProductQuery,
} from '~/services/product.service'
import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import { ProductCategoryType } from '~/types/productCategory.type'
import useTitle from '~/hooks/useTitle'
import { app } from '~/firebase/firebase.config'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên sản phẩm là bắt buộc'),
  category: Yup.string().trim().required('Danh mục sản phẩm là bắt buộc'),
  image: Yup.string().trim().required('Hình ảnh sản phẩm là bắt buộc'),
  price: Yup.number().required('Giá sản phẩm là bắt buộc'),
  size: Yup.string().trim().required('Kích cỡ sản phẩm là bắt buộc'),
  description: Yup.string().trim().optional(),
})

const UpdateProduct = () => {
  useTitle('Manager | Cập nhật sản phẩm')
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string
    category: string
    image: string
    price: number
    size: string
    description?: string
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: product,
    isLoading: isLoadingProduct,
    isSuccess: isSuccessProduct,
    refetch: refetchProduct,
  } = useGetProductQuery(id)

  const {
    data: productCategories,
    isLoading: isLoadingProductCategories,
    isSuccess: isSuccessProductCategories,
    refetch: refetchProductCategories,
  } = useGetProductCategoriesQuery({})

  useEffect(() => {
    refetchProductCategories()
    refetchProduct()
  }, [refetchProductCategories, refetchProduct])

  useEffect(() => {
    if (product?.data) {
      setValue('name', product?.data?.name)
      setValue('category', product?.data?.category?._id)
      setValue('price', product?.data?.price)
      setValue('size', product?.data?.size)
      setValue('description', product?.data?.description)

      setValue('image', product?.data?.image)
      setImageURL(product?.data?.image)
    }
  }, [product, setValue])

  const [imageURL, setImageURL] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(
    null,
  )
  const [imageUploadError, setImageUploadError] = useState<null | string>(null)

  const handleUploadImage = () => {
    try {
      if (!image) {
        setImageUploadError('Vui lòng chọn ảnh!')
        return
      }
      setImageUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + image.name
      const storageRef = ref(storage, `products/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(progress.toFixed(0))
        },
        (error: any) => {
          setImageUploadError(error)
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null)
            setImageUploadError(null)
            setImageURL(downloadURL)
          })
        },
      )
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateProductMutation()

  const handleCreate: SubmitHandler<{
    name: string
    category: string
    price: number
    size: string
    description?: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, category, price, size, description } = reqBody
      const response = await updateApi({
        id,
        name,
        category,
        price,
        size,
        description,
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
  if (isLoadingProductCategories || isLoadingProduct)
    content = <div>Loading...</div>
  if (isSuccessProductCategories && isSuccessProduct) {
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

          <div className='mb-5 flex flex-col gap-3'>
            <label className='font-semibold capitalize'>
              hình ảnh sản phẩm
            </label>
            <label htmlFor='image' className='cursor-pointer capitalize'>
              <AiOutlineCloudUpload size='28' />
            </label>
            <input
              type='file'
              accept='image/*'
              id='image'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0])
                }
              }}
              hidden
            />
            {imageURL ? (
              <img src={imageURL} alt='image' width='250' />
            ) : (
              <img src='images/movie.jpg' alt='image' width='250' />
            )}
            <button
              type='button'
              disabled={imageUploadProgress ? true : false}
              onClick={handleUploadImage}
              className='w-fit'
            >
              {imageUploadProgress ? (
                <div className='h-16 w-16'>
                  <CircularProgressbar
                    value={Number(imageUploadProgress)}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                <div className='cursor-pointer rounded bg-black p-3 font-semibold capitalize text-white'>
                  upload
                </div>
              )}
            </button>
            {imageUploadError && <div>{imageUploadError}</div>}
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

          <div className='mb-5'>
            <label
              htmlFor='description'
              className='mb-1 block font-semibold capitalize'
            >
              mô tả
            </label>
            <textarea
              {...register('description', {
                required: 'Vui lòng nhập mô tả',
              })}
              id='description'
              name='description'
              className='h-[300px] w-full rounded border-2 p-3 text-base outline-none'
            />
          </div>

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

export default UpdateProduct

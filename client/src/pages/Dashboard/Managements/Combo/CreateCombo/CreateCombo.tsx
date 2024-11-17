import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { BeatLoader, HashLoader } from 'react-spinners'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { paths } from '~/utils/paths'
import {
  useCreateComboMutation,
  useUploadComboMutation,
} from '~/services/combo.service'
// import { useGetProductCategoriesQuery } from '~/services/productCategory.service'
import { useGetProductsQuery } from '~/services/product.service'
import { ProductType } from '~/types/product.type'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'
import { FaCloudUploadAlt } from 'react-icons/fa'

const CreateCombo = () => {
  useTitle('Manager | Tạo combo')
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string
    expiry: number
    products: string[]
    image: string
  }>()

  // const {
  //   data: productCategories,
  //   isLoading: isLoadingProductCategories,
  //   isSuccess: isSuccessProductCategories,
  //   refetch: refetchProductCategories,
  // } = useGetProductCategoriesQuery({})

  const {
    data: products,
    isLoading: isLoadingProducts,
    isSuccess: isSuccessProducts,
    refetch: refetchProducts,
  } = useGetProductsQuery({})

  useEffect(() => {
    // refetchProductCategories()
    refetchProducts()
  }, [
    // refetchProductCategories
    refetchProducts,
  ])

  const [selectedProducts, setSelectedProducts] = useState<
    { value: string; label: string }[]
  >([])

  const [image, setImage] = useState<File | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [uploadApi] = useUploadComboMutation()
  const handleUploadCombo = async (
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

  const [createApi, { isLoading: isLoadingCreate }] = useCreateComboMutation()

  const handleCreate: SubmitHandler<{
    name: string
    expiry: number
    products: string[]
    image: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { name, expiry } = reqBody

      const response = await createApi({
        name,
        expiry,
        products: selectedProducts.map((product) => product.value),
        image: imageURL,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.combos.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (
    isLoadingProducts
    // || isLoadingProductCategories
  )
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (
    isSuccessProducts
    // && isSuccessProductCategories
  ) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo combo
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên combo!',
            }}
            labelChildren='tên combo'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên combo'
            type='text'
            name='name'
          />

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>
              hình ảnh combo
            </label>
            <label htmlFor='image' className='mb-3 font-semibold capitalize'>
              {image ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleUploadCombo}
              className='hidden'
            />
            {imageURL ? (
              <img src={imageURL} alt='combo preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='combo preview' width={250} />
            )}
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập thời hạn sử dụng combo!',
            }}
            labelChildren='thời hạn sử dụng combo'
            htmlFor='expiry'
            id='expiry'
            placeholder='Vui lòng nhập thời hạn sử dụng combo'
            type='text'
            name='expiry'
          />

          <div className='mb-5'>
            <label
              htmlFor='products'
              className='mb-1 block font-semibold capitalize'
            >
              sản phẩm
            </label>
            <Select
              id='products'
              isMulti
              options={products?.data?.map((genre: ProductType) => ({
                value: genre._id,
                label: genre.name,
              }))}
              onChange={(selectedOptions) => {
                setSelectedProducts(
                  selectedOptions as { value: string; label: string }[],
                )
              }}
              classNamePrefix='select'
              placeholder='Chọn sản phẩm'
              components={animatedComponents}
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

export default CreateCombo

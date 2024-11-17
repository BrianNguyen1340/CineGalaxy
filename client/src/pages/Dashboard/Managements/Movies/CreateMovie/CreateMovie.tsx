import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FaRegStar, FaCloudUploadAlt } from 'react-icons/fa'
import { DayPicker } from 'react-day-picker'
import { BeatLoader, HashLoader } from 'react-spinners'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { paths } from '~/utils/paths'
import {
  useCreateMovieMutation,
  useUploadPosterMovieMutation,
  useUploadBannerMovieMutation,
} from '~/services/movie.service'
import { useGetGenresQuery } from '~/services/genre.service'
import { GenreType } from '~/types/genre.type'
import { FormInputGroup } from '~/components'
import useTitle from '~/hooks/useTitle'

const CreateMovie = () => {
  useTitle('Admin | Tạo phim')
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string
    description: string
    director: string
    releaseDate: Date
    duration: number
    poster: string
    banner: string
    trailer: string
    movieRating: string
    subtitle: string
    movieFormat: string
    genres: { value: string; label: string }[]
  }>()

  const {
    data: genres,
    isLoading: isLoadingGenres,
    isSuccess: isSuccessGenres,
    refetch: refetchGenres,
  } = useGetGenresQuery({})

  useEffect(() => {
    refetchGenres()
  }, [refetchGenres])

  const [selectedGenres, setSelectedGenres] = useState<
    { value: string; label: string }[]
  >([])

  const [releaseDate, setReleaseDate] = useState<Date>()

  const handleDateChange = (date: Date) => {
    setReleaseDate(date)
    setValue('releaseDate', date, { shouldValidate: true })
  }

  const [poster, setPoster] = useState<File | null>(null)
  const [posterURL, setPosterURL] = useState<string | null>(null)
  const [uploadPosterApi] = useUploadPosterMovieMutation()
  const handleUploadPoster = async (
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
      const response = await uploadPosterApi(formData).unwrap()
      setPoster(response.image)
      setPosterURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [banner, setBanner] = useState<File | null>(null)
  const [bannerURL, setBannerURL] = useState<string | null>(null)
  const [uploadBannerApi] = useUploadBannerMovieMutation()
  const handleUploadBanner = async (
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
      const response = await uploadBannerApi(formData).unwrap()
      setBanner(response.image)
      setBannerURL(response.image)
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [createApi, { isLoading: isLoadingCreate }] = useCreateMovieMutation()

  const handleCreate: SubmitHandler<{
    name: string
    description: string
    director: string
    releaseDate: Date
    duration: number
    poster: string
    banner: string
    trailer: string
    movieRating: string
    subtitle: string
    movieFormat: string
    genres: { value: string; label: string }[]
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const {
        name,
        description,
        director,
        releaseDate,
        duration,
        trailer,
        movieRating,
        subtitle,
        movieFormat,
      } = reqBody

      const response = await createApi({
        name,
        description,
        director,
        releaseDate,
        duration,
        trailer,
        movieRating,
        subtitle,
        movieFormat,
        genres: selectedGenres.map((genre) => genre.value),
        poster: posterURL,
        banner: bannerURL,
      }).unwrap()

      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.movies.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (isLoadingGenres)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )

  if (isSuccessGenres) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo phim
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên phim!',
            }}
            labelChildren='tên phim'
            htmlFor='name'
            id='name'
            placeholder='Vui lòng nhập tên phim'
            type='text'
            name='name'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5'>
            <label
              htmlFor='genres'
              className='mb-1 block font-semibold capitalize'
            >
              thể loại phim
            </label>
            <Select
              {...register('genres', {
                required: 'Vui lòng chọn thể loại phim',
              })}
              id='genres'
              isMulti
              options={genres?.data?.map((genre: GenreType) => ({
                value: genre._id,
                label: genre.name,
              }))}
              onChange={(selectedOptions) => {
                setSelectedGenres(
                  selectedOptions as { value: string; label: string }[],
                )
              }}
              classNamePrefix='select'
              placeholder='Chọn thể loại phim!'
              components={animatedComponents}
            />
            {errors.genres && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.genres.message}
              </div>
            )}
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập tên đạo diễn!',
            }}
            labelChildren='đạo diễn'
            htmlFor='director'
            id='director'
            placeholder='Vui lòng nhập tên đạo diễn'
            type='text'
            name='director'
            icon={<FaRegStar color='red' />}
          />

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
            {errors.description && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.description.message}
              </div>
            )}
          </div>

          <div className='mb-5'>
            <label htmlFor='releaseDate' className='font-semibold capitalize'>
              Chọn ngày công chiếu
            </label>
            <DayPicker
              {...register('releaseDate', {
                required: 'Vui lòng chọn ngày công chiếu',
              })}
              id='releaseDate'
              mode='single'
              selected={releaseDate}
              onSelect={(date: any) => handleDateChange(date)}
            />
            {errors.releaseDate && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.releaseDate.message}
              </div>
            )}
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập thời lượng phim!',
              pattern: {
                value: /^\d+$/,
                message: 'Chỉ được nhập số',
              },
            }}
            labelChildren='thời lượng phim'
            htmlFor='duration'
            id='duration'
            placeholder='Vui lòng nhập thời lượng phim'
            type='text'
            name='duration'
            icon={<FaRegStar color='red' />}
          />

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>poster</label>
            <label htmlFor='poster' className='mb-1 font-semibold capitalize'>
              {poster ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              {...register('poster', {
                required: 'Vui lòng chọn ảnh',
              })}
              type='file'
              id='poster'
              name='poster'
              accept='image/*'
              onChange={handleUploadPoster}
              className='hidden'
            />
            {errors.poster && (
              <div className='mb-1 text-sm text-[red]'>
                {errors.poster.message}
              </div>
            )}
            {posterURL ? (
              <img src={posterURL} alt='poster preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='poster review' width={250} />
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label className='mb-1 font-semibold capitalize'>banner</label>
            <label htmlFor='banner' className='mb-1 font-semibold capitalize'>
              {banner ? <></> : <FaCloudUploadAlt size='24' />}
            </label>
            <input
              {...register('banner', {
                required: 'Vui lòng chọn ảnh',
              })}
              type='file'
              id='banner'
              name='banner'
              accept='image/*'
              onChange={handleUploadBanner}
              className='hidden'
            />
            {errors.banner && (
              <div className='mb-1 text-sm text-[red]'>
                {errors.banner.message}
              </div>
            )}
            {bannerURL ? (
              <img src={bannerURL} alt='banner preview' width={250} />
            ) : (
              <img src='images/movie.jpg' alt='banner preview' width={250} />
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='movieFormat'
              className='mb-1 font-semibold capitalize'
            >
              định dạng phim
            </label>
            <select
              {...register('movieFormat', {
                required: 'Vui lòng chọn định dạng phim',
              })}
              id='movieFormat'
              name='movieFormat'
              className='p-2 capitalize'
            >
              <option>Chọn định dạng phim</option>
              <option value='2D'>2D</option>
              <option value='3D'>3D</option>
            </select>
            {errors.movieFormat && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.movieFormat.message}
              </div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='subtitle' className='mb-1 font-semibold capitalize'>
              phụ đề
            </label>
            <select
              {...register('subtitle', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='subtitle'
              name='subtitle'
              className='p-2 capitalize'
            >
              <option>Chọn phụ đề</option>
              <option value='Thuyết minh'>Thuyết minh</option>
              <option value='Phụ đề'>Phụ đề</option>
              <option value='Lồng tiếng'>Lồng tiếng</option>
            </select>
            {errors.subtitle && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.subtitle.message}
              </div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='movieRating'
              className='mb-1 font-semibold capitalize'
            >
              xếp hạng độ tuổi
            </label>
            <select
              {...register('movieRating', {
                required: 'Vui lòng chọn phụ đề',
              })}
              id='movieRating'
              name='movieRating'
              className='p-2 capitalize'
            >
              <option>Chọn xếp hạng độ tuổi</option>
              <option value='P - Phổ biến'>P - Phổ biến</option>
              <option value='K - Dành cho trẻ em'>K - Dành cho trẻ em</option>
              <option value='C13 - Cấm khán giả dưới 13 tuổi'>
                C13 - Cấm khán giả dưới 13 tuổi
              </option>
              <option value='C16 - Cấm khán giả dưới 16 tuổi'>
                C16 - Cấm khán giả dưới 16 tuổi
              </option>
              <option value='C18 - Cấm khán giả dưới 18 tuổi'>
                C18 - Cấm khán giả dưới 18 tuổi
              </option>
            </select>
            {errors.movieRating && (
              <div className='mt-1 pl-3 text-sm italic text-[red]'>
                {errors.movieRating.message}
              </div>
            )}
          </div>

          <FormInputGroup
            register={register}
            errors={errors}
            validation={{
              required: 'Vui lòng nhập trailer url!',
              pattern: {
                value:
                  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i,
                message: 'Please enter a valid url!',
              },
            }}
            labelChildren='trailer'
            htmlFor='trailer'
            id='trailer'
            placeholder='Vui lòng nhập trailer url'
            type='text'
            name='trailer'
            icon={<FaRegStar color='red' />}
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

  return content
}

export default CreateMovie

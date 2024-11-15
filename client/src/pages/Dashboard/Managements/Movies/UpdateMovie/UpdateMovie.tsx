import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { FaRegStar } from 'react-icons/fa'
import { DayPicker } from 'react-day-picker'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { CircularProgressbar } from 'react-circular-progressbar'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { app } from '~/firebase/firebase.config'
import { useGetGenresQuery } from '~/services/genre.service'
import {
  useUpdateMovieMutation,
  useGetMovieQuery,
} from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { FormInputGroup } from '~/components'
import { GenreType } from '~/types/genre.type'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Tên phim là bắt buộc'),
  description: Yup.string().trim().required('Mô tả phim là bắt buộc'),
  director: Yup.string().trim().required('Tên đạo diễn phim là bắt buộc'),
  releaseDate: Yup.date().required('Ngày công chiếu phim là bắt buộc'),
  duration: Yup.number().required('Thời lượng phim là bắt buộc'),
  poster: Yup.string().trim().required('Poster phim là bắt buộc'),
  banner: Yup.string().trim().required('Banner phim là bắt buộc'),
  trailer: Yup.string().trim().required('Trailer phim là bắt buộc'),
  movieRating: Yup.string().trim().required('Xếp hạng phim là bắt buộc'),
  subtitle: Yup.string().trim().required('Phụ đề phim là bắt buộc'),
  movieFormat: Yup.string().trim().required('Định dạng phim là bắt buộc'),
  genres: Yup.array().required('Thể loại phim là bắt buộc'),
})

const UpdateMovie = () => {
  useTitle('Admin | Cập nhật phim')
  const { id } = useParams()
  const navigate = useNavigate()
  const animatedComponents = makeAnimated()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    poster: string
    banner: string
    name: string
    description: string
    director: string
    releaseDate: Date
    duration: number
    trailer: string
    movieRating: string
    subtitle: string
    movieFormat: string
    genres: { value: string; label: string }[]
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: genres,
    isLoading: isLoadingGenres,
    isSuccess: isSuccessGenres,
    refetch: refetchGenres,
  } = useGetGenresQuery({})

  const {
    data: movie,
    isLoading: isLoadingMovie,
    isSuccess: isSuccessMovie,
    refetch: refetchMovie,
  } = useGetMovieQuery(id)

  useEffect(() => {
    refetchGenres()
    refetchMovie()
  }, [refetchGenres, refetchMovie])

  const [releaseDate, setReleaseDate] = useState<Date>()

  const handleDateChange = (date: Date) => {
    setReleaseDate(date)
    setValue('releaseDate', date, { shouldValidate: true })
  }

  const [selectedGenres, setSelectedGenres] = useState<
    { value: string; label: string }[]
  >([])

  useEffect(() => {
    if (movie?.data) {
      setValue('name', movie?.data?.name)
      setValue('description', movie?.data?.description)
      setValue('director', movie?.data?.director)
      setValue('duration', movie?.data?.duration)
      setValue('trailer', movie?.data?.trailer)
      setValue('movieRating', movie?.data?.movieRating)
      setValue('subtitle', movie?.data?.subtitle)
      setValue('movieFormat', movie?.data?.movieFormat)

      const movieReleaseDate = new Date(movie?.data?.releaseDate)
      setReleaseDate(movieReleaseDate)
      setValue('releaseDate', movieReleaseDate)

      setValue('poster', movie?.data?.poster)
      setPosterURL(movie?.data?.poster)

      setValue('banner', movie?.data?.banner)
      setBannerURL(movie?.data?.banner)

      const defaultGenres = movie?.data?.genres?.map((genre: GenreType) => ({
        value: genre._id,
        label: genre.name,
      }))
      setSelectedGenres(defaultGenres)
      setValue('genres', defaultGenres)
    }
  }, [movie, setValue, genres])

  const [bannerURL, setBannerURL] = useState<string | null>(null)
  const [banner, setBanner] = useState<File | null>(null)
  const [bannerUploadProgress, setBannerUploadProgress] = useState<
    string | null
  >(null)
  const [bannerUploadError, setBannerUploadError] = useState<null | string>(
    null,
  )

  const handleUploadBanner = () => {
    try {
      if (!banner) {
        setBannerUploadError('Vui lòng chọn ảnh!')
        return
      }
      setBannerUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + banner.name
      const storageRef = ref(storage, `banners/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, banner)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setBannerUploadProgress(progress.toFixed(0))
        },
        (error: any) => {
          setBannerUploadError(error)
          setBannerUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setBannerUploadProgress(null)
            setBannerUploadError(null)
            setBannerURL(downloadURL)
          })
        },
      )
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [posterURL, setPosterURL] = useState<string | null>(null)
  const [poster, setPoster] = useState<File | null>(null)
  const [posterUploadProgress, setPosterUploadProgress] = useState<
    string | null
  >(null)
  const [posterUploadError, setPosterUploadError] = useState<null | string>(
    null,
  )

  const handleUploadPoster = () => {
    try {
      if (!poster) {
        setPosterUploadError('Vui lòng chọn ảnh!')
        return
      }
      setPosterUploadError(null)
      const storage = getStorage(app)
      const fileName = new Date().getTime() + '-' + poster.name
      const storageRef = ref(storage, `posters/${fileName}`)
      const uploadTask = uploadBytesResumable(storageRef, poster)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setPosterUploadProgress(progress.toFixed(0))
        },
        (error: any) => {
          setPosterUploadError(error)
          setPosterUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPosterUploadProgress(null)
            setPosterUploadError(null)
            setPosterURL(downloadURL)
          })
        },
      )
    } catch (error) {
      Swal.fire('Thất bại', 'Upload ảnh thất bại!', 'error')
    }
  }

  const [updateApi, { isLoading: isLoadingUpdate }] = useUpdateMovieMutation()

  const handleUpdate: SubmitHandler<{
    poster: string
    banner: string
    name: string
    description: string
    director: string
    releaseDate: Date
    duration: number
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
      const response = await updateApi({
        id,
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
  if (isLoadingMovie || isLoadingGenres) content = <div>Loading...</div>
  if (isSuccessMovie && isSuccessGenres) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật phim
        </div>

        <form
          onSubmit={handleSubmit(handleUpdate)}
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

          <div className='mb-5 flex flex-col'>
            <label htmlFor='genres' className='mb-1 font-semibold capitalize'>
              thể loại phim
            </label>
            <Select
              id='genres'
              isMulti
              options={genres?.data?.map((genre: any) => ({
                value: genre._id,
                label: genre.name,
              }))}
              value={selectedGenres}
              onChange={(selectedOptions) => {
                setSelectedGenres(
                  selectedOptions as { value: string; label: string }[],
                )
              }}
              classNamePrefix='select'
              placeholder='Chọn thể loại phim'
              components={animatedComponents}
            />
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
              className='mb-1 font-semibold capitalize'
            >
              mô tả
            </label>
            <textarea
              {...register('description', {
                required: 'Vui lòng nhập mô tả',
              })}
              placeholder={movie?.description}
              id='description'
              name='description'
              className='h-[300px] w-full rounded border-2 p-3 text-base outline-none'
            />
          </div>

          <div className='mb-5'>
            <label
              htmlFor='releaseDate'
              className='mb-1 font-semibold capitalize'
            >
              Chọn ngày công chiếu
            </label>
            <DayPicker
              id='releaseDate'
              mode='single'
              selected={releaseDate}
              onSelect={(date: any) => handleDateChange(date)}
            />
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

          <div className='mb-5 flex flex-col gap-1'>
            <label className='font-semibold capitalize'>poster</label>
            <label htmlFor='poster' className='cursor-pointer capitalize'>
              <AiOutlineCloudUpload size='28' />
            </label>
            <input
              type='file'
              accept='image/*'
              id='poster'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setPoster(e.target.files[0])
                }
              }}
              hidden
            />
            {posterURL ? (
              <img src={posterURL} alt='poster' width='250' />
            ) : (
              <img src='images/movie.jpg' alt='poster' width='250' />
            )}
            <button
              type='button'
              disabled={posterUploadProgress ? true : false}
              onClick={handleUploadPoster}
              className='w-fit'
            >
              {posterUploadProgress ? (
                <div className='h-16 w-16'>
                  <CircularProgressbar
                    value={Number(posterUploadProgress)}
                    text={`${posterUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                <div className='cursor-pointer rounded bg-black p-3 font-semibold capitalize text-white'>
                  upload
                </div>
              )}
            </button>
            {posterUploadError && <div>{posterUploadError}</div>}
          </div>

          <div className='mb-5 flex flex-col gap-1'>
            <label className='font-semibold capitalize'>poster</label>
            <label htmlFor='poster' className='cursor-pointer capitalize'>
              <AiOutlineCloudUpload size='28' />
            </label>
            <input
              type='file'
              accept='image/*'
              id='poster'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  setBanner(e.target.files[0])
                }
              }}
              hidden
            />
            {bannerURL ? (
              <img src={bannerURL} alt='poster' width='400' />
            ) : (
              <img src='images/movie.jpg' alt='poster' width='250' />
            )}
            <button
              type='button'
              disabled={bannerUploadProgress ? true : false}
              onClick={handleUploadBanner}
              className='w-fit'
            >
              {bannerUploadProgress ? (
                <div className='h-16 w-16'>
                  <CircularProgressbar
                    value={Number(bannerUploadProgress)}
                    text={`${bannerUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                <div className='cursor-pointer rounded bg-black p-3 font-semibold capitalize text-white'>
                  upload
                </div>
              )}
            </button>
            {bannerUploadError && <div>{bannerUploadError}</div>}
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

export default UpdateMovie

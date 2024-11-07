import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegStar } from 'react-icons/fa'
import { DayPicker } from 'react-day-picker'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

import { useCreateMovieMutation } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { useGetAllGenresQuery } from '~/services/genre.service'
import { FormInputGroup } from '~/components'
import { app } from '~/firebase/firebase.config'

const CreateMovie = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string
    description: string
    director: string
    releaseDate: Date | undefined
    duration: number
    poster: string
    banner: string
    trailer: string
    movieRating: string
    subtitle: string
    movieFormat: string
    genres: { value: string; label: string }[]
  }>()
  const animatedComponents = makeAnimated()

  const [createApi, { isLoading }] = useCreateMovieMutation()

  const { data: genres } = useGetAllGenresQuery({})

  const [selectedGenres, setSelectedGenres] = useState<
    { value: string; label: string }[]
  >([])

  const [releaseDate, setReleaseDate] = useState<Date | undefined>()
  const handleDateChange = (date: Date | undefined) => {
    setReleaseDate(date ?? undefined)
    setValue('releaseDate', date ?? undefined, { shouldValidate: true })
  }

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

  const handleCreate: SubmitHandler<{
    name: string
    description: string
    director: string
    releaseDate: Date | undefined
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
      const body = {
        ...reqBody,
        genres: selectedGenres.map((genre) => genre.value),
        poster: posterURL,
        banner: bannerURL,
      }
      const response = await createApi(body).unwrap()
      Swal.fire('Thành công', response.message, 'success')
      navigate(paths.dashboardPaths.managements.movies.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='container'>
      <div className='title'>tạo phim</div>
      <form
        onSubmit={handleSubmit(handleCreate)}
        style={{ width: '500px', margin: '0 auto' }}
      >
        {/* name */}
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

        {/* genres */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor='genres'
            style={{
              textTransform: 'capitalize',
              marginBottom: '5px',
              fontWeight: 700,
              display: 'block',
            }}
          >
            thể loại phim
          </label>
          <Select
            id='genres'
            isMulti
            options={genres?.data?.map((genre: any) => ({
              value: genre._id,
              label: genre.name,
            }))}
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

        {/* director */}
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

        {/* description */}
        <div
          style={{
            marginBottom: '20px',
          }}
        >
          <label
            htmlFor='description'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
              display: 'block',
            }}
          >
            mô tả
          </label>
          <textarea
            {...register('description', {
              required: 'Vui lòng nhập mô tả',
            })}
            id='description'
            name='description'
            style={{
              width: '100%',
              outline: 'none',
              height: '300px',
              padding: '10px',
              fontSize: '16px',
            }}
          />
        </div>

        {/* releaseDate */}
        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor='releaseDate'
            style={{ textTransform: 'capitalize', fontWeight: 700 }}
          >
            Chọn ngày công chiếu
          </label>
          <DayPicker
            id='releaseDate'
            mode='single'
            selected={releaseDate}
            onSelect={(date: Date | undefined) => handleDateChange(date)}
          />
        </div>

        {/* duration */}
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

        {/* poster */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            marginBottom: '20px',
          }}
        >
          <label style={{ textTransform: 'capitalize', fontWeight: 700 }}>
            poster
          </label>
          <label
            htmlFor='poster'
            style={{ textTransform: 'capitalize', cursor: 'pointer' }}
          >
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
            style={{ width: 'fit-content' }}
          >
            {posterUploadProgress ? (
              <div style={{ width: '4rem', height: '4rem' }}>
                <CircularProgressbar
                  value={Number(posterUploadProgress)}
                  text={`${posterUploadProgress || 0}%`}
                />
              </div>
            ) : (
              <div
                style={{
                  padding: '15px',
                  textTransform: 'capitalize',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                upload
              </div>
            )}
          </button>
          {posterUploadError && <div>{posterUploadError}</div>}
        </div>

        {/* banner */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            marginBottom: '20px',
          }}
        >
          <label style={{ textTransform: 'capitalize', fontWeight: 700 }}>
            banner
          </label>
          <label
            htmlFor='banner'
            style={{ textTransform: 'capitalize', cursor: 'pointer' }}
          >
            <AiOutlineCloudUpload size='28' />
          </label>
          <input
            type='file'
            accept='image/*'
            id='banner'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                setBanner(e.target.files[0])
              }
            }}
            hidden
          />
          {bannerURL ? (
            <img src={bannerURL} alt='poster' width='250' />
          ) : (
            <img src='images/movie.jpg' alt='poster' width='250' />
          )}
          <button
            type='button'
            disabled={bannerUploadProgress ? true : false}
            onClick={handleUploadBanner}
            style={{ width: 'fit-content' }}
          >
            {bannerUploadProgress ? (
              <div style={{ width: '4rem', height: '4rem' }}>
                <CircularProgressbar
                  value={Number(bannerUploadProgress)}
                  text={`${bannerUploadProgress || 0}%`}
                />
              </div>
            ) : (
              <div
                style={{
                  padding: '15px',
                  textTransform: 'capitalize',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                upload
              </div>
            )}
          </button>
          {bannerUploadError && <div>{bannerUploadError}</div>}
        </div>

        {/* movie format */}
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='movieFormat'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            định dạng phim
          </label>
          <select
            {...register('movieFormat', {
              required: 'Vui lòng chọn định dạng phim',
            })}
            id='movieFormat'
            name='movieFormat'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn định dạng phim
            </option>
            <option value='2D'>2D</option>
            <option value='3D'>3D</option>
          </select>
        </div>

        {/* subtitle */}
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='subtitle'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            phụ đề
          </label>
          <select
            {...register('subtitle', {
              required: 'Vui lòng chọn phụ đề',
            })}
            id='subtitle'
            name='subtitle'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn phụ đề
            </option>
            <option value='Thuyết minh'>Thuyết minh</option>
            <option value='Phụ đề'>Phụ đề</option>
            <option value='Lồng tiếng'>Lồng tiếng</option>
          </select>
        </div>

        {/* movie rating */}
        <div
          style={{
            marginBottom: '25px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <label
            htmlFor='movieRating'
            style={{
              textTransform: 'capitalize',
              fontWeight: 700,
              marginBottom: '5px',
            }}
          >
            xếp hạng độ tuổi
          </label>
          <select
            {...register('movieRating', {
              required: 'Vui lòng chọn phụ đề',
            })}
            id='movieRating'
            name='movieRating'
            style={{ padding: '8px', outline: 'none' }}
          >
            <option value='' aria-hidden='true'>
              Chọn xếp hạng độ tuổi
            </option>
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

        {/* trailer url */}
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

        {/* btn submit */}
        <button
          type='submit'
          disabled={isLoading ? true : false}
          className='btn-create'
        >
          {isLoading ? 'Đang tạo' : 'Tạo'}
        </button>
      </form>
    </div>
  )
}

export default CreateMovie

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { DayPicker } from 'react-day-picker'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { paths } from '~/utils/paths'
import {
  useCreateMovieMutation,
  useUploadMovieMutation,
} from '~/services/movie.service'
import './CreateMovie.scss'
import { useGetAllGenresQuery } from '~/services/genre.service'
import { FormInputGroup } from '~/components'

const CreateMovie = () => {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<{
    name: string
    description: string
    director: string
    releaseDate: Date
    age: number
    duration: number
    poster: string
    trailer: string
    movieRating: string
    genreId: string
  }>()

  const [createApi, { isLoading }] = useCreateMovieMutation()

  const [uploadImage] = useUploadMovieMutation()
  const { data: genres } = useGetAllGenresQuery({})
  const [releaseDate, setReleaseDate] = useState<any>()
  const [image, setImage] = useState(null)
  console.log(image)

  const handleUpload = async (e: any) => {
    try {
      const file = e.target.files[0]

      if (!file) {
        Swal.fire('Lỗi', 'Vui lòng chọn một file ảnh', 'error')
        return
      }

      const formData = new FormData()
      formData.append('image', file)

      const upload = await uploadImage(formData).unwrap()
      console.log(upload)

      setImage(upload.image)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleCreate: SubmitHandler<{
    name: string
    description: string
    director: string
    releaseDate: Date
    age: number
    duration: number
    poster: string
    trailer: string
    movieRating: string
    genreId: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const {
        name,
        description,
        director,
        releaseDate,
        age,
        duration,
        poster,
        trailer,
        movieRating,
        genreId,
      } = reqBody

      const response = await createApi({
        name,
        description,
        director,
        releaseDate,
        age,
        duration,
        poster,
        trailer,
        movieRating,
        genreId,
      }).unwrap()
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  return (
    <div className='create-movie-container'>
      <div className='title'>tạo phim</div>
      <form onSubmit={handleSubmit(handleCreate)}>
        <div>
          <label>Ảnh</label>
          <input
            id='poster'
            type='file'
            onChange={handleUpload}
            name='poster'
            accept='images/*'
            style={{ display: 'none' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px',
          }}
        >
          {image ? (
            <img src={image} alt='image' style={{ width: '200px' }} />
          ) : (
            <img
              src='images/movie.jpg'
              alt='image'
              style={{ width: '200px' }}
            />
          )}
          <label htmlFor='poster'>chọn ảnh</label>
        </div>

        <button type='submit' disabled={isLoading ? true : false}></button>
      </form>
    </div>
  )
}

export default CreateMovie

{
  /* <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên phim!',
          }}
          labelChildren='name'
          htmlFor='name'
          id='name'
          placeholder='Vui lòng nhập tên phim'
          type='text'
          name='name'
        />
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập mô tả!',
          }}
          labelChildren='mô tả'
          htmlFor='description'
          id='description'
          placeholder='Vui lòng nhập mô tả'
          type='text'
          name='description'
        />
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập tên đạo diễn!',
          }}
          labelChildren='director'
          htmlFor='director'
          id='director'
          placeholder='Vui lòng nhập tên đạo diễn'
          type='text'
          name='director'
        />
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor=''>Chọn ngày công chiếu</label>
          <DayPicker
            mode='single'
            selected={releaseDate}
            onSelect={setReleaseDate}
          />
        </div>
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập độ tuổi!',
          }}
          labelChildren='age'
          htmlFor='age'
          id='age'
          placeholder='Vui lòng nhập độ tuổi'
          type='text'
          name='age'
        />
        <FormInputGroup
          register={register}
          errors={errors}
          validation={{
            required: 'Vui lòng nhập thời lượng phim!',
          }}
          labelChildren='duration'
          htmlFor='duration'
          id='duration'
          placeholder='Vui lòng nhập thời lượng phim'
          type='text'
          name='duration'
        />
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
        /> */
}

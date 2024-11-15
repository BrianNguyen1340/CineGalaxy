import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import Flatpickr from 'react-flatpickr'
import Swal from 'sweetalert2'
import nProgress from 'nprogress'

import { useGetMoviesQuery } from '~/services/movie.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { useCreateShowtimeMutation } from '~/services/showtime.service'
import { paths } from '~/utils/paths'
import { CinemaComplexType } from '~/types/cinemaComplex.type'
import { CinemaType } from '~/types/cinema.type'
import { RoomType } from '~/types/room.type'
import { MovieType } from '~/types/movie.type'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Ngày chiếu là bắt buộc'),
  timeStart: Yup.date().required('Giờ bắt đầu là bắt buộc'),
  movie: Yup.string().required('Phim là bắt buộc'),
  room: Yup.string().required('Phòng là bắt buộc'),
  cinema: Yup.string().required('Rạp là bắt buộc'),
  cinemaComplex: Yup.string().required('Cụm rạp là bắt buộc'),
})

const CreateShowtime = () => {
  useTitle('Admin | Tạo suất chiếu')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<{
    date: Date
    timeStart: Date
    movie: string
    room: string
    cinema: string
    cinemaComplex: string
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: movies,
    isLoading: isLoadingMovies,
    isSuccess: isSuccessMovies,
    refetch: refetchMovies,
  } = useGetMoviesQuery({})

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinemas,
  } = useGetCinemasQuery({})

  const {
    data: cinemaComplexes,
    isLoading: isLoadingCimemaComplexes,
    isSuccess: isSuccessCinemaComplexes,
    refetch: refetchCinemaComplexes,
  } = useGetCinemaComplexesQuery({})

  useEffect(() => {
    refetchMovies()
    refetchRooms()
    refetchCinemas()
    refetchCinemaComplexes()
  }, [refetchMovies, refetchRooms, refetchCinemas, refetchCinemaComplexes])

  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState<
    string | null
  >(null)
  const [selectedCinema, setSelectedCinema] = useState<string | null>()
  const [filteredCinemas, setFilteredCinemas] = useState<CinemaType[]>()
  const [filteredRooms, setFilteredRooms] = useState<RoomType[]>()

  const [selectedDate, setSelectedDate] = useState<
    string | number | Date | readonly (string | number | Date)[] | undefined
  >()
  const [selectedTimeStart, setSelectedTimeStart] = useState<
    string | number | Date | readonly (string | number | Date)[] | undefined
  >()

  useEffect(() => {
    if (cinemas?.data && selectedCinemaComplex) {
      const filtered = cinemas?.data?.filter(
        (cinema: CinemaType) =>
          cinema.cinemaComplex._id === selectedCinemaComplex,
      )
      setFilteredCinemas(filtered)
    } else {
      setFilteredCinemas([])
    }
  }, [selectedCinemaComplex, cinemas])

  const handleCinemaComplexClick = (cinemaComplexId: string) => {
    setSelectedCinemaComplex(cinemaComplexId)
    clearErrors('cinemaComplex')
  }

  useEffect(() => {
    if (selectedCinema && rooms?.data) {
      const filtered = rooms?.data?.filter(
        (room: RoomType) => room?.cinema?._id === selectedCinema,
      )
      setFilteredRooms(filtered)
    } else {
      setFilteredRooms([])
    }
  }, [selectedCinema, rooms])

  const handleCinemaClick = (cinemaId: string) => {
    setSelectedCinema(cinemaId)
    clearErrors('cinema')
  }

  const [createApi, { isLoading: isLoadingCreate }] =
    useCreateShowtimeMutation()

  const handleCreate: SubmitHandler<{
    date: Date
    timeStart: Date
    movie: string
    room: string
    cinema: string
    cinemaComplex: string
  }> = async (reqBody) => {
    try {
      nProgress.start()
      const { date, timeStart, movie, room, cinema, cinemaComplex } = reqBody
      const response = await createApi({
        date,
        timeStart,
        movie,
        room,
        cinema,
        cinemaComplex,
      }).unwrap()
      Swal.fire('Thành công!', response.message, 'success')
      setSelectedDate('')
      setSelectedTimeStart('')
      navigate(paths.dashboardPaths.managements.showtimes.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content
  if (
    isLoadingMovies ||
    isLoadingRooms ||
    isLoadingCinemas ||
    isLoadingCimemaComplexes
  )
    content = <div>Loading...</div>
  if (
    isSuccessMovies &&
    isSuccessRooms &&
    isSuccessCinemas &&
    isSuccessCinemaComplexes
  ) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo suất chiếu
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className='mx-auto w-[500px]'
        >
          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='cinemaComplex'
              className='mb-1 font-semibold capitalize'
            >
              cụm rạp
            </label>
            <select
              {...register('cinemaComplex', {
                required: 'Vui lòng chọn cụm rạp!',
              })}
              id='cinemaComplex'
              name='cinemaComplex'
              onChange={(e) => handleCinemaComplexClick(e.target.value)}
              className='p-2 capitalize'
            >
              <option>Chọn cụm rạp</option>
              {cinemaComplexes?.data?.map(
                (item: CinemaComplexType, index: number) => (
                  <option key={index} value={item._id} className='capitalize'>
                    {item.name}
                  </option>
                ),
              )}
            </select>
            {errors.cinemaComplex && (
              <div className='text-sm text-[red]'>
                {errors.cinemaComplex.message}
              </div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='cinema' className='mb-1 font-semibold capitalize'>
              rạp
            </label>
            <select
              {...register('cinema', {
                required: 'Vui lòng chọn rạp!',
              })}
              id='cinema'
              name='cinema'
              onChange={(e) => handleCinemaClick(e.target.value)}
              className='p-2 capitalize'
            >
              <option>Chọn rạp</option>
              {filteredCinemas?.map((item: CinemaType, index: number) => (
                <option key={index} value={item._id} className='capitalize'>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.cinema && (
              <div className='text-sm text-[red]'>{errors.cinema.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='room' className='mb-1 font-semibold capitalize'>
              phòng
            </label>
            <select
              {...register('room', {
                required: 'Vui lòng chọn phòng',
              })}
              id='room'
              name='room'
              className='p-2 capitalize'
            >
              <option>Chọn phòng</option>
              {filteredRooms?.map((item: RoomType, index: number) => (
                <option key={index} value={item._id} className='capitalize'>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.room && (
              <div className='text-sm text-[red]'>{errors.room.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='movie' className='mb-1 font-semibold capitalize'>
              phim
            </label>
            <select
              {...register('movie', {
                required: 'Vui lòng chọn phim',
              })}
              id='movie'
              name='movie'
              className='p-2 capitalize'
            >
              <option>Chọn phim</option>
              {movies?.data?.map((item: MovieType, index: number) => (
                <option
                  key={index}
                  value={item._id}
                  className='text-sm font-semibold capitalize'
                >
                  {item.name}
                </option>
              ))}
            </select>
            {errors.movie && (
              <div className='text-sm text-[red]'>{errors.movie.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label htmlFor='date' className='mb-1 font-semibold capitalize'>
              ngày chiếu
            </label>
            <Flatpickr
              value={selectedDate}
              onChange={([date]) => {
                setValue('date', date)
                clearErrors('date')
              }}
              options={{
                dateFormat: 'Y-m-d',
              }}
              className='w-full cursor-pointer rounded border-2 p-2 focus:outline-[#AF47D2]'
              id='date'
              name='date'
              placeholder='Chọn ngày chiếu'
            />
            {errors.date && (
              <div className='text-sm text-[red]'>{errors.date.message}</div>
            )}
          </div>

          <div className='mb-5 flex flex-col'>
            <label
              htmlFor='timeStart'
              className='mb-1 font-semibold capitalize'
            >
              giờ bắt đầu suất chiếu
            </label>
            <Flatpickr
              value={selectedTimeStart}
              onChange={([timeStart]) => {
                setValue('timeStart', timeStart)
                clearErrors('timeStart')
              }}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }}
              id='timeStart'
              name='timeStart'
              placeholder='Chọn giờ bắt đầu suất chiếu'
              className='w-full cursor-pointer rounded border-2 p-2 focus:outline-[#AF47D2]'
            />
            {errors.timeStart && (
              <div className='text-sm text-[red]'>
                {errors.timeStart.message}
              </div>
            )}
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

export default CreateShowtime

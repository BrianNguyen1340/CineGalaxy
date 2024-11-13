import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
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
import {
  useUpdateShowtimeMutation,
  useGetShowtimeQuery,
} from '~/services/showtime.service'
import { paths } from '~/utils/paths'
import useTitle from '~/hooks/useTitle'

const validationSchema = Yup.object().shape({
  date: Yup.date().required('Ngày chiếu là bắt buộc'),
  timeStart: Yup.date().required('Giờ bắt đầu là bắt buộc'),
  timeEnd: Yup.date()
    .required('Giờ kết thúc là bắt buộc')
    .min(Yup.ref('timeStart'), 'Giờ kết thúc phải sau giờ bắt đầu'),
  movie: Yup.string().required('Phim là bắt buộc'),
  room: Yup.string().required('Phòng là bắt buộc'),
  cinema: Yup.string().required('Rạp là bắt buộc'),
  cinemaComplex: Yup.string().required('Cụm rạp là bắt buộc'),
})

const UpdateShowtime = () => {
  useTitle('Admin | Cập nhật suất chiếu')

  const { id } = useParams()

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    date: Date
    timeStart: Date
    timeEnd: Date
    movie: string
    room: string
    cinema: string
    cinemaComplex: string
  }>({
    resolver: yupResolver(validationSchema),
  })

  const {
    data: showtime,
    isLoading: isLoadingShowtime,
    isSuccess: isSuccessShowtime,
    refetch: refetchShowtime,
  } = useGetShowtimeQuery(id)

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

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeStart, setSelectedTimeStart] = useState<Date>()
  const [selectedTimeEnd, setSelectedTimeEnd] = useState<Date>()
  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState<any>()
  const [filteredCinemas, setFilteredCinemas] = useState<any>()
  const [selectedCinema, setSelectedCinema] = useState<any>()
  const [filteredRooms, setFilteredRooms] = useState<any>()

  useEffect(() => {
    refetchShowtime()
    refetchMovies()
    refetchRooms()
    refetchCinemas()
    refetchCinemaComplexes()
  }, [
    refetchShowtime,
    refetchMovies,
    refetchRooms,
    refetchCinemas,
    refetchCinemaComplexes,
  ])

  useEffect(() => {
    if (showtime) {
      setValue('date', showtime.data.date)
      setSelectedDate(showtime.data.date)
      setSelectedTimeStart(showtime.data.timeStart)
      setSelectedTimeEnd(showtime.data.timeEnd)
      setValue('cinemaComplex', showtime.data.cinemaComplex._id)
      setValue('cinema', showtime.data.cinema._id)
      setValue('room', showtime.data.room._id)
      setValue('movie', showtime.data.movie._id)
      setSelectedCinemaComplex(showtime.data.cinemaComplex._id)
      setSelectedCinema(showtime.data.cinema._id)
    }
  }, [showtime, setValue])

  useEffect(() => {
    if (selectedCinemaComplex && cinemas) {
      const filtered = cinemas.data.filter(
        (cinema: any) => cinema.cinemaComplex._id === selectedCinemaComplex,
      )
      setFilteredCinemas(filtered)
    } else {
      setFilteredCinemas([])
    }
  }, [selectedCinemaComplex, cinemas])

  const handleCinemaComplexClick = (cinemaComplex: any) => {
    setSelectedCinemaComplex(cinemaComplex)
  }

  useEffect(() => {
    if (selectedCinema && rooms) {
      const filtered = rooms.data.filter(
        (room: any) => room.cinema._id === selectedCinema,
      )
      setFilteredRooms(filtered)
    } else {
      setFilteredRooms([])
    }
  }, [selectedCinema, rooms])

  const handleCinemaClick = (cinema: any) => {
    setSelectedCinema(cinema)
  }

  const [updateApi, { isLoading: isLoadingUpdate }] =
    useUpdateShowtimeMutation()

  const handleUpdate: SubmitHandler<{
    date: Date
    timeStart: Date
    timeEnd: Date
    movie: string
    room: string
    cinema: string
    cinemaComplex: string
  }> = async (reqBody) => {
    try {
      nProgress.start()

      const { date, timeStart, timeEnd, movie, room, cinema, cinemaComplex } =
        reqBody

      const response = await updateApi({
        id,
        date,
        timeStart,
        timeEnd,
        movie,
        room,
        cinema,
        cinemaComplex,
      }).unwrap()

      Swal.fire('Thành công!', response.message, 'success')

      navigate(paths.dashboardPaths.managements.showtimes.list)
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (
    isLoadingShowtime ||
    isLoadingMovies ||
    isLoadingRooms ||
    isLoadingCinemas ||
    isLoadingCimemaComplexes
  )
    content = <div>Loading...</div>

  if (
    isSuccessShowtime &&
    isSuccessMovies &&
    isSuccessRooms &&
    isSuccessCinemas &&
    isSuccessCinemaComplexes
  ) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          cập nhật suất chiếu
        </div>
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className='mx-auto w-[500px]'
        >
          <div className='mb-6 flex flex-col'>
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
              <option value='' aria-hidden='true'>
                Chọn cụm rạp
              </option>
              {cinemaComplexes?.data?.map((cinemaComplex: any) => (
                <option
                  value={cinemaComplex?._id}
                  key={cinemaComplex?._id}
                  className='capitalize'
                >
                  {cinemaComplex?.name}
                </option>
              ))}
            </select>
            {errors.cinemaComplex && (
              <div className='text-sm text-[red]'>
                {errors.cinemaComplex.message}
              </div>
            )}
          </div>
          <div className='mb-6 flex flex-col'>
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
              <option value='' aria-hidden='true'>
                Chọn rạp
              </option>
              {filteredCinemas?.map((cinema: any) => (
                <option
                  key={cinema?._id}
                  value={cinema?._id}
                  className='capitalize'
                >
                  {cinema?.name}
                </option>
              ))}
            </select>
            {errors.cinema && (
              <div className='text-sm text-[red]'>{errors.cinema.message}</div>
            )}
          </div>
          <div className='mb-6 flex flex-col'>
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
              defaultValue={showtime?.data?.room?._id}
            >
              <option value='' aria-hidden='true'>
                Chọn phòng
              </option>
              {filteredRooms?.map((room: any) => (
                <option
                  value={room?._id}
                  key={room?._id}
                  className='capitalize'
                >
                  {room?.name}
                </option>
              ))}
            </select>
            {errors.room && (
              <div className='text-sm text-[red]'>{errors.room.message}</div>
            )}
          </div>
          <div className='mb-6 flex flex-col'>
            <label htmlFor='movie' className='mb-1 font-semibold capitalize'>
              phim
            </label>
            <select
              {...register('movie', {
                required: 'Vui lòng chọn phim',
              })}
              id='movie'
              name='movie'
              className='p-2'
            >
              <option value='' aria-hidden='true'>
                Chọn phim
              </option>
              {movies?.data?.map((item: any) => (
                <option
                  value={item?._id}
                  key={item?._id}
                  className='text-sm font-semibold capitalize'
                >
                  {item?.name}
                </option>
              ))}
            </select>
            {errors.movie && (
              <div className='text-sm text-[red]'>{errors.movie.message}</div>
            )}
          </div>
          <div className='mb-6 flex flex-col'>
            <label htmlFor='date' className='mb-1 font-semibold capitalize'>
              ngày chiếu
            </label>
            <Flatpickr
              value={selectedDate}
              onChange={([date]) => setValue('date', date)}
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
          <div className='mb-6 flex flex-col'>
            <label
              htmlFor='timeStart'
              className='mb-1 font-semibold capitalize'
            >
              giờ bắt đầu suất chiếu
            </label>
            <Flatpickr
              value={selectedTimeStart}
              onChange={([timeStart]) => setValue('timeStart', timeStart)}
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
          <div className='mb-6 flex flex-col'>
            <label htmlFor='timeEnd' className='mb-1 font-semibold capitalize'>
              giờ bắt đầu suất chiếu
            </label>
            <Flatpickr
              value={selectedTimeEnd}
              onChange={([timeEnd]) => setValue('timeEnd', timeEnd)}
              options={{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }}
              id='timeEnd'
              name='timeEnd'
              placeholder='Chọn giờ kết thúc suất chiếu'
              className='w-full cursor-pointer rounded border-2 p-2 focus:outline-[#AF47D2]'
            />
            {errors.timeEnd && (
              <div className='text-sm text-[red]'>{errors.timeEnd.message}</div>
            )}
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

export default UpdateShowtime

import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { DateSelector } from '~/components'
import { PiWarningOctagon } from 'react-icons/pi'
import { FaTimes, FaAngleRight } from 'react-icons/fa'

import { useAppSelector } from '~/hooks/redux'
import { formatDateToVietnamese } from '~/utils/dateFormats'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetShowtimesQuery } from '~/services/showtime.service'
import { useGetMoviesQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { CinemaComplexType } from '~/types/cinemaComplex.type'
import { CinemaType } from '~/types/cinema.type'
import { MovieType } from '~/types/movie.type'
import { ShowtimeType } from '~/types/showtime.type'
import useTitle from '~/hooks/useTitle'

const Showtimes = () => {
  useTitle('Suất chiếu')
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)
  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  const {
    data: cinemaComplexes,
    isLoading: isLoadingCinemaComplexes,
    isSuccess: isSuccessCinemaComplexes,
    refetch: refetchCinemaComplexes,
  } = useGetCinemaComplexesQuery({})

  const {
    data: cinemas,
    isLoading: isLoadingCinemas,
    isSuccess: isSuccessCinemas,
    refetch: refetchCinemas,
  } = useGetCinemasQuery({})

  const {
    data: showtimes,
    isLoading: isLoadingShowtimes,
    isSuccess: isSuccessShowtimes,
    refetch: refetchShowtimes,
  } = useGetShowtimesQuery({})

  const {
    data: movies,
    isLoading: isLoadingMovies,
    isSuccess: isSuccessMovies,
    refetch: refetchMovies,
  } = useGetMoviesQuery({})

  useEffect(() => {
    refetchCinemaComplexes()
    refetchCinemas()
    refetchShowtimes()
    refetchMovies()
  }, [refetchCinemaComplexes, refetchCinemas, refetchShowtimes, refetchMovies])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState<
    string | null
  >(null)
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null)

  const selectMovieName = useMemo(() => {
    return movies?.data?.find((item: MovieType) => item._id === selectedMovie)
  }, [movies, selectedMovie])

  useEffect(() => {
    if (cinemaComplexes?.data) {
      setSelectedCinemaComplex(cinemaComplexes.data[0]._id)
    }
  }, [cinemaComplexes])

  const handleCinemaComplexClick = (cinemaComplex: CinemaComplexType) => {
    setSelectedCinemaComplex(cinemaComplex._id)
    setSelectedCinema(null)
  }

  const handleCinemaClick = (cinema: CinemaType) => {
    setSelectedCinema(cinema._id)
  }

  const handleMovieClick = (movie: MovieType) => {
    setSelectedMovie(movie._id)
  }

  const handleRemoveMovie = () => {
    setSelectedMovie(null)
  }

  const filteredCinemas = useMemo(() => {
    return cinemas?.data?.filter(
      (cinema: CinemaType) =>
        cinema.cinemaComplex._id === selectedCinemaComplex,
    )
  }, [cinemas, selectedCinemaComplex])

  const formattedDate = useMemo(() => {
    return selectedDate ? formatDateToVietnamese(selectedDate) : ''
  }, [selectedDate])

  const filteredShowtimes = useMemo(() => {
    return showtimes?.data?.filter((showtime: ShowtimeType) => {
      const showtimeDate = new Date(showtime.date)
      const isCinemaMatch = showtime.cinema._id === selectedCinema
      const isMovieMatch =
        !selectedMovie || showtime.movie._id === selectedMovie
      const isDateMatch =
        showtimeDate.toDateString() === selectedDate.toDateString()
      const isVisible = !showtime.hidden

      return isCinemaMatch && isMovieMatch && isDateMatch && isVisible
    })
  }, [showtimes, selectedCinema, selectedMovie, selectedDate])

  const groupedShowtimes = useMemo(() => {
    return (
      filteredShowtimes?.reduce((acc: any, item: any) => {
        const movieId = item.movie._id
        if (!acc[movieId]) {
          acc[movieId] = []
        }
        acc[movieId].push(item)
        return acc
      }, {}) || {}
    )
  }, [filteredShowtimes])

  let content
  if (
    isLoadingCinemaComplexes ||
    isLoadingCinemas ||
    isLoadingShowtimes ||
    isLoadingMovies
  )
    content = <div>Loading...</div>
  if (
    isSuccessCinemaComplexes &&
    isSuccessCinemas &&
    isSuccessShowtimes &&
    isSuccessMovies
  ) {
    content = (
      <div className='relative h-full w-full'>
        <div className='h-full w-full bg-[#f9f6ec]'>
          <div className='mx-auto w-[1000px] pt-10'>
            <div className='pb-10 text-center text-xl font-semibold capitalize'>
              suất chiếu phim
            </div>
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
            <div className='mt-10 border-b-2 border-t-2 border-black bg-white'>
              <div className='flex min-h-[300px] items-start border-b'>
                <div className='w-[650px] border-r-2'>
                  <div className='border-b-2 p-6 text-center text-xl font-semibold capitalize'>
                    rạp
                  </div>
                  <div className='grid grid-cols-[170px_auto] gap-6 p-6'>
                    <ul className='flex flex-col gap-4'>
                      {cinemaComplexes?.data?.map(
                        (item: CinemaComplexType, index: number) => (
                          <li
                            key={index}
                            className={`${selectedCinemaComplex === item._id && 'bg-[#231f20] text-white'} cursor-pointer py-3 text-center text-xs font-semibold capitalize`}
                            onClick={() => handleCinemaComplexClick(item)}
                          >
                            {item.name}
                          </li>
                        ),
                      )}
                    </ul>
                    <div className='grid h-[150px] grid-cols-3 grid-rows-3 gap-2'>
                      {filteredCinemas?.map(
                        (item: CinemaType, index: number) => (
                          <div
                            key={index}
                            className={` ${
                              selectedCinema === item._id &&
                              'border border-black bg-[#fff]'
                            } flex h-10 cursor-pointer items-center justify-center bg-[#efefef] text-xs font-semibold capitalize`}
                            onClick={() => handleCinemaClick(item)}
                          >
                            {item.name}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className='w-[350px]'>
                  <div className='border-b-2 p-6 text-center text-xl font-semibold capitalize'>
                    phim
                  </div>
                  <ul className='flex h-[480px] flex-col gap-4 overflow-y-auto p-2'>
                    {movies?.data?.map((item: MovieType, index: number) => (
                      <li
                        key={index}
                        onClick={() => handleMovieClick(item)}
                        className={`${
                          selectedMovie === item._id
                            ? 'border border-[red]'
                            : ''
                        } flex cursor-pointer items-center gap-2 border border-[#eee] p-2 text-sm font-semibold`}
                      >
                        {item.movieRating === 'P - Phổ biến' && (
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#088210] p-2 text-white'>
                            P
                          </div>
                        )}
                        {item.movieRating === 'K - Dành cho trẻ em' && (
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                            K
                          </div>
                        )}
                        {item.movieRating ===
                          'C13 - Cấm khán giả dưới 13 tuổi' && (
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                            13
                          </div>
                        )}
                        {item.movieRating ===
                          'C16 - Cấm khán giả dưới 16 tuổi' && (
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                            16
                          </div>
                        )}
                        {item.movieRating ===
                          'C18 - Cấm khán giả dưới 18 tuổi' && (
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#e80808] p-2 text-white'>
                            18
                          </div>
                        )}
                        <div className='w-[200px] overflow-hidden text-ellipsis text-nowrap text-sm font-semibold uppercase'>
                          {item.name}
                        </div>
                        <span className='mx-1'>|</span>
                        <div>{item.duration} phút</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='h-full w-full'>
          <div className='mx-auto w-[1000px]'>
            <div className='flex items-center justify-between bg-[#dad2b4] p-6'>
              <div className='font-semibold capitalize'>{formattedDate}</div>
              <div className='flex items-center'>
                <div className='mr-2 font-semibold capitalize'>rạp:</div>
                {selectedCinema ? (
                  <div className='flex items-center gap-2 border border-[#bab093] bg-[#e5e0cb] px-2 py-1 text-sm font-semibold capitalize'>
                    <span>
                      {
                        filteredCinemas.find(
                          (cinema: CinemaType) => cinema._id === selectedCinema,
                        )?.name
                      }
                    </span>
                    <button
                      onClick={() => setSelectedCinema(null)}
                      className='bg-[#877b61] p-0.5'
                    >
                      <FaTimes color='white' />
                    </button>
                  </div>
                ) : (
                  <div className='text-sm font-semibold capitalize'>
                    vui lòng chọn phòng chiếu
                  </div>
                )}
              </div>
              <div className='flex items-center'>
                <div className='mr-2 font-semibold capitalize'>phim:</div>
                {selectMovieName ? (
                  <div className='flex items-center gap-2 border border-[#bab093] bg-[#e5e0cb] px-2 py-1 text-sm font-semibold capitalize'>
                    <span>{selectMovieName.name}</span>
                    <button
                      onClick={() => handleRemoveMovie()}
                      className='bg-[#877b61] p-0.5'
                    >
                      <FaTimes color='white' />
                    </button>
                  </div>
                ) : (
                  <div className='text-sm font-semibold capitalize'>
                    vui lòng chọn phim
                  </div>
                )}
              </div>
            </div>
            <div className='my-10'>
              <div className='mb-10'>
                <span className='mr-4 text-2xl font-bold capitalize'>
                  giờ chiếu
                </span>
                <span className='text-sm text-[#777]'>
                  Thời gian chiếu phim có thể chênh lệch 15 phút do chiếu quảng
                  cáo, giới thiệu phim ra rạp
                </span>
              </div>
              {!selectedCinemaComplex || !selectedCinema || !selectedDate ? (
                <div className='flex items-center justify-center text-[18px] leading-[320px] text-[#777]'>
                  <PiWarningOctagon size='24' />
                  Kính mời quý khách chọn phim để xem lịch chiếu chi tiết tại
                  rạp
                </div>
              ) : Object.keys(groupedShowtimes || {}).length ? (
                <ul>
                  {Object.keys(groupedShowtimes).map((movieId: string) => {
                    const showtimesForMovie = groupedShowtimes[movieId]
                    const movie = showtimesForMovie[0].movie

                    return (
                      <li key={movieId} className='mb-6'>
                        <div className='flex items-center gap-3 bg-[#efebdb] p-6 font-semibold uppercase'>
                          <div>{movie.name}</div>
                          <Link
                            to={`/movie/${movie._id}`}
                            className='flex items-center justify-center border border-[#777] bg-white p-0.5'
                            title='Xem thông tin chi tiết phim'
                          >
                            <FaAngleRight />
                          </Link>
                        </div>
                        <div className='flex flex-col items-start p-6'>
                          {selectedCinema &&
                            showtimesForMovie[0].cinema._id ===
                              selectedCinema && (
                              <div className='font-semibold capitalize'>
                                {showtimesForMovie[0].cinema.name}
                              </div>
                            )}
                          <ul className='mt-4 flex flex-wrap items-center gap-2'>
                            {showtimesForMovie
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.timeStart).getTime() -
                                  new Date(b.timeStart).getTime(),
                              )
                              .map((item: any, index: number) => (
                                <li
                                  key={index}
                                  className='w-[120px] border border-[#ebeaea]'
                                >
                                  <Link
                                    to={`/showtime/${item._id}`}
                                    className='group block hover:bg-[#231f20]'
                                  >
                                    <div className='border-b border-[#ebeaea] p-2 text-center text-xs capitalize group-hover:border-black group-hover:text-white'>
                                      <span>{item.movie.movieFormat}</span>
                                      <span className='mx-1'>|</span>
                                      <span>{item.movie.subtitle}</span>
                                    </div>
                                    <div className='border-b border-[#ebeaea] p-2 text-center text-xs capitalize group-hover:border-black group-hover:text-white'>
                                      phòng {item.room.name}
                                    </div>
                                    <div className='p-2 text-center text-sm font-semibold group-hover:border-black group-hover:text-white'>
                                      {new Date(
                                        item.timeStart,
                                      ).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                      <span className='mx-1'>~</span>
                                      {new Date(
                                        item.timeEnd,
                                      ).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </div>
                                    <div className='border-t border-[#ebeaea] p-2 text-center text-xs group-hover:border-black group-hover:text-white'>
                                      {item.room.opacity} Ghế
                                    </div>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className='flex items-center justify-center text-[18px] leading-[320px] text-[#777]'>
                  <PiWarningOctagon size='24' />
                  Không có suất chiếu nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return content
}

export default Showtimes

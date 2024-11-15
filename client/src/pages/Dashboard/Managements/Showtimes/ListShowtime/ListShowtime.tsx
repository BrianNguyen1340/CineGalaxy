import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import {
  useGetShowtimesQuery,
  useHideShowtimeMutation,
  useShowShowtimeMutation,
} from '~/services/showtime.service'
import { useGetMoviesQuery } from '~/services/movie.service'
import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { ShowtimeType } from '~/types/showtime.type'
import { MovieType } from '~/types/movie.type'
import { RoomType } from '~/types/room.type'
import { CinemaComplexType } from '~/types/cinemaComplex.type'
import { CinemaType } from '~/types/cinema.type'
import useTitle from '~/hooks/useTitle'

const ListShowtime = () => {
  useTitle('Admin | Danh sách suất chiếu')

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

  const {
    data: cinemaCinemaComplexes,
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
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  useEffect(() => {
    refetchShowtimes()
    refetchMovies()
    refetchCinemaComplexes()
    refetchCinemas()
    refetchRooms()
  }, [
    refetchShowtimes,
    refetchMovies,
    refetchCinemaComplexes,
    refetchCinemas,
    refetchRooms,
  ])

  const [selectedMovie, setSelectedMovie] = useState<any>(
    localStorage.getItem('selectedMovieShowtime') || null,
  )
  const [selectedRoom, setSelectedRoom] = useState<any>(
    localStorage.getItem('selectedRoomShowtime') || null,
  )
  const [selectedCinema, setSelectedCinema] = useState<any>(
    localStorage.getItem('selectedCinemaShowtime') || null,
  )
  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState<any>(
    localStorage.getItem('selectedCinemaComplexShowtime') || null,
  )

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage

  const filteredShowtimes = showtimes
    ? showtimes.data.filter((showtime: ShowtimeType) => {
        const matchMovie = selectedMovie
          ? showtime.movie._id === selectedMovie
          : true
        const matchRoom = selectedRoom
          ? showtime.room._id === selectedRoom
          : true
        const matchCinema = selectedCinema
          ? showtime.cinema._id === selectedCinema
          : true
        const matchCinemaCluster = selectedCinemaComplex
          ? showtime.cinemaComplex._id === selectedCinemaComplex
          : true

        return matchMovie && matchRoom && matchCinema && matchCinemaCluster
      })
    : []

  const currentItems = filteredShowtimes.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
  }
  const handleMovieChange = (event: any) => {
    setSelectedMovie(event.target.value)
  }
  const handleRoomChange = (event: any) => {
    setSelectedRoom(event.target.value)
  }
  const handleCinemaChange = (event: any) => {
    setSelectedCinema(event.target.value)
  }
  const handleCinemaClusterChange = (event: any) => {
    setSelectedCinemaComplex(event.target.value)
  }

  const [hideShowtime] = useHideShowtimeMutation()
  const [showShowtime] = useShowShowtimeMutation()

  const handleHideMovie = async (_id: string) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn ẩn suất chiếu này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })
      if (result.isConfirmed) {
        await hideShowtime(_id)
        Swal.fire('Thành công!', 'Ẩn suất chiếu thành công!', 'success')
        refetchShowtimes()
      }
    } catch (error: any) {
      Swal.fire('Thất bại', error.data.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleShowMovie = async (_id: string) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn hiện suất chiếu này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })
      if (result.isConfirmed) {
        await showShowtime(_id)
        Swal.fire('Thành công!', 'Hiện suất chiếu thành công!', 'success')
        refetchShowtimes()
      }
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  let content

  if (
    isLoadingShowtimes ||
    isLoadingMovies ||
    isLoadingCinemas ||
    isLoadingCinemaComplexes ||
    isLoadingRooms
  )
    content = <div>Loading...</div>

  if (
    isSuccessShowtimes &&
    isSuccessMovies &&
    isSuccessCinemas &&
    isSuccessCinemaComplexes &&
    isSuccessRooms
  ) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          tạo suất chiếu
        </div>
        
        {showtimes ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>ngày chiếu</th>
                  <th>thời gian bắt đầu</th>
                  <th>thời gian kết thúc</th>
                  <th>phim</th>
                  <th>phòng</th>
                  <th>rạp</th>
                  <th>cụm rạp</th>
                  <th>trạng thái</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item: ShowtimeType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td>
                      {new Date(item.timeStart).toLocaleTimeString('vi-VN')}
                    </td>
                    <td>
                      {new Date(item.timeEnd).toLocaleTimeString('vi-VN')}
                    </td>
                    <td>{item.movie.name}</td>
                    <td className='capitalize'>{item.room.name}</td>
                    <td className='capitalize'>{item.cinema.name}</td>
                    <td className='capitalize'>{item.cinemaComplex.name}</td>
                    <td>
                      {item.hidden === false ? (
                        <div className='flex items-center justify-center'>
                          <button
                            className='cursor-pointer rounded bg-[#70e000] p-1 capitalize text-white'
                            onClick={() => handleHideMovie(item?._id)}
                          >
                            show
                          </button>
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <button
                            className='ff006e cursor-pointer rounded bg-[#ff006e] p-1 capitalize text-white'
                            onClick={() => handleShowMovie(item?._id)}
                          >
                            hidden
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link to={`/update-showtime/${item?._id}`}>
                          <SquarePen />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(showtimes.data.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách suất chiếu trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListShowtime

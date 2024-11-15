import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetSeatsQuery } from '~/services/seat.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetRoomsQuery } from '~/services/room.service'
import { SeatType } from '~/types/seat.type'
import { CinemaType } from '~/types/cinema.type'
import { RoomType } from '~/types/room.type'
import useTitle from '~/hooks/useTitle'

const ListSeat = () => {
  useTitle('Manager | Danh sách ghế')

  const {
    data: seats,
    isLoading: isLoadingSeats,
    isSuccess: isSuccessSeats,
    refetch: refetchSeats,
  } = useGetSeatsQuery({})

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
    refetchSeats()
    refetchCinemas()
    refetchRooms()
  }, [refetchSeats, refetchCinemas, refetchRooms])

  const [selectedSeatRoomCinema, setSelectedSeatRoomCinema] = useState(
    localStorage.getItem('selectedSeatRoomCinema') || null,
  )
  const [selectedSeatRoom, setSelectedSeatRoom] = useState(
    localStorage.getItem('selectedSeatRoom') || null,
  )
  const [sortOrderSeatRow, setSortOrderSeatRow] = useState(
    localStorage.getItem('sortOrderSeatRow') || 'asc',
  )
  const [sortBySeatNumber, setSortBySeatNumber] = useState(
    localStorage.getItem('sortBySeatNumber') || 'asc',
  )

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage

  const filteredSeats = seats
    ? seats?.data
        .filter((seat: SeatType) => {
          const matchCinema = selectedSeatRoomCinema
            ? seat.room.cinema._id === selectedSeatRoomCinema
            : true
          const matchRoom = selectedSeatRoom
            ? seat.room._id === selectedSeatRoom
            : true
          return matchCinema && matchRoom
        })
        .sort((a: SeatType, b: SeatType) => {
          const rowComparison =
            sortOrderSeatRow === 'asc'
              ? a.row.localeCompare(b.row)
              : b.row.localeCompare(a.row)
          if (rowComparison === 0) {
            return sortBySeatNumber === 'asc'
              ? a.number - b.number
              : b.number - a.number
          }
          return rowComparison
        })
    : []

  const currentItems = filteredSeats
    ?.slice()
    ?.reverse()
    ?.slice(offset, offset + itemsPerPage)

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  const handleCinemaChange = (event: any) => {
    const value = event.target.value
    setSelectedSeatRoomCinema(value)
    localStorage.setItem('selectedSeatRoomCinema', value)
    setSelectedSeatRoom(null)
    setCurrentPage(0)
  }

  const handleRoomChange = (event: any) => {
    const value = event.target.value
    setSelectedSeatRoom(value)
    localStorage.setItem('selectedSeatRoom', value)
    setCurrentPage(0)
  }

  const toggleSortSeatOrder = () => {
    const newSortOrder = sortOrderSeatRow === 'asc' ? 'desc' : 'asc'
    setSortOrderSeatRow(newSortOrder)
    localStorage.setItem('sortOrderSeatRow', newSortOrder)
  }

  const toggleSortBySeatNumber = () => {
    const newSortOrder = sortBySeatNumber === 'asc' ? 'desc' : 'asc'
    setSortBySeatNumber(newSortOrder)
    localStorage.setItem('sortBySeatNumber', newSortOrder)
  }

  let content
  if (isLoadingSeats || isLoadingRooms || isLoadingCinemas)
    content = <div>Loading...</div>
  if (isSuccessSeats && isSuccessRooms && isSuccessCinemas) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách ghế
        </div>
        <div className='mb-6 flex items-center gap-10'>
          <div>
            <label htmlFor='cinema-select' className='font-semibold'>
              Chọn rạp:
            </label>
            <select
              id='cinema-select'
              onChange={handleCinemaChange}
              value={selectedSeatRoomCinema || ''}
              className='ml-2 rounded border p-2 capitalize'
            >
              <option>Tất cả rạp</option>
              {cinemas &&
                cinemas.data.map((cinema: CinemaType, index: number) => (
                  <option key={index} value={cinema._id} className='capitalize'>
                    {cinema.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='room-select'
              className='mb-1 font-semibold capitalize'
            >
              Chọn phòng:
            </label>
            <select
              id='room-select'
              onChange={handleRoomChange}
              value={selectedSeatRoom || ''}
              className='ml-2 rounded border p-2 capitalize'
              disabled={!selectedSeatRoomCinema}
            >
              <option>Tất cả phòng</option>
              {rooms &&
                rooms?.data
                  .filter(
                    (room: RoomType) =>
                      room.cinema._id === selectedSeatRoomCinema,
                  )
                  .map((room: RoomType) => (
                    <option
                      key={room._id}
                      value={room._id}
                      className='capitalize'
                    >
                      {room.name}
                    </option>
                  ))}
            </select>
          </div>
        </div>
        <div className='mb-6 flex items-center gap-10'>
          <div>
            <button
              onClick={toggleSortSeatOrder}
              className='rounded bg-blue-500 p-2 text-white'
            >
              Sắp xếp hàng ghế {sortOrderSeatRow === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
          </div>
          <div>
            <button
              onClick={toggleSortBySeatNumber}
              className='rounded bg-green-500 p-2 text-white'
            >
              Sắp xếp số ghế
              {sortBySeatNumber === 'asc' ? 'Tăng dần' : 'Giảm dần'}
            </button>
          </div>
        </div>

        {filteredSeats.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>stt</th>
                  <th>hàng ghế</th>
                  <th>số ghế</th>
                  <th>loại ghế</th>
                  <th>giá</th>
                  <th>phòng</th>
                  <th>quản lý</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: SeatType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset + 1}</td>
                    <td>{item.row}</td>
                    <td>{item.number}</td>
                    <td className='capitalize'>{item.type}</td>
                    <td>{item.price} VNĐ</td>
                    <td className='capitalize'>
                      {item.room.name} - {item.room.cinema.name}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-seat/${item._id}`}
                          className='rounded p-1 transition duration-300 hover:bg-[#67349D] hover:text-white hover:shadow-custom'
                        >
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
              pageCount={Math.ceil(filteredSeats?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách ghế trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListSeat

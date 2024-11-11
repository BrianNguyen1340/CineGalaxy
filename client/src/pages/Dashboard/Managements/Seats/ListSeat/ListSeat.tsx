import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetSeatsQuery } from '~/services/seat.service'
import { useGetCinemasQuery } from '~/services/cinema.service'
import { useGetRoomsQuery } from '~/services/room.service'

const ListSeat = () => {
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
  } = useGetCinemasQuery({})

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
  } = useGetRoomsQuery({})

  useEffect(() => {
    refetchSeats()
  }, [refetchSeats])

  const [currentPage, setCurrentPage] = useState(0)

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

  const itemsPerPage = 10

  const offset = currentPage * itemsPerPage

  const filteredSeats = seats
    ? seats.data
        .filter((seat: any) => {
          const matchCinema = selectedSeatRoomCinema
            ? seat?.room?.cinema?._id === selectedSeatRoomCinema
            : true
          const matchRoom = selectedSeatRoom
            ? seat?.room?._id === selectedSeatRoom
            : true
          return matchCinema && matchRoom
        })
        .sort((a: any, b: any) => {
          const rowComparison =
            sortOrderSeatRow === 'asc'
              ? a?.row?.localeCompare(b?.row)
              : b?.row?.localeCompare(a?.row)
          if (rowComparison === 0) {
            return sortBySeatNumber === 'asc'
              ? a?.number - b?.number
              : b?.number - a?.number
          }
          return rowComparison
        })
    : []

  const currentItems = filteredSeats
    .slice()
    .reverse()
    .slice(offset, offset + itemsPerPage)

  const handlePageClick = (event: any) => {
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
              <option value=''>Tất cả rạp</option>
              {cinemas &&
                cinemas.data.map((cinema: any) => (
                  <option
                    key={cinema._id}
                    value={cinema._id}
                    className='capitalize'
                  >
                    {cinema.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor='room-select' className='font-semibold'>
              Chọn phòng:
            </label>
            <select
              id='room-select'
              onChange={handleRoomChange}
              value={selectedSeatRoom || ''}
              className='ml-2 rounded border p-2 capitalize'
              disabled={!selectedSeatRoomCinema}
            >
              <option value=''>Tất cả phòng</option>
              {rooms &&
                rooms.data
                  .filter(
                    (room: any) => room.cinema._id === selectedSeatRoomCinema,
                  )
                  .map((room: any) => (
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
              Sắp xếp số ghế{' '}
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
                  <th>phòng</th>
                  <th>quản lý</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>{index + offset + 1}</td>
                    <td>{item.row}</td>
                    <td>{item.number}</td>
                    <td>{item.type}</td>
                    <td>
                      {item.room.name} - {item.room.cinema.name}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link to={`/update-seat/${item._id}`}>
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
              pageCount={Math.ceil(filteredSeats.length / itemsPerPage)}
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

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetRoomsQuery } from '~/services/room.service'
import { RoomType } from '~/types/room.type'
import useTitle from '~/hooks/useTitle'

const ListRoom = () => {
  useTitle('Admin | Danh sách phòng')

  const {
    data: rooms,
    isLoading: isLoadingRooms,
    isSuccess: isSuccessRooms,
    refetch: refetchRooms,
  } = useGetRoomsQuery({})

  useEffect(() => {
    refetchRooms()
  }, [refetchRooms])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = rooms
    ? rooms?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoadingRooms) content = <div>Loading...</div>
  if (isSuccessRooms) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách phòng
        </div>

        {rooms ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>stt</th>
                  <th>tên</th>
                  <th>sức chứa</th>
                  <th>tình trạng</th>
                  <th>rạp</th>
                  <th>quản lý</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: RoomType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td>{item.name}</td>
                    <td>{item.opacity}</td>
                    <td>{item.status}</td>
                    <td className='capitalize'>{item.cinema.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-room/${item._id}`}
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
              breakClassName={'break-me'}
              pageCount={Math.ceil(rooms?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách phòng trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListRoom

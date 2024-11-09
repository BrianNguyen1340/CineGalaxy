import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { Loader } from '~/components'
import { useGetAllRoomsQuery } from '~/services/room.service'

const ListRoom = () => {
  const { data: rooms, isLoading, refetch } = useGetAllRoomsQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = rooms
    ? rooms?.data
        .slice()
        .reverse()
        .slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
  }

  if (isLoading) {
    return <Loader />
  }

  return (
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
              {currentItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{item.name}</td>
                  <td>{item.opacity}</td>
                  <td>{item.status}</td>
                  <td>{item.cinema.name}</td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <Link to={`/update-room/${item?._id}`}>
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
            pageCount={Math.ceil(rooms.data.length / itemsPerPage)}
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

export default ListRoom

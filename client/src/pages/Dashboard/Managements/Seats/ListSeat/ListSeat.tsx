import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { Loader } from '~/components'
import { useGetAllSeatsQuery } from '~/services/seat.service'

const ListSeat = () => {
  const { data: seats, isLoading, refetch } = useGetAllSeatsQuery({})

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = seats
    ? seats?.data
        .slice()
        .reverse()
        .slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
      <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
        danh sách ghế
      </div>
      {seats ? (
        <>
          <table>
            <thead>
              <tr>
                <th>stt</th>
                <th>hàng ghế</th>
                <th>số ghế</th>
                <th>loại ghế</th>
                <th>tình trạng ghế</th>
                <th>quản lý</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{item.row}</td>
                  <td>{item.number}</td>
                  <td>{item.type}</td>
                  <td>{item.status}</td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <Link to={`/update-seat/${item?._id}`}>
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
            pageCount={Math.ceil(seats.data.length / itemsPerPage)}
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

export default ListSeat

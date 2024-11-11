import { SquarePen } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'

import { useGetShowtimesQuery } from '~/services/showtime.service'

const ListShowtime = () => {
  const { data: showtimes, isLoading, refetch } = useGetShowtimesQuery({})
  console.log(showtimes)

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = showtimes
    ? showtimes?.data
        .slice()
        .reverse()
        .slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
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
                <th>hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{new Date(item?.date).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {new Date(item?.timeStart).toLocaleTimeString('vi-VN')}
                  </td>
                  <td>{new Date(item?.timeEnd).toLocaleTimeString('vi-VN')}</td>
                  <td>{item?.movie.name}</td>
                  <td>{item?.room.name}</td>
                  <td>{item?.cinema.name}</td>
                  <td>{item?.cinemaComplex.name}</td>
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

export default ListShowtime

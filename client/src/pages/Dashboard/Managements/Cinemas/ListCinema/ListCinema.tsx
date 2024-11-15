import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetCinemasQuery } from '~/services/cinema.service'
import { CinemaType } from '~/types/cinema.type'
import useTitle from '~/hooks/useTitle'

const ListCinema = () => {
  useTitle('Admin | Danh sách rạp')

  const {
    data: cinemas,
    isLoading,
    isSuccess,
    refetch,
  } = useGetCinemasQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = cinemas
    ? cinemas?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoading) content = <div>Loading...</div>
  if (isSuccess) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách rạp
        </div>

        {cinemas ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên rạp</th>
                  <th>email</th>
                  <th>địa chỉ rạp</th>
                  <th>số điện thoại rạp</th>
                  <th>cụm rạp</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: CinemaType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td style={{ textTransform: 'unset' }}>{item.email}</td>
                    <td className='capitalize'>{item.address}</td>
                    <td>{item.phone}</td>
                    <td className='capitalize'>{item.cinemaComplex.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-cinema/${item._id}`}
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
              pageCount={Math.ceil(cinemas?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách cụm rạp trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListCinema

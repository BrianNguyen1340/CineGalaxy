import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { CinemaComplexType } from '~/types/cinemaComplex.type'
import useTitle from '~/hooks/useTitle'
import { BeatLoader } from 'react-spinners'

const ListCinemaComplex = () => {
  useTitle('Admin | Danh sách cụm rạp')

  const {
    data: cinemaComplexes,
    isLoading,
    isSuccess,
    refetch,
  } = useGetCinemaComplexesQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = cinemaComplexes
    ? cinemaComplexes?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content

  if (isLoading)
    content = (
      <div className='flex h-screen w-full items-center justify-center'>
        <BeatLoader />
      </div>
    )
    
  if (isSuccess) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách cụm rạp
        </div>

        {cinemaComplexes ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên cụm rạp</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: CinemaComplexType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-cinema-complex/${item._id}`}
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
              pageCount={Math.ceil(
                cinemaComplexes?.data?.length / itemsPerPage,
              )}
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

export default ListCinemaComplex

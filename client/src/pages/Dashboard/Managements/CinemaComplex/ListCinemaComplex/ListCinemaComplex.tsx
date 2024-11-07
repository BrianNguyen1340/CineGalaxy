import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetAllCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { Loader } from '~/components'

const ListCinemaComplex = () => {
  const {
    data: cinemaComplexes,
    refetch,
    isLoading,
  } = useGetAllCinemaComplexesQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = cinemaComplexes
    ? cinemaComplexes.data
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
        danh sách cụm rạp
      </div>
      {cinemaComplexes ? (
        <>
          <table>
            <thead>
              <tr>
                <th>stt</th>
                <th>name</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td className='capitalize'>{item.name}</td>
                  <td>
                    <div className='flex items-center justify-center'>
                      <Link to={`/update-cinema-complex/${item._id}`}>
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
            pageCount={Math.ceil(cinemaComplexes.data.length / itemsPerPage)}
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

export default ListCinemaComplex

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetAllCinemaComplexesQuery } from '~/services/cinemaComplex.service'
import { Loader } from '~/components'
import './ListCinemaComplex.scss'

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
    <div className='list-cinema-complex-container'>
      <div className='title'>danh sách cụm rạp</div>
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
              {currentItems.map((cinemaComplex: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{cinemaComplex.name}</td>
                  <td>
                    <Link to={`/update-cinema-complex/${cinemaComplex._id}`}>
                      <SquarePen />
                    </Link>
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

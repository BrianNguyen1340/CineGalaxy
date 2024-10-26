import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetAllCinemaQuery } from '~/services/cinema.service'
import { Loader } from '~/components'
import './ListCinema.scss'

const ListCinema = () => {
  const { data: cinemas, refetch, isLoading } = useGetAllCinemaQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = cinemas
    ? cinemas.data
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
    <div className='container'>
      <div className='title'>danh sách rạp</div>
      {cinemas ? (
        <>
          <table>
            <thead>
              <tr>
                <th>stt</th>
                <th>name</th>
                <th>email</th>
                <th>address</th>
                <th>phone</th>
                <th>cụm rạp</th>
                <th>action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{item.name}</td>
                  <td style={{ textTransform: 'unset' }}>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.phone}</td>
                  <td>{item.cinemaComplex.name}</td>
                  <td>
                    <Link to={`/update-cinema/${item._id}`}>
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
            pageCount={Math.ceil(cinemas.data.length / itemsPerPage)}
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

export default ListCinema

import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'

import { useGetAllGenresQuery } from '~/services/genre.service'
import { Loader } from '~/components'
import './ListMovieCategory.scss'

const ListMovieCategory = () => {
  const {
    data: movieCategories,
    refetch,
    isLoading,
  } = useGetAllGenresQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = movieCategories
    ? movieCategories.data
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
    <div className='list-movie-category-container'>
      <div className='title'>danh sách danh mục phim</div>
      {movieCategories ? (
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
              {currentItems.map((movieCategory: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{movieCategory.name}</td>
                  <td>
                    <Link to={`/update-movie-category/${movieCategory._id}`}>
                      <SquarePen />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div>Danh sách danh mục phim trống!</div>
      )}
    </div>
  )
}

export default ListMovieCategory

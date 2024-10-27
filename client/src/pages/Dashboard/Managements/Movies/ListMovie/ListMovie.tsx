import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { Loader } from '~/components'
import { useGetAllMoviesQuery } from '~/services/movie.service'
import './ListMovie.scss'

const ListMovie = () => {
  const { data: movies, isLoading, refetch } = useGetAllMoviesQuery({})

  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5
  const offset = currentPage * itemsPerPage
  const currentItems = movies
    ? movies?.data
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
      <div className='title'>danh sách phim</div>
      {movies ? (
        <>
          <table>
            <thead>
              <tr>
                <th>stt</th>
                <th>tên</th>
                <th>đạo diễn</th>
                <th>poster</th>
                <th>công chiếu</th>
                <th>thời lượng</th>
                <th>thể loại</th>
                <th>hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems?.map((item: any, index: number) => (
                <tr key={index}>
                  <td>{index + offset}</td>
                  <td>{item?.name}</td>
                  <td>{item?.director}</td>
                  <td>
                    <img src={item?.poster} alt='poster' width='200' />
                  </td>
                  <td>
                    {new Date(item?.releaseDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td>{item?.duration} phút</td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {item?.genres?.map((genre: any, index: number) => (
                        <span key={index}>
                          {genre.name}
                          {/* {index < item.genres.length - 1 && <span> / </span>} */}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link to={`/update-movie/${item?._id}`}>
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
            pageCount={Math.ceil(movies.data.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      ) : (
        <div>Danh sách phim trống!</div>
      )}
    </div>
  )
}

export default ListMovie

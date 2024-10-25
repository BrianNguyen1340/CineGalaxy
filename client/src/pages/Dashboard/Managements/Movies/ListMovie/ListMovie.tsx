import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetAllMoviesQuery } from '~/services/movie.service'
import './ListMovie.scss'
import { Loader } from '~/components'

const ListMovie = () => {
  const { data: movies, isLoading, refetch } = useGetAllMoviesQuery({})
  console.log(movies)
  useEffect(() => {
    refetch()
  }, [refetch])

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
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
    <div className='list-movie-container'>
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
                <th>phụ đề</th>
                <th>xếp hạng phim</th>
                <th>định dạng</th>
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
                    <img src={item?.poster} alt='poster' width='150' />
                  </td>
                  <td>
                    {new Date(item?.releaseDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td>{item?.duration} phút</td>
                  <td>{item?.subtitle}</td>
                  <td>{item?.movieRating}</td>
                  <td>{item?.movieFormat}</td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {item?.genres?.map((genre: any, index: number) => (
                        <span key={index}>{genre.name} </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Link to={`/update-cinema/${item?._id}`}>
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

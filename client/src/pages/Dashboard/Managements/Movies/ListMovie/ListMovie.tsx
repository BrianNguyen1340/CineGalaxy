import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'
import nProgress from 'nprogress'
import Swal from 'sweetalert2'

import {
  useGetMoviesQuery,
  useHideMovieMutation,
  useShowMovieMutation,
} from '~/services/movie.service'
import { MovieType } from '~/types/movie.type'
import { GenreType } from '~/types/genre.type'
import useTitle from '~/hooks/useTitle'

const ListMovie = () => {
  useTitle('Admin | Danh sách phim')

  const {
    data: movies,
    isLoading: isLoadingMovie,
    isSuccess: isSuccessMovie,
    refetch: refetchMovie,
  } = useGetMoviesQuery({})

  useEffect(() => {
    refetchMovie()
  }, [refetchMovie])

  const [hideMovie] = useHideMovieMutation()
  const [showMovie] = useShowMovieMutation()

  const handleHideMovie = async (id: string) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn ẩn bộ phim này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })
      if (result.isConfirmed) {
        await hideMovie(id)
        Swal.fire('Thành công!', 'Ẩn phim thành công!', 'success')
        refetchMovie()
      }
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const handleShowMovie = async (id: string) => {
    try {
      nProgress.start()
      const result = await Swal.fire({
        title: 'Bạn có chắc',
        text: 'Muốn hiện bộ phim này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK!',
        cancelButtonText: 'Không!',
      })
      if (result.isConfirmed) {
        await showMovie(id)
        Swal.fire('Thành công!', 'Hiện phim thành công!', 'success')
        refetchMovie()
      }
    } catch (error: any) {
      Swal.fire('Thất bại', error?.data?.message, 'error')
    } finally {
      nProgress.done()
    }
  }

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 5
  const offset = currentPage * itemsPerPage
  const currentItems = movies
    ? movies?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoadingMovie) content = <div>Loading...</div>
  if (isSuccessMovie) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách phim
        </div>

        {movies ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên phim</th>
                  <th>đạo diễn</th>
                  <th>poster</th>
                  <th>công chiếu</th>
                  <th>thời lượng</th>
                  <th>thể loại</th>
                  <th>trạng thái</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((item: MovieType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='w-[200px]'>{item?.name}</td>
                    <td>{item?.director}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <img src={item.poster} alt='poster' width='200' />
                      </div>
                    </td>
                    <td>
                      {new Date(item.releaseDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td>{item.duration} phút</td>
                    <td>
                      <div className='flex flex-col gap-3 capitalize'>
                        {item.genres.map(
                          (genre: GenreType, index: number) => (
                            <span key={index}>{genre.name}</span>
                          ),
                        )}
                      </div>
                    </td>
                    <td>
                      {item.hidden === false ? (
                        <div className='flex items-center justify-center'>
                          <button
                            className='cursor-pointer rounded bg-[#70e000] p-1 capitalize text-white'
                            onClick={() => handleHideMovie(item._id)}
                          >
                            show
                          </button>
                        </div>
                      ) : (
                        <div className='flex items-center justify-center'>
                          <button
                            className='ff006e cursor-pointer rounded bg-[#ff006e] p-1 capitalize text-white'
                            onClick={() => handleShowMovie(item._id)}
                          >
                            hidden
                          </button>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-movie/${item._id}`}
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

  return content
}

export default ListMovie

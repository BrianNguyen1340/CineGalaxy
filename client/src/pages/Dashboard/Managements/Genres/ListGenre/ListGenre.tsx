import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SquarePen } from 'lucide-react'
import ReactPaginate from 'react-paginate'

import { useGetGenresQuery } from '~/services/genre.service'
import { GenreType } from '~/types/genre.type'
import useTitle from '~/hooks/useTitle'

const ListGenre = () => {
  useTitle('Admin | Danh sách thể loại phim')

  const {
    data: genres,
    isLoading: isLoadingGenres,
    isSuccess: isSuccessGenres,
    refetch: refetchGenres,
  } = useGetGenresQuery({})

  useEffect(() => {
    refetchGenres()
  }, [refetchGenres])

  const [currentPage, setCurrentPage] = useState<number>(0)
  const itemsPerPage = 10
  const offset = currentPage * itemsPerPage
  const currentItems = genres
    ? genres?.data
        ?.slice()
        ?.reverse()
        ?.slice(offset, offset + itemsPerPage)
    : []

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected)
  }

  let content
  if (isLoadingGenres) content = <div>Loading...</div>
  if (isSuccessGenres) {
    content = (
      <div className='relative h-fit w-full rounded-xl border bg-white p-4 shadow-md'>
        <div className='mb-5 rounded-xl bg-[#289ae7] py-5 text-center text-xl font-semibold capitalize text-white'>
          danh sách thể loại phim
        </div>
        
        {genres ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>no.</th>
                  <th>tên thể loại</th>
                  <th>hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: GenreType, index: number) => (
                  <tr key={index}>
                    <td>{index + offset}</td>
                    <td className='capitalize'>{item.name}</td>
                    <td>
                      <div className='flex items-center justify-center'>
                        <Link
                          to={`/update-genre/${item._id}`}
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
              pageCount={Math.ceil(genres?.data?.length / itemsPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              activeClassName={'active'}
            />
          </>
        ) : (
          <div>Danh sách danh mục phim trống!</div>
        )}
      </div>
    )
  }

  return content
}

export default ListGenre

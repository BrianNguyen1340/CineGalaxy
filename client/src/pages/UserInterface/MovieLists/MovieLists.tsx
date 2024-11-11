import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux'
import { paths } from '~/utils/paths'
import { useGetMoviesQuery } from '~/services/movie.service'
import useTitle from '~/hooks/useTitle'

const MovieLists = () => {
  useTitle('Danh sách phim')

  const { isAuthenticated, user } = useAppSelector((state) => state.user)

  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  const { data: movies, isLoading } = useGetMoviesQuery({})
  const [activeTab, setActiveTab] = useState('released')

  const currentDate = new Date()

  const releasedMovies = movies?.data?.filter((movie: any) => {
    const releaseDate = new Date(movie.releaseDate)
    return releaseDate <= currentDate
  })

  const upcomingMovies = movies?.data?.filter((movie: any) => {
    const releaseDate = new Date(movie.releaseDate)
    return releaseDate > currentDate
  })

  if (isLoading) {
    return <div className='loading-container'>Loading...</div>
  }
  return (
    <div className='relative h-fit w-full'>
      <div className='mx-auto w-[1040px] py-10'>
        <ul className='flex items-center gap-4 pb-10'>
          <li
            className={`block flex-[50%] cursor-pointer p-4 text-center font-semibold ${
              activeTab === 'released'
                ? 'bg-[#231f20] text-[#dad2b4]'
                : 'bg-[#dad2b4] text-[#6f6247]'
            }`}
            onClick={() => setActiveTab('released')}
          >
            Phim đang chiếu
          </li>
          <li
            className={`block flex-[50%] cursor-pointer p-4 text-center font-semibold ${
              activeTab === 'upcoming'
                ? 'bg-[#231f20] text-[#dad2b4]'
                : 'bg-[#dad2b4] text-[#6f6247]'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Phim sắp chiếu
          </li>
        </ul>
        {activeTab === 'released' ? (
          releasedMovies.length > 0 ? (
            <div className='grid grid-cols-4 gap-4 pb-5'>
              {releasedMovies.map((item: any, index: number) => (
                <div key={index} className='h-fit border bg-white'>
                  <figure className='group relative h-full w-full overflow-hidden'>
                    <img
                      src={item.poster}
                      alt='poster'
                      className='h-[334px] w-full'
                    />
                    <figcaption className='absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-10 transition duration-500 before:absolute before:z-[-1] before:bg-gray-700 before:opacity-0 group-hover:bg-[rgba(0,0,0,0.7)]'>
                      <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                        <Link
                          to={`/movie/${item._id}`}
                          className='mx-auto block min-w-[150px] cursor-pointer p-5 text-center font-semibold capitalize text-white transition duration-500 hover:bg-white hover:text-black'
                        >
                          xem chi tiết
                        </Link>
                      </div>
                      <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                        <Link
                          to={paths.userPaths.showtimes}
                          className='mx-auto block min-w-[150px] cursor-pointer p-5 text-center font-semibold capitalize text-white transition duration-500 hover:bg-white hover:text-black'
                        >
                          đặt vé
                        </Link>
                      </div>
                    </figcaption>
                  </figure>
                  <div className='flex items-center justify-start gap-4 border-b p-4'>
                    {item.movieRating === 'P - Phổ biến' && (
                      <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#088210] p-2 text-white'>
                        P
                      </div>
                    )}
                    {item.movieRating === 'K - Dành cho trẻ em' && (
                      <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                        K
                      </div>
                    )}
                    {item.movieRating === 'C13 - Cấm khán giả dưới 13 tuổi' && (
                      <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                        13
                      </div>
                    )}
                    {item.movieRating === 'C16 - Cấm khán giả dưới 16 tuổi' && (
                      <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                        16
                      </div>
                    )}
                    {item.movieRating === 'C18 - Cấm khán giả dưới 18 tuổi' && (
                      <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#e80808] p-2 text-white'>
                        18
                      </div>
                    )}
                    <div className='w-[170px] overflow-hidden text-ellipsis text-nowrap text-sm font-semibold uppercase'>
                      {item.name}
                    </div>
                  </div>
                  <div className='ic flex justify-center gap-2 p-4 text-center text-sm text-[#777]'>
                    <div>{item.duration} phút</div> |
                    <div>
                      {new Date(item.releaseDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center'>Không có phim sắp chiếu!</div>
          )
        ) : upcomingMovies.length > 0 ? (
          <div className='grid grid-cols-4 gap-4 pb-5'>
            {upcomingMovies.map((item: any, index: number) => (
              <div key={index} className='h-fit border bg-white'>
                <figure className='group relative h-full w-full overflow-hidden'>
                  <img
                    src={item.poster}
                    alt='poster'
                    className='h-[334px] w-full'
                  />
                  <figcaption className='absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-10 transition duration-500 before:absolute before:z-[-1] before:bg-gray-700 before:opacity-0 group-hover:bg-[rgba(0,0,0,0.7)]'>
                    <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                      <Link
                        to={`/movie/${item._id}`}
                        className='mx-auto block min-w-[150px] cursor-pointer p-5 text-center font-semibold capitalize text-white transition duration-500 hover:bg-white hover:text-black'
                      >
                        xem chi tiết
                      </Link>
                    </div>
                  </figcaption>
                </figure>
                <div className='flex items-center justify-start gap-4 border-b p-4'>
                  {item.movieRating === 'P - Phổ biến' && (
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#088210] p-2 text-white'>
                      P
                    </div>
                  )}
                  {item.movieRating === 'K - Dành cho trẻ em' && (
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                      K
                    </div>
                  )}
                  {item.movieRating === 'C13 - Cấm khán giả dưới 13 tuổi' && (
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                      13
                    </div>
                  )}
                  {item.movieRating === 'C16 - Cấm khán giả dưới 16 tuổi' && (
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-black p-2 text-white'>
                      16
                    </div>
                  )}
                  {item.movieRating === 'C18 - Cấm khán giả dưới 18 tuổi' && (
                    <div className='flex h-6 w-6 items-center justify-center rounded-full border bg-[#e80808] p-2 text-white'>
                      18
                    </div>
                  )}
                  <div className='w-[170px] overflow-hidden text-ellipsis text-nowrap text-sm font-semibold uppercase'>
                    {item.name}
                  </div>
                </div>
                <div className='ic flex justify-center gap-2 p-4 text-center text-sm text-[#777]'>
                  <div>
                    {new Date(item.releaseDate).toLocaleDateString('vi-VN')}
                  </div>
                  <div>Chưa mở</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center'>Không có phim sắp chiếu!</div>
        )}
      </div>
    </div>
  )
}

export default MovieLists

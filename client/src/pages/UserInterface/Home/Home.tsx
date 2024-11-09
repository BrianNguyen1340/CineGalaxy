import { Link, Navigate } from 'react-router-dom'
import Slider from 'react-slick'

import { useGetMoviesQuery } from '~/services/movie.service'
import { paths } from '~/utils/paths'
import { Loader } from '~/components'
import { useAppSelector } from '~/hooks/redux'

const Home = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.user)
  const isAuthorized =
    isAuthenticated &&
    (user?.role === 0 || user?.role === 1 || user?.role === 2)

  if (isAuthorized) {
    return <Navigate to={paths.dashboardPaths.dashboard} replace />
  }

  var settings = {
    // dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          // dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const { data: movies, isLoading: isLoadingMovies } = useGetMoviesQuery({})

  if (isLoadingMovies) {
    return <Loader />
  }

  return (
    <div className='h-fit w-full'>
      <section className='mx-auto w-[1300px] py-10'>
        <div className='mb-10 text-center text-[24px] font-semibold capitalize'>
          phim đang chiếu
        </div>
        <Slider {...settings}>
          {movies?.data?.map((item: any, index: number) => (
            <ul key={index} className='border border-[#ddd]'>
              {
                <li>
                  <figure className='group relative h-full w-full overflow-hidden'>
                    <img
                      src={item.poster}
                      alt='poster'
                      className='h-[412px] w-full object-cover'
                    />
                    <figcaption className='absolute bottom-0 left-0 right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-10 transition duration-500 before:absolute before:z-[-1] before:bg-gray-700 before:opacity-0 group-hover:bg-[rgba(0,0,0,0.7)]'>
                      <div className='border border-[#ffd60a] opacity-0 transition duration-500 group-hover:opacity-100'>
                        <Link
                          to={`/movie/${item?._id}`}
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
                </li>
              }
            </ul>
          ))}
        </Slider>
      </section>
    </div>
  )
}

export default Home
